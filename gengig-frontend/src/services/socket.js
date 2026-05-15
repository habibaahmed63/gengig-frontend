import { io } from 'socket.io-client';

// Create socket ONCE — outside component
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const socket = io(BASE_URL, {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
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



