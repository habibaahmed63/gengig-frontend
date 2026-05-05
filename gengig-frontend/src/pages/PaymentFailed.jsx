import { useNavigate } from "react-router-dom";
import logo from "../assets/Gengig LOGO.png";

export default function PaymentFailed() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const dashboardPath = role === "agent" ? "/agent/dashboard" : "/teenlancer/dashboard";
    const paymentPath = role === "agent" ? "/agent/payment" : "/teenlancer/payment";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{ background: "#060834" }}>

            {/* Logo */}
            <img src={logo} alt="Gengig" className="w-12 h-12 object-contain mb-10" />

            {/* Failed icon */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{ background: "rgba(248,113,113,0.12)", border: "2px solid rgba(248,113,113,0.35)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none"
                    viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>

            <h1 className="text-white font-bold tracking-tight mb-3"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                Payment Failed
            </h1>
            <p className="text-base mb-2 max-w-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                Something went wrong with your payment. No charges were made to your account.
            </p>
            <p className="text-sm mb-10" style={{ color: "rgba(178,178,210,0.5)" }}>
                Please check your card details and try again.
            </p>

            {/* Divider */}
            <div className="w-12 h-0.5 rounded-full mb-10"
                style={{ background: "linear-gradient(90deg, #f87171, #ef4444)" }} />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate(paymentPath)}
                    className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    Try Again
                </button>
                <button onClick={() => navigate(dashboardPath)}
                    className="px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
                    style={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                    Back to Dashboard
                </button>
            </div>

            {/* Help note */}
            <p className="text-xs mt-8 max-w-xs leading-relaxed" style={{ color: "rgba(178,178,210,0.4)" }}>
                If the issue persists, contact our support team and we'll help you resolve it.
            </p>
            <button onClick={() => navigate("/Support")}
                className="text-xs mt-2 hover:opacity-80 transition-opacity"
                style={{ color: "#FFC085" }}>
                Visit Support →
            </button>
        </div>
    );
}