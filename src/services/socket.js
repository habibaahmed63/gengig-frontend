import { io } from 'socket.io-client';
import { API_BASE_URL } from "./config";

const BASE_URL = API_BASE_URL;

const socket = io(BASE_URL, {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  autoConnect: true,
});

const joinRoom = () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    socket.emit("join", { userId });
    console.log("Socket joined room:", userId);
  }
};


socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
  const userId = localStorage.getItem('userId');
  if (userId) socket.emit('join', { userId });
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected:', reason);
});

socket.on('reconnect', () => {
  const userId = localStorage.getItem('userId');
  if (userId) socket.emit('join', { userId });
});

if (socket.connected) joinRoom();


export default socket;


