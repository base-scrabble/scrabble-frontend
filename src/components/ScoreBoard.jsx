import { useGameStore } from "../store/gameStore";

export default function ScoreBoard({ players }) {
  const { players: storePlayers } = useGameStore();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Scoreboard</h3>
      <ul className="list-disc pl-6">
        {(players || storePlayers).map((p, idx) => (
          <li key={idx}>
            {p.name}: {p.score} pts
          </li>
        ))}
      </ul>
    </div>
  );
}
