import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import PrivyButton from "./PrivyButton";
import { PRIVY_APP_ID } from "../config";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow">
      <div className="container mx-auto flex flex-wrap gap-3 justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Based Scrabble
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/create" className="hover:underline">
            Create Game
          </Link>
          {PRIVY_APP_ID ? <PrivyButton /> : null}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
