import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinGame } from "../api/gameApi";

export default function JoinGame({ onJoin }) {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!name || !gameId) return;
    setLoading(true);
    try {
      const data = await joinGame(gameId, name);
      console.log("👤 Joined game:", data);

      // ✅ Normalize players to always be objects
      const players = (data.players || []).map((p) =>
        typeof p === "string" ? { name: p, score: 0 } : p
      );

      if (onJoin) onJoin({ ...data, players });

      // go to waiting room
      navigate(`/waiting/${gameId}`);
    } catch (err) {
      console.error("Join error:", err);
      alert(`Error joining game: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="font-bold mb-2">Join a Game</h2>

      <input
        type="text"
        placeholder="Enter your name"
        className="w-full border rounded p-2 mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter game ID"
        className="w-full border rounded p-2 mb-2"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />

      <button
        onClick={handleJoin}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Game"}
      </button>
    </div>
  );
}
