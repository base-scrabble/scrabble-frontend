import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameState, joinGame, startGame } from "../api/gameApi";
import { connectSocket, requestRoomJoin } from "../services/socketService";
import { getSessionItem } from "../utils/session";
import { extractGamePayload, resolveGameId } from "../utils/gamePayload";
import { timelineRecord } from "../utils/gameTimeline";
import { SOCKET_URL } from "../config";

const MIN_POLL_INTERVAL_MS = 4000;
const MAX_POLL_INTERVAL_MS = 5000;
const DEFAULT_POLL_INTERVAL_MS = 5000;
const RATE_LIMIT_BACKOFF_MS = 7000;
const MAX_WAITING_ROOM_RETRIES = 1;
const SOCKET_SYNC_COOLDOWN_MS = 750;

const normalizePlayers = (players = []) =>
  players.map((p, idx) =>
    typeof p === "string"
      ? { name: p, score: 0, playerNumber: idx + 1 }
      : { ...p, score: p.score || 0, playerNumber: p.playerNumber || idx + 1 }
  );

const getHostName = (players = []) => {
  if (!players.length) return null;
  const playerOne = players.find((p) => (p.playerNumber || 0) === 1);
  return (playerOne || players[0]).name || null;
};

export default function WaitingRoom({ gameId, gameData, setGameData, onStart, onJoin, onExit }) {
  const [players, setPlayers] = useState(() => normalizePlayers(gameData?.players));
  const [status, setStatus] = useState(gameData?.status || "waiting");
  const [gameCode, setGameCode] = useState(gameData?.gameCode || "");
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasEnteredGameRef = useRef(false);
  const socketSyncGateRef = useRef(0);
  const onStartRef = useRef(onStart);
  const navigate = useNavigate();
  const storedName = getSessionItem('playerName', '');
  const storedGameId = getSessionItem('currentGameId', '');
  const resolvedGameId = gameId || gameData?.gameId || storedGameId || '';
  const displayGameId = resolvedGameId || '—';
  const hostName = getHostName(players);
  const isHostClient = storedName && hostName
    ? hostName.toLowerCase() === storedName.toLowerCase()
    : false;
  const enoughPlayers = players.length >= 2;
  const canStart = isHostClient && enoughPlayers && !loading;
  const waitingOnHost = !isHostClient && enoughPlayers;

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    hasEnteredGameRef.current = false;
  }, [resolvedGameId]);

  const navigateToGame = useCallback((reason = 'unknown', payload = {}) => {
    const targetGameId = payload.gameId || resolvedGameId;
    if (!targetGameId) {
      console.warn('⚠️ Unable to navigate to game - missing game id');
      return;
    }
    if (hasEnteredGameRef.current) return;
    hasEnteredGameRef.current = true;

    const startPayload = {
      state: payload.state || payload.status || 'active',
      gameId: targetGameId,
      reason,
      ...payload,
    };

    const handler = onStartRef.current;
    if (typeof handler === 'function') {
      handler(startPayload);
    }
    navigate(`/game/${targetGameId}`);
  }, [resolvedGameId, navigate]);

  const applyGamePayload = useCallback((raw, reason = 'update') => {
    const payload = extractGamePayload(raw);
    if (!payload) {
      console.warn(`⚠️ No game payload available for reason: ${reason}`);
      return null;
    }
    const normalizedPlayers = normalizePlayers(payload.players);
    const payloadGameId = resolveGameId(payload, resolvedGameId || gameId);
    setPlayers(normalizedPlayers);
    setStatus(payload.status || 'waiting');
    setGameCode((prev) => (payload.gameCode ? payload.gameCode : prev || ''));
    if (typeof setGameData === 'function') {
      setGameData((prev) => ({
        ...(prev || {}),
        ...payload,
        gameId: payloadGameId || prev?.gameId || resolvedGameId || gameId,
        players: normalizedPlayers,
      }));
    }
    return payload;
  }, [gameId, resolvedGameId, setGameData]);

  useEffect(() => {
    if (Array.isArray(gameData?.players)) {
      setPlayers(normalizePlayers(gameData.players));
    }
    if (gameData?.status) {
      setStatus(gameData.status);
    }
    if (gameData?.gameCode) {
      setGameCode(gameData.gameCode);
    }
  }, [gameData]);

  useEffect(() => {
    if (!resolvedGameId) return;

    let mounted = true;
    const actualPlayerName = getSessionItem('playerName', 'Guest');
    const normalizedSelfName = (actualPlayerName || '').trim().toLowerCase();
    const socket = connectSocket(SOCKET_URL);
    if (!socket) return;

    timelineRecord('waiting:mount', { gameId: resolvedGameId, playerName: actualPlayerName });
    requestRoomJoin({ gameId: resolvedGameId, playerName: actualPlayerName }, 'waiting-mount');

    const pollState = {
      timeoutId: null,
      isFetching: false,
      nextAllowedAt: Date.now(),
      stopped: false,
      pendingReason: null,
      retryBudget: MAX_WAITING_ROOM_RETRIES,
      initialFetchSent: false,
    };

    const clearPollTimer = () => {
      if (pollState.timeoutId) {
        clearTimeout(pollState.timeoutId);
        pollState.timeoutId = null;
      }
    };

    const stopPolling = () => {
      if (pollState.stopped) return;
      pollState.stopped = true;
      pollState.pendingReason = null;
      clearPollTimer();
    };

    const schedulePoll = (delay = DEFAULT_POLL_INTERVAL_MS, { clampToWindow = true, reason = 'scheduled' } = {}) => {
      if (pollState.stopped || !mounted) return;
      const safeDelay = Math.max(delay, 0);
      const boundedDelay = clampToWindow
        ? Math.min(Math.max(safeDelay, MIN_POLL_INTERVAL_MS), MAX_POLL_INTERVAL_MS)
        : safeDelay;
      clearPollTimer();
      pollState.timeoutId = setTimeout(() => {
        pollState.timeoutId = null;
        fetchLatestState(reason);
      }, boundedDelay);
    };

    const fetchLatestState = async (reason = 'auto', options = {}) => {
      const { allowScheduling = true, force = false } = options;
      if (!mounted) return;
      if (pollState.stopped && !force) return;
      if (pollState.isFetching) {
        pollState.pendingReason = reason;
        return;
      }

      if (reason === 'initial-load') {
        if (pollState.initialFetchSent) return;
        pollState.initialFetchSent = true;
      }

      const now = Date.now();
      if (!force && now < pollState.nextAllowedAt) {
        if (allowScheduling) {
          schedulePoll(pollState.nextAllowedAt - now, { clampToWindow: false, reason: 'throttled' });
        }
        return;
      }

      pollState.isFetching = true;
      let scheduledFromCatch = false;
      let postFinallyAction = null;

      try {
        const payload = await getGameState(resolvedGameId);
        pollState.retryBudget = MAX_WAITING_ROOM_RETRIES;
        pollState.nextAllowedAt = Date.now() + DEFAULT_POLL_INTERVAL_MS;
        const normalized = applyGamePayload(payload, reason);
        if (normalized?.status === 'active') {
          stopPolling('state-active');
          navigateToGame('polling-active', { state: 'active', gameId: resolvedGameId });
          return;
        }
      } catch (err) {
        const statusCode = err?.response?.status || err?.status;
        const fallbackDelay = statusCode === 429 ? RATE_LIMIT_BACKOFF_MS : DEFAULT_POLL_INTERVAL_MS;
        if (statusCode === 429) {
          pollState.nextAllowedAt = Date.now() + RATE_LIMIT_BACKOFF_MS;
          console.warn('⚠️ Rate limit hit while syncing waiting room. Backing off before retrying.', err?.message || '');
        } else {
          pollState.nextAllowedAt = Date.now() + DEFAULT_POLL_INTERVAL_MS;
        }

        const canRetry = pollState.retryBudget > 0;
        if (allowScheduling && !pollState.stopped) {
          scheduledFromCatch = true;
          if (canRetry) {
            pollState.retryBudget -= 1;
            schedulePoll(MIN_POLL_INTERVAL_MS, { reason: `${reason}-retry` });
          } else {
            pollState.retryBudget = 0;
            schedulePoll(fallbackDelay, { clampToWindow: false, reason: `${reason}-error` });
          }
        }

        console.error(`❌ Failed to sync waiting room (${reason}):`, err);
      } finally {
        pollState.isFetching = false;

        if (!allowScheduling || pollState.stopped || !mounted) {
          pollState.pendingReason = null;
          postFinallyAction = { type: 'stop' };
        } else if (scheduledFromCatch) {
          postFinallyAction = { type: 'stop' };
        } else if (pollState.pendingReason) {
          const pendingReason = pollState.pendingReason;
          pollState.pendingReason = null;
          postFinallyAction = { type: 'fetchLatestState', reason: pendingReason };
        } else {
          postFinallyAction = { type: 'schedulePoll' };
        }
      }

      if (!postFinallyAction || postFinallyAction.type === 'stop') {
        return;
      }

      if (postFinallyAction.type === 'fetchLatestState') {
        fetchLatestState(postFinallyAction.reason);
        return;
      }

      schedulePoll(DEFAULT_POLL_INTERVAL_MS);
    };

    fetchLatestState('initial-load');

    const syncOnceFromSocket = (reason = 'socket-event') => {
      const now = Date.now();
      if (now - socketSyncGateRef.current < SOCKET_SYNC_COOLDOWN_MS) {
        return;
      }
      socketSyncGateRef.current = now;
      stopPolling('socket-event');
      fetchLatestState(reason, { allowScheduling: false, force: true });
    };

    const isSelfEvent = (data = {}) => {
      if (!normalizedSelfName) return false;
      return (data?.playerName || '').trim().toLowerCase() === normalizedSelfName;
    };

    const handleSocketStart = (data = {}) => {
      console.log("🎮 Received game:start event:", data);
      timelineRecord('game:start', { gameId: data?.gameId || resolvedGameId, source: 'socket' });
      stopPolling('socket-start');
      const statusFromPayload = data.state || data.status;
      if (statusFromPayload !== 'active' && data.force !== true) {
        return;
      }
      navigateToGame('socket-start', {
        ...data,
        gameId: data.gameId || resolvedGameId,
        state: statusFromPayload || 'active',
      });
    };

    const handlePlayerJoinEvent = (data) => {
      console.log('👥 Player joined event:', data);
      timelineRecord('player:join', { gameId: resolvedGameId, playerName: data?.playerName });
      stopPolling('player-event');
      if (isSelfEvent(data)) {
        return;
      }
      syncOnceFromSocket('player-joined');
    };

    const handlePlayerLeave = (data) => {
      console.log("🚪 Player left waiting room:", data?.playerName);
      timelineRecord('player:left', { gameId: resolvedGameId, playerName: data?.playerName, phase: 'waiting' });
      syncOnceFromSocket('player-left');
    };

    const handleConnect = () => {
      stopPolling('socket-connected');
      timelineRecord('socket:connect', { gameId: resolvedGameId });
    };

    socket.on("connect", handleConnect);

    socket.on("game:join", handlePlayerJoinEvent);
    socket.on("game:start", handleSocketStart);
    socket.on("game:state", handleSocketStart);
    socket.on("player:left", handlePlayerLeave);
    socket.on("game:leave", handlePlayerLeave);

    return () => {
      mounted = false;
      stopPolling('cleanup');
      socket.off("connect", handleConnect);
      socket.off("game:join", handlePlayerJoinEvent);
      socket.off("game:start", handleSocketStart);
      socket.off("game:state", handleSocketStart);
      socket.off("player:left", handlePlayerLeave);
      socket.off("game:leave", handlePlayerLeave);
      timelineRecord('waiting:unmount', { gameId: resolvedGameId, playerName: actualPlayerName });
    };
  }, [resolvedGameId, navigateToGame, applyGamePayload]);

  useEffect(() => {
    if (status === 'active') {
      navigateToGame('status-sync', { state: 'active', gameId: resolvedGameId });
    }
  }, [status, navigateToGame, resolvedGameId]);

  const handleJoin = async () => {
    if (!storedName) {
      alert('Please enter your name again on the home screen before joining.');
      return;
    }
    setLoading(true);
    try {
      if (!resolvedGameId) {
        throw new Error('Missing game identifier. Please recreate or rejoin the match.');
      }
      const payload = applyGamePayload(await joinGame(resolvedGameId, storedName), 'join');
      if (!payload) {
        throw new Error('Unable to sync game state after joining.');
      }
      if (onJoin) onJoin({ ...payload, playerName: storedName });
      requestRoomJoin({ gameId: resolvedGameId, playerName: storedName }, 'http-join');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Unable to join game';
      alert(`Error joining game: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleHostStart = async () => {
    if (!isHostClient) {
      alert('Only Player 1 can start the game once everyone is ready.');
      return;
    }
    if (players.length < 2) {
      alert('You need at least two players to start the game.');
      return;
    }
    setLoading(true);
    try {
      // Call HTTP API to update game status in database
      if (!resolvedGameId) {
        throw new Error('Missing game identifier. Please recreate or rejoin the match.');
      }
      await startGame(resolvedGameId);
      // Socket event will be emitted by backend to all players
      navigateToGame('host-start', { gameId: resolvedGameId, state: 'active' });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Unable to start game';
      alert(`Error starting game: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = typeof window !== 'undefined' && resolvedGameId
    ? `${window.location.origin}/waiting/${resolvedGameId}`
    : '';

  const copyInviteLink = async () => {
    if (!inviteLink) return;
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      alert('Clipboard access is unavailable. Please copy the link manually.');
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('❌ Unable to copy invite link:', err);
      alert('Unable to copy link. You can highlight it and copy manually.');
    }
  };

  const copyGameId = async () => {
    if (!resolvedGameId) return;
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      alert('Clipboard access is unavailable. Please copy the ID manually.');
      return;
    }
    try {
      await navigator.clipboard.writeText(resolvedGameId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('❌ Unable to copy game id:', err);
      alert('Unable to copy game ID. You can highlight it and copy manually.');
    }
  };

  return (
    <div className="waiting-room">
      <div className="waiting-room__header">
        <div>
          <p className="waiting-room__eyebrow">Waiting Room</p>
          <h2 className="waiting-room__title">Get everyone in before launch</h2>
        </div>
        <span className="waiting-room__status" data-state={status}>{status}</span>
      </div>

      <div className="waiting-room__meta">
        <div className="waiting-room__meta-card">
          <p className="waiting-room__meta-label">Game ID</p>
          <p className="waiting-room__meta-value">{displayGameId}</p>
          <button type="button" className="waiting-room__meta-copy" onClick={copyGameId}>
            {copiedId ? 'Copied' : 'Copy ID'}
          </button>
        </div>
        <div className="waiting-room__meta-card">
          <p className="waiting-room__meta-label">Game Code</p>
          <p className="waiting-room__meta-value">{gameCode || '—'}</p>
        </div>
      </div>

      <div className="waiting-room__share">
        <label className="waiting-room__share-label" htmlFor="invite-link">Invite link</label>
        <div className="waiting-room__share-row">
          <input
            id="invite-link"
            type="text"
            readOnly
            value={inviteLink}
            className="waiting-room__share-input"
          />
          <button
            onClick={copyInviteLink}
            type="button"
            className="waiting-room__share-button"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="waiting-room__players">
        <div className="waiting-room__players-header">
          <p>Players</p>
          <span>{players.length || 0} joined</span>
        </div>
        <ul className="waiting-room__player-list">
          {players.map((p, idx) => (
            <li key={idx} className="waiting-room__player">
              <div>
                <span className="waiting-room__player-name">{p.name}</span>
                <span className="waiting-room__player-meta">Score: {p.score}</span>
              </div>
              <span className="waiting-room__player-number">#{p.playerNumber || idx + 1}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="waiting-room__actions">
        <button
          onClick={handleJoin}
          className="waiting-room__button waiting-room__button--outline"
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Game"}
        </button>
        <button
          onClick={handleHostStart}
          className={`waiting-room__button waiting-room__button--primary${canStart ? '' : ' is-disabled'}`}
          disabled={!canStart}
        >
          {isHostClient ? (loading ? "Starting..." : "Start Game") : "Waiting for Host"}
        </button>
      </div>

      <div className="waiting-room__hints">
        {!enoughPlayers && (
          <p className="waiting-room__hint waiting-room__hint--warn">
            Need at least two players in the room.
          </p>
        )}
        {waitingOnHost && (
          <p className="waiting-room__hint">
            {hostName || 'Player 1'} has to start the match.
          </p>
        )}
        {isHostClient && enoughPlayers && (
          <p className="waiting-room__hint waiting-room__hint--success">
            You're the host — start whenever everyone's ready.
          </p>
        )}
      </div>

      <button onClick={onExit} className="waiting-room__button waiting-room__button--danger">
        Exit Lobby
      </button>
    </div>
  );
}
