import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold text-xl text-indigo-600">Based Scrabble</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <Link to="/game" className="hover:text-indigo-600">Play</Link>
        <Link to="/waitlist" className="hover:text-indigo-600">Waitlist</Link>
        <Link to="/score" className="hover:text-indigo-600">Scoreboard</Link>
        <Link to="/tournaments" className="hover:text-indigo-600">Tournaments</Link>
        <Link to="/leaderboard" className="hover:text-indigo-600">Leaderboard</Link>
      </div>
    </nav>
  );
}
