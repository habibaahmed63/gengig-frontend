import { useState, useEffect } from "react";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

const statusStyles = {
    pending: { bg: "rgba(255,192,133,0.15)", color: "#FFC085", label: "Pending" },
    accepted: { bg: "rgba(74,222,128,0.15)", color: "#4ade80", label: "Accepted" },
    rejected: { bg: "rgba(248,113,113,0.15)", color: "#f87171", label: "Rejected" },
};

export default function AgentApplications() {
    const [applications, setApplications] = useState([]);
    const [statuses, setStatuses] = useState({});
    const [activeFilter, setActiveFilter] = useState("all");
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            try {
                // TODO: Replace with real API call: GET /agent/applications
                // const response = await api.get("/agent/applications");
                // const data = response.data;
                // setApplications(data);
                // setStatuses(Object.fromEntries(data.map((a) => [a.id, a.status])));

                // Mock data until backend is ready
                const mock = [
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
                setApplications(mock);
                setStatuses(Object.fromEntries(mock.map((a) => [a.id, a.status])));
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const handleAccept = async (id) => {
        setActionLoading(id + "-accept");
        try {
            // TODO: Replace with API call: PUT /applications/:id/accept
            // await api.put(`/applications/${id}/accept`);
            setStatuses((prev) => ({ ...prev, [id]: "accepted" }));
        } catch (err) {
            console.error("Failed to accept:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(id + "-reject");
        try {
            // TODO: Replace with API call: PUT /applications/:id/reject
            // await api.put(`/applications/${id}/reject`);
            setStatuses((prev) => ({ ...prev, [id]: "rejected" }));
        } catch (err) {
            console.error("Failed to reject:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUndo = async (id) => {
        setActionLoading(id + "-undo");
        try {
            // TODO: Replace with API call: PUT /applications/:id/reset
            // await api.put(`/applications/${id}/reset`);
            setStatuses((prev) => ({ ...prev, [id]: "pending" }));
        } catch (err) {
            console.error("Failed to undo:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

    const filtered = applications.filter((a) =>
        activeFilter === "all" ? true : statuses[a.id] === activeFilter
    );

    const counts = {
        all: applications.length,
        pending: applications.filter((a) => statuses[a.id] === "pending").length,
        accepted: applications.filter((a) => statuses[a.id] === "accepted").length,
        rejected: applications.filter((a) => statuses[a.id] === "rejected").length,
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

            {/* Filter Tabs */}
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

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                    <p className="text-sm" style={{ color: "#B2B2D2" }}>Loading applications...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-20 rounded-2xl"
                            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
                        >
                            <p className="text-4xl mb-4">📭</p>
                            <p className="text-sm mb-1 font-medium text-white">No {activeFilter === "all" ? "" : activeFilter} applications yet</p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                {activeFilter === "all"
                                    ? "Applications will appear here once teenlancers apply to your gigs."
                                    : "No applications with this status yet."}
                            </p>
                        </div>
                    ) : (
                        filtered.map((app) => {
                            const status = statuses[app.id];
                            const isExpanded = expanded === app.id;
                            return (
                                <div
                                    key={app.id}
                                    className="rounded-2xl overflow-hidden transition-all"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: isExpanded ? "1px solid rgba(255,192,133,0.2)" : "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    {/* Card Header */}
                                    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">

                                        {/* Avatar */}
                                        <div
                                            className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                            style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                                        >
                                            {app.applicant.img ? (
                                                <img src={app.applicant.img} alt={app.applicant.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <p className="text-white font-semibold text-sm">{app.applicant.name}</p>
                                                {app.applicant.role && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "#B2B2D2" }}>
                                                        {app.applicant.role}
                                                    </span>
                                                )}
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusStyles[status].bg, color: statusStyles[status].color }}>
                                                    {statusStyles[status].label}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#B2B2D2" }}>
                                                {app.applicant.rating && <span>{"⭐ " + app.applicant.rating}</span>}
                                                {app.applicant.completedGigs !== undefined && <span>{"✅ " + app.applicant.completedGigs + " gigs done"}</span>}
                                                {app.appliedDate && <span>{"📅 " + app.appliedDate}</span>}
                                            </div>
                                            {app.gigTitle && (
                                                <p className="text-xs mt-1" style={{ color: "#FFC085" }}>{"For: " + app.gigTitle}</p>
                                            )}
                                        </div>

                                        {/* Rate + Timeline */}
                                        <div className="flex flex-row sm:flex-col gap-4 sm:gap-1 sm:text-right flex-shrink-0">
                                            {app.proposedRate && (
                                                <div>
                                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Proposed Rate</p>
                                                    <p className="text-white font-bold">{app.proposedRate}</p>
                                                </div>
                                            )}
                                            {app.timeline && (
                                                <div>
                                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Timeline</p>
                                                    <p className="text-white text-sm">{app.timeline}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expand Toggle */}
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

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-5 pb-5 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

                                            {/* Message */}
                                            {app.message && (
                                                <div className="pt-4">
                                                    <p className="text-xs font-medium mb-2" style={{ color: "#FFC085" }}>Intro Message</p>
                                                    <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{app.message}</p>
                                                </div>
                                            )}

                                            {/* Portfolio + File */}
                                            <div className="flex flex-wrap gap-3">
                                                {app.portfolioLink && (
                                                    <button
                                                        onClick={() => { window.open(app.portfolioLink); }}
                                                        className="flex items-center gap-2 text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                                                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                                    >
                                                        {"🔗 View Portfolio"}
                                                    </button>
                                                )}
                                                {app.file && (
                                                    <button
                                                        className="flex items-center gap-2 text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                                                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                                    >
                                                        {"📎 " + app.file}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            {status === "pending" && (
                                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                    <button
                                                        onClick={() => handleAccept(app.id)}
                                                        disabled={actionLoading === app.id + "-accept"}
                                                        className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                                        style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)" }}
                                                    >
                                                        {actionLoading === app.id + "-accept" ? "Accepting..." : "✓ Accept Application"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(app.id)}
                                                        disabled={actionLoading === app.id + "-reject"}
                                                        className="flex-1 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
                                                        style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
                                                    >
                                                        {actionLoading === app.id + "-reject" ? "Rejecting..." : "✕ Reject Application"}
                                                    </button>
                                                </div>
                                            )}

                                            {status === "accepted" && (
                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-2 text-sm" style={{ color: "#4ade80" }}>
                                                        <span>✓ You accepted this application</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUndo(app.id)}
                                                        disabled={actionLoading === app.id + "-undo"}
                                                        className="text-xs px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                                                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                                    >
                                                        {actionLoading === app.id + "-undo" ? "..." : "Undo"}
                                                    </button>
                                                </div>
                                            )}

                                            {status === "rejected" && (
                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-2 text-sm" style={{ color: "#f87171" }}>
                                                        <span>✕ You rejected this application</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUndo(app.id)}
                                                        disabled={actionLoading === app.id + "-undo"}
                                                        className="text-xs px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                                                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                                    >
                                                        {actionLoading === app.id + "-undo" ? "..." : "Undo"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </AgentLayout>
    );
}