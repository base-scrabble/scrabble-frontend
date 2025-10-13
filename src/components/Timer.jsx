import { useEffect, useState } from "react";

export default function Timer({ initial = 60, onTimeout }) {
  const [time, setTime] = useState(initial);

  useEffect(() => {
    if (time <= 0) {
      if (onTimeout) onTimeout();
      return;
    }
    const interval = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time, onTimeout]);

  return (
    <div className="mb-4 text-center font-bold text-lg">
      Time Left: {time}s
    </div>
  );
}
