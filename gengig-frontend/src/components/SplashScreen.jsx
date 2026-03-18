import { useEffect, useState } from "react";
import logo from "../assets/Gengig LOGO.png";

export default function SplashScreen({ onFinish }) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setFadeOut(true), 2000);
        const timer2 = setTimeout(() => onFinish(), 2500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500"
            style={{
                background: "#060834",
                opacity: fadeOut ? 0 : 1,
                pointerEvents: fadeOut ? "none" : "all",
            }}
        >
            {/* Background orbs */}
            <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#FFC085", top: "-10%", right: "-10%" }} />
            <div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#013A63", bottom: "-10%", left: "-10%" }} />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Logo with pulse animation */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#FFC085" }} />
                    <img src={logo} alt="Gengig" className="w-30 h-30 object-contain relative z-10" />
                </div>

                {/* Brand name */}
                <div className="flex flex-col items-center gap-1">
                    <h1 className="font-bold text-gradient" style={{ fontSize: "4rem" }}>
                        Gengig
                    </h1>
                    <p className="text-sm italic" style={{ color: "#B2B2D2" }}>
                        Where Ambition Finds Its First Gig
                    </p>
                </div>

                {/* Loading bar */}
                <div className="w-48 h-1 rounded-full overflow-hidden mt-4" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div
                        className="h-full rounded-full"
                        style={{
                            background: "linear-gradient(90deg, #FFC085, #e8a060)",
                            animation: "loadingBar 2s ease-in-out forwards",
                        }}
                    />
                </div>
            </div>

            {/* Loading bar animation */}
            <style>{`
        @keyframes loadingBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
}