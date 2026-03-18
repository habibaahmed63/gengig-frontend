import { Link } from "react-router-dom";
import logo from "../assets/Gengig LOGO.png";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden" style={{ background: "#060834" }}>

            <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#FFC085", top: "-10%", right: "-10%" }} />
            <div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#013A63", bottom: "-10%", left: "-10%" }} />

            <div className="relative z-10 flex flex-col items-center">
                <img src={logo} alt="Gengig" className="w-30 h-30 object-contain mb-8" />

                <h1 className="font-bold leading-none mb-4 text-gradient" style={{ fontSize: "clamp(6rem, 20vw, 12rem)" }}>
                    404
                </h1>

                <h2 className="text-white font-bold mb-3" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                    Page Not Found
                </h2>

                <p className="text-sm mb-10 max-w-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                    Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/home"
                        className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/exploreagig"
                        className="px-8 py-3 rounded-full font-semibold text-white hover:bg-white/10 transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                    >
                        Explore Gigs
                    </Link>
                </div>
            </div>
        </div>
    );
}