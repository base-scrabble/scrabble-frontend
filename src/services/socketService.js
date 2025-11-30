import { io } from "socket.io-client";

let socket = null;
let pendingJoinPayload = null;
let joinTimer = null;
let lastJoinSignature = null;
let lastJoinTimestamp = 0;

const JOIN_DEBOUNCE_MS = 200;
const JOIN_COOLDOWN_MS = 1500;

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
      if (pendingJoinPayload) {
        emitJoin(pendingJoinPayload, "pending-connect");
      }
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
        requestRoomJoin({ gameId, playerName }, "auto-reconnect");
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

function emitJoin(payload, reason = "manual") {
  if (!socket || !socket.connected) return;
  const signature = `${payload.gameId}:${payload.playerName}`;
  const now = Date.now();
  if (signature === lastJoinSignature && now - lastJoinTimestamp < JOIN_COOLDOWN_MS) {
    console.debug("⚠️ Skipping duplicate join emission", { reason, signature });
    return;
  }
  console.log("🚪 Joining game room", { ...payload, reason });
  socket.emit("game:join", payload);
  lastJoinSignature = signature;
  lastJoinTimestamp = now;
}

export function requestRoomJoin(payload, reason = "manual") {
  if (!payload?.gameId || !payload?.playerName) return;
  pendingJoinPayload = payload;
  if (!socket) return;
  clearTimeout(joinTimer);
  joinTimer = setTimeout(() => {
    if (socket.connected) {
      emitJoin(payload, reason);
    } else {
      console.debug("ℹ️ Delaying room join until socket is connected", reason);
    }
  }, JOIN_DEBOUNCE_MS);
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
    pendingJoinPayload = null;
    lastJoinSignature = null;
    lastJoinTimestamp = 0;
    if (joinTimer) {
      clearTimeout(joinTimer);
      joinTimer = null;
    }
    socket = null;
  }
}