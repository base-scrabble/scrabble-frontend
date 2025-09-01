// pages/Results.js
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scores, winner } = location.state || { scores: {}, winner: null };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Game Over 🎉</h1>

      {winner ? (
        <p className="text-xl mb-4">
          Winner: <span className="font-bold text-green-400">{winner}</span>
        </p>
      ) : (
        <p className="text-xl mb-4">It's a tie!</p>
      )}

      <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Final Scores</h2>
        <ul>
          {Object.entries(scores).map(([player, score]) => (
            <li key={player} className="flex justify-between border-b py-1">
              <span>{player}</span>
              <span>{score}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg"
      >
        Back to Home
      </button>
    </div>
  );
}
