export default function BadgeDisplay({ badges = [] }) {
  if (!badges.length) return null;

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm"
          >
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
}
