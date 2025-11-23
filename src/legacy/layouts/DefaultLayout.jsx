import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-white/10 sticky top-0 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-black tracking-wide text-lg">
            BASE<span className="text-sky-400">D</span> SCRABBLE
          </Link>
          <nav className="flex gap-4 text-sm">
            {[
              ["Home", "/"],
              ["Create", "/create"],
              ["Join", "/join"],
              ["Play", "/play"],
              ["Tournament", "/tournament"],
              ["Profile", "/profile"],
              ["Leaderboard", "/leaderboard"],
            ].map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "bg-white/10" : "hover:bg-white/5"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>

      <footer className="border-t border-white/10 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Based Scrabble
        </div>
      </footer>
    </div>
  );
}