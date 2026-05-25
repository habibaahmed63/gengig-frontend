import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "your email";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [resendLoading, setResendLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        setError("");
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join("");
        if (fullCode.length < 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/verify-email", {
                email,
                code: fullCode,
            });
            setVerified(true);
            setTimeout(() => {
                const role = localStorage.getItem("role");
                if (role === "agent") navigate("/onboarding/agent");
                else navigate("/onboarding/teenlancer");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid code. Please try again.");
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setError("");
        try {
            await api.post("/auth/resend-verification", { email });
            setResendTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend code. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

    if (verified) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#060834" }}>
                <div className="text-center flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#FFC085" }} />
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl relative z-10"
                            style={{ background: "rgba(255,192,133,0.15)", border: "2px solid #FFC085" }}>
                            ✓
                        </div>
                    </div>
                    <h2 className="text-white font-bold text-xl">Email Verified!</h2>
                    <p className="text-sm" style={{ color: "#B2B2D2" }}>Redirecting you to complete your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "#060834" }}>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute rounded-full blur-3xl opacity-10"
                    style={{ width: "400px", height: "400px", background: "#FFC085", top: "-100px", right: "-100px" }} />
                <div className="absolute rounded-full blur-3xl opacity-10"
                    style={{ width: "300px", height: "300px", background: "#6366f1", bottom: "50px", left: "-80px" }} />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md p-8 rounded-3xl flex flex-col items-center text-center gap-6"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>

                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: "rgba(255,192,133,0.15)", border: "1px solid rgba(255,192,133,0.3)" }}>
                        📧
                    </div>

                    <div>
                        <h1 className="text-white font-bold mb-2" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>
                            Enter your verification code
                        </h1>
                        <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                            We sent a 6-digit verification code to
                        </p>
                        <p className="text-sm font-semibold mt-1" style={{ color: "#FFC085" }}>{email}</p>
                    </div>

                    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-12 h-14 text-center text-white text-xl font-bold rounded-xl outline-none transition-all"
                                style={{
                                    background: digit ? "rgba(255,192,133,0.15)" : "rgba(255,255,255,0.08)",
                                    border: error ? "1px solid #f87171" : digit ? "1px solid rgba(255,192,133,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                    caretColor: "#FFC085",
                                }}
                            />
                        ))}
                    </div>

                    {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}

                    <button onClick={handleVerify} disabled={loading || code.join("").length < 6}
                        className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                    <div className="text-sm" style={{ color: "#B2B2D2" }}>
                        {"Didn't receive the code? "}
                        {resendTimer > 0 ? (
                            <span style={{ color: "#FFC085" }}>{"Resend in " + resendTimer + "s"}</span>
                        ) : (
                            <button onClick={handleResend} disabled={resendLoading}
                                className="font-semibold hover:opacity-80 transition-opacity"
                                style={{ color: "#FFC085" }}>
                                {resendLoading ? "Sending..." : "Resend Code"}
                            </button>
                        )}
                    </div>

                    <button onClick={() => navigate("/signup")} className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#B2B2D2" }}>
                        Wrong email? Go back to Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}