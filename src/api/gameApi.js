import axios from 'axios';
import { API_BASE_URL } from '../config';
import { withApiRetry } from '../utils/retry';

// Use axios with credentials for game API calls
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

const callGameplayApi = (requestFactory, meta) =>
  withApiRetry(async () => {
    const response = await requestFactory();
    return unwrap(response);
  }, meta);

export async function createGame(playerName, stakeAmount = null, stakeTxHash = null, playerAddress = null) {
  return callGameplayApi(
    () => client.post('/gameplay/create', {
      playerName,
      stakeAmount,
      stakeTxHash,
      playerAddress,
    }),
    { id: 'gameplay:create' }
  );
}

export async function joinGame(gameId, playerName) {
  return callGameplayApi(
    () => client.post(`/gameplay/${encodeURIComponent(gameId)}/join`, { playerName }),
    { id: 'gameplay:join', attempts: 4 }
  );
}

export async function getGameState(gameId, playerName) {
  const params = {};
  if (playerName) params.playerName = playerName;
  return callGameplayApi(
    () => client.get(`/gameplay/${encodeURIComponent(gameId)}`, { params }),
    { id: 'gameplay:getState', attempts: 4 }
  );
}

export async function makeMove(gameId, playerName, move) {
  return callGameplayApi(
    () => client.post(`/gameplay/${encodeURIComponent(gameId)}/move`, { playerName, ...move }),
    { id: 'gameplay:move', attempts: 2 }
  );
}

export async function skipTurn(gameId, playerName) {
  return callGameplayApi(
    () => client.post(`/gameplay/${encodeURIComponent(gameId)}/skip`, { playerName }),
    { id: 'gameplay:skip' }
  );
}

export async function startGame(gameId) {
  return callGameplayApi(
    () => client.post(`/gameplay/${encodeURIComponent(gameId)}/start`),
    { id: 'gameplay:start', attempts: 2 }
  );
}

export async function endGame(gameId) {
  return callGameplayApi(
    () => client.post(`/gameplay/${encodeURIComponent(gameId)}/end`),
    { id: 'gameplay:end', attempts: 2 }
  );
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