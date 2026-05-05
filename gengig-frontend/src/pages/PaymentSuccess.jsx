import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Gengig LOGO.png";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const dashboardPath = role === "agent" ? "/agent/dashboard" : "/teenlancer/dashboard";
    const paymentPath = role === "agent" ? "/agent/payment" : "/teenlancer/payment";

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(dashboardPath);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{ background: "#060834" }}>

            {/* Logo */}
            <img src={logo} alt="Gengig" className="w-12 h-12 object-contain mb-10" />

            {/* Success icon */}
            <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full animate-ping opacity-10"
                    style={{ background: "#4ade80" }} />
                <div className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
                    style={{ background: "rgba(74,222,128,0.12)", border: "2px solid rgba(74,222,128,0.35)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none"
                        viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <h1 className="text-white font-bold tracking-tight mb-3"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                Payment Successful
            </h1>
            <p className="text-base mb-2 max-w-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                Your payment has been processed and confirmed successfully.
            </p>
            <p className="text-sm mb-10" style={{ color: "rgba(178,178,210,0.5)" }}>
                You will be redirected to your dashboard in 5 seconds.
            </p>

            {/* Divider */}
            <div className="w-12 h-0.5 rounded-full mb-10"
                style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)" }} />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate(dashboardPath)}
                    className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    Go to Dashboard
                </button>
                <button onClick={() => navigate(paymentPath)}
                    className="px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
                    style={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                    Payment Details
                </button>
            </div>

            {/* Countdown indicator */}
            <p className="text-xs mt-8" style={{ color: "rgba(178,178,210,0.4)" }}>
                Redirecting automatically in 5 seconds...
            </p>
        </div>
    );
}