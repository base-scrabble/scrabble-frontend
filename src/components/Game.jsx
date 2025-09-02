import React, { useEffect, useMemo, useState } from "react";

/**
 * Game – working skeleton
 * - Phases: "lobby" → "active" → ("paused") → "ended"
 * - Shows: board, rack, scores, timer, action buttons
 * - Click a rack tile to select it, then click a board square to place it
 * - "Submit Move" commits placed tiles and updates a simple score
 * - "Pass" ends turn without scoring
 * - "Shuffle" randomizes your rack
 * - "Resign" ends the game
 *
 * Replace placeholder logic with your real hooks (sockets, server, contracts) later.
 */

// 15x15 standard Scrabble board size (visual only here)
const BOARD_SIZE = 15;
// simple per-turn timer (seconds)
const TURN_SECONDS = 60;

// Minimal letter bag & points (tweak later or move to utils/constants)
const LETTER_POINTS = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4,
  I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3,
  Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8,
  Y: 4, Z: 10,
};

const LETTER_BAG = Object.entries(LETTER_POINTS)
  .flatMap(([ch]) => Array(2).fill(ch)); // tiny bag for demo

function drawLetters(n = 7) {
  const copy = [...LETTER_BAG];
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0] || "E");
  }
  return out;
}

export default function Game() {
  // ----- High-level game state -----
  const [phase, setPhase] = useState("lobby"); // "lobby" | "active" | "paused" | "ended"
  const [players, setPlayers] = useState([
    { id: "me", name: "You", score: 0 },
    { id: "op", name: "Opponent", score: 0 },
  ]);
  const [currentIdx, setCurrentIdx] = useState(0); // whose turn
  const me = players[0];
  const currentPlayer = players[currentIdx];

  // ----- Board state -----
  const emptyBoard = useMemo(
    () =>
      Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => ({ letter: null, locked: false }))
      ),
    []
  );
  const [board, setBoard] = useState(emptyBoard);

  // last committed placements to highlight
  const [lastMoveCoords, setLastMoveCoords] = useState([]); // [{r,c}]

  // ----- Rack & placement buffer -----
  const [rack, setRack] = useState(drawLetters(7));
  const [selectedRackIdx, setSelectedRackIdx] = useState(null);
  const [placementBuffer, setPlacementBuffer] = useState([]); // [{r,c,letter,fromRackIdx}]

  // ----- Turn timer -----
  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS);

  useEffect(() => {
    if (phase !== "active") return;
    if (currentIdx !== 0) return; // only tick when it's "me"
    setSecondsLeft(TURN_SECONDS);
  }, [phase, currentIdx]);

  useEffect(() => {
    if (phase !== "active") return;
    if (currentIdx !== 0) return;
    if (secondsLeft <= 0) {
      handleAutoPass(); // time-up behavior
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, currentIdx, secondsLeft]);

  // ----- Actions -----
  function startGame() {
    setPhase("active");
    setCurrentIdx(0);
    setSecondsLeft(TURN_SECONDS);
  }

  function pauseGame() {
    setPhase("paused");
  }
  function resumeGame() {
    setPhase("active");
  }

  function endGame() {
    setPhase("ended");
  }

  function nextTurn() {
    // return placed tiles to locked, clear buffer, swap turn
    setPlacementBuffer([]);
    setSelectedRackIdx(null);
    setCurrentIdx((idx) => (idx + 1) % players.length);
    setSecondsLeft(TURN_SECONDS);
  }

  function handleAutoPass() {
    // time up → just pass
    nextTurn();
  }

  function onSelectRackTile(idx) {
    if (phase !== "active" || currentIdx !== 0) return;
    setSelectedRackIdx(idx === selectedRackIdx ? null : idx);
  }

  function onClickBoardCell(r, c) {
    if (phase !== "active" || currentIdx !== 0) return;
    if (selectedRackIdx == null) return;

    setBoard((prev) => {
      const cell = prev[r][c];
      if (cell.letter || cell.locked) return prev; // occupied
      const letter = rack[selectedRackIdx];

      // place letter
      const next = prev.map((row) => row.slice());
      next[r][c] = { letter, locked: false };
      return next;
    });

    setPlacementBuffer((b) => [
      ...b,
      { r, c, letter: rack[selectedRackIdx], fromRackIdx: selectedRackIdx },
    ]);

    // remove letter from rack visually
    setRack((prev) => prev.map((ch, i) => (i === selectedRackIdx ? null : ch)));
    setSelectedRackIdx(null);
  }

  function shuffleRack() {
    if (phase !== "active" || currentIdx !== 0) return;
    const letters = rack.filter(Boolean);
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // keep nulls (already placed) at end
    const nulls = rack.filter((x) => x == null);
    setRack([...letters, ...nulls].slice(0, 7));
  }

  function passTurn() {
    if (phase !== "active" || currentIdx !== 0) return;
    // return buffered tiles to rack
    if (placementBuffer.length) {
      const back = [...rack];
      placementBuffer.forEach(({ fromRackIdx, letter }) => {
        if (back[fromRackIdx] == null) back[fromRackIdx] = letter;
      });
      setRack(back);
      // clear board placements
      setBoard((prev) => {
        const next = prev.map((row) => row.slice());
        placementBuffer.forEach(({ r, c }) => {
          next[r][c] = { letter: null, locked: false };
        });
        return next;
      });
      setPlacementBuffer([]);
    }
    nextTurn();
  }

  function resign() {
    endGame();
  }

  function submitMove() {
    if (phase !== "active" || currentIdx !== 0) return;
    if (!placementBuffer.length) return;

    // very simple scoring: sum of placed letters
    const gained = placementBuffer.reduce((sum, p) => sum + (LETTER_POINTS[p.letter] || 0), 0);

    // lock tiles on board
    setBoard((prev) => {
      const next = prev.map((row) => row.slice());
      placementBuffer.forEach(({ r, c }) => {
        next[r][c] = { ...next[r][c], locked: true };
      });
      return next;
    });

    // highlight last move
    setLastMoveCoords(placementBuffer.map(({ r, c }) => ({ r, c })));

    // refill rack to 7
    const missing = rack.filter((x) => x == null).length;
    if (missing > 0) {
      const refill = drawLetters(missing);
      let i = 0;
      setRack((prev) => prev.map((x) => (x == null ? refill[i++] : x)));
    }

    // update score for current player
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === currentIdx ? { ...p, score: p.score + gained } : p))
    );

    // clear buffer & pass turn
    setPlacementBuffer([]);
    setSelectedRackIdx(null);
    nextTurn();
  }

  // ----- Render helpers -----
  const isMyTurn = phase === "active" && currentIdx === 0;

  function HeaderBar() {
    return (
      <div className="w-full bg-slate-900 text-slate-100 px-4 py-3 flex items-center justify-between rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Based Scrabble — MVP</span>
          {phase === "active" && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isMyTurn ? "bg-emerald-600" : "bg-slate-700"
              }`}
            >
              {isMyTurn ? "Your turn" : `${currentPlayer.name}'s turn`}
            </span>
          )}
        </div>

        {phase === "active" && (
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">⏱ {isMyTurn ? secondsLeft : "—"}</span>
            <button
              onClick={pauseGame}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg"
            >
              Pause
            </button>
          </div>
        )}
      </div>
    );
  }

  function ScorePanel() {
    return (
      <div className="bg-white/60 backdrop-blur rounded-2xl shadow p-4 space-y-3">
        <div className="text-sm font-semibold text-slate-700">Scores</div>
        <div className="space-y-2">
          {players.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                i === currentIdx ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50"
              }`}
            >
              <span className="text-slate-700">{p.name}</span>
              <span className="font-mono">{p.score}</span>
            </div>
          ))}
        </div>
        {phase === "active" && (
          <div className="text-xs text-slate-500">
            Turn: <span className="font-medium">{currentPlayer.name}</span>
          </div>
        )}
      </div>
    );
  }

  function Board() {
    return (
      <div className="bg-white rounded-2xl shadow p-3">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            gap: "2px",
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const placedNow = placementBuffer.some((p) => p.r === r && p.c === c);
              const last = lastMoveCoords.some((p) => p.r === r && p.c === c);
              const bg =
                cell.letter && cell.locked
                  ? "bg-amber-200"
                  : placedNow
                  ? "bg-emerald-200"
                  : "bg-slate-100";
              const ring = last ? "ring-2 ring-emerald-500" : "";
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => onClickBoardCell(r, c)}
                  className={`aspect-square flex items-center justify-center rounded ${bg} ${ring} hover:bg-slate-200 transition`}
                >
                  <span className="font-semibold text-slate-700">
                    {cell.letter || ""}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  function Rack() {
    return (
      <div className="bg-white rounded-2xl shadow p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-slate-700">Your Rack</div>
          <div className="flex items-center gap-2">
            <button
              onClick={shuffleRack}
              disabled={!isMyTurn}
              className="text-xs bg-slate-800 text-white px-3 py-1 rounded-lg disabled:opacity-50"
            >
              Shuffle
            </button>
            <button
              onClick={passTurn}
              disabled={!isMyTurn}
              className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-lg disabled:opacity-50"
            >
              Pass
            </button>
            <button
              onClick={submitMove}
              disabled={!isMyTurn || placementBuffer.length === 0}
              className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg disabled:opacity-50"
            >
              Submit Move
            </button>
            <button
              onClick={resign}
              className="text-xs bg-rose-600 text-white px-3 py-1 rounded-lg"
            >
              Resign
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {rack.map((ch, i) => {
            const selected = i === selectedRackIdx;
            return (
              <button
                key={i}
                onClick={() => onSelectRackTile(i)}
                disabled={!ch || !isMyTurn}
                className={`w-12 h-12 rounded-lg shadow flex items-center justify-center font-bold ${
                  ch ? "bg-amber-200" : "bg-slate-100"
                } ${selected ? "ring-2 ring-emerald-500" : ""} disabled:opacity-50`}
                title={ch ? `Points: ${LETTER_POINTS[ch]}` : ""}
              >
                {ch || ""}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
   return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 p-4 md:p-6">
	<div className="max-w-7xl mx-auto space-y-6">
        <HeaderBar />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-6">
            <Board />
            <Rack />
          </div>
          <ScorePanel />
        </div>

        {phase === "lobby" && (
          <div className="flex justify-center">
            <button
              onClick={startGame}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700 transition"
            >
              Start Game
            </button>
          </div>
        )}

        {phase === "paused" && (
          <div className="flex justify-center">
            <button
              onClick={resumeGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Resume Game
            </button>
          </div>
        )}

        {phase === "ended" && (
          <div className="text-center space-y-4">
            <div className="text-xl font-bold text-slate-700">
              Game Over
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl shadow hover:bg-slate-900 transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
