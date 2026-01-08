import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSocket } from "../services/socketService";
import { endGame, makeMove, skipTurn } from "../api/gameApi";
import ChatBox from "./ChatBox";
import Controls from "./Controls";

const BOARD_SIZE = 15;
const TURN_SECONDS = 60;

const LETTER_POINTS = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4,
  I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3,
  Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8,
  Y: 4, Z: 10,
};

const LETTER_BAG = Object.entries(LETTER_POINTS).flatMap(([ch]) => Array(2).fill(ch));

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
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("lobby");
  const [players, setPlayers] = useState([
    { id: "me", name: "You", score: 0 },
    { id: "op", name: "Opponent", score: 0 },
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const me = players[0];
  const currentPlayer = players[currentIdx];

  const meNameRef = useRef(me.name);

  useEffect(() => {
    meNameRef.current = me.name;
  }, [me.name]);

  const emptyBoard = useMemo(
    () =>
      Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => ({ letter: null, locked: false }))
      ),
    []
  );
  const [board, setBoard] = useState(emptyBoard);
  const [rack, setRack] = useState(drawLetters(7));
  const [selectedRackIdx, setSelectedRackIdx] = useState(null);
  const [placementBuffer, setPlacementBuffer] = useState([]);
  const [lastMoveCoords, setLastMoveCoords] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(TURN_SECONDS);
  const [messages, setMessages] = useState([]);

  // === SOCKET SETUP ===
  useEffect(() => {
    if (!gameId) return;
    const socket = getSocket();

    socket.emit("join-game", { gameId, playerName: meNameRef.current });

    socket.on("game:state", (data) => {
      if (data.rack) setRack(data.rack);
      if (data.players) setPlayers(data.players);
      if (data.currentTurn !== undefined) setCurrentIdx(data.currentTurn);
    });

    socket.on("game:move", (data) => {
      if (data.boardState) setBoard(data.boardState);
      if (data.score) setPlayers(data.score);
      if (data.currentTurn !== undefined) setCurrentIdx(data.currentTurn);
    });

    socket.on("game:end", () => setPhase("ended"));

    socket.on("chat:message", (msg) => {
      setMessages((m) => [...m, msg]);
    });

    return () => socket.disconnect();
  }, [gameId]);

  const nextTurn = useCallback(() => {
    setPlacementBuffer([]);
    setSelectedRackIdx(null);
    setCurrentIdx((idx) => (idx + 1) % players.length);
    setSecondsLeft(TURN_SECONDS);
  }, [players.length]);

  const handleAutoPass = useCallback(() => {
    skipTurn(gameId, meNameRef.current);
    nextTurn();
  }, [gameId, nextTurn]);

  // === TIMER LOGIC ===
  useEffect(() => {
    if (phase !== "active" || currentIdx !== 0) return;
    setSecondsLeft(TURN_SECONDS);
  }, [phase, currentIdx]);

  useEffect(() => {
    if (phase !== "active" || currentIdx !== 0) return;
    if (secondsLeft <= 0) return handleAutoPass();
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, currentIdx, secondsLeft, handleAutoPass]);

  // === GAME ACTIONS ===
  function startGame() {
    setPhase("active");
    setCurrentIdx(0);
    setSecondsLeft(TURN_SECONDS);
  }

  function onSelectRackTile(idx) {
    if (phase !== "active" || currentIdx !== 0) return;
    setSelectedRackIdx((prev) => (prev === idx ? null : idx));
  }

  function onClickBoardCell(r, c) {
    if (phase !== "active" || currentIdx !== 0) return;
    if (selectedRackIdx == null) return;

    setBoard((prev) => {
      const cell = prev[r][c];
      if (cell.letter || cell.locked) return prev;
      const letter = rack[selectedRackIdx];
      const next = prev.map((row) => row.slice());
      next[r][c] = { letter, locked: false };
      return next;
    });

    setPlacementBuffer((b) => [...b, { r, c, letter: rack[selectedRackIdx], fromRackIdx: selectedRackIdx }]);
    setRack((prev) => prev.map((ch, i) => (i === selectedRackIdx ? null : ch)));
    setSelectedRackIdx(null);
  }

  async function submitMove() {
    if (!placementBuffer.length) return;

    try {
      const move = placementBuffer.map(({ r, c, letter }) => ({ r, c, tile: letter }));
      await makeMove(gameId, me.name, move);
    } catch (err) {
      console.error("Error submitting move:", err);
    }

    const gained = placementBuffer.reduce((s, p) => s + (LETTER_POINTS[p.letter] || 0), 0);
    setPlayers((prev) =>
      prev.map((p, i) => (i === currentIdx ? { ...p, score: p.score + gained } : p))
    );
    setPlacementBuffer([]);
    nextTurn();
  }

  function resign() {
    endGame(gameId);
    setPhase("ended");
  }

  function sendChat(msg) {
    const socket = getSocket();
    socket.emit("chat:message", { gameId, username: me.name, message: msg });
    setMessages((m) => [...m, { username: me.name, message: msg }]);
  }

  // === UI ===
  const isMyTurn = phase === "active" && currentIdx === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
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
            <span className="font-mono text-sm">⏱ {isMyTurn ? secondsLeft : "—"}</span>
          )}
        </div>

        {/* MAIN BOARD AREA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-6">
            {/* BOARD */}
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
                  row.map((cell, c) => (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => onClickBoardCell(r, c)}
                      className={`aspect-square flex items-center justify-center rounded ${
                        cell.letter
                          ? cell.locked
                            ? "bg-amber-200"
                            : "bg-emerald-200"
                          : "bg-slate-100"
                      } hover:bg-slate-200 transition`}
                    >
                      <span className="font-semibold text-slate-700">
                        {cell.letter || ""}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* RACK + CONTROLS */}
            <Controls
              rack={rack}
              selectedRackIdx={selectedRackIdx}
              onSelectRackTile={onSelectRackTile}
              onSubmit={submitMove}
              onResign={resign}
              isMyTurn={isMyTurn}
              placementBuffer={placementBuffer}
            />
          </div>

          {/* SCOREBOARD + CHAT */}
          <div className="space-y-4">
            <div className="bg-white/60 backdrop-blur rounded-2xl shadow p-4 space-y-3">
              <div className="text-sm font-semibold text-slate-700">Scores</div>
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

            <ChatBox messages={messages} onSend={sendChat} />
          </div>
        </div>

        {/* LOBBY / ENDED STATE */}
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

        {phase === "ended" && (
          <div className="text-center space-y-4">
            <div className="text-xl font-bold text-slate-700">Game Over</div>
            <button
              onClick={() => navigate("/leaderboard")}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl shadow hover:bg-slate-900 transition"
            >
              View Leaderboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
