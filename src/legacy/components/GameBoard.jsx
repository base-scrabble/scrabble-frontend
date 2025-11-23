import React, { useState } from "react";
import axios from "axios";

export default function GameBoard() {
  const [gameId, setGameId] = useState(null);
  const [gameCode, setGameCode] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [board, setBoard] = useState(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [message, setMessage] = useState("");

  // Create a new game
  const handleCreate = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/game/create`,
        { playerName }
      );
      setGameId(res.data.gameId);
      setGameCode(res.data.gameCode);
      setMessage(`Game created. Code: ${res.data.gameCode}`);
    } catch (err) {
      setMessage("❌ Failed to create game");
      console.error(err);
    }
  };

  // Join existing game
  const handleJoin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/game/join/${gameId}`,
        { playerName }
      );
      setMessage(`${playerName} joined game ${res.data.gameCode}`);
    } catch (err) {
      setMessage("❌ Failed to join game");
      console.error(err);
    }
  };

  // Start game
  const handleStart = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/game/start/${gameId}`
      );
      setMessage("✅ Game started");
    } catch (err) {
      setMessage("❌ Failed to start game");
      console.error(err);
    }
  };

  // Make a move (for demo: always place word "CAT")
  const handleMove = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/game/move/${gameId}`,
        {
          playerName,
          word: "CAT",
          positions: [
            { row: 7, col: 7, letter: "C" },
            { row: 7, col: 8, letter: "A" },
            { row: 7, col: 9, letter: "T" }
          ]
        }
      );
      setMessage(res.data.message);

      // update board UI
      const newBoard = [...board];
      res.data.word.split("").forEach((letter, i) => {
        newBoard[7][7 + i] = letter;
      });
      setBoard(newBoard);
    } catch (err) {
      setMessage("❌ Failed to make move");
      console.error(err);
    }
  };

  // Skip turn
  const handleSkip = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/game/skip/${gameId}`,
        { playerName }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage("❌ Failed to skip turn");
      console.error(err);
    }
  };

  // End game
  const handleEnd = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/game/end/${gameId}`
      );
      setMessage(`Game ended. Winner: ${res.data.winner}`);
    } catch (err) {
      setMessage("❌ Failed to end game");
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Based Scrabble</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="border p-2"
      />

      <div className="flex gap-2">
        <button onClick={handleCreate} className="btn btn-primary">
          Create Game
        </button>
        <button onClick={handleJoin} className="btn btn-secondary">
          Join Game
        </button>
        <button onClick={handleStart} className="btn btn-success">
          Start Game
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={handleMove} className="btn btn-info">
          Make Move
        </button>
        <button onClick={handleSkip} className="btn btn-warning">
          Skip Turn
        </button>
        <button onClick={handleEnd} className="btn btn-danger">
          End Game
        </button>
      </div>

      <div className="grid grid-cols-15 gap-0.5 bg-gray-300 p-1 rounded">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="w-8 h-8 flex items-center justify-center bg-white border text-sm font-bold"
            >
              {cell}
            </div>
          ))
        )}
      </div>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
