
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { withApiRetry } from '../utils/retry';

// Use axios with credentials for game API calls
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 20000,
});

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

const newClientRequestId = () => {
  try {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `cid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  } catch {
    return `cid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
};

const callGameplayApi = (requestFactory, meta) =>
  withApiRetry(async () => {
    const response = await requestFactory();
    return unwrap(response);
  }, meta);

// Free Game API
export async function createFreeGame(playerName, playerAddress = null) {
  return callGameplayApi(
    () => client.post('/gameplay/create', {
      playerName,
      playerAddress,
    }),
    { id: 'gameplay:create' }
  );
}

// Staked Game API (future use)
export async function createStakedGame(playerName, playerAddress, stakeAmount, stakeTxHash) {
  return callGameplayApi(
    () => client.post('/gameplay/create-staked', {
      playerName,
      playerAddress,
      stakeAmount,
      stakeTxHash,
    }),
    { id: 'gameplay:create-staked' }
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
  const clientRequestId = newClientRequestId();
  const kind = move?.passed
    ? 'pass'
    : Array.isArray(move?.exchanged) && move.exchanged.length
      ? 'exchange'
      : Array.isArray(move?.placements) && move.placements.length
        ? 'placement'
        : 'unknown';
  return callGameplayApi(
    async () => {
      console.debug('[gameplay] submit move → sending', {
        clientRequestId,
        gameId,
        playerName,
        kind,
      });
      try {
        const response = await client.post(
          `/gameplay/${encodeURIComponent(gameId)}/move`,
          { playerName, ...move },
          { headers: { 'X-Client-Request-Id': clientRequestId } },
        );
        console.debug('[gameplay] submit move → ok', {
          clientRequestId,
          gameId,
          status: response?.status,
          serverRequestId: response?.headers?.['x-request-id'] || null,
        });
        return response;
      } catch (err) {
        console.warn('[gameplay] submit move → failed', {
          clientRequestId,
          gameId,
          status: err?.response?.status ?? null,
          serverRequestId: err?.response?.headers?.['x-request-id'] || null,
          message: err?.message,
        });
        throw err;
      }
    },
    { id: 'gameplay:move', attempts: 2 }
  );
}

export async function skipTurn(gameId, playerName) {
  const clientRequestId = newClientRequestId();
  return callGameplayApi(
    async () => {
      console.debug('[gameplay] skip → sending', { clientRequestId, gameId, playerName });
      try {
        const response = await client.post(
          `/gameplay/${encodeURIComponent(gameId)}/skip`,
          { playerName },
          { headers: { 'X-Client-Request-Id': clientRequestId } },
        );
        console.debug('[gameplay] skip → ok', {
          clientRequestId,
          gameId,
          status: response?.status,
          serverRequestId: response?.headers?.['x-request-id'] || null,
        });
        return response;
      } catch (err) {
        console.warn('[gameplay] skip → failed', {
          clientRequestId,
          gameId,
          status: err?.response?.status ?? null,
          serverRequestId: err?.response?.headers?.['x-request-id'] || null,
          message: err?.message,
        });
        throw err;
      }
    },
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
  createFreeGame,
  createStakedGame,
  joinGame,
  startGame,
  getGameState,
  makeMove,
  skipTurn,
  endGame,
};