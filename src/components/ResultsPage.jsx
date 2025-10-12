// src/components/ResultsPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getGameState } from "../api/gameApi";
import { connectSocket, getSocket } from "../services/socketService";

export default function ResultsPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const socketPayload = location.state || null;

  const [winner, setWinner] = useState(socketPayload?.winner || null);
  const [scores, setScores] = useState(socketPayload?.scores || []);
  const [loading, setLoading] = useState(!socketPayload);

  // ----------------------------
  // Socket listener for live updates
  // ----------------------------
  useEffect(() => {
    connectSocket();
    const socket = getSocket();
    if (!socket || !gameId) return;

    socket.emit("join-game", { gameId });

    const handleGameEnded = (payload) => {
      console.log("📡 Received game_ended update:", payload);
      setWinner(payload.winner || "Unknown");
      setScores(payload.scores || []);
      setLoading(false);
    };

    socket.on("game_ended", handleGameEnded);

    return () => {
      if (socket) {
        socket.off("game_ended", handleGameEnded);
        socket.emit("leave-game", { gameId });
      }
    };
  }, [gameId]);

  // ----------------------------
  // Fallback: Fetch results from backend
  // ----------------------------
  useEffect(() => {
    if (socketPayload) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getGameState(gameId);

        if (data.state !== "completed") {
          navigate(`/game/${gameId}`);
          return;
        }

        setWinner(data.winner || "Unknown");
        setScores(
          (data.players || []).map((p) => ({
            name: p.name,
            score: p.score || 0,
          }))
        );
      } catch (err) {
        console.error("❌ Error fetching results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [gameId, socketPayload, navigate]);

  // ----------------------------
  // Share helpers
  // ----------------------------
  const shareUrl = `${window.location.origin}/results/${gameId}`;
  const shareText = `🏆 Based Scrabble Results\nWinner: ${winner}\n\nScores:\n${scores
    .map((p) => `${p.name}: ${p.score} pts`)
    .join("\n")}\n\nPlay Based Scrabble by noblepeter2000 🧩\n${shareUrl}`;

  const previewUrl = `${process.env.REACT_APP_API_URL}/share/results/${gameId}/image`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert("✅ Results copied to clipboard!");
    } catch {
      alert("❌ Could not copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Based Scrabble Results",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.warn("Share cancelled", err);
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `based-scrabble-results-${gameId}.png`;
    link.click();
  };

  // ----------------------------
  // Render
  // ----------------------------
  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="font-bold mb-2">Results</h2>
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">Game Over</h2>
      {winner && (
        <p className="mb-2">
          🏆 Winner: <span className="font-semibold">{winner}</span>
        </p>
      )}

      <h3 className="font-semibold mt-4">Final Scores</h3>
      <ul className="list-disc pl-6">
        {scores.map((p, idx) => (
          <li key={idx}>
            {p.name}: {p.score} pts
          </li>
        ))}
      </ul>

      {/* 🔹 Image Preview */}
      <div className="mt-6">
        <h3 className="font-semibold">Shareable Preview</h3>
        <img
          src={previewUrl}
          alt="Game Results Preview"
          className="mt-2 rounded shadow max-w-full"
        />
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
        <button
          onClick={handleShare}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Share Results
        </button>
        <button
          onClick={handleCopy}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Copy Text
        </button>
        <button
          onClick={handleDownload}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Download Image
        </button>
      </div>
    </div>
  );
}
