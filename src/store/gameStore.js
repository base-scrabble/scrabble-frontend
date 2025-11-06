import { create } from "zustand";

export const useGameStore = create((set) => ({
  roomCode: null,
  status: "waiting",
  turn: 1,
  players: [],
  boardState: Array.from({ length: 15 }, () => Array(15).fill(null)),
  setGameState: (data) =>
    set({
      roomCode: data.gameCode,
      status: data.status || "waiting",
      turn: data.currentTurn || 1,
      players: (data.players || []).map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score || 0,
        tiles: p.tiles ? JSON.parse(p.tiles) : [],
      })),
      boardState: data.boardState
        ? Array.isArray(data.boardState)
          ? data.boardState
          : JSON.parse(data.boardState)
        : Array.from({ length: 15 }, () => Array(15).fill(null)),
    }),
  createRoom: ({ gameCode }) =>
    set({ roomCode: gameCode, status: "waiting", turn: 1, players: [], boardState: Array.from({ length: 15 }, () => Array(15).fill(null)) }),
  joinRoom: (code) => set({ roomCode: code.toUpperCase() }),
  addScore: (playerId, delta) =>
    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + delta } : p
      ),
    })),
}));
