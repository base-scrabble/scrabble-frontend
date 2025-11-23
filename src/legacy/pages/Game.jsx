import React from "react";
import GameBoard from "../components/GameBoard";
import PlayerStats from "../components/PlayerStats";
import ChatBox from "../components/ChatBox";
import ReactionPanel from "../components/ReactionPanel";

export default function GamePlayPage() {
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4">
      <div className="space-y-4">
        <GameBoard />
        <ReactionPanel />
      </div>
      <aside className="space-y-4">
        <PlayerStats />
        <ChatBox />
      </aside>
    </div>
  );
}

