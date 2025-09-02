import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6 space-y-10">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Welcome to BaseScrabble 🎲
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          The first onchain Scrabble game on Base — play, compete, and flex your
          word power globally!
        </p>
      </div>

      {/* Call-to-Action */}
      <Link
        to="/waitlist"
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
      >
        🚀 Join the Waitlist
      </Link>

      {/* Navigation Buttons */}
      <div className="grid gap-4 w-full max-w-md">
        <Link
          to="/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow text-center"
        >
          ➕ Create Game
        </Link>
        <Link
          to="/waiting"
          className="px-6 py-3 bg-yellow-600 text-white rounded-xl shadow text-center"
        >
          ⏳ Waiting Room
        </Link>
        <Link
          to="/game"
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow text-center"
        >
          🎮 Play Game
        </Link>
        <Link
          to="/scoreboard"
          className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow text-center"
        >
          🏆 Scoreboard
        </Link>
      </div>
    </div>
  );
}

