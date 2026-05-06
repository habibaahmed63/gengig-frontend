import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Agent";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const [openGigs, setOpenGigs] = useState([]);
  const [activeGigs, setActiveGigs] = useState([]);
  const [completedGigs, setCompletedGigs] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [openRes, activeRes, completedRes, statsRes, appsRes] = await Promise.all([
          api.get("/agent/gigs?status=open"),
          api.get("/agent/gigs?status=active"),
          api.get("/agent/gigs?status=completed"),
          api.get("/agent/stats"),
          api.get("/agent/applications?limit=3"),
        ]);
        setOpenGigs(openRes.data);
        setActiveGigs(activeRes.data);
        setCompletedGigs(completedRes.data);
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

  const hasActivity = openGigs.length > 0 || activeGigs.length > 0 || completedGigs.length > 0;

  const statCards = stats ? [
    { label: "Open Gigs", value: stats.openGigs ?? openGigs.length, color: "#63b3ed" },
    { label: "Active Gigs", value: stats.activeGigs ?? activeGigs.length, color: "#FFC085" },
    { label: "Completed Gigs", value: stats.completedGigs ?? completedGigs.length, color: "#4ade80" },
    { label: "Teenlancers Hired", value: stats.teenlancersHired ?? 0, color: "#a78bfa" },
  ] : [];

  const GigRow = ({ gig, statusLabel, statusColor, statusBg, last }) => (
    <div
      onClick={() => navigate("/agent/my-gigs")}
      className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
      style={{ borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: statusBg }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke={statusColor} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{gig.title}</p>
        <p className="text-xs" style={{ color: "#B2B2D2" }}>
          {[
            gig.category,
            gig.applications != null && `${gig.applications} applicant${gig.applications !== 1 ? "s" : ""}`,
            gig.deadline && `Due ${gig.deadline}`,
            gig.completedDate && `Completed ${gig.completedDate}`,
          ].filter(Boolean).join(" · ")}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {gig.budget && (
          <span className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: statusBg, color: statusColor }}>
          {statusLabel}
        </span>
      </div>
    </div>
  );

  return (
    <AgentLayout>
      <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
        <Link to="/agent/dashboard" className="hover:text-[#FFC085] transition-colors">Home</Link>
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
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => navigate("/agent/my-gigs")}
            className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors hidden sm:block"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>
            My Gigs
          </button>
          <button onClick={() => navigate("/post")}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
            + Post a Gig
          </button>
        </div>
      </div>

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
              className="p-5 rounded-2xl hover:scale-105 transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>{stat.label}</p>
              <p className="font-bold text-2xl tracking-tight"
                style={{ color: stat.value === 0 || stat.value === "$0" ? "#B2B2D2" : stat.color }}>
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

        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-10"
              style={{ background: "#FFC085" }} />
            <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
              style={{ background: "rgba(255,192,133,0.1)", border: "2px solid rgba(255,192,133,0.3)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none"
                viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 className="text-white font-bold text-xl mb-2">No activity yet</h2>
          <p className="text-sm mb-2 max-w-sm" style={{ color: "#B2B2D2" }}>
            You haven't posted any gigs yet. Post your first gig and start finding talented teenlancers!
          </p>
          <p className="text-xs mb-8" style={{ color: "rgba(178,178,210,0.5)" }}>
            Once you post gigs and receive applications, everything will appear here.
          </p>
          <button onClick={() => navigate("/post")}
            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
            Post Your First Gig →
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full px-4">
            {[
              { title: "Post a gig", desc: "Describe what you need and set your budget", action: () => navigate("/post") },
              { title: "Review applications", desc: "Browse teenlancers who apply to your gig", action: () => navigate("/agent/applications") },
              { title: "Hire & collaborate", desc: "Accept the best fit and get your project done", action: null },
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

        <div className="flex flex-col gap-8">

          <div className="p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[rgba(255,192,133,0.3)] transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={() => navigate("/agent/my-gigs")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                  viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">My Gigs</p>
                <p className="text-xs mt-0.5" style={{ color: "#B2B2D2" }}>
                  {openGigs.length} open · {activeGigs.length} active · {completedGigs.length} completed
                </p>
              </div>
            </div>
            <span className="text-sm font-medium" style={{ color: "#FFC085" }}>View all →</span>
          </div>

          {recentApplications.length > 0 && (
            <div className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Recent Applications</h2>
                <button onClick={() => navigate("/agent/applications")}
                  className="text-xs hover:opacity-80 transition-opacity"
                  style={{ color: "#FFC085" }}>
                  View all →
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {recentApplications.map(app => (
                  <div key={app.id}
                    onClick={() => navigate("/agent/applications")}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{ border: "2px solid rgba(255,192,133,0.4)", background: "rgba(255,192,133,0.1)" }}>
                      {app.applicant?.photo ? (
                        <img src={app.applicant.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: "#FFC085" }}>
                          {app.applicant?.name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {app.applicant?.name || "Unknown"}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#B2B2D2" }}>
                        Applied for: {app.gigTitle || "Unknown gig"}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                      style={{
                        background: app.status === "pending" ? "rgba(255,192,133,0.12)" : "rgba(74,222,128,0.1)",
                        color: app.status === "pending" ? "#FFC085" : "#4ade80",
                      }}>
                      {app.status === "pending" ? "New" : "Reviewed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {openGigs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Open Gigs</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#B2B2D2" }}>
                    Posted and waiting for teenlancers to apply
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: "rgba(99,179,237,0.1)", color: "#63b3ed" }}>
                    {openGigs.length} open
                  </span>
                  <button onClick={() => navigate("/agent/my-gigs")}
                    className="text-xs hover:opacity-80 transition-opacity"
                    style={{ color: "#FFC085" }}>
                    Manage →
                  </button>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {openGigs.map((gig, i) => (
                  <GigRow key={gig.id || gig.title} gig={gig}
                    statusLabel="Open"
                    statusColor="#63b3ed"
                    statusBg="rgba(99,179,237,0.1)"
                    last={i === openGigs.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Gigs */}
          {activeGigs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Active Gigs</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#B2B2D2" }}>
                    Teenlancer accepted — work in progress
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085" }}>
                    {activeGigs.length} in progress
                  </span>
                  <button onClick={() => navigate("/agent/my-gigs")}
                    className="text-xs hover:opacity-80 transition-opacity"
                    style={{ color: "#FFC085" }}>
                    Manage →
                  </button>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {activeGigs.map((gig, i) => (
                  <GigRow key={gig.id || gig.title} gig={gig}
                    statusLabel="Active"
                    statusColor="#FFC085"
                    statusBg="rgba(255,192,133,0.1)"
                    last={i === activeGigs.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Gigs*/}
          {completedGigs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Completed Gigs</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#B2B2D2" }}>
                    Successfully finished projects
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
                    {completedGigs.length} completed
                  </span>
                  <button onClick={() => navigate("/agent/my-gigs")}
                    className="text-xs hover:opacity-80 transition-opacity"
                    style={{ color: "#FFC085" }}>
                    View all →
                  </button>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {completedGigs.map((gig, i) => (
                  <GigRow key={gig.id || gig.title} gig={gig}
                    statusLabel="Completed"
                    statusColor="#4ade80"
                    statusBg="rgba(74,222,128,0.1)"
                    last={i === completedGigs.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

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