import { io } from "socket.io-client";

let socket = null;

const readStoredValue = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const sessionValue = window.sessionStorage?.getItem(key);
    if (sessionValue) return sessionValue;
    return window.localStorage?.getItem(key) ?? null;
  } catch (error) {
    console.warn("[socket] storage read failed", error);
    return null;
  }
};

export function connectSocket(url) {
  if (!socket) {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const targetUrl = url || `http://${hostname}:3000`;
    console.log('🔌 Initializing socket connection...', `URL: ${targetUrl}`);
    
    const opts = {
      transports: ['websocket'],
      upgrade: false,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    };
    
    socket = io(targetUrl, opts);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      console.log("🔗 Socket connected - readyState:", socket.connected);
    });
    
    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("❌ Full error object:", error);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`🔄 Socket reconnected after ${attempt} attempts`);
      const gameId = readStoredValue("currentGameId") || readStoredValue("gameId");
      const playerName = readStoredValue("playerName") || readStoredValue("playerId");
      if (gameId && playerName) {
        socket.emit("game:join", { gameId, playerName });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", socket.id, "Reason:", reason);
    });

    // Add transport-level diagnostic events
    socket.io.on("error", (error) => {
      console.error("❌ Socket.IO engine error:", error);
    });

    socket.io.on("open", () => {
      console.log("🔓 Socket.IO transport opened - handshake in progress");
    });

    socket.io.on("close", (reason) => {
      console.log("🔒 Socket.IO transport closed:", reason);
    });

    socket.io.on("ping", () => {
      console.log("🏓 Socket.IO ping received");
    });

    socket.io.on("packet", (packet) => {
      console.log("📦 Socket.IO packet:", packet.type, packet.data);
    });

    console.log('🔌 Calling socket.connect()...');
    socket.connect();
    
    // Add timeout check
    setTimeout(() => {
      if (!socket.connected) {
        console.warn("⚠️ Socket connection timeout - not connected after 5 seconds");
        console.log("⚠️ Socket state:", {
          connected: socket.connected,
          disconnected: socket.disconnected,
          id: socket.id
        });
      }
    }, 5000);
  }
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.off("connect");
    socket.off("reconnect");
    socket.off("disconnect");
    socket.off("game:state");
    socket.off("game:join");
    socket.off("game:start");
    socket.off("game:leave");
    socket.disconnect();
    socket = null;
  }
}