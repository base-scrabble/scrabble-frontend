import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import CreateGamePage from "../pages/CreateGamePage";
import JoinGamePage from "../pages/JoinGamePage";
import GamePlayPage from "../pages/Game";
import TournamentPage from "../pages/TournamentPage";
import ProfilePage from "../pages/Profile";
import LeaderboardPage from "../pages/Leaderboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGamePage />} />
      <Route path="/join" element={<JoinGamePage />} />
      <Route path="/play" element={<GamePlayPage />} />
      <Route path="/tournament" element={<TournamentPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Routes>
  );
}