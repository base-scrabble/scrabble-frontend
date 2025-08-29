import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    navigate("/success");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero */}
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <img
          src="/scrabble-board.png"
          alt="Scrabble Preview"
          className="w-32 md:w-40 lg:w-48 mb-6 rounded-lg shadow-lg mx-auto"
        />
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide">
          Join the BaseScrabble Waitlist
        </h1>
        <p className="text-gray-400 mt-3 text-lg max-w-xl">
          A word game for the onchain world. Play words. Earn flex. ✨
        </p>
      </div>

      {/* Center Form + Leaderboard */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6 w-full max-w-6xl">
        {/* Waitlist Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Be first to play 👇
          </h2>
          <div className="flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-r-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
            >
              Join Now
            </button>
          </div>
        </form>

        {/* Pseudo Leaderboard */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-xs mx-auto">
          <h2 className="text-lg font-semibold mb-4">🌍 Global Leaderboard</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex justify-between">
              <span>player.eth</span> <span>128 pts</span>
            </li>
            <li className="flex justify-between">
              <span>baseMaxi</span> <span>97 pts</span>
            </li>
            <li className="flex justify-between">
              <span>wordlord</span> <span>83 pts</span>
            </li>
            <li className="flex justify-between italic text-gray-500">
              <span>Your name here</span> <span>--</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 py-6 border-t border-gray-700 text-center space-x-6 text-gray-400 w-full">
        <a href="https://x.com/basescrabble" target="_blank" className="hover:text-white">
          X
        </a>
        <a href="https://t.me/+_u8MjvBypj0yNzM8" target="_blank" className="hover:text-white">
          Telegram
        </a>
        <a href="https://discord.gg/2jexYPVA" target="_blank" className="hover:text-white">
          Discord
        </a>
      </footer>
    </div>
  );
}