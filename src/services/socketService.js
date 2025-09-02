// soft-import socket.io so app doesn't crash if it's not installed yet
let ioClient = null;
try {
  // eslint-disable-next-line no-undef
  ioClient = require("socket.io-client");
} catch (_) {
  // optional dependency not installed
}

let socket = null;

export function connectSocket(url) {
  if (!ioClient) return null;
  socket = ioClient(url, { transports: ["websocket"] });
  return socket;
}

export function getSocket() {
  return socket;
}
