import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg flex items-center gap-2"
            style={{ background: toast.type === "error" ? "rgba(248,113,113,0.95)" : "linear-gradient(90deg, #FFC085, #e8a060)" }}>
            <span>{toast.type === "error" ? "✕" : "✓"}</span>
            {toast.message}
        </div>
    );
}

export default function AgentApplications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState("all");
    const [gigFilter, setGigFilter] = useState("all");
    const [expandedApp, setExpandedApp] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => { fetchApplications(); }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await api.get("/agent/applications");
            setApplications(res.data);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (applicationId, applicantName) => {
        setActionLoading(applicationId + "_accept");
        try {
            await api.put(`/agent/applications/${applicationId}/accept`);
            setApplications(prev => prev.map(a =>
                (a.id || a._id) === applicationId ? { ...a, status: "accepted" } : a
            ));
            showToast(`✓ Accepted! ${applicantName} has been notified.`);
        } catch (err) {
            console.error("Failed to accept:", err);
            showToast("Failed to accept. Please try again.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (applicationId, applicantName) => {
        setActionLoading(applicationId + "_reject");
        try {
            await api.put(`/agent/applications/${applicationId}/reject`);
            setApplications(prev => prev.map(a =>
                (a.id || a._id) === applicationId ? { ...a, status: "rejected" } : a
            ));
            showToast(`Application from ${applicantName} rejected.`);
        } catch (err) {
            console.error("Failed to reject:", err);
            showToast("Failed to reject. Please try again.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const statusStyle = {
        pending: { bg: "rgba(255,192,133,0.1)", color: "#FFC085", label: "Pending" },
        accepted: { bg: "rgba(74,222,128,0.1)", color: "#4ade80", label: "Accepted" },
        rejected: { bg: "rgba(248,113,113,0.1)", color: "#f87171", label: "Rejected" },
    };

    const uniqueGigs = ["all", ...new Set(applications.map(a => a.gigTitle).filter(Boolean))];

    const filtered = applications.filter(a => {
        const matchStatus = filter === "all" || a.status === filter;
        const matchGig = gigFilter === "all" || a.gigTitle === gigFilter;
        return matchStatus && matchGig;
    });

    const counts = {
        all: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        accepted: applications.filter(a => a.status === "accepted").length,
        rejected: applications.filter(a => a.status === "rejected").length,
    };

    return (
        <AgentLayout>
            <Toast toast={toast} />

            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                <Link to="/home" className="hover:text-[#FFC085] transition-colors">Home</Link>
                {" › "}
                <Link to="/agent/profile" className="hover:text-[#FFC085] transition-colors">Profile</Link>
                {" › "}
                <span style={{ color: "#FFC085" }}>Applications</span>
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-white font-bold text-2xl tracking-tight">Applications</h1>
                    <p className="text-sm mt-1" style={{ color: "#B2B2D2" }}>
                        {filtered.length} application{filtered.length !== 1 ? "s" : ""}
                        {counts.pending > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs"
                                style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                {counts.pending} pending review
                            </span>
                        )}
                    </p>
                </div>
                <button onClick={() => navigate("/post")}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    + Post New Gig
                </button>
            </div>

            {!loading && applications.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total", value: counts.all, color: "#B2B2D2" },
                        { label: "Pending", value: counts.pending, color: "#FFC085" },
                        { label: "Accepted", value: counts.accepted, color: "#4ade80" },
                        { label: "Rejected", value: counts.rejected, color: "#f87171" },
                    ].map(s => (
                        <div key={s.label} className="p-4 rounded-2xl text-center"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex gap-2 flex-wrap">
                    {["all", "pending", "accepted", "rejected"].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className="px-4 py-2 rounded-xl text-xs font-medium transition-all capitalize"
                            style={{
                                background: filter === f ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.06)",
                                color: filter === f ? "white" : "#B2B2D2",
                                border: filter === f ? "none" : "1px solid rgba(255,255,255,0.1)",
                            }}>
                            {f === "all" ? "All Status" : f.charAt(0).toUpperCase() + f.slice(1)}
                            {f !== "all" && counts[f] > 0 && (
                                <span className="ml-1.5 opacity-80">({counts[f]})</span>
                            )}
                        </button>
                    ))}
                </div>

                {uniqueGigs.length > 2 && (
                    <select value={gigFilter} onChange={e => setGigFilter(e.target.value)}
                        className="rounded-xl px-4 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-[#FFC085] sm:ml-auto"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {uniqueGigs.map(g => (
                            <option key={g} value={g} style={{ background: "#060834" }}>
                                {g === "all" ? "All Gigs" : g}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                </div>

            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
                    style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <p className="text-3xl mb-3">📭</p>
                    <p className="text-white font-medium mb-1">No applications found</p>
                    <p className="text-sm mb-4" style={{ color: "#B2B2D2" }}>
                        {filter === "all" && gigFilter === "all"
                            ? "Applications will appear here when teenlancers apply to your gigs."
                            : "No applications match your current filters."}
                    </p>
                    {filter === "all" && gigFilter === "all" && (
                        <button onClick={() => navigate("/post")}
                            className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Post a Gig
                        </button>
                    )}
                </div>

            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map(app => {
                        const appId = app._id || app._id;
                        const style = statusStyle[app.status] || statusStyle.pending;
                        const isExpanded = expandedApp === appId;
                        const isAcceptLoading = actionLoading === appId + "_accept";
                        const isRejectLoading = actionLoading === appId + "_reject";

                        return (
                            <div key={appId} className="rounded-2xl overflow-hidden"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: app.status === "pending"
                                        ? "1px solid rgba(255,192,133,0.15)"
                                        : "1px solid rgba(255,255,255,0.08)",
                                }}>
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                                        <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                                            style={{ border: "2px solid rgba(255,192,133,0.4)", background: "rgba(255,192,133,0.1)" }}>
                                            {app.applicant?.photo ? (
                                                <img src={app.applicant.photo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-bold" style={{ color: "#FFC085" }}>
                                                    {app.applicant?.name?.charAt(0) || "?"}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <p className="text-white font-semibold">{app.applicant?.name || "Unknown Teenlancer"}</p>
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                    style={{ background: style.bg, color: style.color }}>
                                                    {style.label}
                                                </span>
                                            </div>
                                            <p className="text-xs mb-1" style={{ color: "#FFC085" }}>
                                                Applied for: <span className="font-medium">{app.gigTitle || "—"}</span>
                                            </p>
                                            {app.applicant?.skills?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {app.applicant.skills.slice(0, 3).map(s => (
                                                        <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                                                            style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2" }}>
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {app.appliedAt && (
                                                <p className="text-xs mt-1" style={{ color: "rgba(178,178,210,0.5)" }}>
                                                    Applied {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 flex-shrink-0">
                                            {app.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleAccept(appId, app.applicant?.name)}
                                                        disabled={isAcceptLoading || isRejectLoading}
                                                        className="px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5 justify-center"
                                                        style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
                                                        {isAcceptLoading ? (
                                                            <div className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                                                                style={{ borderColor: "#4ade80", borderTopColor: "transparent" }} />
                                                        ) : "✓"} Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(appId, app.applicant?.name)}
                                                        disabled={isAcceptLoading || isRejectLoading}
                                                        className="px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5 justify-center"
                                                        style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                                                        {isRejectLoading ? (
                                                            <div className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                                                                style={{ borderColor: "#f87171", borderTopColor: "transparent" }} />
                                                        ) : "✕"} Reject
                                                    </button>
                                                </>
                                            )}

                                            {app.status === "accepted" && (
                                                <button
                                                    onClick={() => navigate("/agent/chat", {
                                                        state: {
                                                            openContact: {
                                                                _id: app.applicant?._id || app.applicant?.id,
                                                                id: app.applicant?._id || app.applicant?.id,
                                                                name: app.applicant?.name,
                                                                photo: app.applicant?.photo,
                                                            }
                                                        }
                                                    })}
                                                    className="px-5 py-2 rounded-full text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                                    💬 Chat
                                                </button>
                                            )}

                                            {app.status === "rejected" && (
                                                <span className="text-xs px-4 py-2 text-center rounded-full"
                                                    style={{ background: "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.15)" }}>
                                                    Rejected
                                                </span>
                                            )}

                                            {(app.status === "work_submitted" || app.workSubmitted) && (
                                                <button
                                                    onClick={() => navigate(`/agent/reviewwork/${app._id}`)}
                                                    className="text-xs px-3 py-1.5 rounded-full font-medium text-white hover:opacity-90"
                                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                                    Review Work
                                                </button>
                                            )}
                                           
                                        

                                            {app.coverLetter && (
                                                <button onClick={() => setExpandedApp(isExpanded ? null : appId)}
                                                    className="text-xs text-center hover:opacity-80 transition-opacity"
                                                    style={{ color: "#B2B2D2" }}>
                                                    {isExpanded ? "Hide ▲" : "Read letter ▼"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {app.coverLetter && !isExpanded && (
                                        <p className="text-sm mt-3 leading-relaxed line-clamp-2" style={{ color: "#B2B2D2" }}>
                                            {app.coverLetter}
                                        </p>
                                    )}
                                </div>

                                {isExpanded && app.coverLetter && (
                                    <div className="px-5 pb-5 pt-0">
                                        <div className="p-4 rounded-xl"
                                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <p className="text-xs font-semibold mb-2" style={{ color: "#FFC085" }}>Cover Letter</p>
                                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                                {app.coverLetter}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </AgentLayout>
    );
}