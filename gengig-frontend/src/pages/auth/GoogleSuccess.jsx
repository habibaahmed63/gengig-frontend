import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const role  = searchParams.get("role");
        const name  = searchParams.get("name");
        const email = searchParams.get("email");
        const photo = searchParams.get("photo") || "";

        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("role",  role  || "");
            localStorage.setItem("name",  name  || "");
            localStorage.setItem("email", email || "");
            localStorage.setItem("photo", photo);

            window.dispatchEvent(new Event("storage"));

            if (role === "agent") {
                navigate("/agent/dashboard");
            } else if (role === "teenlancer") {
                navigate("/teenlancer/dashboard");
            } else {
                navigate("/home");
            }
        } else {
            navigate("/signin");
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4"
            style={{ background: "#060834" }}>
            <div className="w-10 h-10 rounded-full border-2 animate-spin"
                style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
            <p className="text-sm" style={{ color: "#B2B2D2" }}>Signing you in with Google...</p>
        </div>
    );
}