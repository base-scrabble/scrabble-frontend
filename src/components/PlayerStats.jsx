export default function PlayerStats({ gamesPlayed = 0, wins = 0, losses = 0 }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-bold mb-2">Player Stats</h3>
      <ul className="space-y-1 text-sm">
        <li>Games Played: {gamesPlayed}</li>
        <li>Wins: {wins}</li>
        <li>Losses: {losses}</li>
      </ul>
    </div>
  );
}
