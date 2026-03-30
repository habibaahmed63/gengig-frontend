import { useState } from "react";
import logo from "../assets/Gengig LOGO.png";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });
            localStorage.removeItem("name");
            localStorage.removeItem("photo");
            localStorage.removeItem("bio");
            localStorage.removeItem("skills");
            localStorage.removeItem("education");
            localStorage.removeItem("availability");
            localStorage.removeItem("hourlyRate");
            localStorage.removeItem("company");
            localStorage.removeItem("industry");
            localStorage.removeItem("workTypes");
            localStorage.removeItem("location");
            localStorage.removeItem("joinDate");

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);

            if (response.data.name) localStorage.setItem("name", response.data.name);
            if (response.data.photo) localStorage.setItem("photo", response.data.photo);
            console.log("Success:", response.data);
            if (response.data.role === "teenlancer") {
                navigate("/teenlancer/dashboard");
            } else if (response.data.role === "agent") {
                navigate("/agent/dashboard");
            } else {
                navigate("/home");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden" style={{ background: "#060834" }}>

            {/* Logo */}
            <div className="absolute top-4 left-4 z-20">
                <img src={logo} alt="Gengig Logo" className="w-16 h-16 object-contain" />
            </div>

            {/* Left side - hidden on mobile */}
            <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-10">
                <h1 className="font-bold leading-tight text-center whitespace-nowrap" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
                    <span className="text-gradient">Welcome Back</span>
                </h1>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 lg:py-10">
                <h2 className="text-white text-2xl font-semibold mb-6">Sign In</h2>

                <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-white text-sm">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-md px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-white text-sm">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-md px-3 py-2 pr-10 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B2B2D2] hover:text-white transition-colors">
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember me + Forgot password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-3.5 h-3.5 accent-[#FFC085]" />
                            <span className="text-[#B2B2D2] text-xs">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#FFC085" }}>
                            Forgot password?
                        </Link>                    </div>

                    {/* Error */}
                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-full font-semibold text-white mt-1 transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-px bg-white/20" />
                        <span className="text-[#B2B2D2] text-sm">or</span>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-4">
                        <button type="button" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>
                        <button type="button" className="w-9 h-9 rounded-full bg-black border border-white/20 flex items-center justify-center hover:scale-105 transition-transform">
                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                        </button>
                        <button type="button" className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition-transform" style={{ background: "#1877F2" }}>
                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm mt-1" style={{ color: "#B2B2D2" }}>
                        No Account Yet?{" "}
                        <Link to="/signup" className="text-[#FFC085] font-medium hover:underline">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}