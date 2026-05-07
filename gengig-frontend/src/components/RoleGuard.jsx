import { useNavigate } from "react-router-dom";

export default function RoleGuard({ isOpen, onClose, userRole }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const isTeenlancer = userRole === "teenlancer";

    const config = {
        teenlancer: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none"
                    viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            title: "Agents Only",
            message: "Posting gigs is only available to agents. Create an agent account to start hiring talented teenlancers and posting your projects.",
            cta: "Create Agent Account",
            ctaPath: "/signup",
            secondary: "Back",
        },
        agent: {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none"
                    viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Teenlancers Only",
            message: "Applying for gigs is only available to teenlancers. Create a teenlancer account to start showcasing your skills and earning from your talent.",
            cta: "Create Teenlancer Account",
            ctaPath: "/signup",
            secondary: "Back",
        },
    };

    const content = isTeenlancer ? config.teenlancer : config.agent;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose} />

            <div className="relative w-full max-w-md rounded-3xl overflow-hidden z-10"
                style={{ background: "#0a0d2e", border: "1px solid rgba(255,255,255,0.12)" }}>

                <div className="h-1 w-full"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }} />

                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: "rgba(255,192,133,0.12)", border: "1px solid rgba(255,192,133,0.25)" }}>
                        {content.icon}
                    </div>

                    <h2 className="text-white font-bold text-xl mb-3 tracking-tight">
                        {content.title}
                    </h2>

                    <p className="text-sm leading-relaxed mb-8" style={{ color: "#B2B2D2" }}>
                        {content.message}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { onClose(); navigate(content.ctaPath); }}
                            className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            {content.cta}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-full font-semibold hover:bg-white/10 transition-all text-sm"
                            style={{ color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.12)" }}>
                            {content.secondary}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}