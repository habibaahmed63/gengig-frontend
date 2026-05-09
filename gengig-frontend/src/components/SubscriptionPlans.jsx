import { useState } from "react";
import { CheckCircle, Crown, Zap } from "lucide-react";

const PLANS = {
    teenlancer: {
        title: "Teenlancer Premium",
        monthly: 99,
        yearly: 990,
        color: "#FFC085",
        features: [
            "Featured Premium Badge on your profile",
            "Unlimited gig applications per month",
            "Profile view analytics & insights",
            "Priority placement in search results",
            "Stand out from regular teenlancers",
            "Early access to new gigs",
        ],
    },
    agent: {
        title: "Agent Premium",
        monthly: 299,
        yearly: 2990,
        color: "#63b3ed",
        features: [
            "Verified Business Badge on your profile",
            "5 priority-boosted job posts per month",
            "Advanced talent search filters",
            "Direct messaging with any teenlancer",
            "Featured gigs in top search results",
            "Access to premium teenlancer pool",
        ],
    },
};

export default function SubscriptionPlans({ userType, onSelectPlan, loading }) {
    const [billing, setBilling] = useState("monthly");

    const plan = PLANS[userType] || PLANS.teenlancer;
    const price = billing === "monthly" ? plan.monthly : plan.yearly;
    const saved = Math.round(plan.monthly * 12 - plan.yearly);

    const handleProceed = () => {
        onSelectPlan({ amount: price, billingCycle: billing, planName: plan.title });
    };

    return (
        <div className="max-w-lg mx-auto">
            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-sm font-medium"
                    style={{ color: billing === "monthly" ? "#FFC085" : "#B2B2D2" }}>
                    Monthly
                </span>
                <button onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
                    className="relative w-12 h-6 rounded-full transition-all duration-300"
                    style={{ background: billing === "yearly" ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.15)" }}>
                    <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
                        style={{ transform: billing === "yearly" ? "translateX(26px)" : "translateX(2px)" }} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium"
                        style={{ color: billing === "yearly" ? "#FFC085" : "#B2B2D2" }}>
                        Yearly
                    </span>
                    {billing === "yearly" && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>
                            Save {saved} EGP
                        </span>
                    )}
                </div>
            </div>

            {/* Plan card */}
            <div className="p-8 rounded-3xl relative overflow-hidden"
                style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,192,133,0.3)",
                    boxShadow: "0 0 40px rgba(255,192,133,0.1)",
                }}>

                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }} />

                {/* Crown icon */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(255,192,133,0.15)", border: "1px solid rgba(255,192,133,0.3)" }}>
                        <Crown className="w-6 h-6" style={{ color: "#FFC085" }} />
                    </div>
                    <div>
                        <p className="text-white font-bold">{plan.title}</p>
                        <p className="text-xs" style={{ color: "#B2B2D2" }}>
                            {billing === "yearly" ? "Billed annually" : "Billed monthly"}
                        </p>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-black text-white">{price}</span>
                    <span className="text-lg font-semibold" style={{ color: "#FFC085" }}>EGP</span>
                    <span className="text-sm" style={{ color: "#B2B2D2" }}>/ {billing}</span>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#4ade80" }} />
                            <span className="text-sm" style={{ color: "#B2B2D2" }}>{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <button onClick={handleProceed} disabled={loading}
                    className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    {loading ? (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 animate-spin"
                                style={{ borderColor: "white", borderTopColor: "transparent" }} />
                            Redirecting to payment...
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4" />
                            Upgrade Now — {price} EGP/{billing === "monthly" ? "mo" : "yr"}
                        </>
                    )}
                </button>

                <p className="text-center text-xs mt-4" style={{ color: "rgba(178,178,210,0.5)" }}>
                    Cancel anytime · Secured by Paymob
                </p>
            </div>
        </div>
    );
}