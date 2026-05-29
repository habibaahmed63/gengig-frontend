import { io } from 'socket.io-client';
import { API_BASE_URL } from "./config";

const SOCKET_BASE_URL = (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_PROXY_TARGET ||
  import.meta.env.VITE_API_URL ||
  API_BASE_URL
).replace(/\/+$/, "");
const rawSocketEnabled = import.meta.env.VITE_ENABLE_SOCKET;
const SOCKET_ENABLED = (
  rawSocketEnabled ?? (import.meta.env.DEV ? 'true' : 'false')
)
  .toString()
  .toLowerCase() === 'true';

const getStoredUserId = () =>
  localStorage.getItem("userId") ||
  localStorage.getItem("id") ||
  localStorage.getItem("_id");

function createDisabledSocket() {
  const noop = () => disabledSocket;
  const disabledSocket = {
    connected: false,
    id: undefined,
    emit: noop,
    on: noop,
    once: noop,
    off: noop,
    connect: noop,
    disconnect: noop,
  };
  return disabledSocket;
}

const socket = SOCKET_ENABLED
  ? io(SOCKET_BASE_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      autoConnect: true,
    })
  : createDisabledSocket();

const joinRoom = () => {
  const userId = getStoredUserId();
  if (userId) {
    socket.emit("join", { userId });
    console.log("Socket joined room:", userId);
  }
};


if (SOCKET_ENABLED) {
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    const userId = getStoredUserId();
    if (userId) socket.emit('join', { userId });
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('reconnect', () => {
    const userId = getStoredUserId();
    if (userId) socket.emit('join', { userId });
  });

  if (socket.connected) joinRoom();
}


export default socket;
