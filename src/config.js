// Centralized config for Based Scrabble frontend

const DEFAULT_HTTP_RPC = 'https://misty-proportionate-owl.base-sepolia.quiknode.pro/3057dcb195d42a6ae388654afca2ebb055b9bfd9/';
const DEFAULT_WSS_RPC = 'wss://misty-proportionate-owl.base-sepolia.quiknode.pro/3057dcb195d42a6ae388654afca2ebb055b9bfd9/';

// Backend (append /api so all fetch calls go through API routes)
const isDev = import.meta.env.DEV;

// In development use a relative path so Vite dev server proxy forwards to backend.
// In production prefer the explicit API base URL (Koyeb) from env.
const DEFAULT_KOYEB_API_BASE = 'https://leading-deer-base-scrabble-7f7c59ec.koyeb.app/api';

function normalizeApiBase(input) {
  if (!input) return '';
  const trimmed = String(input).trim().replace(/\/+$/, "");
  // If caller provides an origin (no /api), append it.
  if (/^https?:\/\//.test(trimmed) && !/\/api$/.test(trimmed)) {
    return trimmed + '/api';
  }
  return trimmed;
}

export const API_BASE_URL = isDev
  ? '/api'
  : normalizeApiBase(import.meta.env.VITE_API_BASE_URL)
    || normalizeApiBase(import.meta.env.VITE_BACKEND_URL)
    || DEFAULT_KOYEB_API_BASE;

// WebSocket endpoint (defaults to same host as API base)
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || (API_BASE_URL === '/api' ? '' : API_BASE_URL.replace(/\/api$/, ''));

// Privy Configuration
export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

// Contract addresses (Base Sepolia)
export const ACCESS_MANAGER_ADDRESS = import.meta.env.VITE_ACCESS_MANAGER_ADDRESS;
export const SCRABBLE_GAME_ADDRESS  = import.meta.env.VITE_SCRABBLE_GAME_ADDRESS;
export const WALLET_ADDRESS         = import.meta.env.VITE_WALLET_ADDRESS;

// RPC endpoints (shared by ethers helpers)
export const RPC_HTTP_URL = import.meta.env.VITE_RPC_URL || DEFAULT_HTTP_RPC;
export const RPC_WSS_URL  = import.meta.env.VITE_RPC_WSS_URL || DEFAULT_WSS_RPC;
