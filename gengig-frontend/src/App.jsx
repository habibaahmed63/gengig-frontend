

import { useState } from "react";
import AppRouter from "./routes/AppRouter";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <AppRouter />
    </>
  );
}