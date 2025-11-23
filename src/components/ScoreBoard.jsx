import { useGameStore } from "../store/gameStore";

export default function ScoreBoard({ players, currentTurn, bagCount, viewerName = "", className = "" }) {
  const { players: storePlayers, bagCount: storeBagCount, currentTurn: storeTurn } = useGameStore();
  const resolvedPlayers = (players && players.length ? players : storePlayers) || [];
  const activeTurn = currentTurn || storeTurn;
  const tilesRemaining = typeof bagCount === "number" ? bagCount : storeBagCount;

  const normalizedViewer = viewerName?.trim().toLowerCase();
  const activePlayer = resolvedPlayers.find((player) => player?.playerNumber === activeTurn);
  const activeName = activePlayer?.name || (activeTurn ? `Player ${activeTurn}` : null);
  const isViewerTurn = normalizedViewer && activeName && activeName.trim().toLowerCase() === normalizedViewer;
  const turnCopy = activeName
    ? isViewerTurn
      ? `${activeName}, it's your turn`
      : `It's ${activeName}'s turn to play`
    : activeTurn
      ? `Player ${activeTurn}'s turn`
      : null;

  return (
    <div className={["scoreboard", className].filter(Boolean).join(" ")}>
      <div className="scoreboard__header">
        <div>
          <p className="scoreboard__title">Scoreboard</p>
          <p className="scoreboard__subtitle">Tiles in bag: {tilesRemaining ?? "--"}</p>
        </div>
        {turnCopy && <span className="scoreboard__turn">{turnCopy}</span>}
      </div>
      <ul className="scoreboard__list">
        {resolvedPlayers.map((player, idx) => {
          const isActive = player?.isActive || (activeTurn && player?.playerNumber === activeTurn);
          return (
            <li
              key={`${player?.name || "player"}-${idx}`}
              className={`scoreboard__player ${isActive ? "scoreboard__player--active" : ""}`.trim()}
            >
              <span className="scoreboard__player-name">{player?.name || `Player ${idx + 1}`}</span>
              <span className="scoreboard__player-score">{player?.score ?? 0} pts</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
