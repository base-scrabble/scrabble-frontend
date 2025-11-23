import { useEffect, useMemo, useRef, useState } from "react";
import { connectSocket, getSocket } from "../services/socketService";
import { getGameState, makeMove as recordMove } from "../api/gameApi";
import Board from "./Board";
import Rack from "./Rack";
import Controls from "./Controls";
import ScoreBoard from "./ScoreBoard";
import Timer from "./Timer";
import BlankTilePicker from "./BlankTilePicker";
import { getSessionItem } from "../utils/session";
import { extractGamePayload } from "../utils/gamePayload";
import { cloneTile, createBlankTile, normalizeRack, normalizeTile, serializeTileLetter } from "../utils/tileUtils";

export default function PlayGame({ gameId, gameData, setGameData, playerName, onExit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rack, setRack] = useState(() => normalizeRack([]));
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [pendingPlacements, setPendingPlacements] = useState([]);
  const [exchangeMode, setExchangeMode] = useState(false);
  const [exchangeSelection, setExchangeSelection] = useState([]);
  const [pendingBlankSelection, setPendingBlankSelection] = useState(null);
  const exitHandledRef = useRef(false);

  const normalizePlayers = (arr, currentTurnValue) =>
    (arr || []).map((p) => ({
      name: p.name,
      score: p.score || 0,
      playerNumber: p.playerNumber,
      isActive: currentTurnValue && p.playerNumber === currentTurnValue,
    }));
  const normalizeBoard = (boardState) =>
    Array.isArray(boardState) && boardState.length === 15
      ? boardState
      : Array.from({ length: 15 }, () => Array(15).fill(null));
  const formatCoordinate = (row, col) => {
    if (typeof row !== "number" || typeof col !== "number") return "";
    return `${String.fromCharCode(65 + row)}${col + 1}`;
  };
  const applyGamePayload = (payload) => {
    if (!payload) return;
    const hasBoard = Array.isArray(payload.boardState);
    const hasPlayers = Array.isArray(payload.players);
    const hasRack = Array.isArray(payload.rack);
    if (!hasBoard && !hasPlayers && !hasRack) {
      // Likely a lightweight event (e.g., { gameId, move }); ignore to avoid wiping UI
      return;
    }
    setGameData((prev) => {
      const nextGameId = payload.gameId || payload.id || prev?.gameId || gameId;
      const nextTurn = payload.currentTurn || prev?.currentTurn;
      return {
        ...(prev || {}),
        ...payload,
        currentTurn: nextTurn,
        gameId: nextGameId,
        players: normalizePlayers(payload.players || prev?.players, nextTurn),
        boardState: hasBoard ? normalizeBoard(payload.boardState) : normalizeBoard(prev?.boardState),
      };
    });
    if (hasRack) {
      setRack(normalizeRack(payload.rack));
    }
    setPendingPlacements([]);
    setSelectedTileIndex(null);
    setExchangeMode(false);
    setExchangeSelection([]);
    setPendingBlankSelection(null);
  };

  const fetchLatestState = async (reason = 'socket-fallback') => {
    if (!gameId) return;
    try {
      const response = await getGameState(gameId, playerName || getSessionItem('playerName'));
      const payload = extractGamePayload(response);
      if (payload) {
        applyGamePayload(payload);
      }
    } catch (err) {
      console.error(`❌ Failed to refresh game state (${reason}):`, err);
    }
  };

  useEffect(() => {
    if (!gameId) return;
    exitHandledRef.current = false;
    const hydrateGame = async () => {
      try {
        const response = await getGameState(gameId, playerName);
        const payload = extractGamePayload(response);
        if (!payload) return;
        applyGamePayload(payload);
      } catch (err) {
        console.error('❌ Failed to hydrate game:', err);
      }
    };
    hydrateGame();
  }, [gameId, setGameData, playerName]);

  useEffect(() => {
    if (!gameId) return;
    
    // Get playerName from storage helper if not passed as prop
    const actualPlayerName = playerName || getSessionItem('playerName', 'Guest');
    
    // In development, use undefined so Vite proxy handles socket.io
    const socketUrl = import.meta.env.DEV ? undefined : import.meta.env.VITE_SOCKET_URL;
    const socket = connectSocket(socketUrl);
    if (!socket) return;

    const handleUpdate = (data) => {
      console.log('🎮 Game state update received:', data);
      const payload = extractGamePayload(data);
      const hasBoard = Array.isArray(payload?.boardState);
      const hasPlayers = Array.isArray(payload?.players);
      const hasRack = Array.isArray(payload?.rack);
      if (payload && (hasBoard || hasPlayers || hasRack)) {
        applyGamePayload(payload);
      } else {
        fetchLatestState('socket-update');
      }
    };

    const handleSocketMove = (data) => {
      console.log('🎯 Move received:', data);
      const payload = extractGamePayload(data);
      const hasBoard = Array.isArray(payload?.boardState);
      if (payload && hasBoard) {
        applyGamePayload(payload);
      } else {
        fetchLatestState('socket-move');
      }
    };

    const handlePlayerLeave = (data) => {
      if (!data?.playerName) return;
      console.log('🚪 Player left:', data.playerName);
      if (data.playerName === actualPlayerName) {
        // Ignore the echo of our own exit
        return;
      }
      if (exitHandledRef.current) return;
      exitHandledRef.current = true;
      alert(`Player ${data.playerName} has left the game. Returning to lobby.`);
      if (onExit) onExit();
    };

    const handleGameOver = (data) => {
      console.log('🏁 Game over:', data);
      setGameData(prev => ({
        ...prev,
        gameId: data.gameId || prev?.gameId || gameId,
        status: 'completed',
        winner: data.winner,
        players: normalizePlayers(data.players || prev?.players),
        finalScores: data.scores,
      }));
    };

    const handleConnect = () => {
      if (!gameId || !actualPlayerName) return;
      console.log('🔌 Socket connected to game room:', gameId, 'as', actualPlayerName);
      socket.emit("game:join", { gameId, playerName: actualPlayerName });
    };

    socket.on("connect", handleConnect);
    if (socket.connected) {
      handleConnect();
    }
    
    // SOCKET EVENTS ARE THE ONLY SOURCE OF TRUTH
    socket.on("game:update", handleUpdate); // Main game state updates
    socket.on("game:state", handleUpdate);  // Alias for compatibility
    socket.on("game:move", handleSocketMove);     // Move updates
    socket.on("player:left", handlePlayerLeave); // Player exit event
    socket.on("game:leave", handlePlayerLeave);  // Alias for compatibility
    socket.on("game:over", handleGameOver);  // Game completion

    // NO POLLING - Socket events only!

    return () => {
      socket.off("connect", handleConnect);
      socket.off("game:update", handleUpdate);
      socket.off("game:state", handleUpdate);
      socket.off("game:move", handleSocketMove);
      socket.off("player:left", handlePlayerLeave);
      socket.off("game:leave", handlePlayerLeave);
      socket.off("game:over", handleGameOver);
      // Don't disconnect - keep socket alive for other components
    };
  }, [gameId, setGameData, playerName, onExit]);

  const submitMove = async (move) => {
    if (!gameId) {
      setError('Missing game id - return to home and rejoin.');
      return false;
    }
    const activePlayer = playerName || getSessionItem('playerName');
    if (!activePlayer) {
      setError('Missing player identity - please rejoin the game.');
      return false;
    }
    setError('');
    setLoading(true);

    const attemptMove = async (attempt = 1) => {
      try {
        const response = await recordMove(gameId, activePlayer, move);
        const payload = extractGamePayload(response);
        applyGamePayload(payload);
        return true;
      } catch (err) {
        const status = err?.response?.status;
        const shouldRetry = attempt === 1 && (!status || status >= 500);
        console.error(`❌ Move failed (attempt ${attempt})`, err);
        if (shouldRetry) {
          console.warn('🔄 Retrying move once after transient error...');
          await new Promise((resolve) => setTimeout(resolve, 400));
          return attemptMove(attempt + 1);
        }
        const message = err?.response?.data?.message || err?.message || 'Move failed';
        setError(message);
        return false;
      }
    };

    try {
      return await attemptMove(1);
    } finally {
      setLoading(false);
    }
  };

  const handleTilePlace = (row, col) => {
    if (exchangeMode || selectedTileIndex === null) return;
    const selectedTile = rack[selectedTileIndex];
    const tileSnapshot = cloneTile(selectedTile);
    if (!tileSnapshot) return;
    const isOccupied = pendingPlacements.some((placement) => placement.row === row && placement.col === col);
    if (isOccupied || (gameData?.boardState?.[row]?.[col])) return;
    if (tileSnapshot.isBlank) {
      setPendingBlankSelection({ row, col, rackIndex: selectedTileIndex, tile: tileSnapshot });
      setRack((prev) => {
        const next = [...prev];
        next[selectedTileIndex] = null;
        return next;
      });
      setSelectedTileIndex(null);
      return;
    }
    const placement = {
      row,
      col,
      letter: tileSnapshot.letter,
      rackIndex: selectedTileIndex,
      rackLetter: serializeTileLetter(tileSnapshot),
      isBlank: tileSnapshot.isBlank,
      tileSnapshot,
    };
    setPendingPlacements((prev) => [...prev, placement]);
    setRack((prev) => {
      const next = [...prev];
      next[selectedTileIndex] = null;
      return next;
    });
    setSelectedTileIndex(null);
  };

  const handleRackTap = (idx) => {
    if (exchangeMode) {
      handleToggleExchangeSelection(idx);
      return;
    }
    const currentValue = rack[idx];
    if (selectedTileIndex === null) {
      if (!currentValue) return;
      setSelectedTileIndex(idx);
      return;
    }
    if (selectedTileIndex === idx) {
      setSelectedTileIndex(null);
      return;
    }

    setRack((prev) => {
      const next = [...prev];
      const heldValue = next[selectedTileIndex];
      if (!heldValue) {
        setSelectedTileIndex(null);
        return next;
      }
      if (!currentValue) {
        next[idx] = heldValue;
        next[selectedTileIndex] = null;
        setSelectedTileIndex(idx);
        return next;
      }
      [next[idx], next[selectedTileIndex]] = [next[selectedTileIndex], next[idx]];
      setSelectedTileIndex(idx);
      return next;
    });
  };

  const handleShuffleRack = () => {
    if (exchangeMode || pendingPlacements.length) return;
    setRack((prev) => {
      const letters = prev.filter(Boolean);
      for (let i = letters.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      const next = Array(prev.length).fill(null);
      letters.forEach((letter, idx) => {
        next[idx] = letter;
      });
      return next;
    });
    setSelectedTileIndex(null);
  };

  const handleSubmitMove = async () => {
    if (!pendingPlacements.length || exchangeMode) return;
    if (!assertTurn()) return;
    const placements = pendingPlacements.map(({ row, col, letter, rackLetter, isBlank }) => ({
      row,
      col,
      letter,
      rackLetter,
      isBlank,
    }));
    await submitMove({ placements });
  };

  const handleUndo = (idx) => {
    const placement = pendingPlacements[idx];
    if (!placement) return;
    setPendingPlacements((prev) => prev.filter((_, i) => i !== idx));
    setRack((prevRack) => {
      const nextRack = [...prevRack];
      const restored = cloneTile(placement.tileSnapshot)
        || (placement.isBlank ? createBlankTile() : normalizeTile(placement.letter));
      nextRack[placement.rackIndex] = restored;
      return nextRack;
    });
  };

  const resetPlacements = () => {
    setRack((prevRack) => {
      const nextRack = [...prevRack];
      pendingPlacements.forEach((placement) => {
        const restored = cloneTile(placement.tileSnapshot)
          || (placement.isBlank ? createBlankTile() : normalizeTile(placement.letter));
        nextRack[placement.rackIndex] = restored;
      });
      return nextRack;
    });
    setPendingPlacements([]);
    setSelectedTileIndex(null);
    setPendingBlankSelection(null);
  };

  const toggleExchangeMode = () => {
    if (pendingPlacements.length || loading) return;
    setExchangeMode((prev) => {
      if (prev) {
        setExchangeSelection([]);
      }
      setSelectedTileIndex(null);
      setPendingBlankSelection(null);
      return !prev;
    });
  };

  const handleToggleExchangeSelection = (idx) => {
    if (!rack[idx]) return;
    setExchangeSelection((prev) =>
      prev.includes(idx) ? prev.filter((value) => value !== idx) : [...prev, idx]
    );
  };

  const handleConfirmExchange = async () => {
    if (!exchangeMode || !exchangeSelection.length) return;
    if (!assertTurn()) return;
    const letters = exchangeSelection
      .map((idx) => serializeTileLetter(rack[idx]))
      .filter(Boolean);
    if (!letters.length) return;
    const success = await submitMove({ exchanged: letters });
    if (success) {
      setExchangeSelection([]);
      setExchangeMode(false);
    }
  };

  const handlePass = async () => {
    if (pendingPlacements.length || exchangeMode) return;
    if (!assertTurn()) return;
    await submitMove({ passed: true });
  };

  const hasSelectedTile = selectedTileIndex !== null && Boolean(rack[selectedTileIndex]);
  const canShuffleRack = rack.some(Boolean) && !pendingPlacements.length && !exchangeMode;
  const selectedTileSnapshot = hasSelectedTile ? rack[selectedTileIndex] : null;
  const rackStatusLabel = hasSelectedTile
    ? selectedTileSnapshot?.isBlank
      ? "Holding blank tile"
      : `Holding ${selectedTileSnapshot?.letter}`
    : "Tap a tile to pick it up";
  const pendingBlankSlot = typeof pendingBlankSelection?.rackIndex === "number"
    ? pendingBlankSelection.rackIndex + 1
    : null;

  const sidebarMeta = useMemo(() => ({
    bagCount: gameData?.bagCount ?? 0,
    status: gameData?.status,
    currentTurn: gameData?.currentTurn,
  }), [gameData?.bagCount, gameData?.status, gameData?.currentTurn]);

  const scoreboardPlayers = useMemo(
    () => normalizePlayers(gameData?.players, sidebarMeta.currentTurn),
    [gameData?.players, sidebarMeta.currentTurn]
  );

  const viewerName = playerName || getSessionItem('playerName', '');
  const viewerKey = viewerName.trim().toLowerCase();
  const viewerPlayer = useMemo(
    () => scoreboardPlayers.find((p) => p?.name?.trim().toLowerCase() === viewerKey),
    [scoreboardPlayers, viewerKey]
  );
  const activePlayer = useMemo(
    () => scoreboardPlayers.find((p) => p?.playerNumber === sidebarMeta.currentTurn),
    [scoreboardPlayers, sidebarMeta.currentTurn]
  );
  const isMyTurn = viewerPlayer ? viewerPlayer.playerNumber === sidebarMeta.currentTurn : true;

  const assertTurn = () => {
    if (!isMyTurn) {
      setError(activePlayer?.name ? `It's ${activePlayer.name}'s turn to play.` : 'Please wait for your turn.');
      return false;
    }
    return true;
  };

  // Show game result if game is completed
  const isGameCompleted = gameData?.status === 'completed';
  const winner = gameData?.winner;

  useEffect(() => {
    if (!isGameCompleted || !onExit) return undefined;
    const timer = setTimeout(() => {
      onExit();
    }, 15000);
    return () => clearTimeout(timer);
  }, [isGameCompleted, onExit]);

  return (
    <div className="play-shell">
      <div className="play-panel">
        <div className="text-center mb-6">
          <p className="text-sm tracking-[0.4em] uppercase text-slate-500">Live match</p>
          <h2 className="text-3xl font-black text-slate-900">Game {gameId}</h2>
          <p className="text-slate-600">Take your turn without leaving the screen.</p>
        </div>
        {error && (
          <div className="alert-error">
            <span>{error}</span>
            <button
              type="button"
              className="text-xs underline"
              onClick={() => setError('')}
            >
              dismiss
            </button>
          </div>
        )}
        <div className="mobile-top-bar mobile-only">
          <div className="glass-card glass-card--frosted">
            <ScoreBoard
              players={scoreboardPlayers}
              currentTurn={sidebarMeta.currentTurn}
              bagCount={sidebarMeta.bagCount}
              viewerName={viewerName}
            />
          </div>
          <div className="glass-card glass-card--frosted mobile-top-bar__controls">
            <Controls onExit={onExit} />
          </div>
        </div>
        <div className="game-layout">
          <div className="game-primary glass-card glass-card--dark">
            <Board
              board={normalizeBoard(gameData?.boardState)}
              onTilePlace={handleTilePlace}
              pendingPlacements={pendingPlacements}
            />
            <Rack
              tiles={rack}
              selectedIndex={selectedTileIndex}
              exchangeMode={exchangeMode}
              exchangeSelection={exchangeSelection}
              onSelectTile={handleRackTap}
              onToggleExchangeSelection={handleToggleExchangeSelection}
              disabled={loading || isGameCompleted}
              canDrop={hasSelectedTile}
            />
            <div className="rack-status">
              <p>
                {pendingBlankSlot
                  ? `Assign a letter for blank tile in slot ${pendingBlankSlot}`
                  : rackStatusLabel}
              </p>
            </div>
            <div className="rack-actions">
              <button
                type="button"
                className="btn-chip"
                onClick={handleShuffleRack}
                disabled={!canShuffleRack}
              >
                Shuffle Rack
              </button>
              <button
                type="button"
                className="btn-chip"
                onClick={() => setSelectedTileIndex(null)}
                disabled={!hasSelectedTile}
              >
                Deselect Tile
              </button>
              <button
                type="button"
                className="btn-chip"
                onClick={resetPlacements}
                disabled={!pendingPlacements.length}
              >
                Reset Rack
              </button>
            </div>
            {exchangeMode && (
              <p className="text-sm text-orange-600 text-center mt-2">
                Select tiles to swap, then confirm exchange.
              </p>
            )}
            <div className="action-row">
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmitMove}
                disabled={!pendingPlacements.length || loading}
              >
                Submit Move
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={resetPlacements}
                disabled={!pendingPlacements.length}
              >
                Clear
              </button>
            </div>
            <div className="support-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={handlePass}
                disabled={loading || exchangeMode || pendingPlacements.length > 0}
              >
                Pass Turn
              </button>
              <button
                type="button"
                className={`btn-toggle ${exchangeMode ? 'is-active' : ''}`}
                onClick={toggleExchangeMode}
                disabled={loading || pendingPlacements.length > 0}
              >
                {exchangeMode ? "Cancel Exchange" : "Exchange Tiles"}
              </button>
              {exchangeMode && (
                <button
                  type="button"
                  className="btn-alert"
                  onClick={handleConfirmExchange}
                  disabled={loading || !exchangeSelection.length}
                >
                  Confirm Exchange ({exchangeSelection.length})
                </button>
              )}
            </div>
          </div>
          <div className="game-secondary">
            <div className="glass-card glass-card--frosted desktop-only">
              <ScoreBoard
                players={scoreboardPlayers}
                currentTurn={sidebarMeta.currentTurn}
                bagCount={sidebarMeta.bagCount}
                viewerName={viewerName}
              />
            </div>
            <div className="glass-card glass-card--frosted">
              <Timer status={gameData?.status} />
            </div>
            {!!pendingPlacements.length && (
              <div className="glass-card glass-card--frosted pending-moves">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Pending placements</h3>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={resetPlacements}
                  >
                    Clear all
                  </button>
                </div>
                {pendingPlacements.map((placement, idx) => (
                  <div key={`${placement.row}-${placement.col}-${idx}`} className="pending-moves__item">
                    <span>
                      {placement.letter}
                      {placement.isBlank ? " (blank)" : ""}
                      {" "}→ {formatCoordinate(placement.row, placement.col)}
                    </span>
                    <button type="button" onClick={() => handleUndo(idx)}>
                      undo
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="glass-card glass-card--frosted desktop-only">
              <Controls onExit={onExit} />
            </div>
          </div>
        </div>

      {/* Game Result Overlay */}
      {isGameCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">🎉 Game Over!</h2>
            {winner && winner.name ? (
              <div className="mb-6">
                <p className="text-xl text-gray-700 mb-2">Winner:</p>
                <p className="text-4xl font-bold text-green-600 mb-2">{winner.name}</p>
                <p className="text-2xl text-gray-600">Score: {winner.score}</p>
              </div>
            ) : (
              <p className="text-2xl text-gray-600 mb-6">It's a draw!</p>
            )}
            <div className="mb-6">
              <p className="text-lg text-gray-700 font-semibold mb-2">Final Scores:</p>
              {normalizePlayers(gameData?.players).map((player, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <span className="font-semibold">{player.name}</span>
                  <span className="text-blue-600">{player.score} pts</span>
                </div>
              ))}
            </div>
            <button
              onClick={onExit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105"
            >
              Return to Home
            </button>
            <p className="text-sm text-gray-500 mt-3">Automatically returning in ~15 seconds…</p>
          </div>
        </div>
      )}
      <BlankTilePicker
        isOpen={Boolean(pendingBlankSelection)}
        rackIndex={pendingBlankSelection?.rackIndex}
        onClose={() => {
          if (!pendingBlankSelection) return;
          setRack((prev) => {
            const next = [...prev];
            next[pendingBlankSelection.rackIndex] = cloneTile(pendingBlankSelection.tile)
              || createBlankTile();
            return next;
          });
          setPendingBlankSelection(null);
        }}
        onSelect={(letter) => {
          if (!pendingBlankSelection) return;
          const { row, col, rackIndex, tile } = pendingBlankSelection;
          const tileSnapshot = cloneTile(tile) || createBlankTile();
          setPendingPlacements((prev) => [
            ...prev,
            {
              row,
              col,
              letter,
              rackIndex,
              rackLetter: "?",
              isBlank: true,
              tileSnapshot,
            },
          ]);
          setSelectedTileIndex(null);
          setPendingBlankSelection(null);
        }}
      />
      </div>
    </div>
  );
}
