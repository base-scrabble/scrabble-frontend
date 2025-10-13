export default function TournamentBanner({ title, date, onJoin }) {
  return (
    <div className="bg-yellow-200 border-l-4 border-yellow-500 p-4 mb-4 rounded">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm">Starts: {date}</p>
      <button
        onClick={onJoin}
        className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
      >
        Join Tournament
      </button>
    </div>
  );
}
