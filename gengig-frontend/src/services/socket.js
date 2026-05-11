import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    autoConnect: true,
});

socket.on("connect", () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
        socket.emit("join", { userId });
        console.log("Socket connected, joined room:", userId);
    }
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
});

export default socket;