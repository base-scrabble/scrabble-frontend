export default function Controls({ onExit }) {
  return (
    <div className="controls">
      <button onClick={onExit} className="btn-alert controls__exit">
        Exit Game
      </button>
    </div>
  );
}
