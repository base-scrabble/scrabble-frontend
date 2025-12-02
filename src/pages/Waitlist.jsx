import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

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
        navigate("/waitlist/success");
      } else {
        setError(data.message || "Failed to join waitlist.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="waitlist-container">
      <h2>Join the Waitlist</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={loading}
      />
      <button onClick={handleJoin} disabled={loading}>
        {loading ? "Joining..." : "Join Waitlist"}
      </button>
      {error && <div className="error">{error}</div>}
      {inviteLink && (
        <div className="invite-link">
          Invite Link: <a href={inviteLink}>{inviteLink}</a>
        </div>
      )}
    </div>
  );
}
