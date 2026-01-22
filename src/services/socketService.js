import { io } from "socket.io-client";

let socket = null;
let pendingJoinPayload = null;
let joinTimer = null;
let lastJoinSignature = null;
let lastJoinTimestamp = 0;
let joinedSignature = null;
let joinedSocketId = null;

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
    const isBrowser = typeof window !== 'undefined';
    const normalizedUrl = typeof url === 'string' ? url.trim() : '';
    const currentOrigin = isBrowser ? window.location.origin : '';
    const currentHost = isBrowser ? window.location.hostname : '';

    // Common LAN/mobile dev pitfall:
    // If the page is opened from http://<LAN-IP>:5173, but VITE_SOCKET_URL is set to
    // http://localhost:<port>, the phone will try to connect to *its own* localhost.
    // That leads to missing real-time events (looks like "needs refresh").
    const shouldIgnoreExplicitLocalhostUrl = (() => {
      if (!isBrowser) return false;
      if (!normalizedUrl) return false;
      if (currentHost === 'localhost' || currentHost === '127.0.0.1') return false;
      return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(normalizedUrl);
    })();

    // Dev: connect to same origin (Vite proxy forwards /socket.io to backend)
    // Prod: prefer explicit VITE_SOCKET_URL (passed in via callers), otherwise same origin.
    const targetUrl = shouldIgnoreExplicitLocalhostUrl
      ? currentOrigin
      : (normalizedUrl || currentOrigin || 'http://localhost:8000');

    if (shouldIgnoreExplicitLocalhostUrl) {
      console.warn(
        '[socket] Ignoring explicit localhost socket URL on non-localhost origin. Falling back to same-origin.',
        { providedUrl: normalizedUrl, origin: currentOrigin }
      );
    }

    console.log('🔌 Initializing socket connection...', `URL: ${targetUrl || '(same-origin)'}`);
    
    const opts = {
      // Allow polling fallback for networks that block websockets
      transports: ['websocket', 'polling'],
      upgrade: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: false,
    };
    
    socket = io(targetUrl, opts);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      console.log("🔗 Socket connected - readyState:", socket.connected);
      // If the UI requested a room join before the socket finished connecting,
      // emit it now. This prevents the "white screen / needs refresh to sync" symptom
      // where a client never actually joins the room and only sees updates after reload.
      if (pendingJoinPayload) {
        emitJoin(pendingJoinPayload, "pending-connect");
      }
    });
    
    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("❌ Full error object:", error);
    });

    socket.io.on("reconnect", (attempt) => {
      console.log(`🔄 Socket reconnected after ${attempt} attempts`);
      const gameId = readStoredValue("currentGameId") || readStoredValue("gameId");
      const playerName = readStoredValue("playerName") || readStoredValue("playerId");
      if (gameId && playerName) {
        requestRoomJoin({ gameId, playerName }, "auto-reconnect");
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", socket.id, "Reason:", reason);
      // Allow a fresh join on the next successful connect.
      joinedSocketId = null;
    });

    // Transport-level diagnostic events (keep lightweight)
    socket.io.on("error", (error) => {
      console.error("❌ Socket.IO engine error:", error);
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

  // If we've already joined this room on this exact socket connection, do nothing.
  if (joinedSignature === signature && joinedSocketId === socket.id) {
    return;
  }

  if (signature === lastJoinSignature && now - lastJoinTimestamp < JOIN_COOLDOWN_MS) {
    console.debug("⚠️ Skipping duplicate join emission", { reason, signature });
    return;
  }
  console.log("🚪 Joining game room", { ...payload, reason });
  socket.emit("game:join", payload);
  lastJoinSignature = signature;
  lastJoinTimestamp = now;
  joinedSignature = signature;
  joinedSocketId = socket.id;
}

export function requestRoomJoin(payload, reason = "manual") {
  if (!payload?.gameId || !payload?.playerName) return;
  pendingJoinPayload = payload;
  if (!socket) return;

  const signature = `${payload.gameId}:${payload.playerName}`;
  if (socket.connected && joinedSignature === signature && joinedSocketId === socket.id) {
    return;
  }

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
    joinedSignature = null;
    joinedSocketId = null;
    if (joinTimer) {
      clearTimeout(joinTimer);
      joinTimer = null;
    }
    socket = null;
  }
}