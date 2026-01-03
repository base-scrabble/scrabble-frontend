# Base Scrabble Frontend

React + Vite frontend for Base Scrabble (Pama Global Labs).

## Current status
- Base Scrabble is live and includes a working waitlist.
- Free-to-play gameplay exists and is live.
- Staked mode is **not enabled** yet.
- Privy + Paymaster integration is planned/in progress (not production).
- The app is live as a Base App + Farcaster Mini App.

## Tech
- React (Vite)
- Tailwind CSS
- Socket.IO client
- Mini app embed support: `@farcaster/miniapp-sdk`

## Local development

### Prerequisites
- Node.js (recommended: Node 22.x)
- npm

### Install
```bash
cd scrabble-frontend
npm install
```

### Configure environment
Create `scrabble-frontend/.env.local` (recommended) and set only what you need.

Common variables:
```dotenv
# Backend/API (production)
VITE_API_BASE_URL=https://YOUR_BACKEND_HOST/api
VITE_BACKEND_URL=https://YOUR_BACKEND_HOST
VITE_SOCKET_URL=https://YOUR_BACKEND_HOST

# Waitlist mode
# - "local": frontend-only join (default)
# - "backend": uses backend endpoints when VITE_API_BASE_URL is a full https URL
VITE_WAITLIST_MODE=local

# Chain / RPC (used by wallet/onchain helpers)
VITE_CHAIN_ID=84532
VITE_RPC_URL=https://YOUR_RPC_HTTP
VITE_RPC_WSS_URL=wss://YOUR_RPC_WSS

# Contract addresses (Base Sepolia / Base Mainnet depending on env)
VITE_ACCESS_MANAGER_ADDRESS=0x0000000000000000000000000000000000000000
VITE_SCRABBLE_GAME_ADDRESS=0x0000000000000000000000000000000000000000
VITE_WALLET_ADDRESS=0x0000000000000000000000000000000000000000

# Planned (not production)
VITE_PRIVY_APP_ID=YOUR_PRIVY_APP_ID
VITE_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT=YOUR_PAYMASTER_ENDPOINT
```

### Run
This frontend is configured to proxy `/api` and `/socket.io` to `http://localhost:8000` in development.

Run the backend locally on port `8000`, then:
```bash
npm run dev
```

## Deployment
```bash
npm run build
npm run preview
```

## DO NOT (important)
- Do not push changes without explicit approval.
- Do not commit `.env` files or any private keys.
- Do not change gameplay logic without explicit go-ahead.
- Do not introduce staking, Privy flows, Paymaster usage, or tournament logic in the frontend without approval.