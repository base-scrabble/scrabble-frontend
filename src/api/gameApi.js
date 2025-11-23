import axios from 'axios';
import { API_BASE_URL } from '../config';

// Use axios with credentials for game API calls
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

export async function createGame(playerName, stakeAmount = null, stakeTxHash = null, playerAddress = null) {
  const res = await client.post('/gameplay/create', { 
    playerName,
    stakeAmount,
    stakeTxHash,
    playerAddress
  });
  return unwrap(res);
}

export async function joinGame(gameId, playerName) {
  const res = await client.post(`/gameplay/${encodeURIComponent(gameId)}/join`, { playerName });
  return unwrap(res);
}

export async function getGameState(gameId, playerName) {
  const params = {};
  if (playerName) params.playerName = playerName;
  const res = await client.get(`/gameplay/${encodeURIComponent(gameId)}`, { params });
  return unwrap(res);
}

export async function makeMove(gameId, playerName, move) {
  const res = await client.post(`/gameplay/${encodeURIComponent(gameId)}/move`, { playerName, ...move });
  return unwrap(res);
}

export async function skipTurn(gameId, playerName) {
  const res = await client.post(`/gameplay/${encodeURIComponent(gameId)}/skip`, { playerName });
  return unwrap(res);
}

export async function startGame(gameId) {
  const res = await client.post(`/gameplay/${encodeURIComponent(gameId)}/start`);
  return unwrap(res);
}

export async function endGame(gameId) {
  const res = await client.post(`/gameplay/${encodeURIComponent(gameId)}/end`);
  return unwrap(res);
}

export default {
  createGame,
  joinGame,
  startGame,
  getGameState,
  makeMove,
  skipTurn,
  endGame,
};