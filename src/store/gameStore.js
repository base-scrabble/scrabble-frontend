import { create } from "zustand";

export const useGameStore = create((set) => ({
  roomCode: null,
  minutesPerSide: 5,
  players: [
    { id: "p1", name: "You", score: 0 },
    { id: "p2", name: "Rival", score: 0 },
  ],
  createRoom: ({ minutesPerSide }) =>
    set(() => ({
      roomCode: Math.random().toString(36).slice(2, 7).toUpperCase(),
      minutesPerSide,
    })),
  joinRoom: (code) => set(() => ({ roomCode: code.toUpperCase() })),
  addScore: (playerId, delta) =>
    set((s) => ({
      players: s.players.map((p) => (p.id === playerId ? { ...p, score: p.score + delta } : p)),
    })),
}));
