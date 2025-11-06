import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "../services/socketService";
import { API_BASE_URL } from "../config";
import Board from "./Board";
import Rack from "./Rack";
import Controls from "./Controls";
import ScoreBoard from "./ScoreBoard";
import Timer from "./Timer";

export default function PlayGame({ gameId, gameData, setGameData, playerName, onExit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizePlayers = (arr) =>
    (arr || []).map(p => ({ name: p.name, score: p.score || 0 }));
  const normalizeBoard = (boardState) =>
    Array.isArray(boardState) && boardState.length === 15
      ? boardState
      : Array.from({ length: 15 }, () => Array(15).fill(null));

  useEffect(() => {
    if (!gameId) return;
    const socket = connectSocket(import.meta.env.VITE_SOCKET_URL);
    if (!socket) return;

    const handleUpdate = (data) => {
      setGameData({
        ...data,
        players: normalizePlayers(data.players),
        boardState: normalizeBoard(data.boardState)
      });
    };

    socket.on("connect", () => socket.emit("game:join", { gameId, playerName }));
    socket.on("game:state", handleUpdate);

    return () => {
      socket.off("game:state", handleUpdate);
      socket.disconnect();
    };
  }, [gameId, setGameData, playerName]);

  const handleMove = async (move) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/games/move/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, ...move }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Move failed");
      const data = await res.json();
      setGameData({
        ...data,
        players: normalizePlayers(data.players),
        boardState: normalizeBoard(data.boardState)
      });
      getSocket()?.emit("game:move", { gameId, move });
    } catch (err) {
      setError("Move failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Game On: {gameId}</h2>
      <ScoreBoard players={normalizePlayers(gameData?.players)} />
      <Timer />
      <Board board={normalizeBoard(gameData?.boardState)} />
      <Rack tiles={gameData?.tiles || []} onPlay={handleMove} disabled={loading} />
      <Controls onExit={onExit} />
    </div>
  );
}
