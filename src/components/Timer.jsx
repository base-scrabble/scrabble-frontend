import { useEffect, useState } from "react";
import { getSocket } from "../services/socketService";
import { useGameStore } from "../store/gameStore";

export default function Timer({ status }) {
  const { minutesPerSide } = useGameStore();
  const defaultSeconds = (minutesPerSide || 0) * 60;
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("game:state", (data) => {
        if (typeof data.timeLeft === "number") setTimeLeft(data.timeLeft);
      });
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      socket?.off?.("game:state");
    };
  }, []);

  useEffect(() => {
    setTimeLeft((minutesPerSide || 0) * 60);
  }, [minutesPerSide]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const isCritical = timeLeft <= 30;

  return (
    <div className={`timer ${isCritical ? "timer--critical" : ""}`}>
      <p className="timer__label">Clock</p>
      <p className="timer__value">
        {minutes}:{formattedSeconds}
      </p>
      <p className="timer__status">Status: {status || "active"}</p>
    </div>
  );
}
