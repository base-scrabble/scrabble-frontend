// Centralized config for Based Scrabble frontend

const DEFAULT_HTTP_RPC = 'https://misty-proportionate-owl.base-sepolia.quiknode.pro/3057dcb195d42a6ae388654afca2ebb055b9bfd9/';
const DEFAULT_WSS_RPC = 'wss://misty-proportionate-owl.base-sepolia.quiknode.pro/3057dcb195d42a6ae388654afca2ebb055b9bfd9/';

// Backend (append /api so all fetch calls go through API routes)
const isDev = import.meta.env.DEV;

// In development we usually use a relative path so Vite dev server proxy forwards to a local backend.
// If a full https API base is provided via env, use it directly so dev can target Fly.
// In production prefer an explicit API base URL from env (Fly by default).
const DEFAULT_FLY_API_BASE = 'https://basescrabble-backend.fly.dev/api';

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
  ? (() => {
    // In dev, default to same-origin API so Vite can proxy to the local backend.
    // This avoids CORS issues (especially on LAN/mobile) when .env contains production URLs.
    const devExplicit = String(import.meta.env.VITE_DEV_USE_EXPLICIT_API || '').toLowerCase() === 'true';
    const devApiBase = normalizeApiBase(import.meta.env.VITE_DEV_API_BASE_URL);
    if (devApiBase && /^https?:\/\//.test(devApiBase)) return devApiBase;

    if (devExplicit) {
      const envApiBase =
        normalizeApiBase(import.meta.env.VITE_API_BASE_URL)
        || normalizeApiBase(import.meta.env.VITE_BACKEND_URL);
      if (envApiBase && /^https?:\/\//.test(envApiBase)) return envApiBase;
    }

    return '/api';
  })()
  : (
    normalizeApiBase(import.meta.env.VITE_API_BASE_URL)
    || normalizeApiBase(import.meta.env.VITE_BACKEND_URL)
    || DEFAULT_FLY_API_BASE
  );

// WebSocket endpoint (defaults to same host as API base)
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || (API_BASE_URL === '/api' ? '' : API_BASE_URL.replace(/\/api$/, ''));

// Privy Configuration
export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

// Feature flags
export const ENABLE_WALLET = String(import.meta.env.VITE_ENABLE_WALLET || '').toLowerCase() === 'true';

// Contract addresses (Base Sepolia)
export const ACCESS_MANAGER_ADDRESS = import.meta.env.VITE_ACCESS_MANAGER_ADDRESS;
export const SCRABBLE_GAME_ADDRESS  = import.meta.env.VITE_SCRABBLE_GAME_ADDRESS;
export const WALLET_ADDRESS         = import.meta.env.VITE_WALLET_ADDRESS;

// RPC endpoints (shared by ethers helpers)
export const RPC_HTTP_URL = import.meta.env.VITE_RPC_URL || DEFAULT_HTTP_RPC;
export const RPC_WSS_URL  = import.meta.env.VITE_RPC_WSS_URL || DEFAULT_WSS_RPC;
