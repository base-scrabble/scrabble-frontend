import React from "react";

export default function TournamentBanner() {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-600/20 to-emerald-600/20">
      <div className="text-sm text-gray-300">Season 1</div>
      <div className="text-xl font-bold">Based Scrabble Open</div>
      <div className="text-sm text-gray-300">Qualifiers open soon</div>
    </div>
  );
}
