import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Crown, Zap, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function PremiumCheckout() {
    const location = useLocation();
    const navigate = useNavigate();

    const { userType, billingCycle, price, planName } = location.state || {};

    useEffect(() => {
        if (!price) navigate("/premium");
    }, [price, navigate]);

    if (!price) return null;

    const role = localStorage.getItem("role") || userType || "teenlancer";

    return (
        <div style={{ background: "#060834", minHeight: "100vh" }}>
            <Navbar />

            <div className="max-w-lg mx-auto px-6 py-16 flex flex-col items-center">

                {/* Icon */}
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 relative"
                    style={{ background: "rgba(255,192,133,0.15)", border: "2px solid rgba(255,192,133,0.4)" }}>
                    <Crown className="w-10 h-10" style={{ color: "#FFC085" }} />
                    <div className="absolute inset-0 rounded-3xl animate-ping opacity-10"
                        style={{ background: "#FFC085" }} />
                </div>

                <h1 className="text-white font-black text-3xl mb-2 text-center">Order Summary</h1>
                <p className="text-sm mb-10 text-center" style={{ color: "#B2B2D2" }}>
                    Review your plan before proceeding to secure payment
                </p>

                {/* Summary card */}
                <div className="w-full p-6 rounded-3xl mb-6"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,192,133,0.25)" }}>

                    <div className="h-1 w-full rounded-full mb-6"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }} />

                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Plan", value: planName || `${userType} Premium` },
                            { label: "Billing", value: billingCycle === "yearly" ? "Annually" : "Monthly" },
                            { label: "Role", value: role === "agent" ? "Agent" : "Teenlancer" },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between pb-3"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <span className="text-sm" style={{ color: "#B2B2D2" }}>{item.label}</span>
                                <span className="text-sm font-semibold text-white capitalize">{item.value}</span>
                            </div>
                        ))}

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-white font-bold text-lg">Total</span>
                            <span className="font-black text-2xl" style={{ color: "#FFC085" }}>
                                {price} EGP
                            </span>
                        </div>
                    </div>
                </div>

                {/* What you get */}
                <div className="w-full p-5 rounded-2xl mb-8"
                    style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
                    <p className="text-xs font-semibold mb-3" style={{ color: "#4ade80" }}>WHAT YOU GET INSTANTLY</p>
                    <ul className="flex flex-col gap-2">
                        {[
                            "Premium badge activated on your profile",
                            "Priority placement in search results",
                            role === "agent" ? "5 priority job posts unlocked" : "Unlimited applications unlocked",
                            "Analytics dashboard access",
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs" style={{ color: "#B2B2D2" }}>
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#4ade80" }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                
                <Link to="/premium"
                    className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-4"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    <Zap className="w-4 h-4" />
                    Go to Premium Page
                </Link>

                <p className="text-xs text-center" style={{ color: "rgba(178,178,210,0.4)" }}>
                    🔒 Secured by Paymob · Cancel anytime
                </p>
            </div>
        </div>
    );
}