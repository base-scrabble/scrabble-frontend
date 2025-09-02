export default function Tile({ letter, points, onClick, isDraggable = true }) {
  return (
    <div
      className="w-10 h-10 bg-yellow-200 border border-yellow-600 rounded flex items-center justify-center cursor-pointer font-bold relative"
      draggable={isDraggable}
      onClick={onClick}
    >
      {letter}
      <span className="absolute bottom-0 right-1 text-xs">{points}</span>
    </div>
  );
}
