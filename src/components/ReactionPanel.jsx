import React from "react";

export default function ReactionPanel() {
  const reactions = ["👍", "🔥", "😂", "😮", "👏"];
  return (
    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex gap-2">
      {reactions.map(r => (
        <button key={r} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20">
          {r}
        </button>
      ))}
    </div>
  );
}
