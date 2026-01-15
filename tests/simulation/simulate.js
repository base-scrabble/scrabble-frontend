/*
RUN:
node tests/simulation/simulate.js
*/

import axios from 'axios';
import { spawnPlayer } from './client.js';
import { playRandomMove, passTurn } from './moves.js';
import { saveState } from './compare.js';
import { log } from '../utils/logger.js';

const DEFAULT_BACKEND_ORIGIN = 'https://basescrabble-backend.fly.dev';
const backendUrl = process.env.BACKEND_URL || DEFAULT_BACKEND_ORIGIN;
const socketUrl = process.env.SOCKET_URL || DEFAULT_BACKEND_ORIGIN;
const PLAYER_NAMES = ['Alpha', 'Bravo', 'Charlie'];

function extractGameState(payload) {
  if (!payload) return null;
  if (payload.data?.gameState) return payload.data.gameState;
  if (payload.gameState) return payload.gameState;
  return payload;
}

(async function runSimulation() {
  log('=== START 3-PLAYER SIMULATION ===');

  // 1. CREATE GAME
  const hostName = PLAYER_NAMES[0];
  const joinQueue = PLAYER_NAMES.slice(1);
  const gameRes = await axios.post(`${backendUrl}/api/gameplay/create`, {
    mode: 'classic',
    playerName: hostName,
  });
  const initialState = extractGameState(gameRes.data);
  const gameId = initialState?.id || initialState?.gameId;
  if (!gameId) {
    throw new Error('Failed to create game');
  }
  log(`Created game: ${gameId}`);

  // 2. SPAWN 3 PLAYERS (host already created during /create call)
  const players = [];
  const hostPlayer = await spawnPlayer(backendUrl, socketUrl, gameId, hostName, {
    skipJoin: true,
    initialGameState: initialState,
  });
  players.push(hostPlayer);
  for (const name of joinQueue) {
    const participant = await spawnPlayer(backendUrl, socketUrl, gameId, name);
    players.push(participant);
  }

  const [P1, P2, P3] = players;

  // 3. SAVE INITIAL STATE
  const state1 = await axios.get(`${backendUrl}/api/gameplay/${gameId}`);
  saveState('initial', state1.data);

  // 3b. START GAME (ensures moves/skip endpoints are allowed)
  await axios.post(`${backendUrl}/api/gameplay/${gameId}/start`);
  log('Game started');

  // 4. RANDOM MOVES
  await playRandomMove(backendUrl, gameId, PLAYER_NAMES[0]);
  await playRandomMove(backendUrl, gameId, PLAYER_NAMES[1]);
  await passTurn(backendUrl, gameId, PLAYER_NAMES[2]);

  // 5. FORCE RECONNECT CHAOS
  log('FORCING SOCKET RECONNECTS…');
  P1.socket.disconnect();
  P2.socket.disconnect();
  P3.socket.disconnect();

  setTimeout(() => {
    P1.socket.connect();
    P2.socket.connect();
    P3.socket.connect();
  }, 1500);

  // 6. SAVE POST-RECONNECT STATE
  setTimeout(async () => {
    const state2 = await axios.get(`${backendUrl}/api/gameplay/${gameId}`);
    saveState('after-reconnect', state2.data);

    log('=== 3-PLAYER SIMULATION DONE ===');
    process.exit(0);
  }, 4000);
})();
