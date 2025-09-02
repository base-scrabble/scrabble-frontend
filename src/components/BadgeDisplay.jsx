import React from "react";

export default function BadgeDisplay() {
  const badges = [
    { id: 1, name: "Starter", desc: "Played first game" },
    { id: 2, name: "Streak 3", desc: "3 wins in a row" },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {badges.map(b => (
        <div key={b.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="font-medium">{b.name}</div>
          <div className="text-xs text-gray-400">{b.desc}</div>
        </div>
      ))}
    </div>
  );
}
