export default function PlayerPanel() {
  const letters = ["A", "B", "C", "D", "E", "F", "G"];
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-bold mb-2">Your Tiles</h3>
      <div className="flex space-x-2">
        {letters.map((letter, idx) => (
          <div
            key={idx}
            className="w-8 h-8 bg-yellow-200 border flex items-center justify-center"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}
