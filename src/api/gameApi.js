import { API_BASE_URL } from "../config";

export async function createGame(playerName) {
  const res = await fetch(`${API_BASE_URL}/games/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create game");
  return res.json();
}

export async function joinGame(gameId, playerName) {
  const res = await fetch(`${API_BASE_URL}/games/join/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to join game");
  return res.json();
}

export async function startGame(gameId) {
  const res = await fetch(`${API_BASE_URL}/games/start/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to start game");
  return res.json();
}

export async function getGameState(gameId) {
  const res = await fetch(`${API_BASE_URL}/games/state/${gameId}`);
  if (!res.ok) throw new Error((await res.json()).message || "Failed to get game state");
  return res.json();
}

export async function makeMove(gameId, playerName, move) {
  const res = await fetch(`${API_BASE_URL}/games/move/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName, ...move }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to make move");
  return res.json();
}

export async function skipTurn(gameId, playerName) {
  const res = await fetch(`${API_BASE_URL}/games/skip/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to skip turn");
  return res.json();
}

export async function endGame(gameId) {
  const res = await fetch(`${API_BASE_URL}/games/end/${gameId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to end game");
  return res.json();
}