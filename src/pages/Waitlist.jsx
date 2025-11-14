import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [refCode, setRefCode] = useState(null);
  const navigate = useNavigate();

  // Capture ?ref=CODE from URL
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("ref");
    if (code) setRefCode(code);
  }, []);

  async function handleJoin() {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referralCode: refCode }),
      });

      const data = await res.json();

      if (data.success) {
        setInviteLink(data.inviteLink);
        localStorage.setItem("inviteCode", data.inviteLink.split("ref=")[1]);
        navigate("/success");
      } else {
        setError(data.message || "Could not join waitlist.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchReferrals(code) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/referrals/${code}`);
      const data = await res.json();
      if (data.success) setReferrals(data.referrals);
    } catch {
      setReferrals(null);
    }
  }

  useEffect(() => {
    const savedCode = localStorage.getItem("inviteCode");
    if (savedCode) {
      fetchReferrals(savedCode);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">
          Join Base Scrabble Waitlist
        </h1>

        {!inviteLink ? (
          <>
            <p className="text-sm text-center text-gray-600 mb-4">
              Get early access and share your referral link to climb the leaderboard!
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
            {error && (
              <p className="mt-3 text-red-500 text-center text-sm">{error}</p>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">
              🎉 You're on the waitlist!
            </p>
            <p className="text-gray-800 font-semibold">Your referral link:</p>
            <div className="bg-gray-100 rounded-lg p-3 text-sm break-all">
              {inviteLink}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Copy Link
            </button>

            {referrals !== null && (
              <p className="text-gray-700 text-sm">
                👥 Referrals so far:{" "}
                <span className="font-bold">{referrals}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
