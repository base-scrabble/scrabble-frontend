import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinGame } from "../api/gameApi";
import { getSessionItem, setSessionItem } from "../utils/session";
import { extractGamePayload, resolveGameId } from "../utils/gamePayload";

const normalizePlayers = (players = []) =>
  players.map((p) =>
    typeof p === "string"
      ? { name: p, score: 0 }
      : { ...p, score: p.score || 0 }
  );

const getStoredName = () => getSessionItem('playerName', '');

export default function JoinGame({ onJoin }) {
  const [name, setName] = useState(getStoredName);
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateName = (value) => {
    setError('');
    setName(value);
    setSessionItem('playerName', value);
  };

  const handleJoin = async () => {
    const normalizedName = (name || '').trim();
    const normalizedGameId = (gameId || '').trim();
    if (!normalizedName || !normalizedGameId) {
      setError('Enter both your name and a game ID to join.');
      return;
    }
    setLoading(true);
    try {
      const data = await joinGame(normalizedGameId, normalizedName);
      const payload = extractGamePayload(data);
      const resolvedGameId = resolveGameId(payload, normalizedGameId);

      if (!payload || !resolvedGameId) {
        throw new Error('Received an invalid response from the server.');
      }

      const players = normalizePlayers(payload.players);

      if (onJoin) {
        onJoin({
          ...payload,
          players,
          playerName: normalizedName,
        });
      }

      navigate(`/waiting/${resolvedGameId}`);
    } catch (err) {
      console.error("Join error:", err);
      const message = err?.response?.data?.message || err?.message || 'Unable to join game';
      alert(`Error joining game: ${message}`);
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
        className="w-full border rounded p-2 mb-2 text-gray-900 placeholder:text-gray-500"
        value={name}
        onChange={(e) => updateName(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      <input
        type="text"
        placeholder="Enter game ID"
        className="w-full border rounded p-2 mb-2 text-gray-900 placeholder:text-gray-500"
        value={gameId}
        onChange={(e) => {
          setError('');
          setGameId(e.target.value.toUpperCase());
        }}
      />

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

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
