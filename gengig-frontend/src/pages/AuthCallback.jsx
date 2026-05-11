import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import api from "../services/api";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    console.error("No session:", error);
                    navigate("/signin");
                    return;
                }

                const { user } = session;

                const res = await api.post("/auth/google/supabase", {
                    email: user.email,
                    name: user.user_metadata?.full_name || user.email.split("@")[0],
                    photo: user.user_metadata?.avatar_url || "",
                    googleId: user.id,
                });

                const d = res.data;

                ["token", "role", "name", "photo", "userId", "bio", "skills", "company",
                    "industry", "location", "hourlyRate", "availability", "portfolio"]
                    .forEach(k => localStorage.removeItem(k));

                localStorage.setItem("token", d.token);
                localStorage.setItem("role", d.role || "teenlancer");
                localStorage.setItem("name", d.name || user.user_metadata?.full_name || "");
                const userId = d._id || d.userId || d.id;
                if (userId) localStorage.setItem("userId", userId);
                const photo = d.photo || user.user_metadata?.avatar_url || "";
                if (photo) localStorage.setItem("photo", photo);

                if (d.role === "agent") {
                    navigate("/agent/dashboard", { replace: true });
                } else {
                    navigate("/teenlancer/dashboard", { replace: true });
                }

            } catch (err) {
                console.error("Auth callback error:", err);
                navigate("/signin");
            }
        };

        handleCallback();
    }, [navigate]);

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