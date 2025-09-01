import Board from "../components/Board";
import PlayerPanel from "../components/PlayerPanel";
import Scoreboard from "../components/Scoreboard";

export default function Game() {
  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      <div className="col-span-3">
        <Board />
      </div>
      <div className="space-y-4">
        <Scoreboard />
        <PlayerPanel />
      </div>
    </div>
  );
}
