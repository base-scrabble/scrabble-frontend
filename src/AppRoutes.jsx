// src/AppRoutes.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";

/*
  AppRoutes: top-level router + single source of truth for
  playerName and gameData. Replace the entire file with this code.

  - CreateGame calls onCreate(data) where `data` is expected to be the
    backend response: { gameId, players, state, playerName? }.
  - After create, we navigate to /waiting/:gameId
  - WaitingRoom can call onStart(...) to move players to /game/:gameId
  - gameData persisted to sessionStorage so page reload doesn't lose state
*/

import Layout from "./components/Layout";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import WaitingRoom from "./components/WaitingRoom";
import PlayGame from "./components/PlayGame";
import Header from "./components/Header"; // optional — Layout might already include header
import Footer from "./components/Footer"; // optional
import ApiTest from "./components/ApiTest";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesInner />
    </BrowserRouter>
  );
}

function AppRoutesInner() {
  const navigate = useNavigate();

  // playerName (string) and gameData (object from backend)
  const [playerName, setPlayerName] = useState(
    () => sessionStorage.getItem("playerName") || ""
  );

  const [gameData, setGameData] = useState(() => {
    try {
      const raw = sessionStorage.getItem("gameData");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // persist to sessionStorage so refresh doesn't kill the flow
  useEffect(() => {
    if (playerName) sessionStorage.setItem("playerName", playerName);
    else sessionStorage.removeItem("playerName");
  }, [playerName]);

  useEffect(() => {
    if (gameData) sessionStorage.setItem("gameData", JSON.stringify(gameData));
    else sessionStorage.removeItem("gameData");
  }, [gameData]);

  // Called by CreateGame component (onCreate)
  // Accepts either:
  //  - a backend response object: { gameId, players, state, playerName? }
  //  - OR (fallback) a plain playerName string (older versions)
  const handleCreate = (data) => {
    if (!data) return;

    // fallback: CreateGame passed playerName string only
    if (typeof data === "string") {
      setPlayerName(data);
      // If CreateGame only sent a name, we don't have gameId to navigate to.
      // The CreateGame we replaced earlier *does* call the backend and passes the response object,
      // so this branch should be rare. If you hit this, consider updating CreateGame
      // to call the backend and pass its response into onCreate().
      return;
    }

    // expected object from backend
    if (data.playerName) setPlayerName(data.playerName);
    setGameData(data);

    if (data.gameId) {
      navigate(`/waiting/${data.gameId}`);
    } else {
      // safety: if create returned no id, stay on page but show created data
      console.warn("create returned no gameId:", data);
    }
  };

  // Called when someone joins a game (WaitingRoom or Join flows)
  const handleJoin = (data) => {
    if (!data) return;
    setGameData(data);
    if (data.gameId) navigate(`/waiting/${data.gameId}`);
  };

  // Called by WaitingRoom when game actually starts (server/host starts the match)
  const handleStart = (newState = {}) => {
    // attach new state to gameData and navigate to game board
    setGameData((prev) => {
      const merged = { ...(prev || {}), state: newState };
      // navigate after state is applied
      if (merged.gameId) navigate(`/game/${merged.gameId}`);
      return merged;
    });
  };

  // Called to clear current game (leave / finish)
  const clearGame = () => {
    setGameData(null);
    // optionally navigate to home
    navigate("/");
  };

  return (
    <Layout>
      <Routes>
        {/* Home / Create page */}
        <Route
  path="/"
  element={
    <div className="container mx-auto p-4">
      <CreateGame onCreate={handleCreate} />
      <JoinGame onJoin={handleJoin} /> {/* ✅ added */}
      <ApiTest />
    </div>
  }
/>

        {/* Explicit Create route (optional) */}
        <Route
          path="/create"
          element={
            <div className="container mx-auto p-4">
              <CreateGame onCreate={handleCreate} />
            </div>
          }
        />

        <Route
          path="/join"
          element={
            <div className="container mx-auto p-4">
              <JoinGame onJoin={handleJoin} />
            </div>
          }
        />

        {/* Waiting room — wrapper pulls :gameId param and passes gameData + callbacks */}
        <Route
          path="/waiting/:gameId"
          element={
            <WaitingRoomWrapper
              gameData={gameData}
              setGameData={setGameData}
              onStart={handleStart}
              onJoin={handleJoin}
              setPlayerName={setPlayerName}
            />
          }
        />

        {/* Live game board */}
        <Route
          path="/game/:gameId"
          element={
            <PlayGameWrapper
              gameData={gameData}
              setGameData={setGameData}
              playerName={playerName}
              clearGame={clearGame}
            />
          }
        />

        {/* Fallback -> home */}
        <Route
          path="*"
          element={
            <div className="container mx-auto p-4">
              <CreateGame onCreate={handleCreate} />
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}

/* -------------------------
   Route wrappers (read params + pass props)
   ------------------------- */

function WaitingRoomWrapper({ gameData, setGameData, onStart, onJoin, setPlayerName }) {
  const params = useParams();
  const navigate = useNavigate();
  const { gameId } = params;

  // helper passed down to actual WaitingRoom component
  const handleLocalStart = (state) => {
    // update gameData and navigate to game
    setGameData((prev) => ({ ...(prev || {}), state }));
    if (gameId) navigate(`/game/${gameId}`);
    if (typeof onStart === "function") onStart(state);
  };

  const handleLocalJoin = (data) => {
    setGameData(data);
    if (data?.playerName) setPlayerName(data.playerName);
    if (typeof onJoin === "function") onJoin(data);
  };

  return (
    <div className="p-4">
      <WaitingRoom
        gameId={gameId}
        gameData={gameData}
        onStart={handleLocalStart}
        onJoin={handleLocalJoin}
      />
    </div>
  );
}

function PlayGameWrapper({ gameData, setGameData, playerName, clearGame }) {
  const { gameId } = useParams();

  return (
    <div className="p-2">
      <PlayGame
        gameId={gameId}
        gameData={gameData}
        setGameData={setGameData}
        playerName={playerName}
        onExit={clearGame}
      />
    </div>
  );
}
