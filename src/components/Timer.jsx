import { useEffect, useState } from "react";
import { getSocket } from "../services/socketService";
import { useGameStore } from "../store/gameStore";

export default function Timer() {
  const { minutesPerSide } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(minutesPerSide * 60);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("game:state", (data) => {
        if (data.timeLeft) setTimeLeft(data.timeLeft);
      });
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-lg font-bold">
      Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
