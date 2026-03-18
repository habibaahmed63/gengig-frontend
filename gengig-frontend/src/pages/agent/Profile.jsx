import AgentLayout from "../../layouts/AgentLayout";

const reviews = [
    { name: "Salma Tamer", role: "Graphic Designer", stars: 5, text: "Working with this agent was a great experience. Very clear instructions and prompt feedback!" },
    { name: "Ahmed Karim", role: "Video Editor", stars: 4, text: "Professional and easy to work with. Always available and responsive." },
];

const postedGigs = [
    { title: "Social Media Campaign", category: "Marketing", budget: "$150", status: "Active" },
    { title: "Mobile App UI Design", category: "UI/UX", budget: "$300", status: "Active" },
    { title: "Brand Logo Design", category: "Logo Design", budget: "$100", status: "Completed" },
    { title: "Product Video Edit", category: "Video Editing", budget: "$200", status: "Completed" },
];

const statusColor = {
    Active: "#4ade80",
    Completed: "#FFC085",
};

export default function AgentProfile() {
    return (
        <AgentLayout>
            {/* Breadcrumb */}
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Profile</span>
            </p>

            {/* Profile Header */}
            <div className="p-6 rounded-2xl mb-6 flex items-center gap-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="relative">
                    <img src="../src/assets/profile.jpg" alt="profile" className="w-24 h-24 rounded-full object-cover" style={{ border: "3px solid #FFC085" }} />
                    <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: "#FFC085", color: "#060834" }}>✎</button>
                </div>
                <div className="flex-1">
                    <h1 className="text-white font-bold text-2xl mb-1">Habiba Ahmed</h1>
                    <p className="text-sm mb-3" style={{ color: "#FFC085" }}>Agent · Marketing Manager</p>
                    <div className="flex gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                        <span>📍 Cairo, Egypt</span>
                        <span>📅 Joined Mar 2023</span>
                        <span>⭐ 4.9 Rating</span>
                    </div>
                </div>
                <button className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    {/* Bio */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-3">About Me</h2>
                        <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                            I'm a marketing manager looking for fresh creative talent to bring innovative ideas to life. I believe in supporting young creators and giving them real opportunities to grow.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-4">Stats</h2>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Gigs Posted", value: "24" },
                                { label: "Teenlancers Hired", value: "18" },
                                { label: "Total Spent", value: "$2,400" },
                                { label: "Completion Rate", value: "96%" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</span>
                                    <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-2 flex flex-col gap-6">
                    {/* Posted Gigs */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold">Posted Gigs</h2>
                            <button className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                + Post New Gig
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {postedGigs.map((gig) => (
                                <div key={gig.title} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div>
                                        <p className="text-white text-sm font-medium">{gig.title}</p>
                                        <p className="text-xs" style={{ color: "#B2B2D2" }}>{gig.category}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{gig.budget}</span>
                                        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.08)", color: statusColor[gig.status] }}>
                                            {gig.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-4">Reviews & Ratings</h2>
                        <div className="flex flex-col gap-4">
                            {reviews.map((r) => (
                                <div key={r.name} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <img src="https://i.pravatar.cc/40" alt="" className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="text-white text-sm font-semibold">{r.name}</p>
                                                <p className="text-xs" style={{ color: "#B2B2D2" }}>{r.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} style={{ color: i < r.stars ? "#FFC085" : "#555" }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm" style={{ color: "#B2B2D2" }}>{r.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}