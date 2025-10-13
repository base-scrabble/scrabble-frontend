// Centralized config for Based Scrabble frontend

// Backend (append /api so all fetch calls go through API routes)
export const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/$/, "") + "/api";

// WebSocket (optional, can be wired later)
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

// Contract addresses (Base Sepolia)
export const ACCESS_MANAGER_ADDRESS = import.meta.env.VITE_ACCESS_MANAGER_ADDRESS;
export const SCRABBLE_GAME_ADDRESS  = import.meta.env.VITE_SCRABBLE_GAME_ADDRESS;
export const WALLET_ADDRESS         = import.meta.env.VITE_WALLET_ADDRESS;
