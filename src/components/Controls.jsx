export default function Controls({ onExit }) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={onExit}
        className="bg-red-600 text-white px-4 py-2 rounded shadow"
      >
        Exit Game
      </button>
    </div>
  );
}
