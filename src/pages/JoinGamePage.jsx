import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";

export default function JoinGamePage() {
  const [code, setCode] = useState("");
  const joinRoom = useGameStore(s => s.joinRoom);

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">Join Game</h1>
      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Enter match code"
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
      />
      <button
        onClick={() => joinRoom(code)}
        className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600"
      >
        Join
      </button>
    </div>
  );
}
