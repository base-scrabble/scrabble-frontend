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
        })
        .catch(() => setReferrals(null));
    }
  }, []);

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      alert("Referral link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Confetti */}
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className={`absolute w-3 h-3 ${piece.color} opacity-80 animate-bounce`}
            style={{
              left: `${piece.left}%`,
              top: "-10px",
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              transform: "rotate(45deg)",
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <div>
            <div className="font-black text-2xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              BaseScrabble
            </div>
            <div className="text-sm text-gray-400 -mt-1">Success!</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Animation */}
        <div className="mb-16 relative group">
          <div className="absolute -inset-8 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl animate-bounce">🎉</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-8 max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent block">
              Welcome
            </span>
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent block mt-4">
              Aboard!
            </span>
          </h1>

          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
            You're officially part of the{" "}
            <span className="text-green-400 font-bold">BaseScrabble</span> waitlist.
            <br />
            Share your invite link to move up the leaderboard 🚀
          </p>
        </div>

        {/* Referral Info */}
        {inviteLink && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-12 w-full max-w-lg text-center shadow-xl">
            <p className="text-green-400 font-bold mb-3">Your Referral Link:</p>
            <div className="bg-black/50 border border-white/10 p-3 rounded-lg text-sm break-all">
              {inviteLink}
            </div>
            <button
              onClick={handleCopy}
              className="mt-3 text-sm text-blue-400 hover:underline"
            >
              Copy Link
            </button>
            {referrals !== null && (
              <p className="mt-3 text-gray-300 text-sm">
                👥 Referrals so far: <b>{referrals}</b>
              </p>
            )}
          </div>
        )}

        {/* Share Buttons */}
        <div className="space-y-4 w-full max-w-md mx-auto">
          <a
            href={`https://x.com/intent/tweet?text=I%20just%20joined%20the%20BaseScrabble%20waitlist!%20🎲%20Join%20me%20at%20${encodeURIComponent(
              inviteLink || "https://basescrabble.xyz"
            )}`}
            target="_blank"
            rel="noopener"
            className="block py-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg border border-white/10"
          >
            𝕏 Share on X
          </a>
          <a
            href={`https://warpcast.com/~/compose?text=I%20just%20joined%20the%20BaseScrabble%20waitlist!%20🎲%20Join%20me%20at%20${encodeURIComponent(
              inviteLink || "https://basescrabble.xyz"
            )}`}
            target="_blank"
            rel="noopener"
            className="block py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg"
          >
            🟣 Share on Farcaster
          </a>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-16 relative group bg-white/10 backdrop-blur-lg border-2 border-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:bg-white/20"
        >
          <span className="mr-2">⬅</span>
          Back to Waitlist
        </button>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/20 w-full text-center text-gray-400 text-sm">
        <p>© 2025 BaseScrabble. Built on Base chain with ❤️</p>
      </footer>
    </div>
  );
}
