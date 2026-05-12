import { io } from 'socket.io-client';

// Create socket ONCE — outside component
const socket = io('http://localhost:3000', {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  autoConnect: true,
});

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

export default socket;