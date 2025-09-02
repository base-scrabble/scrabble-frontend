import { useEffect, useRef, useState } from "react";
import { connectSocket } from "../services/socketService";

export function useSocket(url) {
  const [connected, setConnected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const s = connectSocket(url);
    ref.current = s;
    if (s) {
      const onConnect = () => setConnected(true);
      const onDisconnect = () => setConnected(false);
      s.on("connect", onConnect);
      s.on("disconnect", onDisconnect);
      return () => {
        s.off("connect", onConnect);
        s.off("disconnect", onDisconnect);
        s.close();
      };
    }
  }, [url]);

  return { socket: ref.current, connected };
}
