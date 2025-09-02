import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";

export default function CreateGamePage() {
  const [minutesPerSide, setMinutesPerSide] = useState(5);
  const createRoom = useGameStore(s => s.createRoom);

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">Create Game</h1>
      <label className="block text-sm">
        Minutes per player
        <input
          type="number"
          min={1}
          value={minutesPerSide}
          onChange={e => setMinutesPerSide(Number(e.target.value))}
          className="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2"
        />
      </label>
      <button
        onClick={() => createRoom({ minutesPerSide })}
        className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-600"
      >
        Create
      </button>
    </div>
  );
}
