// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import Scoreboard from "./pages/Scoreboard";
import TournamentPage from "./pages/TournamentPage";
import Waitlist from "./pages/Waitlist";
import Success from "./pages/Success";

// Temporary 404 page
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! Page not found.</p>
      <Link to="/" className="text-blue-500 underline">
        Go back Home
      </Link>
    </div>
  );
}

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 bg-gray-900 text-white flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/game">Game</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/scoreboard">Scoreboard</Link>
        <Link to="/tournaments">Tournaments</Link>
        <Link to="/waitlist">Waitlist</Link>
        <Link to="/success">Success</Link>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/tournaments" element={<TournamentPage />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
