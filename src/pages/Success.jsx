import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Success() {
  const navigate = useNavigate();
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [inviteLink, setInviteLink] = useState("");
  const [referrals, setReferrals] = useState(null);

  useEffect(() => {
    // Generate confetti animation
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: [
        "text-blue-400",
        "text-purple-400",
        "text-pink-400",
        "text-green-400",
        "text-yellow-400",
      ][Math.floor(Math.random() * 5)],
    }));
    setConfettiPieces(pieces);
  }, []);

  useEffect(() => {
    // Load referral info from localStorage
    const code = localStorage.getItem("inviteCode");
    if (code) {
      const link = `https://basescrabble.xyz?ref=${code}`;
      setInviteLink(link);

      // Fetch referral count
      fetch(`${API_BASE_URL}/api/users/referrals/${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setReferrals(data.referrals);
        });
    }
  }, []);

  return (
    <div className="success-container">
      <h2>Success! You're on the waitlist.</h2>
      <div className="confetti">
        {confettiPieces.map((piece) => (
          <span
            key={piece.id}
            className={`confetti-piece ${piece.color}`}
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          >
            🎉
          </span>
        ))}
      </div>
      {inviteLink && (
        <div className="invite-link">
          Your invite link: <a href={inviteLink}>{inviteLink}</a>
        </div>
      )}
      {referrals !== null && (
        <div className="referrals">
          Referrals: {referrals}
        </div>
      )}
      <button onClick={() => navigate("/waitlist")}>Back to Waitlist</button>
    </div>
  );
}
