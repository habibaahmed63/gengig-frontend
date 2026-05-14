import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";
import { useSearchParams } from "react-router-dom";

export default function TeenlancerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Teenlancer";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const [myApplications, setMyApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const revisionApps = myApplications.filter(a =>
    a.status === "revision_requested" ||
    a.status === "revision" ||
    a.workRejected === true
  );
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get("/teenlancer/stats"),
          api.get("/teenlancer/applications"),
        ]);
        setStats(statsRes.data);
        setMyApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setMyApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const acceptedApps = myApplications.filter(a => a.status === "accepted");
  const pendingApps = myApplications.filter(a => a.status === "pending");
  const rejectedApps = myApplications.filter(a => a.status === "rejected");
  const completedApps = myApplications.filter(a => a.status === "completed");

  const hasActivity = myApplications.length > 0;

  const statCards = [
    { label: "Applied", value: myApplications.length, color: "#B2B2D2" },
    { label: "Accepted", value: acceptedApps.length, color: "#4ade80" },
    { label: "Pending", value: pendingApps.length, color: "#FFC085" },
    { label: "Completed", value: completedApps.length, color: "#63b3ed" },
  ];

  const appStatusStyle = {
    accepted: { bg: "rgba(74,222,128,0.1)", color: "#4ade80", label: "Accepted" },
    rejected: { bg: "rgba(248,113,113,0.1)", color: "#f87171", label: "Rejected" },
    pending: { bg: "rgba(255,192,133,0.1)", color: "#FFC085", label: "Pending" },
    completed: { bg: "rgba(99,179,237,0.1)", color: "#63b3ed", label: "Completed" },
  };

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("tab") === "revisions") {
      setActiveTab("revisions");
    }
  }, [searchParams]);

  const AppCard = ({ app }) => {
    const style = appStatusStyle[app.status] || appStatusStyle.pending;
    const gigTitle = app.gigTitle || app.gig?.title || "Untitled Gig";
    const agentName = app.agentName || app.agent?.name || "—";
    return (
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate mb-0.5">{gigTitle}</p>
          <p className="text-xs" style={{ color: "#B2B2D2" }}>
            by {agentName}
            {app.appliedAt && (
              " · Applied " + new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: style.bg, color: style.color }}>
            {style.label}
          </span>
          {app.status === "accepted" && (
            <button
              onClick={() => navigate("/teenlancer/chat", {
                state: {
                  openContact: {
                    id: app.agentId || app.agent?._id,
                    name: app.agentName || app.agent?.name,
                    photo: app.agentPhoto || app.agent?.photo,
                  }
                }
              })}
              className="text-xs px-3 py-1.5 rounded-full font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
              💬 Chat
            </button>
          )}
          {app.status === "accepted" && (
            <button
              onClick={() => navigate(`/teenlancer/submitwork/${app._id || app.id}`)}
              className="text-xs px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity"
              style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}>
              📤 Submit Work
            </button>
          )}
          {app.status === "rejected" && (
            <button onClick={() => navigate("/Exploreagig")}
              className="text-xs px-3 py-1.5 rounded-full font-medium hover:opacity-80 transition-opacity"
              style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.1)" }}>
              Find More
            </button>
          )}
          {(app.status === "revision_requested" || app.status === "revision" || app.workRejected) && (
            <button
              onClick={() => navigate(
                `/teenlancer/submitwork/${app._id || app.id}?revision=true&reason=${encodeURIComponent(app.revisionReason || app.rejectionReason || "")}`
              )}
              className="text-xs px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity"
              style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}>
              📝 Submit Revision
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <TeenlancerLayout>
      <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
        <Link to="/teenlancer/dashboard" className="hover:text-[#FFC085] transition-colors">Home</Link>
        {" › "}
        <span style={{ color: "#FFC085" }}>Dashboard</span>
      </p>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-bold text-white mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            Welcome back, <span className="text-gradient">{name.split(" ")[0]}</span>
          </h1>
          <p className="text-sm" style={{ color: "#B2B2D2" }}>{dateStr} · {timeStr}</p>
        </div>

        <button onClick={() => navigate('/teenlancer/savedgigs')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.25)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Saved Gigs
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", height: "80px" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <div key={stat.label}
              className="p-5 rounded-2xl hover:scale-105 transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>{stat.label}</p>
              <p className="font-bold text-2xl tracking-tight"
                style={{ color: stat.value === 0 ? "#B2B2D2" : stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "#B2B2D2" }}>Loading your dashboard...</p>
        </div>
      ) : !hasActivity ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ background: "#FFC085" }} />
            <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
              style={{ background: "rgba(255,192,133,0.1)", border: "2px solid rgba(255,192,133,0.3)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none"
                viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-white font-bold text-xl mb-2">No activity yet</h2>
          <p className="text-sm mb-2 max-w-sm" style={{ color: "#B2B2D2" }}>
            You haven't applied to any gigs yet. Start exploring and find your first project!
          </p>
          <p className="text-xs mb-8" style={{ color: "rgba(178,178,210,0.5)" }}>
            Once you apply, your applications will appear here with real-time status updates.
          </p>
          <button onClick={() => navigate("/Exploreagig")}
            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
            Explore Gigs
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full px-4">
            {[
              { title: "Complete your profile", desc: "A full profile gets 3x more attention from agents", action: () => navigate("/teenlancer/profile") },
              { title: "Browse gigs", desc: "Find gigs that match your skills and interests", action: () => navigate("/Exploreagig") },
              { title: "Apply with confidence", desc: "Write a clear cover letter to stand out", action: null },
            ].map(tip => (
              <div key={tip.title} onClick={tip.action || undefined}
                className={`p-4 rounded-2xl text-left transition-all duration-200 ${tip.action ? "cursor-pointer hover:scale-105" : ""}`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-white text-sm font-semibold mb-1">{tip.title}</p>
                <p className="text-xs" style={{ color: "#B2B2D2" }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── Tab Navigation ── */}
          {hasActivity && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {[
                { key: "overview", label: "Overview", count: null },
                { key: "applications", label: "My Applications", count: myApplications.length },
                {
                  key: "revisions", label: "Revisions Requested",
                  count: revisionApps.length,
                  highlight: revisionApps.length > 0
                },
                { key: "active", label: "Active Gigs", count: acceptedApps.length },
                { key: "completed", label: "Completed", count: completedApps.length },
              ].map(tab => (
                <button key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: activeTab === tab.key
                      ? "linear-gradient(90deg, #FFC085, #e8a060)"
                      : tab.highlight
                        ? "rgba(248,113,113,0.1)"
                        : "rgba(255,255,255,0.05)",
                    color: activeTab === tab.key
                      ? "white"
                      : tab.highlight
                        ? "#f87171"
                        : "#B2B2D2",
                    border: activeTab === tab.key
                      ? "none"
                      : tab.highlight
                        ? "1px solid rgba(248,113,113,0.3)"
                        : "1px solid rgba(255,255,255,0.08)",
                  }}>
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{
                        background: activeTab === tab.key
                          ? "rgba(255,255,255,0.25)"
                          : tab.highlight
                            ? "rgba(248,113,113,0.2)"
                            : "rgba(255,255,255,0.1)",
                        color: activeTab === tab.key ? "white" : tab.highlight ? "#f87171" : "#B2B2D2",
                      }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── REVISIONS TAB ── */}
          {activeTab === "revisions" && (
            <div className="flex flex-col gap-4">
              {revisionApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
                  style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <p className="text-3xl mb-3">✅</p>
                  <p className="text-white font-medium mb-1">No revisions requested</p>
                  <p className="text-sm" style={{ color: "#B2B2D2" }}>All your submissions are looking good!</p>
                </div>
              ) : (
                revisionApps.map(app => {
                  const gigTitle = app.gigTitle || app.gig?.title || "Untitled Gig";
                  const agentName = app.agentName || app.agent?.name || "Agent";
                  const reason = app.revisionReason || app.rejectionReason || app.reason || "";
                  const appId = app._id || app.id;
                  return (
                    <div key={appId} className="p-5 rounded-2xl"
                      style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)" }}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(248,113,113,0.1)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                              viewBox="0 0 24 24" stroke="#f87171" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{gigTitle}</p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>
                              by {agentName}
                              {app.revisionCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs"
                                  style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                                  Revision #{app.revisionCount}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                          style={{
                            background: "rgba(248,113,113,0.1)", color: "#f87171",
                            border: "1px solid rgba(248,113,113,0.2)"
                          }}>
                          Revision Requested
                        </span>
                      </div>
                      {/* Revision reason */}
                      {reason && (
                        <div className="p-4 rounded-xl mb-4"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <p className="text-xs font-semibold mb-2" style={{ color: "#f87171" }}>
                            📋 Agent's Feedback
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                            {reason}
                          </p>
                        </div>
                      )}
                      {/* Action button */}
                      <button
                        onClick={() => navigate(
                          `/teenlancer/submitwork/${appId}?revision=true&reason=${encodeURIComponent(reason)}`
                        )}
                        className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Submit Revised Work
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── OVERVIEW TAB (existing content) ── */}
          {(activeTab === "overview" || !hasActivity) && (
            <div className="flex flex-col gap-6">
              {acceptedApps.length > 0 && (
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">Active Gigs</h2>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
                      {acceptedApps.length} active
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {acceptedApps.map(app => <AppCard key={app._id || app.id} app={app} />)}
                  </div>
                </div>
              )}
              {revisionApps.length > 0 && (
                <div className="p-5 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveTab("revisions")}
                  style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(248,113,113,0.1)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                          viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Revisions Requested</p>
                        <p className="text-xs" style={{ color: "#B2B2D2" }}>
                          {revisionApps.length} gig{revisionApps.length > 1 ? "s need" : " needs"} revision
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#f87171" }}>View →</span>
                  </div>
                </div>
              )}
              {myApplications.length > 0 && (
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">My Applications</h2>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085" }}>
                      {myApplications.length} total
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {myApplications.slice(0, 5).map(app => <AppCard key={app._id || app.id} app={app} />)}
                    {myApplications.length > 5 && (
                      <button onClick={() => setActiveTab("applications")}
                        className="text-xs text-center hover:opacity-80"
                        style={{ color: "#FFC085" }}>
                        View all {myApplications.length} applications →
                      </button>
                    )}
                  </div>
                </div>
              )}
              {/* Earnings Summary */}
              {stats && (stats.totalEarnings && stats.totalEarnings !== "$0" && stats.totalEarnings !== 0) && (
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h2 className="text-white font-semibold mb-4">Earnings Summary</h2>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { label: "Total Earned", value: stats.totalEarnings },
                      { label: "Gigs Completed", value: stats.completedGigs || completedApps.length },
                      { label: "Avg per Gig", value: stats.avgPerGig || "—" },
                      { label: "Your Rating", value: stats.rating || "—" },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>{item.label}</p>
                        <p className="text-white font-bold text-lg">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate("/Exploreagig")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-80"
                  style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.25)" }}>
                  Explore More Gigs
                </button>
                <button onClick={() => navigate("/teenlancer/profile")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Update Profile
                </button>
                <button onClick={() => navigate("/teenlancer/savedgigs")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Saved Gigs
                </button>
              </div>
            </div>
          )}

          {/* ── APPLICATIONS TAB ── */}
          {activeTab === "applications" && (
            <div className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 className="text-white font-semibold mb-4">All Applications</h2>
              <div className="flex flex-col gap-3">
                {myApplications.map(app => <AppCard key={app._id || app.id} app={app} />)}
              </div>
            </div>
          )}

          {/* ── ACTIVE TAB ── */}
          {activeTab === "active" && (
            <div className="flex flex-col gap-4">
              {acceptedApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
                  style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <p className="text-white font-medium mb-1">No active gigs</p>
                  <p className="text-sm" style={{ color: "#B2B2D2" }}>Accepted applications will appear here.</p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex flex-col gap-3">
                    {acceptedApps.map(app => <AppCard key={app._id || app.id} app={app} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── COMPLETED TAB ── */}
          {activeTab === "completed" && (
            <div className="flex flex-col gap-4">
              {completedApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
                  style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <p className="text-white font-medium mb-1">No completed gigs yet</p>
                  <p className="text-sm" style={{ color: "#B2B2D2" }}>Finished projects will appear here.</p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex flex-col gap-3">
                    {completedApps.map(app => <AppCard key={app._id || app.id} app={app} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </TeenlancerLayout>
  );
}