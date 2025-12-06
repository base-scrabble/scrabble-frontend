import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || '';
const API_BASE = `${API}/api/waitlist`;

function getStoredCode() {
  return localStorage.getItem("waitlistCode") || "";
}
function getStoredEmail() {
  return localStorage.getItem("waitlistEmail") || "";
}

export default function Waitlist() {
  const [email, setEmail] = useState(getStoredEmail());
  const [code, setCode] = useState(getStoredCode());
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (code) {
      fetch(`${API_BASE}/${code}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setReferralLink(data.referralLink);
            setReferralCount(data.referralCount);
            setSuccess(true);
          }
        });
    }
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setCode(data.code);
        setReferralLink(data.referralLink);
        setReferralCount(data.referralCount);
        setSuccess(true);
        localStorage.setItem("waitlistCode", data.code);
        localStorage.setItem("waitlistEmail", data.email);
      } else {
        setError(data.message || "Unknown error");
      }
    } catch (err) {
      setError("Server error");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Join the Waitlist</h2>
      {success ? (
        <div>
          <p className="text-green-700 font-semibold mb-2">Success! Stay tuned for Testnet!</p>
          <div className="mb-2">Your referral code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{code}</span></div>
          <div className="mb-2">Your invite link: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{referralLink}</span></div>
          <button onClick={handleCopy} className="bg-blue-600 text-white px-4 py-2 rounded">Copy Link</button>
          <div className="mt-4">Referrals: <span className="font-bold text-purple-700">{referralCount}</span></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border-2 border-gray-300 rounded-lg p-3"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full py-3 rounded-lg font-bold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
}
