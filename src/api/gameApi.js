// src/api/gameApi.js
import { API_BASE_URL } from "../config";

/**
 * Create a new game
 */
export async function createGame(playerName) {
  const res = await fetch(`${API_BASE_URL}/game/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create game (status ${res.status})`);
  }

  return res.json();
}

/**
 * Join an existing game
 */
export async function joinGame(gameId, playerName) {
  const res = await fetch(`${API_BASE_URL}/game/join/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to join game (status ${res.status})`);
  }

  return res.json();
}

/**
 * List all active/waiting games
 */
export async function listGames() {
  const res = await fetch(`${API_BASE_URL}/game/list`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to list games (status ${res.status})`);
  }

  return res.json();
}

/**
 * Start a game
 */
export async function startGame(gameId) {
  const res = await fetch(`${API_BASE_URL}/game/start/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to start game (status ${res.status})`);
  }

  return res.json();
}

/**
 * Get the current state of a game
 */
export async function getGameState(gameId) {
  const res = await fetch(`${API_BASE_URL}/game/state/${gameId}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to get game state (status ${res.status})`);
  }

  return res.json();
}

/**
 * Make a move
 */
export async function makeMove(gameId, payload) {
  const res = await fetch(`${API_BASE_URL}/game/move/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to make move (status ${res.status})`);
  }
  return res.json();
}
