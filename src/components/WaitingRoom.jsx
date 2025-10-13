// frontend: src/components/WaitingRoom.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameState, joinGame, startGame } from "../api/gameApi";

export default function WaitingRoom({ gameId, gameData, onStart, onJoin, onEnd }) {
  const [players, setPlayers] = useState(() =>
    (gameData?.players || []).map((p) =>
      typeof p === "string" ? { name: p, score: 0 } : p
    )
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // helper: always normalize players into { name, score }
  const normalizePlayers = (arr) =>
    (arr || []).map((p) =>
      typeof p === "string" ? { name: p, score: 0 } : p
    );

  // Poll backend for game state
  useEffect(() => {
    if (!gameId) return;

    const fetchState = async () => {
      try {
        const data = await getGameState(gameId);

        const normalizedPlayers = normalizePlayers(data.players);
        setPlayers(normalizedPlayers);

        console.log("🕒 WaitingRoom state:", data);

        // ✅ navigate all players when game starts
        if (data.state === "active") {
          if (onStart) onStart(data);
          navigate(`/game/${gameId}`);
        }

        // ✅ navigate all players when game ends
        if (data.state === "completed") {
          if (onEnd) onEnd(data);
          navigate(`/results/${gameId}`);
        }
      } catch (err) {
        console.error("Error polling game state", err);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [gameId, onStart, onEnd, navigate]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const data = await joinGame(gameId, "Guest"); // default Guest
      console.log("👤 Joined game:", data);

      const normalizedPlayers = normalizePlayers(data.players);
      setPlayers(normalizedPlayers);

      if (onJoin) onJoin({ ...data, players: normalizedPlayers });
    } catch (err) {
      console.error("Join error:", err);
      alert(`Error joining game: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const data = await startGame(gameId);
      console.log("🚀 Game started:", data);

      if (onStart) onStart(data);

      // ✅ force both host & other players to leave WaitingRoom
      navigate(`/game/${gameId}`);
    } catch (err) {
      console.error("Start error:", err);
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
          <li key={idx}>
            {p.name} <span className="text-gray-500">({p.score} pts)</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleJoin}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Joining..." : "Join Game"}
      </button>

      <button
        onClick={handleStart}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Game"}
      </button>
    </div>
  );
}
