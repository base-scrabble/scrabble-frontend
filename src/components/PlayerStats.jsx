import React from "react";
import { useGameStore } from "../store/gameStore";

export default function PlayerStats() {
  const players = useGameStore(s => s.players);
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="font-semibold mb-3">Players</h3>
      <ul className="space-y-2 text-sm">
        {players.map(p => (
          <li key={p.id} className="flex justify-between">
            <span>{p.name}</span>
            <span className="text-gray-300">{p.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
