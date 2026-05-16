import { useState } from "react";
import { Crown, Sparkles, Zap, Shield, TrendingUp, Users, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SubscriptionPlans from "../components/SubscriptionPlans";
import api from "../services/api";

const ROLE_PERKS = {
    teenlancer: {
        headline: "Built for ambitious Teenlancers",
        sub: "Stand out, get hired faster, and unlock your full earning potential.",
        color: "#FFC085",
        perks: [
            { icon: <Star className="w-5 h-5" />, title: "Featured Badge", desc: "A gold premium badge appears on your profile — agents notice you instantly." },
            { icon: <TrendingUp className="w-5 h-5" />, title: "Priority in Search", desc: "Your profile ranks above free teenlancers in every search result." },
            { icon: <Zap className="w-5 h-5" />, title: "Unlimited Applications", desc: "Apply to as many gigs as you want — no monthly limits." },
            { icon: <Shield className="w-5 h-5" />, title: "Analytics Dashboard", desc: "See who viewed your profile, which gigs got the most attention." },
        ],
    },
    agent: {
        headline: "Built for serious Agents",
        sub: "Find the best teenlancers faster, post more, and build your team.",
        color: "#63b3ed",
        perks: [
            { icon: <Shield className="w-5 h-5" />, title: "Verified Business Badge", desc: "A blue verified badge builds instant trust with teenlancers." },
            { icon: <TrendingUp className="w-5 h-5" />, title: "Priority Job Posts", desc: "Your gigs appear at the top of explore pages and search results." },
            { icon: <Users className="w-5 h-5" />, title: "Advanced Talent Filters", desc: "Filter teenlancers by skill, rating, location, and availability." },
            { icon: <Zap className="w-5 h-5" />, title: "Direct Messaging", desc: "Message any teenlancer directly without them applying first." },
        ],
    },
};

export default function PremiumPage() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role") || "teenlancer";
    const userType = role === "agent" ? "agent" : "teenlancer";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const rolePerks = ROLE_PERKS[userType];

    const handlePremiumPayment = async ({ amount, billingCycle, planName }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/payments/premium/initiate", {
                amount, billingCycle, userType, planName,
            });
            const { iframeUrl } = response.data;
            window.location.href = iframeUrl;
        } catch (err) {
            console.error("Premium payment failed:", err);
            setError("Could not initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#060834", minHeight: "100vh" }}>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center relative"
                            style={{ background: "rgba(255,192,133,0.15)", border: "2px solid rgba(255,192,133,0.4)", boxShadow: "0 0 40px rgba(255,192,133,0.2)" }}>
                            <Crown className="w-10 h-10" style={{ color: "#FFC085" }} />
                            <div className="absolute inset-0 rounded-3xl animate-ping opacity-10"
                                style={{ background: "#FFC085" }} />
                        </div>
                    </div>

                    <h1 className="font-black mb-4 text-white"
                        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                        Gengig{" "}
                        <span style={{
                            background: "linear-gradient(90deg, #FFC085, #e8a060)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            Premium
                        </span>
                    </h1>

                    <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#B2B2D2" }}>
                        {rolePerks.sub}
                    </p>

                    {/* Role pill */}
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium"
                        style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.25)", color: "#FFC085" }}>
                        <Sparkles className="w-3.5 h-3.5" />
                        {userType === "agent" ? "Agent Plan" : "Teenlancer Plan"}
                    </div>
                </div>

                {/* Role-specific perks */}
                <div className="mb-16">
                    <h2 className="text-white font-bold text-center mb-3"
                        style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
                        {rolePerks.headline}
                    </h2>
                    <p className="text-center text-sm mb-8" style={{ color: "#B2B2D2" }}>
                        Everything included in your Premium plan
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rolePerks.perks.map((perk, i) => (
                            <div key={i} className="p-5 rounded-2xl flex items-start gap-4 hover:scale-[1.02] transition-all duration-200"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085" }}>
                                    {perk.icon}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm mb-1">{perk.title}</p>
                                    <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>{perk.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Both roles comparison*/}
                {!localStorage.getItem("token") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {Object.entries(ROLE_PERKS).map(([type, data]) => (
                            <div key={type} className="p-6 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <h3 className="text-white font-bold mb-1 capitalize">{type} Premium</h3>
                                <p className="text-xs mb-4" style={{ color: "#B2B2D2" }}>{data.sub}</p>
                                <ul className="flex flex-col gap-2">
                                    {data.perks.map((p, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs" style={{ color: "#B2B2D2" }}>
                                            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#4ade80" }} />
                                            {p.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="max-w-lg mx-auto mb-6 flex items-center gap-2 px-4 py-3 rounded-xl"
                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <span style={{ color: "#f87171" }}>⚠</span>
                        <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
                    </div>
                )}

                {/* Subscription Plans */}
                <SubscriptionPlans
                    userType={userType}
                    onSelectPlan={handlePremiumPayment}
                    loading={loading}
                />

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {[
                        "🔒 Secured by Paymob",
                        "✓ Cancel anytime",
                        "📧 24/7 support",
                        "🔄 Instant activation",
                    ].map(item => (
                        <span key={item} className="text-xs" style={{ color: "rgba(178,178,210,0.5)" }}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}