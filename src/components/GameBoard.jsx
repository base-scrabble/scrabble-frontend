import React from "react";
import { TILE_POINTS } from "../utils/constants";

const SIZE = 15;

export default function GameBoard() {
  // minimal 15x15 placeholder board
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {Array.from({ length: SIZE * SIZE }).map((_, i) => (
          <div
            key={i}
            className="aspect-square text-center text-xs flex items-center justify-center border border-white/[0.06] bg-white/[0.02]"
          >
            {/* empty tile placeholder */}
          </div>
        ))}
      </div>
      <div className="p-3 text-xs text-gray-400">
        Tile points sample: B={TILE_POINTS.B}, S={TILE_POINTS.S}, Q={TILE_POINTS.Q}
      </div>
    </div>
  );
}
