export default function Tile({ letter, points, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 bg-yellow-200 border rounded flex flex-col items-center justify-center font-bold hover:bg-yellow-300"
    >
      <span>{letter}</span>
      <span className="text-xs">{points}</span>
    </button>
  );
}
