import { useState, useEffect } from "react";
import axios from "axios";

export default function PlayGame({ gameId, playerName }) {
  const [board, setBoard] = useState([]); // 15x15 scrabble board
  const [rack, setRack] = useState([]); // player's letters
  const [turn, setTurn] = useState(null); // whose turn
  const [players, setPlayers] = useState([]); // game players
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch game state on mount and poll every 3s
  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 3000);
    return () => clearInterval(interval);
  }, [gameId]);

  async function fetchGameState() {
    try {
      const res = await axios.get(`/api/game/state?gameId=${gameId}`);
      setBoard(res.data.board);
      setRack(res.data.rack);
      setTurn(res.data.turn);
      setPlayers(res.data.players);
    } catch (err) {
      console.error("Error fetching game state", err);
    }
  }

  async function playWord(word, x, y, direction) {
    setLoading(true);
    try {
      const res = await axios.post("/api/game/play", {
        gameId,
        player: playerName,
        word,
        x, // row index
        y, // col index
        direction, // "horizontal" or "vertical"
      });
      if (res.data.success) {
        setMessage(`✅ Word played: ${word}`);
        fetchGameState();
      } else {
        setMessage(`❌ Invalid word: ${res.data.error}`);
      }
    } catch (err) {
      console.error("Play word error", err);
      setMessage("❌ Error playing word");
    }
    setLoading(false);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Game ID: {gameId}</h2>
      <p className="mb-2">Players: {players.join(", ")}</p>
      <p className="mb-2">Current Turn: {turn}</p>

      <div className="grid grid-cols-15 gap-0 border">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
            key={`${i}-${j}`}
            className="w-8 h-8 border flex items-center justify-center text-sm"
          >
            {cell || ""}
          </div>
        ))
      )}
    </div>

    <div className="mt-4">
      <h3 className="font-semibold">Your Rack</h3>
      <div className="flex space-x-2">
        {rack.map((letter, idx) => (
          <div
            key={idx}
            className="w-8 h-8 border flex items-center justify-center text-lg bg-yellow-100"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>

    <div className="mt-4">
      <h3 className="font-semibold mb-2">Play a Word</h3>
      <form
          onSubmit={(e) => {
            e.preventDefault();
            const word = e.target.word.value.trim();
            const x = parseInt(e.target.x.value, 10);
            const y = parseInt(e.target.y.value, 10);
            const direction = e.target.direction.value;
            if (!word) return setMessage(":x: Enter a word");
            playWord(word, x, y, direction);
            e.target.reset();
          }}
          className="space-y-2"
        >
          <input
            type="text"
            name="word"
            placeholder="Word"
            className="border p-1"
          />
          <input
            type="number"
            name="x"
            placeholder="Row (0-14)"
            className="border p-1"
          />
          <input
            type="number"
            name="y"
            placeholder="Col (0-14)"
            className="border p-1"
          />
          <select name="direction" className="border p-1">
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {loading ? "Playing..." : "Play Word"}
          </button>
        </form>
      </div>

      {message && (
        <div className="mt-4 p-2 bg-gray-100 border rounded">{message}</div>
      )}
    </div>
  );
}