// frontend: src/components/Board.jsx
import React from "react";

export default function Board({ board }) {
  // fallback: always 15x15
  const safeBoard =
    Array.isArray(board) && board.length === 15
      ? board
      : Array.from({ length: 15 }, () => Array(15).fill(null));

  return (
    <div className="bg-gray-200 p-2 rounded shadow-md inline-block">
      <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-0.5">
        {safeBoard.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="w-8 h-8 flex items-center justify-center bg-white border text-xs font-bold text-gray-800"
            >
              {cell || ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
