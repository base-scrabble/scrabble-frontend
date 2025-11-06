import { useEffect } from "react";
import Tile from "./Tile";
import { useGameStore } from "../store/gameStore";
import { getSocket } from "../services/socketService";

export default function Board({ board, onTilePlace }) {
  const { boardState } = useGameStore();

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("game:state", (data) => {
        useGameStore.setState({ boardState: data.boardState });
      });
    }
  }, []);

  return (
    <div className="grid grid-cols-15 gap-0.5 bg-gray-300 p-1 rounded">
      {(board || boardState || Array.from({ length: 15 }, () => Array(15).fill(null))).map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Tile
            key={`${rIdx}-${cIdx}`}
            value={cell}
            onPlace={() => onTilePlace?.(rIdx, cIdx)}
            className="w-8 h-8 flex items-center justify-center bg-white border text-sm font-bold"
          />
        ))
      )}
    </div>
  );
}
