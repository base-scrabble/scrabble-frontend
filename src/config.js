// Centralized config for Based Scrabble frontend

const DEFAULT_HTTP_RPC = 'https://misty-proportionate-owl.base-sepolia.quiknode.pro/3057dcb195d42a6ae388654afca2ebb055b9bfd9/';
const DEFAULT_WSS_RPC = 'wss://misty-proportionate-owl.base-sepolia.quiknode.pro/3057dcb195d42a6ae388654afca2ebb055b9bfd9/';

// Backend (append /api so all fetch calls go through API routes)
const isDev = import.meta.env.DEV;

// In development use a relative path so Vite dev server proxy forwards to backend
// In production use the explicit backend URL from env (or fallback)
const RAILWAY_BACKEND = 'https://scrabble-backend-production.up.railway.app';

export const API_BASE_URL = isDev
  ? '/api'
  : (import.meta.env.VITE_BACKEND_URL || RAILWAY_BACKEND).replace(/\/$/, "") + "/api";

// WebSocket endpoint (defaults to Railway backend socket namespace)
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || RAILWAY_BACKEND;

// Privy Configuration
export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

// Contract addresses (Base Sepolia)
export const ACCESS_MANAGER_ADDRESS = import.meta.env.VITE_ACCESS_MANAGER_ADDRESS;
export const SCRABBLE_GAME_ADDRESS  = import.meta.env.VITE_SCRABBLE_GAME_ADDRESS;
export const WALLET_ADDRESS         = import.meta.env.VITE_WALLET_ADDRESS;

// RPC endpoints (shared by ethers helpers)
export const RPC_HTTP_URL = import.meta.env.VITE_RPC_URL || DEFAULT_HTTP_RPC;
export const RPC_WSS_URL  = import.meta.env.VITE_RPC_WSS_URL || DEFAULT_WSS_RPC;
