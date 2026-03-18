import TeenlancerLayout from "../../layouts/TeenlancerLayout";

const projects = [
  { name: "Project One", time: "00:40:00", progress: 80 },
  { name: "Project Two", time: "00:10:00", progress: 20 },
  { name: "Project Three", time: "00:20:00", progress: 40 },
  { name: "Project Four", time: "00:30:00", progress: 60 },
];

const members = [
  { name: "Food Dashboard Design", role: "Creating UI and Research", today: "00:40:00", week: "08:40:00" },
  { name: "SAP Logo", role: "Creating UI and Research", today: "00:40:00", week: "08:40:00" },
];

export default function TeenlancerDashboard() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <TeenlancerLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-xs" style={{ color: "#B2B2D2" }}>
          Home › <span style={{ color: "#FFC085" }}>Account</span>
        </p>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-bold text-white mb-1" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Today</h1>
          <p className="text-sm" style={{ color: "#B2B2D2" }}>{dateStr} | {timeStr}</p>
        </div>
        <button className="text-2xl">🔔</button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-2xl flex items-center justify-between" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs mb-2 flex items-center gap-2" style={{ color: "#B2B2D2" }}>
              Worked This Week
              <span style={{ color: "#FFC085" }}>⋮</span>
            </p>
            <p className="text-white font-bold text-xl">40:00:05</p>
          </div>
          <span className="text-2xl">⏱️</span>
        </div>
        <div className="p-5 rounded-2xl flex items-center justify-between" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs mb-2 flex items-center gap-2" style={{ color: "#B2B2D2" }}>
              Project Worked
              <span style={{ color: "#FFC085" }}>⋮</span>
            </p>
            <p className="text-white font-bold text-xl">02</p>
          </div>
          <span className="text-2xl">📁</span>
        </div>
      </div>

      {/* Projects */}
      <div className="p-6 rounded-2xl mb-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Projects</h2>
          <span style={{ color: "#B2B2D2" }}>⋮</span>
        </div>
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <div key={p.name} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="text-sm" style={{ color: "#FFC085" }}>📁</span>
              <span className="text-white text-sm flex-1">{p.name}</span>
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "#B2B2D2" }}>{p.time}</span>
              <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: "linear-gradient(90deg, #FFC085, #e8a060)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Info Table */}
      <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="grid grid-cols-4 gap-4 mb-3 text-xs font-semibold" style={{ color: "#B2B2D2" }}>
          <span>Member Info</span>
          <span></span>
          <span className="text-center">Today</span>
          <span className="text-center">This Week</span>
        </div>
        {members.map((m) => (
          <div key={m.name} className="grid grid-cols-4 gap-4 items-center py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 col-span-2">
              <img src="https://i.pravatar.cc/40" alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-white text-sm font-medium">{m.name}</p>
                <p className="text-xs" style={{ color: "#B2B2D2" }}>{m.role}</p>
              </div>
            </div>
            <span className="text-center text-sm px-2 py-1 rounded-lg text-white" style={{ background: "rgba(255,255,255,0.08)" }}>{m.today}</span>
            <span className="text-center text-sm px-2 py-1 rounded-lg text-white" style={{ background: "rgba(255,255,255,0.08)" }}>{m.week}</span>
          </div>
        ))}
      </div>
    </TeenlancerLayout>
  );
}