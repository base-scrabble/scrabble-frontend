import { useState } from "react";

export default function CreateGame({ onCreate }) {
  const [playerName, setPlayerName] = useState("");

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-2">Create Game</h2>
      <input
        type="text"
        placeholder="Enter your name"
        className="w-full border rounded p-2 mb-2"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white w-full py-2 rounded"
        onClick={() => onCreate(playerName)}
      >
        Start Game
      </button>
    </div>
  );
}