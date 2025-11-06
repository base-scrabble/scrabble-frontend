import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameState, joinGame, startGame } from "../api/gameApi";
import { connectSocket, getSocket } from "../services/socketService";

export default function WaitingRoom({ gameId, gameData, onStart, onJoin, onEnd }) {
  const [players, setPlayers] = useState(() =>
    (gameData?.players || []).map(p => typeof p === "string" ? { name: p, score: 0 } : p)
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) return;
    const socket = connectSocket(import.meta.env.VITE_SOCKET_URL);
    if (!socket) return;

    const handleJoin = (data) => {
      setPlayers(data.players);
      if (onJoin) onJoin(data);
    };

    const handleStart = (data) => {
      if (data.state === "active") {
        if (onStart) onStart(data);
        navigate(`/game/${gameId}`);
      }
    };

    const handleEnd = (data) => {
      if (data.state === "completed") {
        if (onEnd) onEnd(data);
        navigate(`/results/${gameId}`);
      }
    };

    socket.on("connect", () => socket.emit("game:join", { gameId, playerName: "Guest" }));
    socket.on("game:join", handleJoin);
    socket.on("game:start", handleStart);
    socket.on("game:state", handleStart);
    socket.on("game:leave", handleJoin);

    return () => {
      socket.off("game:join", handleJoin);
      socket.off("game:start", handleStart);
      socket.off("game:state", handleStart);
      socket.off("game:leave", handleJoin);
      socket.disconnect();
    };
  }, [gameId, onStart, onJoin, onEnd, navigate]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const data = await joinGame(gameId, "Guest");
      setPlayers(data.players);
      if (onJoin) onJoin(data);
      getSocket()?.emit("game:join", { gameId, playerName: "Guest" });
    } catch (err) {
      alert(`Error joining game: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const data = await startGame(gameId);
      if (onStart) onStart(data);
      getSocket()?.emit("game:start", { gameId });
      navigate(`/game/${gameId}`);
    } catch (err) {
      alert(`Error starting game: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">Waiting Room</h2>
      <p>Game ID: {gameId}</p>
      <ul className="list-disc pl-6 mb-4">
        {players.map((p, idx) => (
          <li key={idx}>{p.name} <span className="text-gray-500">({p.score} pts)</span></li>
        ))}
      </ul>
      <button onClick={handleJoin} className="mt-2 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? "Joining..." : "Join Game"}
      </button>
      <button onClick={handleStart} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? "Starting..." : "Start Game"}
      </button>
    </div>
  );
}
