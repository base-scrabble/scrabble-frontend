// src/AppRoutes.jsx
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Link
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
import { API_BASE_URL } from "./config";
import { getSocket } from "./services/socketService";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
  getSessionJSON,
  setSessionJSON,
} from "./utils/session";

const WaitingRoom = lazy(() => import("./components/WaitingRoom"));
const PlayGame = lazy(() => import("./components/PlayGame"));
const Waitlist = lazy(() => import("./pages/Waitlist"));
const Success = lazy(() => import("./pages/Success"));

const PageFallback = ({ label = "Loading…" }) => (
  <div className="p-4 text-slate-600">{label}</div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesInner />
    </BrowserRouter>
  );
}

function AppRoutesInner() {
  const navigate = useNavigate();
  const leavingRef = useRef(false);
  const gameDataRef = useRef(null);

  const [gameData, setGameData] = useState(() => getSessionJSON("gameData"));

  useEffect(() => {
    gameDataRef.current = gameData;
    if (gameData) setSessionJSON("gameData", gameData);
    else removeSessionItem("gameData");
  }, [gameData]);

  // Called by CreateGame component (onCreate)
  // Accepts either:
  //  - a backend response object: { gameId, players, state, playerName? }
  //  - OR (fallback) a plain playerName string (older versions)
  const handleCreate = (data = {}) => {
    if (!data) return;

    // fallback: CreateGame passed playerName string only
    if (typeof data === "string") {
      setSessionItem('playerName', data);
      // If CreateGame only sent a name, we don't have gameId to navigate to.
      // The CreateGame we replaced earlier *does* call the backend and passes the response object,
      // so this branch should be rare. If you hit this, consider updating CreateGame
      // to call the backend and pass its response into onCreate().
      return;
    }

    // expected object from backend
    if (data.playerName) {
      setSessionItem('playerName', data.playerName);
      console.log('💾 Stored playerName in sessionStorage:', data.playerName);
    }
    setGameData((prev) => ({
      ...(prev || {}),
      ...data,
      gameId: data.gameId || prev?.gameId,
    }));

    if (data.gameId) {
      setSessionItem('currentGameId', data.gameId);
      console.log('💾 Stored gameId in sessionStorage:', data.gameId);
      navigate(`/waiting/${data.gameId}`);
    } else {
      // safety: if create returned no id, stay on page but show created data
      console.warn("create returned no gameId:", data);
    }
  };

  // Called when someone joins a game (WaitingRoom or Join flows)
  const handleJoin = (data) => {
    if (!data) return;
    console.log('🔵 handleJoin called with data:', data);
    setGameData((prev) => ({
      ...(prev || {}),
      ...data,
      gameId: data.gameId || prev?.gameId,
    }));
    if (data.playerName) {
      setSessionItem('playerName', data.playerName);
      console.log('💾 Stored playerName in sessionStorage:', data.playerName);
    }
    if (data.gameId) {
      setSessionItem('currentGameId', data.gameId);
      console.log('💾 Stored gameId in sessionStorage:', data.gameId);
      navigate(`/waiting/${data.gameId}`);
    }
  };

  // Called by WaitingRoom when game actually starts (server/host starts the match)
  const handleStart = (newState = {}) => {
    // attach new state to gameData and navigate to game board
    const merged = {
      ...(gameData || {}),
      state: newState,
      status: 'active',
      gameId: newState.gameId || gameData?.gameId,
    };
    setGameData(merged);
    if (merged.gameId) navigate(`/game/${merged.gameId}`);
  };

  // Called to clear current game (leave / finish)
  const clearGame = async (gameIdParam) => {
    if (leavingRef.current) {
      console.log('⏭️ clearGame skipped - already processing a leave request');
      return;
    }
    leavingRef.current = true;
    // ALWAYS read fresh from sessionStorage - React state may be stale after navigation
    const storedPlayerName = getSessionItem('playerName');
    const storedGameId = getSessionItem('currentGameId');
    const activeGameData = gameDataRef.current;
    const gameId = gameIdParam || activeGameData?.gameId || storedGameId;
    const player = storedPlayerName;
    
    console.log('🚪 clearGame - gameId:', gameId, 'player:', player);
    
    // Call backend to leave game if we have both
    try {
      const activeSocket = getSocket();
      if (activeSocket && gameId && player) {
        try {
          activeSocket.emit('game:leave', { gameId, playerName: player });
        } catch (socketErr) {
          console.warn('⚠️ Failed to emit game:leave', socketErr);
        }
      }

      if (gameId && player) {
        try {
          const leaveUrl = `${API_BASE_URL}/gameplay/${gameId}/leave`;
          console.log(`🚪 Leaving game ${gameId} as ${player}`);
          console.log(`🚪 Fetching URL: ${leaveUrl}`);
          console.log(`🚪 Request body:`, { playerName: player });
          
          const response = await fetch(leaveUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: player })
          });
          
          console.log(`🚪 Response status: ${response.status}`, response);
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Successfully left game:', result);
          } else {
            const error = await response.json();
            console.error('❌ Failed to leave game:', error);
          }
        } catch (err) {
          console.error('❌ Error leaving game:', err);
        }
      } else {
        console.warn('⚠️ Cannot leave game - missing gameId or playerName');
      }
      
      // Clear React state
      setGameData(null);
      
      // ONLY clear sessionStorage on explicit user exit
      // DON'T use sessionStorage.clear() - it clears everything
      removeSessionItem('currentGameId');
      removeSessionItem('gameData');
      
      navigate("/");
    } finally {
      leavingRef.current = false;
    }
  };

  return (
    <Layout>
      <Routes>
        {/* Home / Create page */}
        <Route
          path="/"
          element={
            <div className="max-w-5xl mx-auto p-4 space-y-6">
              <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Live beta</p>
                <h1 className="text-3xl font-black mt-2">Spin up a room or join an existing match.</h1>
                <p className="text-slate-200 mt-2">
                  Share the same name across both cards so you stay synced between create and join.
                </p>
              </section>
              <div className="mb-4">
                <Link to="/waitlist" className="btn bg-blue-600 text-white px-4 py-2 rounded">Join the Waitlist</Link>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <CreateGame
                  onCreate={handleCreate}
                />
                <JoinGame
                  onJoin={handleJoin}
                />
              </div>
            </div>
          }
        />

        {/* Explicit Create route (optional) */}
        <Route
          path="/create"
          element={
            <div className="container mx-auto p-4">
              <CreateGame
                onCreate={handleCreate}
              />
            </div>
          }
        />

        <Route
          path="/join"
          element={
            <div className="container mx-auto p-4">
              <JoinGame
                onJoin={handleJoin}
              />
            </div>
          }
        />

        {/* Waiting room — wrapper pulls :gameId param and passes gameData + callbacks */}
        <Route
          path="/waiting/:gameId"
          element={
            <Suspense fallback={<PageFallback label="Loading room…" />}>
              <WaitingRoomWrapper
                gameData={gameData}
                setGameData={setGameData}
                onStart={handleStart}
                onJoin={handleJoin}
                onExit={clearGame}
              />
            </Suspense>
          }
        />

        {/* Live game board */}
        <Route
          path="/game/:gameId"
          element={
            <Suspense fallback={<PageFallback label="Loading game…" />}>
              <PlayGameWrapper
                gameData={gameData}
                setGameData={setGameData}
                clearGame={clearGame}
              />
            </Suspense>
          }
        />


        {/* Waitlist and Success pages */}
        <Route
          path="/waitlist"
          element={
            <Suspense fallback={<PageFallback label="Loading…" />}>
              <Waitlist />
            </Suspense>
          }
        />
        <Route
          path="/waitlist/success"
          element={
            <Suspense fallback={<PageFallback label="Loading…" />}>
              <Success />
            </Suspense>
          }
        />

        {/* Farcaster manifest is served from public/.well-known/farcaster.json by the host */}

        {/* Fallback -> home */}
        <Route
          path="*"
          element={
            <div className="container mx-auto p-4">
              <CreateGame
                onCreate={handleCreate}
              />
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

function WaitingRoomWrapper({ gameData, setGameData, onStart, onJoin, onExit }) {
  const params = useParams();
  const navigate = useNavigate();
  const { gameId } = params;

  // helper passed down to actual WaitingRoom component
  const handleLocalStart = (state) => {
    // update gameData and navigate to game
    setGameData((prev) => ({
      ...(prev || {}),
      state,
      status: 'active',
      gameId: state?.gameId || prev?.gameId || gameId,
    }));
    if (gameId) navigate(`/game/${gameId}`);
    if (typeof onStart === "function") onStart(state);
  };

  const handleLocalJoin = (data = {}) => {
    setGameData((prev) => ({
      ...(prev || {}),
      ...data,
      gameId: data.gameId || prev?.gameId || gameId,
    }));
    if (typeof onJoin === "function") onJoin({ ...data, gameId: data.gameId || gameId });
  };

  return (
    <div className="p-4">
      <WaitingRoom
        gameId={gameId}
        gameData={gameData}
        setGameData={setGameData}
        onStart={handleLocalStart}
        onJoin={handleLocalJoin}
        onExit={() => onExit(gameId)}
      />
    </div>
  );
}

function PlayGameWrapper({ gameData, setGameData, clearGame }) {
  const { gameId } = useParams();
  const storedName = getSessionItem('playerName', '');

  return (
    <div className="p-2">
      <PlayGame
        gameId={gameId}
        gameData={gameData}
        setGameData={setGameData}
        playerName={storedName}
        onExit={() => clearGame(gameId)}
      />
    </div>
  );
}
