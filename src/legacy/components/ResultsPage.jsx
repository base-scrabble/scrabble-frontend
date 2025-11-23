import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResultsPage() {
  const { gameId } = useParams();
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/game/state/${gameId}`
        );
        if (res.data.success) {
          // winner is only available if completed
          if (res.data.state === "completed") {
            setScores(res.data.players);
            // Backend returns winner via /end, but fallback to max score here
            const top = res.data.players.reduce(
              (a, b) => (a.score > b.score ? a : b),
              res.data.players[0]
            );
            setWinner(top.name);
          }
        }
      } catch (err) {
        console.error("Error loading results:", err);
      }
    };
    fetchResults();
  }, [gameId]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Game Over 🎉</h2>
      {winner && <p className="text-lg mb-4">🏆 Winner: {winner}</p>}
      <div className="space-y-2">
        {scores.map((s, idx) => (
          <div
            key={idx}
            className="bg-gray-100 border rounded p-2 flex justify-between"
          >
            <span>{s.name}</span>
            <span>{s.score}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Back to Home
      </button>
    </div>
  );
}
