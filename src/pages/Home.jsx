import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        Welcome to BaseScrabble 🎲
      </h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-10">
        The first onchain Scrabble game on Base — play, compete, and flex your
        word power globally!
      </p>
      <Link
        to="/waitlist"
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
      >
        🚀 Join the Waitlist
      </Link>
    </div>
  );
}
