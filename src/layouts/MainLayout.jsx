import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Based Scrabble</Link>
        <nav className="space-x-4">
          <Link to="/game">Game</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/practice">Practice</Link>
          <Link to="/tournament">Tournaments</Link>
        </nav>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-100 p-4 text-center text-sm">
        © 2025 Based Scrabble by noblepeter2000
      </footer>
    </div>
  );
}
