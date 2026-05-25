import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const role = params.get("role");
        const name = params.get("name");
        const userId = params.get("userId") || params.get("_id") || params.get("id");
        const photo = params.get("photo") || params.get("photoUrl") || "";

        if (token) {
            ["token", "role", "name", "photo", "userId", "bio", "skills", "company", "industry",
                "location", "hourlyRate", "availability", "portfolio"].forEach(k => localStorage.removeItem(k));

            localStorage.setItem("token", token);
            localStorage.setItem("role", role || "teenlancer");
            localStorage.setItem("name", name || "");
            if (userId) localStorage.setItem("userId", userId);
            if (photo) localStorage.setItem("photo", photo);

            if (role === "agent") navigate("/agent/dashboard", { replace: true });
            else navigate("/teenlancer/dashboard", { replace: true });
        } else {
            navigate("/signin", { replace: true });
        }
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