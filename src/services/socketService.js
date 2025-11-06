import { io } from "socket.io-client";

let socket = null;

export function connectSocket(url) {
  if (!socket) {
    socket = io(url, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`Socket reconnected after ${attempt} attempts`);
      const gameId = localStorage.getItem("gameId");
      const playerId = localStorage.getItem("playerId");
      if (gameId && playerId) {
        socket.emit("rejoin", { gameId, playerId });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    socket.connect();
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