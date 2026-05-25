import { useState, useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import SplashScreen from "./components/SplashScreen";
import socket from "./services/socket";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const joinSocketRoom = () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        socket.emit("join", { userId });
      }
    };

    joinSocketRoom();

    socket.on("connect", joinSocketRoom);

    const handleStorage = () => joinSocketRoom();
    window.addEventListener("storage", handleStorage);

    return () => {
      socket.off("connect", joinSocketRoom);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <AppRouter />
    </>
  );
}