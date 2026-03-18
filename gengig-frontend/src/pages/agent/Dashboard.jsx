import AgentLayout from "../../layouts/AgentLayout";

const currentGigs = [
  {
    date: "15 October",
    gigs: [
      { time: "09:00", category: "Marketing", title: "5 posts on Instagram", color: "#FFC085" },
      { time: "11:00", category: "Animation", title: "Platform Concept", color: "#B2B2D2" },
    ],
  },
  {
    date: "16 October",
    gigs: [
      { time: "09:00", category: "Design", title: "Sleep App", color: "#FFC085" },
      { time: "15:00", category: "Animation", title: "Create Post For App", color: "#B2B2D2" },
    ],
  },
  {
    date: "17 October",
    gigs: [
      { time: "09:00", category: "Marketing", title: "2 posts on instagram", color: "#FFC085" },
      { time: "10:00", category: "Animation", title: "Platform App Concept", color: "#B2B2D2" },
    ],
  },
  {
    date: "17 October",
    gigs: [
      { time: "09:00", category: "Marketing", title: "2 posts on instagram", color: "#FFC085" },
      { time: "10:00", category: "Animation", title: "Platform App Concept", color: "#B2B2D2" },
    ],
  },
];

const previousGigs = [
  {  title: "Marketing", desc: "Marketing · Viewed Just Now · Edited 15 min ago", initials: "BA", color: "#FFC085" },
  {  title: "Developming", desc: "Developming · Viewed Just Now · Edited 10 min ago", initials: "AS", color: "#B2B2D2" },
  {  title: "Night Mode for Sleep app", desc: "Design · Viewed Just Now · Edited 45 min ago", initials: "BA", color: "#FFC085" },
  {  title: "Animation", desc: "Motion Web · Viewed Just Now · Edited 1 hour ago", initials: "AS", color: "#B2B2D2" },
];

export default function AgentDashboard() {
  return (
    <AgentLayout>
      {/* Breadcrumb */}
      <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
        Home › <span style={{ color: "#FFC085" }}>Account</span>
      </p>

      {/* Current Gigs */}
      <div className="mb-10">
        <h1 className="text-white font-bold italic mb-6" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Current Gigs
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {currentGigs.map((group, i) => (
            <div key={i} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white text-sm font-semibold">{group.date}</p>
                <span style={{ color: "#B2B2D2" }}>•••</span>
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

      {/* Previous Gigs */}
      <div>
        <h2 className="text-white font-bold italic mb-6" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
          Previous Gigs
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {previousGigs.map((gig, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
              style={{ borderBottom: i < previousGigs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <span className="text-xl w-8 text-center">{gig.icon}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{gig.title}</p>
                <p className="text-xs" style={{ color: "#B2B2D2" }}>{gig.desc}</p>
              </div>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(255,255,255,0.1)", color: gig.color }}>
                {gig.initials}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AgentLayout>
  );
}