import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFreeGame } from "../api/gameApi";
import { getSessionItem, setSessionItem } from "../utils/session";
import { extractGamePayload, resolveGameId } from "../utils/gamePayload";

const getInitialName = () => {
  return getSessionItem('playerName', '');
};

export default function CreateGame({ onCreate }) {
  const [playerName, setPlayerName] = useState(getInitialName);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateName = (value) => {
    setError('');
    setPlayerName(value);
    setSessionItem('playerName', value);
  };

  const handleCreateGame = async () => {
    const normalizedName = (playerName || '').trim();
    if (!normalizedName) {
      setError('Please enter your name before creating a room.');
      return;
    }

    setCreating(true);
    try {
      // Free game is fully offchain; do not require wallet connection.
      const data = await createFreeGame(normalizedName, null);
      const payload = extractGamePayload(data);
      const resolvedGameId = resolveGameId(payload);

      if (!payload || !resolvedGameId) {
        throw new Error('Received an invalid response from the server.');
      }

      onCreate({ ...payload, playerName: normalizedName });
      navigate(`/waiting/${resolvedGameId}`);
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || err?.message || 'Unable to create game';
      alert(`Error creating game: ${message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">Create Game</h2>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
          value={playerName}
          onChange={(e) => updateName(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <button
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full py-3 rounded-lg font-bold disabled:opacity-50 hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
        onClick={handleCreateGame}
        disabled={creating || !(playerName || '').trim()}
      >
        {creating ? "Creating..." : "Create Game"}
      </button>
    </div>
  );
}
