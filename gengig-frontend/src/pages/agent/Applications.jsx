import { useState } from "react";
import AgentLayout from "../../layouts/AgentLayout";

const initialApplications = [
    {
        id: 1,
        gigTitle: "Brand Identity Design",
        category: "Graphic Design",
        applicant: {
            name: "Salma Tamer",
            role: "Graphic Designer",
            rating: 4.9,
            completedGigs: 12,
            img: "https://i.pravatar.cc/100?img=1",
        },
        message: "Hi! I am a graphic designer with experience in brand identity and logo design. I have worked on similar projects and I am confident I can deliver great results.",
        proposedRate: "$130",
        timeline: "5 days",
        portfolioLink: "https://behance.net/salmatamer",
        file: "brand_samples.pdf",
        status: "pending",
        appliedDate: "March 2, 2026",
    },
    {
        id: 2,
        gigTitle: "Brand Identity Design",
        category: "Graphic Design",
        applicant: {
            name: "Ahmed Karim",
            role: "UI/UX Designer",
            rating: 4.7,
            completedGigs: 8,
            img: "https://i.pravatar.cc/100?img=2",
        },
        message: "Hello! I specialize in branding and visual identity. I have a strong portfolio of logo and brand guideline projects that I would love to share.",
        proposedRate: "$150",
        timeline: "1 week",
        portfolioLink: "https://dribbble.com/ahmedkarim",
        file: null,
        status: "pending",
        appliedDate: "March 3, 2026",
    },
    {
        id: 3,
        gigTitle: "Social Media Campaign",
        category: "Marketing",
        applicant: {
            name: "Mariam Assem",
            role: "Content Creator",
            rating: 4.8,
            completedGigs: 15,
            img: "https://i.pravatar.cc/100?img=5",
        },
        message: "Hi there! I have run several social media campaigns for small businesses and I know exactly how to create engaging content that converts.",
        proposedRate: "$180",
        timeline: "1 week",
        portfolioLink: "https://instagram.com/mariamassem",
        file: "campaign_samples.pdf",
        status: "accepted",
        appliedDate: "March 1, 2026",
    },
    {
        id: 4,
        gigTitle: "Social Media Campaign",
        category: "Marketing",
        applicant: {
            name: "Omar Fathy",
            role: "Social Media Manager",
            rating: 4.5,
            completedGigs: 6,
            img: "https://i.pravatar.cc/100?img=7",
        },
        message: "I manage social media for 3 local brands currently and have experience creating campaigns from scratch.",
        proposedRate: "$160",
        timeline: "3-5 days",
        portfolioLink: "",
        file: null,
        status: "rejected",
        appliedDate: "March 2, 2026",
    },
];

const statusStyles = {
    pending: { bg: "rgba(255,192,133,0.15)", color: "#FFC085", label: "Pending" },
    accepted: { bg: "rgba(74,222,128,0.15)", color: "#4ade80", label: "Accepted" },
    rejected: { bg: "rgba(248,113,113,0.15)", color: "#f87171", label: "Rejected" },
};

