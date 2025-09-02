import React from "react";
import BadgeDisplay from "../components/BadgeDisplay";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Your Profile</h1>
      <BadgeDisplay />
    </div>
  );
}

