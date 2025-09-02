export default function WaitingRoom({ players, onStart }) {
    return (
      <div className="p-4 bg-white shadow rounded-lg max-w-sm mx-auto">
        <h2 className="text-lg font-bold mb-2">Waiting Room</h2>
        <ul className="mb-2">
          {players.map((p, i) => (
            <li key={i} className="py-1">{p}</li>
          ))}
        </ul>
        <button
          className="bg-green-500 text-white w-full py-2 rounded"
          onClick={onStart}
        >
          Start Game
        </button>
      </div>
    );
  }