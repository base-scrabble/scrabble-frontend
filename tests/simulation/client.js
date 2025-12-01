import axios from 'axios';
import { io } from 'socket.io-client';
import { log } from '../utils/logger.js';

function extractGameState(payload) {
  if (!payload) return null;
  if (payload.data?.gameState) return payload.data.gameState;
  if (payload.gameState) return payload.gameState;
  return payload;
}

async function fetchGameState(backendUrl, gameId, playerName) {
  const params = playerName ? { playerName } : undefined;
  const res = await axios.get(`${backendUrl}/api/gameplay/${gameId}`, { params });
  return extractGameState(res.data);
}

export async function spawnPlayer(backendUrl, socketUrl, gameId, name, options = {}) {
  const { skipJoin = false, initialGameState = null } = options;
  log(`Spawn player: ${name}${skipJoin ? ' (existing)' : ''}`);

  let gameState = initialGameState;
  try {
    if (!gameState) {
      if (skipJoin) {
        gameState = await fetchGameState(backendUrl, gameId, name);
      } else {
        const joinRes = await axios.post(
          `${backendUrl}/api/gameplay/${gameId}/join`,
          { playerName: name },
        );
        gameState = extractGameState(joinRes.data);
      }
    }
  } catch (err) {
    const alreadyJoined = err?.response?.status === 400 && err.response?.data?.message === 'Player already joined';
    if (!skipJoin && alreadyJoined) {
      log(`${name}: Already joined, fetching state…`);
      gameState = await fetchGameState(backendUrl, gameId, name);
    } else {
      log(`${name}: Failed to join`, err.message);
      throw err;
    }
  }

  const player = gameState?.players?.find((p) => p?.name?.toLowerCase() === name.toLowerCase()) || null;
  if (!player) {
    log(`${name}: Player record missing in game state`);
  } else {
    log(`${name}: Ready in slot #${player.playerNumber || '?'}`);
  }

  const socket = io(socketUrl, {
    transports: ['websocket'],
    query: {
      gameId,
      playerName: name,
    },
  });

  socket.on('connect', () => log(`${name}: SOCKET CONNECTED`));
  socket.on('disconnect', () => log(`${name}: SOCKET DISCONNECTED`));
  socket.on('reconnect', () => log(`${name}: SOCKET RECONNECTED`));
  socket.on('game:update', (data) => {
    log(`${name}: GOT UPDATE`, JSON.stringify(data));
  });

  return { name, player, socket };
}
