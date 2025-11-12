// src/pages/Waitlist.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const referralCode = new URLSearchParams(window.location.search).get('ref');
  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referralCode }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteLink(data.inviteLink);
        navigate('/success');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Join Base Scrabble Waitlist</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {inviteLink && <p className="mt-4 text-green-600 text-center">Share: {inviteLink}</p>}
      </div>
    </div>
  );
}