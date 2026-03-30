import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [done, setDone] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (step === 2) inputRefs.current[0]?.focus();
    }, [step]);

    useEffect(() => {
        if (step !== 2 || resendTimer <= 0) return;
        const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
        return () => clearTimeout(t);
    }, [resendTimer, step]);

    // ── Step 1: Send reset email ──
    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError("Please enter your email."); return; }
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/forgot-password", { email });
            setStep(2);
            setResendTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || "No account found with this email.");
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Code input handlers ──
    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        setError("");
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleCodeKeyDown = (index, e) => {
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

    // ── Step 2: Verify code ──
    const handleVerifyCode = async () => {
        const fullCode = code.join("");
        if (fullCode.length < 6) { setError("Please enter the full 6-digit code."); return; }
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/verify-reset-code", { email, code: fullCode });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired code.");
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Resend code ──
    const handleResend = async () => {
        setError("");
        try {
            await api.post("/auth/forgot-password", { email });
            setResendTimer(60);
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend. Try again.");
        }
    };

    // ── Step 3: Reset password ──
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!passwords.newPassword || passwords.newPassword.length < 6) {
            setError("Password must be at least 6 characters."); return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match."); return;
        }
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/reset-password", {
                email,
                code: code.join(""),
                newPassword: passwords.newPassword,
            });
            setDone(true);
            setTimeout(() => navigate("/signin"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Success Screen ──
    if (done) {
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
                    <h2 className="text-white font-bold text-xl">Password Reset!</h2>
                    <p className="text-sm" style={{ color: "#B2B2D2" }}>Redirecting you to Sign In...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "#060834" }}>
            <Navbar />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute rounded-full blur-3xl opacity-10" style={{ width: "400px", height: "400px", background: "#FFC085", top: "-100px", right: "-100px" }} />
                <div className="absolute rounded-full blur-3xl opacity-10" style={{ width: "300px", height: "300px", background: "#6366f1", bottom: "50px", left: "-80px" }} />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md p-8 rounded-3xl flex flex-col items-center text-center gap-6"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>

                    {/* Step Indicators */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                    style={{
                                        background: step >= s ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                                        color: step >= s ? "white" : "#B2B2D2",
                                    }}>
                                    {step > s ? "✓" : s}
                                </div>
                                {s < 3 && (
                                    <div className="w-8 h-0.5 rounded-full transition-all"
                                        style={{ background: step > s ? "#FFC085" : "rgba(255,255,255,0.1)" }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── STEP 1: Email ── */}
                    {step === 1 && (
                        <>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ background: "rgba(255,192,133,0.15)", border: "1px solid rgba(255,192,133,0.3)" }}>
                                🔑
                            </div>
                            <div>
                                <h1 className="text-white font-bold mb-2" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>
                                    Forgot Password?
                                </h1>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                    No worries! Enter your email address and we will send you a reset code.
                                </p>
                            </div>

                            <form onSubmit={handleSendEmail} className="w-full flex flex-col gap-4">
                                <div className="flex flex-col gap-1 text-left">
                                    <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                        placeholder="your@email.com"
                                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                </div>

                                {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}

                                <button type="submit" disabled={loading}
                                    className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                    {loading ? "Sending..." : "Send Reset Code"}
                                </button>
                            </form>

                            <Link to="/signin" className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#B2B2D2" }}>
                                Back to Sign In
                            </Link>
                        </>
                    )}

                    {/* ── STEP 2: Code ── */}
                    {step === 2 && (
                        <>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ background: "rgba(255,192,133,0.15)", border: "1px solid rgba(255,192,133,0.3)" }}>
                                📧
                            </div>
                            <div>
                                <h1 className="text-white font-bold mb-2" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>
                                    Check Your Email
                                </h1>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                    We sent a 6-digit code to
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
                                        onChange={(e) => handleCodeChange(i, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                                        className="w-12 h-14 text-center text-white text-xl font-bold rounded-xl outline-none transition-all"
                                        style={{
                                            background: digit ? "rgba(255,192,133,0.15)" : "rgba(255,255,255,0.08)",
                                            border: error
                                                ? "1px solid #f87171"
                                                : digit
                                                    ? "1px solid rgba(255,192,133,0.5)"
                                                    : "1px solid rgba(255,255,255,0.1)",
                                            caretColor: "#FFC085",
                                        }}
                                    />
                                ))}
                            </div>

                            {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}

                            <button onClick={handleVerifyCode} disabled={loading || code.join("").length < 6}
                                className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>

                            <div className="text-sm" style={{ color: "#B2B2D2" }}>
                                {"Didn't receive the code? "}
                                {resendTimer > 0 ? (
                                    <span style={{ color: "#FFC085" }}>{"Resend in " + resendTimer + "s"}</span>
                                ) : (
                                    <button onClick={handleResend} className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "#FFC085" }}>
                                        Resend Code
                                    </button>
                                )}
                            </div>

                            <button onClick={() => { setStep(1); setCode(["", "", "", "", "", ""]); setError(""); }}
                                className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#B2B2D2" }}>
                                Change email
                            </button>
                        </>
                    )}

                    {/* ── STEP 3: New Password ── */}
                    {step === 3 && (
                        <>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ background: "rgba(255,192,133,0.15)", border: "1px solid rgba(255,192,133,0.3)" }}>
                                🔒
                            </div>
                            <div>
                                <h1 className="text-white font-bold mb-2" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>
                                    Set New Password
                                </h1>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                    Choose a strong password for your account.
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
                                <div className="flex flex-col gap-1 text-left">
                                    <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            value={passwords.newPassword}
                                            onChange={(e) => { setPasswords((p) => ({ ...p, newPassword: e.target.value })); setError(""); }}
                                            placeholder="Min. 6 characters"
                                            className="w-full rounded-xl px-4 py-3 pr-10 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                        />
                                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#B2B2D2" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                {showNew
                                                    ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                }
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 text-left">
                                    <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            value={passwords.confirmPassword}
                                            onChange={(e) => { setPasswords((p) => ({ ...p, confirmPassword: e.target.value })); setError(""); }}
                                            placeholder="Repeat your password"
                                            className="w-full rounded-xl px-4 py-3 pr-10 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#B2B2D2" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                {showConfirm
                                                    ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                }
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}

                                <button type="submit" disabled={loading}
                                    className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                    {loading ? "Resetting..." : "Reset Password →"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}