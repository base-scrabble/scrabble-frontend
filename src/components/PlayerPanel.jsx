import PlayerInfo from "./PlayerInfo";

export default function PlayerPanel({ players = [], scores = {} }) {
  return (
    <div className="bg-gray-100 p-3 rounded shadow mb-4">
      <h3 className="font-bold mb-2">Players</h3>
      {players.map((p, idx) => (
        <PlayerInfo key={idx} name={p} score={scores[p] || 0} />
      ))}
    </div>
  );
}
