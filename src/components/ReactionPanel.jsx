export default function ReactionPanel({ onReact }) {
  const reactions = ["👍", "😂", "🔥", "😢", "🎉"];

  return (
    <div className="flex space-x-2 mt-4">
      {reactions.map((emoji, idx) => (
        <button
          key={idx}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => onReact(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
