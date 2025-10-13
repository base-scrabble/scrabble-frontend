// frontend: src/components/PlayGame.jsx
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Board from "./Board";
import Rack from "./Rack";
import Controls from "./Controls";
import ScoreBoard from "./ScoreBoard";
import Timer from "./Timer";

export default function PlayGame({
  gameId,
  gameData,
  setGameData,
  playerName,
  onExit,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ helper: normalize players into { name, score }
  const normalizePlayers = (arr) =>
    (arr || []).map((p) =>
      typeof p === "string"
        ? { name: p, score: 0 }
        : { name: p.name, score: p.score || 0 }
    );

  // ✅ helper: normalize board into a 15x15 grid
  const normalizeBoard = (boardState) => {
    try {
      const parsed =
        typeof boardState === "string" ? JSON.parse(boardState) : boardState;
      if (Array.isArray(parsed) && parsed.length === 15) return parsed;

      // fallback: blank 15x15 board
      return Array.from({ length: 15 }, () => Array(15).fill(null));
    } catch {
      return Array.from({ length: 15 }, () => Array(15).fill(null));
    }
  };

  // 🔄 fetch game state every 5s
  useEffect(() => {
    if (!gameId) return;
    const fetchState = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/game/state/${gameId}`);
        if (!res.ok) throw new Error("Failed to fetch game state");
        const data = await res.json();

        data.players = normalizePlayers(data.players);
        data.boardState = normalizeBoard(data.boardState);

        setGameData(data);
      } catch (err) {
        console.error("❌ fetchState error:", err);
        setError("Could not load game");
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [gameId, setGameData]);

  // 🎯 handle moves
  const handleMove = async (move) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/game/move/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, ...move }),
      });
      if (!res.ok) throw new Error("Move failed");

      const data = await res.json();
      data.players = normalizePlayers(data.players);
      data.boardState = normalizeBoard(data.boardState);

      setGameData(data);
    } catch (err) {
      console.error("❌ handleMove error:", err);
      setError("Move failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Game On: {gameId}</h2>

      {/* ✅ ScoreBoard expects array of objects */}
      <ScoreBoard players={normalizePlayers(gameData?.players)} />

      <Timer />

      {/* ✅ always a 15x15 board */}
      <Board board={normalizeBoard(gameData?.boardState)} />

      <Rack
        tiles={gameData?.tiles || []}
        onPlay={handleMove}
        disabled={loading}
      />

      <Controls onExit={onExit} />
    </div>
  );
}
