import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";

export default function TeenlancerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Teenlancer";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // TODO: Replace with API call: GET /teenlancer/gigs?status=active
  const activeGigs = [];

  // TODO: Replace with API call: GET /teenlancer/gigs?status=completed
  const completedGigs = [];

  // TODO: Replace with API call: GET /teenlancer/stats
  const stats = [
    { label: "Active Gigs", value: activeGigs.length, icon: "🎯" },
    { label: "Completed Gigs", value: completedGigs.length, icon: "✅" },
    { label: "Total Earnings", value: localStorage.getItem("totalEarnings") || "$0", icon: "💰" },
    { label: "Rating", value: localStorage.getItem("rating") || "—", icon: "⭐" },
  ];

  const hasActivity = activeGigs.length > 0 || completedGigs.length > 0;

  return (
    <TeenlancerLayout>
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
              🎯
            </div>
          </div>

          <h2 className="text-white font-bold text-xl mb-2">No activity yet</h2>
          <p className="text-sm mb-2 max-w-sm" style={{ color: "#B2B2D2" }}>
            You have not applied to any gigs yet. Start exploring and find your first project!
          </p>
          <p className="text-xs mb-8" style={{ color: "rgba(178,178,210,0.5)" }}>
            Once you apply and get accepted, your gigs will appear here.
          </p>

          <button
            onClick={() => navigate("/exploreagig")}
            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
          >
            Explore Gigs →
          </button>

          {/* Quick tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full px-4">
            {[
              { icon: "👤", title: "Complete your profile", desc: "A full profile gets 3x more attention from agents" },
              { icon: "🔍", title: "Browse gigs", desc: "Find gigs that match your skills and interests" },
              { icon: "✉️", title: "Apply with confidence", desc: "Write a clear intro message to stand out" },
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
        <div className="flex flex-col gap-6">

          {/* Active Gigs */}
          {activeGigs.length > 0 && (
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Active Gigs</h2>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}
                >
                  {activeGigs.length} active
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {activeGigs.map((gig, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,192,133,0.15)" }}
                    >
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{gig.title}</p>
                      <p className="text-xs" style={{ color: "#B2B2D2" }}>{gig.category} · Due {gig.deadline}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
                        In Progress
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Gigs */}
          {completedGigs.length > 0 && (
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Completed Gigs</h2>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085" }}
                >
                  {completedGigs.length} completed
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {completedGigs.map((gig, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(74,222,128,0.1)" }}
                    >
                      <span className="text-lg">✅</span>
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
    </TeenlancerLayout>
  );
}