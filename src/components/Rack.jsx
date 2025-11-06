import Tile from "./Tile";
import { useGameStore } from "../store/gameStore";
import { getSocket } from "../services/socketService";
import { calculateScrabbleScore } from "../utils/scoreCalculator";

export default function Rack({ tiles, onPlay, disabled }) {
  const { players, addScore } = useGameStore();

  const handlePlay = (tile) => {
    if (!disabled && onPlay) {
      onPlay(tile);
      addScore(players[0].id, calculateScrabbleScore(tile));
      getSocket()?.emit("game:move", { tile });
    }
  };

  return (
    <div className="flex gap-2 p-2 bg-gray-100 rounded">
      {(tiles || []).map((tile, idx) => (
        <Tile
          key={idx}
          value={tile}
          onPlace={() => handlePlay(tile)}
          className="w-8 h-8 flex items-center justify-center bg-white border text-sm font-bold"
        />
      ))}
    </div>
  );
}
