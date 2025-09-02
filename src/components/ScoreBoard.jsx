export default function Scoreboard({ players }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-2">Scoreboard</h2>
      <ul>
        {players.map((p, i) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>{p.name}</span>
            <span>{p.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
