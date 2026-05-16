import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import api from "../services/api";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                await new Promise(r => setTimeout(r, 500));

                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                console.log("Session:", session);
                console.log("Session error:", sessionError);

                if (sessionError || !session) {
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    console.log("User fallback:", user, userError);

                    if (!user) {
                        setError("Could not get session. Please try again.");
                        setTimeout(() => navigate("/signin"), 2000);
                        return;
                    }

                    await processGoogleUser({
                        email: user.email,
                        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0],
                        photo: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
                        googleId: user.id,
                    });
                    return;
                }

                const { user } = session;
                await processGoogleUser({
                    email: user.email,
                    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0],
                    photo: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
                    googleId: user.id,
                });

            } catch (err) {
                console.error("Auth callback error:", err);
                setError("Something went wrong. Please try again.");
                setTimeout(() => navigate("/signin"), 2000);
            }
        };

        const processGoogleUser = async ({ email, name, photo, googleId }) => {
            try {
                const res = await api.post("/auth/google/supabase", {
                    email, name, photo, googleId,
                });

                const d = res.data;
                console.log("Backend response:", d);

                ["token", "role", "name", "photo", "userId", "bio", "skills", "company",
                    "industry", "location", "hourlyRate", "availability", "portfolio"]
                    .forEach(k => localStorage.removeItem(k));

                localStorage.setItem("token", d.token);
                localStorage.setItem("role", d.role || "teenlancer");
                localStorage.setItem("name", d.name || name || "");
                window.dispatchEvent(new Event("storage"));
                setTimeout(() => {
                    const userId = localStorage.getItem("userId");
                    if (userId) {
                        import("../services/socket").then(({ default: socket }) => {
                            socket.emit("join", { userId });
                        });
                    }
                }, 100);

                const userId = d._id || d.userId || d.id;
                if (userId) localStorage.setItem("userId", userId);

                const photoUrl = d.photo || photo || "";
                if (photoUrl) localStorage.setItem("photo", photoUrl);

                if (d.role === "agent") navigate("/agent/dashboard", { replace: true });
                else navigate("/teenlancer/dashboard", { replace: true });

            } catch (err) {
                console.error("Backend auth error:", err);
                setError("Account setup needed. Redirecting...");
                setTimeout(() => navigate("/signin"), 1500);
            }
        };

        handleCallback();
    }, [navigate]);

    if (error) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#060834" }}>
            <div className="flex flex-col items-center gap-4 text-center px-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(248,113,113,0.15)", border: "1px solid #f87171" }}>
                    <span style={{ color: "#f87171" }}>✕</span>
                </div>
                <p className="text-white font-semibold">Sign in issue</p>
                <p className="text-sm" style={{ color: "#B2B2D2" }}>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#060834" }}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 animate-spin"
                    style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                <p className="text-sm" style={{ color: "#B2B2D2" }}>Signing you in with Google...</p>
            </div>
        </div>
    );
}