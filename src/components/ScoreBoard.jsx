// frontend: src/components/ScoreBoard.jsx
export default function ScoreBoard({ players = [] }) {
  return (
    <div className="mb-4 p-2 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Scores</h3>
      <ul className="list-disc pl-6">
        {players.map((p, idx) => (
          <li key={idx}>
            {p.name} <span className="text-gray-500">({p.score} pts)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
