export default function Scoreboard() {
  const scores = [
    { name: "Alice", score: 10 },
    { name: "Bob", score: 15 },
  ];
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-bold mb-2">Scoreboard</h3>
      {scores.map((s, idx) => (
        <p key={idx}>
          {s.name}: {s.score}
        </p>
      ))}
    </div>
  );
}
