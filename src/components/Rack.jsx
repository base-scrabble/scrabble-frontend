export default function Rack({ tiles = [], onPlay, disabled }) {
  const handlePlay = (tile) => {
    if (disabled) return;
    onPlay({ tile });
  };

  return (
    <div className="flex space-x-2 mt-4">
      {tiles.map((t, idx) => (
        <button
          key={idx}
          className="w-10 h-10 bg-yellow-200 border rounded flex flex-col items-center justify-center font-bold shadow"
          onClick={() => handlePlay(t)}
          disabled={disabled}
        >
          <span>{t.letter || t}</span>
          {t.points !== undefined && (
            <span className="text-xs font-normal">{t.points}</span>
          )}
        </button>
      ))}
    </div>
  );
}
