import { Sparkles } from "lucide-react";

export default function PremiumButton({ onClick }) {
    return (
        <button onClick={onClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200"
            style={{
                background: "linear-gradient(90deg, #FFC085, #e8a060)",
                boxShadow: "0 0 20px rgba(255,192,133,0.3)",
            }}>
            <Sparkles size={14} className="animate-pulse" />
            <span className="tracking-wide text-sm">Get Premium</span>
        </button>
    );
}