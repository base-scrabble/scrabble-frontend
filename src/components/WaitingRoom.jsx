import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameState, joinGame, startGame } from "../api/gameApi";
import { connectSocket, getSocket } from "../services/socketService";
import { getSessionItem } from "../utils/session";
import { extractGamePayload, resolveGameId } from "../utils/gamePayload";

const MIN_POLL_INTERVAL_MS = 3000;
const DEFAULT_POLL_INTERVAL_MS = 4000;
const RATE_LIMIT_BACKOFF_MS = 5000;

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

    if (typeof onStart === 'function') {
      onStart(startPayload);
    }
    navigate(`/game/${targetGameId}`);
  }, [resolvedGameId, navigate, onStart]);

  const applyGamePayload = (raw, reason = 'update') => {
    const payload = extractGamePayload(raw);
    if (!payload) {
      console.warn(`⚠️ No game payload available for reason: ${reason}`);
      return null;
    }
    const normalizedPlayers = normalizePlayers(payload.players);
    const payloadGameId = resolveGameId(payload, resolvedGameId || gameId);
    setPlayers(normalizedPlayers);
    setStatus(payload.status || 'waiting');
    if (payload.gameCode || !gameCode) {
      setGameCode(payload.gameCode || '');
    }
    if (typeof setGameData === 'function') {
      setGameData((prev) => ({
        ...(prev || {}),
        ...payload,
        gameId: payloadGameId || prev?.gameId || resolvedGameId || gameId,
        players: normalizedPlayers,
      }));
    }
    return payload;
  };

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

    const actualPlayerName = getSessionItem('playerName', 'Guest');
    const socketUrl = import.meta.env.DEV ? undefined : import.meta.env.VITE_SOCKET_URL;
    const socket = connectSocket(socketUrl);
    if (!socket) return;

    const pollState = {
      timeoutId: null,
      isFetching: false,
      nextAllowedAt: Date.now(),
      stopped: false,
      pendingReason: null,
    };

    const clearPollTimer = () => {
      if (pollState.timeoutId) {
        clearTimeout(pollState.timeoutId);
        pollState.timeoutId = null;
      }
    };

    const stopPolling = () => {
      pollState.stopped = true;
      pollState.pendingReason = null;
      clearPollTimer();
    };

    const schedulePoll = (delay = DEFAULT_POLL_INTERVAL_MS, { clampToMin = true, reason = 'scheduled' } = {}) => {
      if (pollState.stopped) return;
      const safeDelay = Math.max(delay, 0);
      const finalDelay = clampToMin ? Math.max(safeDelay, MIN_POLL_INTERVAL_MS) : safeDelay;
      clearPollTimer();
      pollState.timeoutId = setTimeout(() => {
        pollState.timeoutId = null;
        fetchLatestState(reason);
      }, finalDelay);
    };

    const fetchLatestState = async (reason = 'auto') => {
      if (pollState.stopped || !resolvedGameId) return;
      if (pollState.isFetching) {
        pollState.pendingReason = reason;
        return;
      }

      const now = Date.now();
      if (now < pollState.nextAllowedAt) {
        schedulePoll(pollState.nextAllowedAt - now, { clampToMin: false, reason });
        return;
      }

      pollState.isFetching = true;
      let nextDelay = DEFAULT_POLL_INTERVAL_MS;

      try {
        const payload = await getGameState(resolvedGameId);
        pollState.nextAllowedAt = Date.now() + DEFAULT_POLL_INTERVAL_MS;
        const normalized = applyGamePayload(payload, reason);
        if (normalized?.status === 'active') {
          stopPolling();
          navigateToGame('polling-active', { state: 'active', gameId: resolvedGameId });
          return;
        }
      } catch (err) {
        const statusCode = err?.response?.status || err?.status;
        if (statusCode === 429) {
          pollState.nextAllowedAt = Date.now() + RATE_LIMIT_BACKOFF_MS;
          nextDelay = RATE_LIMIT_BACKOFF_MS;
          console.warn('⚠️ Rate limit hit while syncing waiting room. Backing off before retrying.', err?.message || '');
        } else {
          pollState.nextAllowedAt = Date.now() + DEFAULT_POLL_INTERVAL_MS;
        }
        console.error(`❌ Failed to sync waiting room (${reason}):`, err);
      } finally {
        pollState.isFetching = false;
        if (pollState.stopped) return;

        if (pollState.pendingReason) {
          const pendingReason = pollState.pendingReason;
          pollState.pendingReason = null;
          schedulePoll(0, { clampToMin: false, reason: pendingReason });
          return;
        }

        schedulePoll(nextDelay);
      }
    };

    fetchLatestState('initial-load');

    const handleSocketStart = (data = {}) => {
      console.log("🎮 Received game:start event:", data);
      const statusFromPayload = data.state || data.status;
      if (statusFromPayload !== 'active' && data.force !== true) {
        return;
      }
      stopPolling();
      navigateToGame('socket-start', {
        ...data,
        gameId: data.gameId || resolvedGameId,
        state: statusFromPayload || 'active',
      });
    };

    const handlePlayerJoinEvent = (data) => {
      console.log('👥 Player joined event:', data);
      fetchLatestState('player-joined');
    };

    const handlePlayerLeave = (data) => {
      console.log("🚪 Player left waiting room:", data.playerName);
      fetchLatestState('player-left');
    };

    const handleConnect = () => {
      if (!resolvedGameId || !actualPlayerName) return;
      console.log("🔌 Socket connected to game room:", resolvedGameId, "as", actualPlayerName);
      socket.emit("game:join", { gameId: resolvedGameId, playerName: actualPlayerName });
    };

    socket.on("connect", handleConnect);
    if (socket.connected) {
      handleConnect();
    }

    socket.on("player:joined", handlePlayerJoinEvent);
    socket.on("game:join", handlePlayerJoinEvent);
    socket.on("game:start", handleSocketStart);
    socket.on("game:state", handleSocketStart);
    socket.on("player:left", handlePlayerLeave);
    socket.on("game:leave", handlePlayerLeave);

    return () => {
      stopPolling();
      socket.off("connect", handleConnect);
      socket.off("player:joined", handlePlayerJoinEvent);
      socket.off("game:join", handlePlayerJoinEvent);
      socket.off("game:start", handleSocketStart);
      socket.off("game:state", handleSocketStart);
      socket.off("player:left", handlePlayerLeave);
      socket.off("game:leave", handlePlayerLeave);
    };
  }, [resolvedGameId, onStart, onJoin, navigate, setGameData, navigateToGame]);

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
      getSocket()?.emit("game:join", { gameId: resolvedGameId, playerName: storedName });
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
