import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Agent";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const [currentGigs, setCurrentGigs] = useState([]);
  const [previousGigs, setPreviousGigs] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
         const [currentRes, previousRes, statsRes, appsRes] = await Promise.all([
         api.get("/agent/gigs?status=active"),
          api.get("/agent/gigs?status=completed"),
          api.get("/agent/stats"),
           api.get("/agent/applications?limit=3"),
         ]);
         setCurrentGigs(currentRes.data);
         setPreviousGigs(previousRes.data);
         setStats(statsRes.data);
         setRecentApplications(appsRes.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const hasActivity = currentGigs.length > 0 || previousGigs.length > 0;

  const statCards = stats ? [
    { label: "Active Gigs", value: stats.activeGigs ?? currentGigs.length, icon: "📋", color: "#63b3ed" },
    { label: "Completed Gigs", value: stats.completedGigs ?? previousGigs.length, icon: "✅", color: "#4ade80" },
    { label: "Total Spent", value: stats.totalSpent ?? "$0", icon: "💳", color: "#FFC085" },
    { label: "Teenlancers Hired", value: stats.teenlancersHired ?? 0, icon: "👥", color: "#FFC085" },
  ] : [];

  return (
    <AgentLayout>
      <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
        Home › <span style={{ color: "#FFC085" }}>Dashboard</span>
      </p>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-bold text-white mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            Welcome back, <span className="text-gradient">{name.split(" ")[0]}</span> 
          </h1>
          <p className="text-sm" style={{ color: "#B2B2D2" }}>{dateStr} · {timeStr}</p>
        </div>

        {/* ── Header action buttons ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate("/agent/my-gigs")}
            className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors hidden sm:block"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
          >
            My Gigs
          </button>
          <button
            onClick={() => navigate("/post")}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
          >
            + Post a Gig
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", height: "90px" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <div key={stat.label}
              className="p-5 rounded-2xl flex items-center justify-between hover:scale-105 transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>{stat.label}</p>
                <p className="font-bold text-xl"
                  style={{ color: stat.value === 0 || stat.value === "$0" ? "#B2B2D2" : "white" }}>
                  {stat.value}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "#B2B2D2" }}>Loading your dashboard...</p>
        </div>
      ) : !hasActivity ? (

        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ background: "#FFC085" }} />
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl relative z-10"
              style={{ background: "rgba(255,192,133,0.1)", border: "2px solid rgba(255,192,133,0.3)" }}>
              📋
            </div>
          </div>
          <h2 className="text-white font-bold text-xl mb-2">No activity yet</h2>
          <p className="text-sm mb-2 max-w-sm" style={{ color: "#B2B2D2" }}>
            You have not posted any gigs yet. Post your first gig and start finding talented teenlancers!
          </p>
          <p className="text-xs mb-8" style={{ color: "rgba(178,178,210,0.5)" }}>
            Once you post gigs and receive applications, everything will appear here.
          </p>
          <button onClick={() => navigate("/post")}
            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
            Post Your First Gig →
          </button>

          {/* Quick tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full px-4">
            {[
              { icon: "✍️", title: "Post a gig", desc: "Describe what you need and set your budget", action: () => navigate("/post") },
              { icon: "👀", title: "Review applications", desc: "Browse teenlancers who apply to your gig", action: () => navigate("/agent/applications") },
              { icon: "🤝", title: "Hire & collaborate", desc: "Accept the best fit and get your project done", action: null },
            ].map(tip => (
              <div key={tip.title} onClick={tip.action || undefined}
                className={`p-4 rounded-2xl text-left transition-all duration-200 ${tip.action ? "cursor-pointer hover:scale-105" : ""}`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xl mb-2">{tip.icon}</p>
                <p className="text-white text-sm font-semibold mb-1">{tip.title}</p>
                <p className="text-xs" style={{ color: "#B2B2D2" }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

      ) : (
        /* ── Has activity ── */
        <div className="flex flex-col gap-8">

          {/* ── My Gigs quick-access card ── */}
          <div
            className="p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[rgba(255,192,133,0.3)] transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={() => navigate("/agent/my-gigs")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}>
                📋
              </div>
              <div>
                <p className="text-white font-semibold">My Gigs</p>
                <p className="text-xs mt-0.5" style={{ color: "#B2B2D2" }}>
                  {currentGigs.length} active · {previousGigs.length} completed · manage applications
                </p>
              </div>
            </div>
            <span className="text-sm font-medium" style={{ color: "#FFC085" }}>View all →</span>
          </div>

          {/* Recent Applications */}
          {recentApplications.length > 0 && (
            <div className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Recent Applications</h2>
                <button onClick={() => navigate("/agent/applications")}
                  className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#FFC085" }}>
                  View all →
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {recentApplications.map(app => (
                  <div key={app.id} onClick={() => navigate("/agent/my-gigs")}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}>
                      {app.applicant?.photo ? (
                        <img src={app.applicant.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: "#FFC085" }}>
                          {app.applicant?.name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{app.applicant?.name || "Unknown"}</p>
                      <p className="text-xs truncate" style={{ color: "#B2B2D2" }}>
                        Applied for: {app.gigTitle || "Unknown gig"}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: app.status === "pending" ? "rgba(255,192,133,0.15)" : "rgba(74,222,128,0.1)",
                        color: app.status === "pending" ? "#FFC085" : "#4ade80",
                      }}>
                      {app.status === "pending" ? "New" : "Reviewed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Gigs */}
          {currentGigs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
                  Current Gigs
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
                    {currentGigs.length} active
                  </span>
                  <button onClick={() => navigate("/agent/my-gigs")}
                    className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#FFC085" }}>
                    Manage →
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {currentGigs.map(gig => (
                  <div key={gig.id || gig.title}
                    onClick={() => navigate("/agent/my-gigs")}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,192,133,0.15)" }}>
                      <span className="text-lg">📋</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{gig.title}</p>
                      <p className="text-xs" style={{ color: "#B2B2D2" }}>
                        {[gig.category, gig.applications != null && `${gig.applications} applicant${gig.applications !== 1 ? "s" : ""}`, gig.deadline && `Due ${gig.deadline}`].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {gig.budget && <span className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>}
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Gigs */}
          {previousGigs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
                  Previous Gigs
                </h2>
                <button onClick={() => navigate("/agent/my-gigs")}
                  className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#FFC085" }}>
                  View all →
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {previousGigs.map((gig, i) => (
                  <div key={gig.id || gig.title}
                    onClick={() => navigate("/agent/my-gigs")}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ borderBottom: i < previousGigs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(74,222,128,0.1)" }}>
                      <span className="text-sm">✅</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{gig.title}</p>
                      <p className="text-xs" style={{ color: "#B2B2D2" }}>
                        {[gig.category, gig.completedDate && `Completed ${gig.completedDate}`].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {gig.budget && <span className="text-sm font-bold flex-shrink-0" style={{ color: "#FFC085" }}>{gig.budget}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spending Summary — only when real data exists */}
          {stats && stats.totalSpent !== "$0" && (
            <div className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 className="text-white font-semibold mb-4">Spending Summary</h2>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Total Spent", value: stats.totalSpent },
                  { label: "Gigs Completed", value: stats.completedGigs },
                  { label: "Teenlancers Hired", value: stats.teenlancersHired },
                  { label: "Avg per Gig", value: stats.avgPerGig || "—" },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>{item.label}</p>
                    <p className="text-white font-bold text-lg">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AgentLayout>
  );
}