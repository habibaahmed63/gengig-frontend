import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

const STATUS_COLORS = {
    active: { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", text: "#4ade80", label: "Active" },
    closed: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", text: "#f87171", label: "Closed" },
    draft: { bg: "rgba(178,178,210,0.1)", border: "rgba(178,178,210,0.2)", text: "#B2B2D2", label: "Draft" },
    completed: { bg: "rgba(99,179,237,0.1)", border: "rgba(99,179,237,0.3)", text: "#63b3ed", label: "Completed" },
};

const APP_STATUS_COLORS = {
    pending: { text: "#FFC085", bg: "rgba(255,192,133,0.1)", label: "Pending" },
    accepted: { text: "#4ade80", bg: "rgba(74,222,128,0.1)", label: "Accepted" },
    rejected: { text: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Rejected" },
};

const FILTERS = ["All", "Active", "Closed", "Completed", "Draft"];

export default function MyGigs() {
    const navigate = useNavigate();

    // ── list state ────────────────────────────────────────────────
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    // ── detail drawer state ───────────────────────────────────────
    const [selectedGig, setSelectedGig] = useState(null);
    const [gigDetail, setGigDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [actionLoading, setActionLoading] = useState({});
    const [confirmClose, setConfirmClose] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);

    // ── fetch all gigs for this agent ─────────────────────────────
    const fetchGigs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/agent/gigs");
            setGigs(res.data);

        } catch (err) {
            console.error("Failed to fetch gigs:", err);
            setGigs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchGigs(); }, [fetchGigs]);

    // ── fetch single gig detail + applications ────────────────────
    const openGig = async (gig) => {
        setSelectedGig(gig);
        setActiveTab("overview");
        setDetailLoading(true);
        setConfirmClose(false);
        setGigDetail(null);
        try {
            const [gigRes, appsRes] = await Promise.all([
                api.get(`/agent/gigs/${gig.id}`),
                api.get(`/agent/gigs/${gig.id}/applications`),
            ]);
            setGigDetail({ ...gigRes.data, applications: appsRes.data });
        } catch (err) {
            console.error("Failed to fetch gig detail:", err);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setSelectedGig(null);
        setGigDetail(null);
    };

    // ── accept / reject / undo application ───────────────────────
    const handleAction = async (appId, action) => {
        setActionLoading(prev => ({ ...prev, [appId]: action }));
        try {
            if (action === "accept") await api.put(`/applications/${appId}/accept`);
            if (action === "reject") await api.put(`/applications/${appId}/reject`);
            if (action === "reset") await api.put(`/applications/${appId}/reset`);

        } catch (err) {
            console.error("Application action failed:", err);
        } finally {
            setActionLoading(prev => ({ ...prev, [appId]: null }));
        }
    };

    // ── close / reopen gig ────────────────────────────────────────
    const handleToggleGigStatus = async () => {
        const newStatus = selectedGig.status === "active" ? "closed" : "active";
        setStatusUpdating(true);
        try {
            await api.put(`/agent/gigs/${selectedGig.id}/status`, { status: newStatus });

        } catch (err) {
            console.error("Failed to update gig status:", err);
        } finally {
            setStatusUpdating(false);
        }
    };

    // ── filtering & searching ─────────────────────────────────────
    const filtered = gigs.filter(g => {
        const matchesFilter = filter === "All" || g.status === filter.toLowerCase();
        const matchesSearch = !search.trim() ||
            g.title?.toLowerCase().includes(search.toLowerCase()) ||
            g.category?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // ── summary stats — all computed from real gigs array ─────────
    const totalApps = gigs.reduce((s, g) => s + (g.applications ?? 0), 0);
    const totalViews = gigs.reduce((s, g) => s + (g.views ?? 0), 0);
    const activeCount = gigs.filter(g => g.status === "active").length;

    // ─────────────────────────────────────────────────────────────
    return (
        <AgentLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › <span style={{ color: "#FFC085" }}>My Gigs</span>
            </p>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-white font-bold text-2xl">My Posted Gigs</h1>
                    <p className="text-sm mt-1" style={{ color: "#B2B2D2" }}>
                        Manage your gigs, review applications and track interactions
                    </p>
                </div>
                <button
                    onClick={() => navigate("/post")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity self-start sm:self-auto"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                >
                    + Post New Gig
                </button>
            </div>

            {/* Summary stats — dynamic from gigs array */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 rounded-2xl animate-pulse"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", height: "80px" }} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Gigs", value: gigs.length, icon: "📋" },
                        { label: "Active", value: activeCount, icon: "🟢" },
                        { label: "Applications", value: totalApps, icon: "👥" },
                        { label: "Total Views", value: totalViews, icon: "👁️" },
                    ].map(stat => (
                        <div key={stat.label} className="p-4 rounded-2xl"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex items-center gap-2 mb-1">
                                <span>{stat.icon}</span>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</p>
                            </div>
                            <p className="text-2xl font-bold"
                                style={{ color: stat.value === 0 ? "rgba(178,178,210,0.5)" : "#FFC085" }}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search your gigs..."
                        className="flex-1 bg-transparent text-white text-sm outline-none"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} style={{ color: "#B2B2D2" }}>✕</button>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className="px-4 py-2 rounded-full text-xs font-medium transition-all"
                            style={{
                                background: filter === f ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.06)",
                                color: filter === f ? "white" : "#B2B2D2",
                                border: filter === f ? "none" : "1px solid rgba(255,255,255,0.08)",
                            }}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gigs list */}
            {loading ? (
                <div className="flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-5 rounded-2xl animate-pulse"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", height: "120px" }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                    style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <span className="text-5xl mb-4">📋</span>
                    <p className="text-white font-semibold text-lg mb-2">
                        {search || filter !== "All" ? "No matching gigs" : "You haven't posted any gigs yet"}
                    </p>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                        {search || filter !== "All"
                            ? "Try different search terms or filters"
                            : "Post your first gig and start finding talented teenlancers!"}
                    </p>
                    {!search && filter === "All" && (
                        <button onClick={() => navigate("/post")}
                            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            + Post Your First Gig
                        </button>
                    )}
                    {(search || filter !== "All") && (
                        <button onClick={() => { setSearch(""); setFilter("All"); }}
                            className="px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map(gig => {
                        const s = STATUS_COLORS[gig.status] || STATUS_COLORS.draft;
                        const appCount = gig.applications ?? 0;
                        return (
                            <div key={gig.id}
                                className="p-5 rounded-2xl cursor-pointer transition-all group"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                                onClick={() => openGig(gig)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="text-xs px-2.5 py-1 rounded-full"
                                                style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085" }}>
                                                {gig.category}
                                            </span>
                                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                                                style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                                                ● {s.label}
                                            </span>
                                            {gig.postedDate && (
                                                <span className="text-xs" style={{ color: "#B2B2D2" }}>{gig.postedDate}</span>
                                            )}
                                        </div>
                                        <h3 className="text-white font-semibold text-base mb-2 group-hover:text-[#FFC085] transition-colors">
                                            {gig.title}
                                        </h3>
                                        {gig.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {gig.skills.slice(0, 3).map(skill => (
                                                    <span key={skill} className="text-xs px-2 py-0.5 rounded-full"
                                                        style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                                {gig.skills.length > 3 && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full"
                                                        style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2" }}>
                                                        +{gig.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 flex-shrink-0">
                                        {gig.budget && (
                                            <span className="text-xl font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>
                                        )}
                                        <div className="flex items-center gap-3 text-xs" style={{ color: "#B2B2D2" }}>
                                            <span>👥 {appCount}</span>
                                            {gig.views != null && <span>👁️ {gig.views}</span>}
                                            {gig.saves != null && <span>🔖 {gig.saves}</span>}
                                        </div>
                                        {gig.deadline && (
                                            <span className="text-xs" style={{ color: "#B2B2D2" }}>⏱ {gig.deadline}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-3"
                                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>
                                        {appCount} teenlancer{appCount !== 1 ? "s" : ""} applied
                                    </span>
                                    <span className="text-xs font-medium group-hover:underline" style={{ color: "#FFC085" }}>
                                        View details →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── GIG DETAIL DRAWER ──────────────────────────────────── */}
            {selectedGig && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={closeDetail} />
                    <div className="w-full max-w-2xl flex flex-col overflow-hidden"
                        style={{ background: "#090c28", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>

                        {/* Drawer header */}
                        <div className="flex items-start justify-between p-6 flex-shrink-0"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-xs px-2.5 py-1 rounded-full"
                                        style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085" }}>
                                        {selectedGig.category}
                                    </span>
                                    {(() => {
                                        const s = STATUS_COLORS[selectedGig.status] || STATUS_COLORS.draft;
                                        return (
                                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                                                style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                                                ● {s.label}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <h2 className="text-white font-bold text-lg leading-snug">{selectedGig.title}</h2>
                                {selectedGig.postedDate && (
                                    <p className="text-xs mt-1" style={{ color: "#B2B2D2" }}>Posted {selectedGig.postedDate}</p>
                                )}
                            </div>
                            <button onClick={closeDetail}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                                style={{ color: "#B2B2D2" }}>
                                ✕
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-shrink-0"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            {["overview", "applications", "timeline"].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className="flex-1 py-3 text-sm font-medium capitalize transition-colors"
                                    style={{
                                        color: activeTab === tab ? "#FFC085" : "#B2B2D2",
                                        borderBottom: activeTab === tab ? "2px solid #FFC085" : "2px solid transparent",
                                    }}>
                                    {tab}
                                    {tab === "applications" && gigDetail && (
                                        <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                                            style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                            {gigDetail.applications?.length ?? 0}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Drawer body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {detailLoading ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-10 h-10 rounded-full border-2 animate-spin"
                                        style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                                </div>
                            ) : gigDetail ? (
                                <>
                                    {/* ── OVERVIEW TAB ── */}
                                    {activeTab === "overview" && (
                                        <div className="flex flex-col gap-5">
                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { label: "Applications", value: gigDetail.applications?.length ?? 0, icon: "👥" },
                                                    { label: "Views", value: gigDetail.views ?? "—", icon: "👁️" },
                                                    { label: "Saves", value: gigDetail.saves ?? "—", icon: "🔖" },
                                                ].map(s => (
                                                    <div key={s.label} className="p-4 rounded-xl text-center"
                                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                        <span className="text-xl mb-1 block">{s.icon}</span>
                                                        <p className="text-xl font-bold" style={{ color: "#FFC085" }}>{s.value}</p>
                                                        <p className="text-xs mt-0.5" style={{ color: "#B2B2D2" }}>{s.label}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Application status breakdown — only if there are applications */}
                                            {(gigDetail.applications?.length ?? 0) > 0 && (
                                                <div className="p-4 rounded-xl"
                                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                    <p className="text-sm font-semibold text-white mb-3">Application Breakdown</p>
                                                    {["pending", "accepted", "rejected"].map(status => {
                                                        const count = gigDetail.applications.filter(a => a.status === status).length;
                                                        const total = gigDetail.applications.length;
                                                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                                        const s = APP_STATUS_COLORS[status];
                                                        return (
                                                            <div key={status} className="flex items-center gap-3 mb-2">
                                                                <span className="text-xs w-16 capitalize" style={{ color: s.text }}>{status}</span>
                                                                <div className="flex-1 h-2 rounded-full overflow-hidden"
                                                                    style={{ background: "rgba(255,255,255,0.08)" }}>
                                                                    <div className="h-full rounded-full transition-all duration-500"
                                                                        style={{ width: `${pct}%`, background: s.text }} />
                                                                </div>
                                                                <span className="text-xs w-4 text-right" style={{ color: "#B2B2D2" }}>{count}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Gig details */}
                                            <div className="p-4 rounded-xl"
                                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                <p className="text-sm font-semibold text-white mb-3">Gig Details</p>
                                                <div className="flex flex-col gap-3">
                                                    {gigDetail.budget && (
                                                        <div className="flex justify-between">
                                                            <span className="text-xs" style={{ color: "#B2B2D2" }}>Budget</span>
                                                            <span className="text-sm font-semibold text-white">{gigDetail.budget}</span>
                                                        </div>
                                                    )}
                                                    {gigDetail.deadline && (
                                                        <div className="flex justify-between">
                                                            <span className="text-xs" style={{ color: "#B2B2D2" }}>Deadline</span>
                                                            <span className="text-sm font-semibold text-white">{gigDetail.deadline}</span>
                                                        </div>
                                                    )}
                                                    {gigDetail.skills?.length > 0 && (
                                                        <div>
                                                            <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>Skills Required</p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {gigDetail.skills.map(skill => (
                                                                    <span key={skill} className="text-xs px-2.5 py-1 rounded-full"
                                                                        style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}>
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {gigDetail.description && (
                                                        <div>
                                                            <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>Description</p>
                                                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{gigDetail.description}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Gig actions */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate(`/post?edit=${gigDetail.id}`)}
                                                    className="flex-1 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                                                    style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>
                                                    ✏️ Edit Gig
                                                </button>
                                                {!confirmClose ? (
                                                    <button
                                                        onClick={() => setConfirmClose(true)}
                                                        disabled={statusUpdating}
                                                        className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                                                        style={{
                                                            background: selectedGig.status === "active" ? "rgba(248,113,113,0.1)" : "rgba(74,222,128,0.1)",
                                                            color: selectedGig.status === "active" ? "#f87171" : "#4ade80",
                                                            border: `1px solid ${selectedGig.status === "active" ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)"}`,
                                                        }}>
                                                        {selectedGig.status === "active" ? "🔒 Close Gig" : "🔓 Reopen Gig"}
                                                    </button>
                                                ) : (
                                                    <div className="flex-1 flex gap-2">
                                                        <button onClick={handleToggleGigStatus} disabled={statusUpdating}
                                                            className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1"
                                                            style={{ background: "#f87171" }}>
                                                            {statusUpdating
                                                                ? <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
                                                                : "Confirm"}
                                                        </button>
                                                        <button onClick={() => setConfirmClose(false)}
                                                            className="flex-1 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                                                            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── APPLICATIONS TAB ── */}
                                    {activeTab === "applications" && (
                                        <div className="flex flex-col gap-4">
                                            {!gigDetail.applications || gigDetail.applications.length === 0 ? (
                                                <div className="flex flex-col items-center py-16 rounded-2xl"
                                                    style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                                                    <span className="text-4xl mb-3">📭</span>
                                                    <p className="text-white font-semibold mb-1">No applications yet</p>
                                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                                        Once teenlancers apply, they will appear here.
                                                    </p>
                                                </div>
                                            ) : gigDetail.applications.map(app => {
                                                const s = APP_STATUS_COLORS[app.status] || APP_STATUS_COLORS.pending;
                                                return (
                                                    <div key={app.id} className="p-5 rounded-2xl flex flex-col gap-4"
                                                        style={{
                                                            background: "rgba(255,255,255,0.04)",
                                                            border: `1px solid ${app.status === "accepted" ? "rgba(74,222,128,0.25)"
                                                                : app.status === "rejected" ? "rgba(248,113,113,0.15)"
                                                                    : "rgba(255,255,255,0.08)"
                                                                }`,
                                                        }}>

                                                        {/* Applicant header */}
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                                style={{ background: "rgba(255,192,133,0.15)", border: "2px solid rgba(255,192,133,0.3)" }}>
                                                                {app.photo ? (
                                                                    <img src={app.photo} alt="" className="w-full h-full object-cover rounded-full" />
                                                                ) : (
                                                                    <span className="font-bold text-sm" style={{ color: "#FFC085" }}>
                                                                        {app.name?.charAt(0) || "?"}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <p className="text-white font-semibold text-sm">{app.name}</p>
                                                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                                        style={{ background: s.bg, color: s.text }}>
                                                                        {s.label}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: "#B2B2D2" }}>
                                                                    {app.rating != null && <span>⭐ {app.rating}</span>}
                                                                    {app.completedGigs != null && <span>✅ {app.completedGigs} gigs</span>}
                                                                    {app.availability && <span>🕐 {app.availability}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                {app.proposedRate && <p className="text-sm font-bold" style={{ color: "#FFC085" }}>{app.proposedRate}</p>}
                                                                {app.timeline && <p className="text-xs" style={{ color: "#B2B2D2" }}>in {app.timeline}</p>}
                                                            </div>
                                                        </div>

                                                        {/* Message */}
                                                        {app.message && (
                                                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{app.message}</p>
                                                        )}

                                                        {/* Skills */}
                                                        {app.skills?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {app.skills.map(skill => (
                                                                    <span key={skill} className="text-xs px-2.5 py-1 rounded-full"
                                                                        style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between pt-3"
                                                            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                                            <span className="text-xs" style={{ color: "#B2B2D2" }}>
                                                                {app.appliedDate ? `Applied ${app.appliedDate}` : ""}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                {app.status !== "accepted" && (
                                                                    <button
                                                                        onClick={() => handleAction(app.id, "accept")}
                                                                        disabled={!!actionLoading[app.id]}
                                                                        className="px-4 py-1.5 rounded-full text-xs font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                                                        style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)" }}>
                                                                        {actionLoading[app.id] === "accept" ? "..." : "✓ Accept"}
                                                                    </button>
                                                                )}
                                                                {app.status !== "rejected" && (
                                                                    <button
                                                                        onClick={() => handleAction(app.id, "reject")}
                                                                        disabled={!!actionLoading[app.id]}
                                                                        className="px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                                                        style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                                                                        {actionLoading[app.id] === "reject" ? "..." : "✕ Reject"}
                                                                    </button>
                                                                )}
                                                                {(app.status === "accepted" || app.status === "rejected") && (
                                                                    <button
                                                                        onClick={() => handleAction(app.id, "reset")}
                                                                        disabled={!!actionLoading[app.id]}
                                                                        className="px-4 py-1.5 rounded-full text-xs hover:opacity-80 transition-opacity disabled:opacity-50"
                                                                        style={{ color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                                        {actionLoading[app.id] === "reset" ? "..." : "↩ Undo"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* ── TIMELINE TAB ── */}
                                    {activeTab === "timeline" && (
                                        <div className="flex flex-col gap-0">
                                            {!gigDetail.timeline || gigDetail.timeline.length === 0 ? (
                                                <div className="flex flex-col items-center py-16">
                                                    <span className="text-4xl mb-3">📅</span>
                                                    <p className="text-white font-semibold mb-1">No activity yet</p>
                                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Timeline events will appear here as things happen.</p>
                                                </div>
                                            ) : gigDetail.timeline.map((event, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                                                            style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}>
                                                            {event.icon}
                                                        </div>
                                                        {i < gigDetail.timeline.length - 1 && (
                                                            <div className="w-px flex-1 my-1" style={{ background: "rgba(255,255,255,0.08)", minHeight: "24px" }} />
                                                        )}
                                                    </div>
                                                    <div className="pb-6 pt-1.5">
                                                        <p className="text-white text-sm font-medium">{event.event}</p>
                                                        <p className="text-xs mt-0.5" style={{ color: "#B2B2D2" }}>{event.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex justify-center py-20">
                                    <p className="text-sm" style={{ color: "#B2B2D2" }}>Failed to load gig details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AgentLayout>
    );
}