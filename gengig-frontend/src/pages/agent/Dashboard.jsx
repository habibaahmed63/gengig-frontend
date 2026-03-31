import { useNavigate } from "react-router-dom";
import AgentLayout from "../../layouts/AgentLayout";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Agent";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // TODO: Replace with API call: GET /agent/gigs?status=active
  const currentGigs = [];

  // TODO: Replace with API call: GET /agent/gigs?status=completed
  const previousGigs = [];

  // TODO: Replace with API call: GET /agent/stats
  const stats = [
    { label: "Active Gigs", value: currentGigs.length, icon: "📋" },
    { label: "Completed Gigs", value: previousGigs.length, icon: "✅" },
    { label: "Total Spent", value: localStorage.getItem("totalSpent") || "$0", icon: "💳" },
    { label: "Teenlancers Hired", value: localStorage.getItem("teenlancersHired") || "0", icon: "👥" },
  ];

  const hasActivity = currentGigs.length > 0 || previousGigs.length > 0;

  return (
    <AgentLayout>
      {/* Breadcrumb */}
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
        <button
          onClick={() => navigate("/post")}
          className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
        >
          + Post a Gig
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div>
              <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>{stat.label}</p>
              <p className="text-white font-bold text-xl">{stat.value}</p>
            </div>
            <span className="text-2xl">{stat.icon}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {!hasActivity ? (
        /* ── Empty State ── */
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          {/* Animated icon */}
          <div className="relative mb-6">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-10"
              style={{ background: "#FFC085" }}
            />
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl relative z-10"
              style={{ background: "rgba(255,192,133,0.1)", border: "2px solid rgba(255,192,133,0.3)" }}
            >
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

          <button
            onClick={() => navigate("/post")}
            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
          >
            Post Your First Gig →
          </button>

          {/* Quick tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full px-4">
            {[
              { icon: "✍️", title: "Post a gig", desc: "Describe what you need and set your budget" },
              { icon: "👀", title: "Review applications", desc: "Browse teenlancers who apply to your gig" },
              { icon: "🤝", title: "Hire & collaborate", desc: "Accept the best fit and get your project done" },
            ].map((tip) => (
              <div
                key={tip.title}
                className="p-4 rounded-2xl text-left"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-xl mb-2">{tip.icon}</p>
                <p className="text-white text-sm font-semibold mb-1">{tip.title}</p>
                <p className="text-xs" style={{ color: "#B2B2D2" }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Has Activity ── */
        <div className="flex flex-col gap-8">

          {/* Current Gigs */}
          {currentGigs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
                  Current Gigs
                </h2>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}
                >
                  {currentGigs.length} active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentGigs.map((group, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-white text-sm font-semibold">{group.date}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {group.gigs.map((gig, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <span className="text-xs font-medium mt-0.5 w-10 flex-shrink-0" style={{ color: "#B2B2D2" }}>{gig.time}</span>
                          <div className="w-0.5 h-10 rounded-full flex-shrink-0" style={{ background: gig.color }} />
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: gig.color }}>{gig.category}</p>
                            <p className="text-white text-sm font-medium">{gig.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Gigs */}
          {previousGigs.length > 0 && (
            <div>
              <h2
                className="text-white font-bold mb-4"
                style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}
              >
                Previous Gigs
              </h2>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {previousGigs.map((gig, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ borderBottom: i < previousGigs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,192,133,0.1)" }}
                    >
                      <span className="text-sm">✅</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{gig.title}</p>
                      <p className="text-xs" style={{ color: "#B2B2D2" }}>{gig.category} · Completed {gig.completedDate}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>
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