export default function AgentApplications() {
    const [statuses, setStatuses] = useState(
        Object.fromEntries(initialApplications.map((a) => [a.id, a.status]))
    );
    const [activeFilter, setActiveFilter] = useState("all");
    const [expanded, setExpanded] = useState(null);

    const handleAccept = (id) => setStatuses((prev) => ({ ...prev, [id]: "accepted" }));
    const handleReject = (id) => setStatuses((prev) => ({ ...prev, [id]: "rejected" }));
    const handleUndo = (id) => setStatuses((prev) => ({ ...prev, [id]: "pending" }));
    const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

    const filtered = initialApplications.filter((a) =>
        activeFilter === "all" ? true : statuses[a.id] === activeFilter
    );

    const counts = {
        all: initialApplications.length,
        pending: initialApplications.filter((a) => statuses[a.id] === "pending").length,
        accepted: initialApplications.filter((a) => statuses[a.id] === "accepted").length,
        rejected: initialApplications.filter((a) => statuses[a.id] === "rejected").length,
    };

    return (
        <AgentLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Applications</span>
            </p>

            <h1 className="text-white font-bold mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                Applications
            </h1>
            <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                Review and manage applications from teenlancers
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
                {["all", "pending", "accepted", "rejected"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all capitalize flex items-center gap-2"
                        style={{
                            background: activeFilter === filter ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.05)",
                            color: activeFilter === filter ? "white" : "#B2B2D2",
                            border: activeFilter === filter ? "none" : "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {filter}
                        <span
                            className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                            style={{
                                background: activeFilter === filter ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                                color: activeFilter === filter ? "white" : "#B2B2D2",
                            }}
                        >
                            {counts[filter]}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {filtered.length === 0 ? (
                    <div className="text-center py-16" style={{ color: "#B2B2D2" }}>
                        <p className="text-4xl mb-4">📭</p>
                        <p className="text-sm">No {activeFilter} applications yet</p>
                    </div>
                ) : (
                    filtered.map((app) => {
                        const status = statuses[app.id];
                        const isExpanded = expanded === app.id;
                        return (
                            <div
                                key={app.id}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <img
                                        src={app.applicant.img}
                                        alt={app.applicant.name}
                                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                        style={{ border: "2px solid #FFC085" }}
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <p className="text-white font-semibold text-sm">{app.applicant.name}</p>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full"
                                                style={{ background: "rgba(255,255,255,0.08)", color: "#B2B2D2" }}
                                            >
                                                {app.applicant.role}
                                            </span>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                style={{ background: statusStyles[status].bg, color: statusStyles[status].color }}
                                            >
                                                {statusStyles[status].label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#B2B2D2" }}>
                                            <span>{"⭐ " + app.applicant.rating}</span>
                                            <span>{"✅ " + app.applicant.completedGigs + " gigs done"}</span>
                                            <span>{"📅 " + app.appliedDate}</span>
                                        </div>
                                        <p className="text-xs mt-1" style={{ color: "#FFC085" }}>
                                            {"For: " + app.gigTitle}
                                        </p>
                                    </div>

                                    <div className="flex flex-row sm:flex-col gap-4 sm:gap-1 sm:text-right flex-shrink-0">
                                        <div>
                                            <p className="text-xs" style={{ color: "#B2B2D2" }}>Proposed Rate</p>
                                            <p className="text-white font-bold">{app.proposedRate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs" style={{ color: "#B2B2D2" }}>Timeline</p>
                                            <p className="text-white text-sm">{app.timeline}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleExpand(app.id)}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                                        style={{ color: "#B2B2D2" }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div
                                        className="px-5 pb-5 flex flex-col gap-4"
                                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <div className="pt-4">
                                            <p className="text-xs font-medium mb-2" style={{ color: "#FFC085" }}>
                                                Intro Message
                                            </p>
                                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                                {app.message}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {app.portfolioLink && (
                                                <button
                                                    onClick={() => window.open(app.portfolioLink, "_blank")}
                                                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                                    className="flex items-center gap-2 text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                                                >
                                                    {"🔗 View Portfolio"}
                                                </button>
                                            )}
                                            {app.file && (
                                                <button
                                                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                                    className="flex items-center gap-2 text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                                                >
                                                    {"📎 " + app.file}
                                                </button>
                                            )}
                                        </div>

                                        {status === "pending" && (
                                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                <button
                                                    onClick={() => handleAccept(app.id)}
                                                    className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                                    style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)" }}
                                                >
                                                    {"✓ Accept Application"}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(app.id)}
                                                    className="flex-1 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-all"
                                                    style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
                                                >
                                                    {"✕ Reject Application"}
                                                </button>
                                            </div>
                                        )}

                                        {status === "accepted" && (
                                            <div className="flex items-center gap-2 text-sm" style={{ color: "#4ade80" }}>
                                                <span>{"✓ You accepted this application"}</span>
                                            </div>
                                        )}

                                        {status === "rejected" && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm" style={{ color: "#f87171" }}>
                                                    <span>{"✕ You rejected this application"}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleUndo(app.id)}
                                                    className="text-xs px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                                                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                                >
                                                    Undo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                                }
                            </div>
                        );
                    })
                )}
            </div>
        </AgentLayout >
    );
}