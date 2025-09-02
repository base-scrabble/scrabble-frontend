import React from "react";

export default function LeaderboardPage() {
  const rows = [
    { name: "PlayerOne", rating: 1420, wins: 12 },
    { name: "PlayerTwo", rating: 1375, wins: 9 },
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Leaderboard</h1>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-2">Player</th>
              <th className="text-left px-4 py-2">Rating</th>
              <th className="text-left px-4 py-2">Wins</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-white/0 even:bg-white/[0.03]">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.rating}</td>
                <td className="px-4 py-2">{r.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
