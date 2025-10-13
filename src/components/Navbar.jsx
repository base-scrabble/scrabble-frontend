import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Based Scrabble
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/create" className="hover:underline">
            Create Game
          </Link>
        </div>
      </div>
    </nav>
  );
}
