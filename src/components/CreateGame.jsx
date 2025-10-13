import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame } from "../api/gameApi";

export default function CreateGame({ onCreate }) {
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    if (!playerName) return;

    setLoading(true);
    try {
      const data = await createGame(playerName); // ✅ use API helper
      console.log("🎮 Created game:", data);
      onCreate(data);
      navigate(`/waiting/${data.gameId}`); // ✅ redirect to waiting room
    } catch (err) {
      console.error(err);
      alert(`Error creating game: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-2">Create Game</h2>
      <input
        type="text"
        placeholder="Enter your name"
        className="w-full border rounded p-2 mb-2"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white w-full py-2 rounded disabled:opacity-50"
        onClick={handleCreateGame}
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Game"}
      </button>
    </div>
  );
}
