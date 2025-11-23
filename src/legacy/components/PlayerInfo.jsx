export default function PlayerInfo({ name, score }) {
    return (
      <div className="flex justify-between items-center border p-2 rounded mb-2">
        <span className="font-medium">{name}</span>
        <span className="font-bold">{score}</span>
      </div>
    );
  }
  