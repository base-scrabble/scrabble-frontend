# 🧠 Base Scrabble Frontend

Welcome to the official frontend of **Base Scrabble** — a multiplayer, onchain word game built on the **Base chain**, where players compete in timed rounds, earn NFTs, and climb the leaderboard.

---

## 🔧 Tech Stack

| Layer       | Tech               |
|-------------|--------------------|
| Frontend    | React + TailwindCSS |
| State Mgmt  | Zustand (or Redux) |
| Backend     | Node.js + Express (API) |
| Blockchain  | Solidity on Base L2 |
| Wallets     | MetaMask, TBA (Base Wallet) |
| Real-time   | Socket.io          |
| Storage     | PostgreSQL or MySQL |
| CMS/Admin   | Integrated inside this frontend |

---

## 📁 Folder Structure

```
scrabble-frontend/
├── public/                 # HTML entry point
├── src/
│   ├── assets/             # Icons, badge images
│   ├── components/         # Reusable UI elements
│   ├── pages/              # Main screens (Game, Profile, Home)
│   ├── hooks/              # Custom hooks (game logic, socket)
│   ├── layouts/            # Layout wrappers
│   ├── routes/             # Routing config
│   ├── services/           # API/auth/socket clients
│   ├── store/              # Zustand or Redux state
│   ├── utils/              # Helpers: validator, contract calls
│   ├── abi/                # ABI files for contracts
│   ├── App.jsx             # App root component
│   ├── index.js            # Entry point
│   └── config.js           # App configs and constants
├── .env                    # Local environment variables
├── tailwind.config.js      # Tailwind CSS config
├── package.json            # Project dependencies
└── README.md               # This file
```

---

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/base-scrabble/scrabble-frontend.git
cd scrabble-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file**

At the project root:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CONTRACT_ADDRESS=0xYourGameContractAddress
VITE_NFT_CONTRACT_ADDRESS=0xYourNFTContractAddress
```

> Replace the contract addresses and URL with your actual deployed values.

4. **Run the development server**

```bash
npm run dev
```

---

## 🧩 Game Features

- ✅ Multiplayer word rounds (2–4 players)
- ✅ Based on Base chain smart contracts
- ✅ Timed or untimed game modes
- ✅ Staking and reward distribution (ETH/USDC)
- ✅ NFT badge rewards for wins
- ✅ Leaderboard with player classes
- ✅ Emoji reactions and optional in-game chat
- ✅ Admin CMS for owner control
- ✅ Tournament system (auto & manual)

---

## 📦 Deployment

For production:

```bash
npm run build
```

---

## 💬 Maintainers

Built and maintained by the **Base Scrabble Core Team**.

> Questions? Bug reports? Reach out via the team repo or Farcaster.