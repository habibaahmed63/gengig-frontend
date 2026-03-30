import AgentLayout from "../../layouts/AgentLayout";
import { useNavigate } from "react-router-dom";

const statusColor = {
    Active: "#4ade80",
    Completed: "#FFC085",
};

export default function AgentProfile() {
    const navigate = useNavigate();

    // TODO: Replace all localStorage reads with API call: GET /users/profile
    const name = localStorage.getItem("name") || "";
    const photo = localStorage.getItem("photo") || null;
    const bio = localStorage.getItem("bio") || "";
    const location = localStorage.getItem("location") || "";
    const joinDate = localStorage.getItem("joinDate") || "";
    const company = localStorage.getItem("company") || "";
    const industry = localStorage.getItem("industry") || "";

    // TODO: Replace with API call: GET /agent/gigs
    const postedGigs = [];

    // TODO: Replace with API call: GET /agent/reviews
    const reviews = [];

    // TODO: Replace with API call: GET /agent/stats
    const stats = [
        { label: "Gigs Posted", value: localStorage.getItem("gigsPosted") || "0" },
        { label: "Teenlancers Hired", value: localStorage.getItem("teenlancersHired") || "0" },
        { label: "Total Spent", value: localStorage.getItem("totalSpent") || "$0" },
        { label: "Completion Rate", value: localStorage.getItem("completionRate") || "—" },
    ];

    return (
        <AgentLayout>
            {/* Breadcrumb */}
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Profile</span>
            </p>

            {/* Profile Header */}
            <div
                className="p-6 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
                <div className="relative flex-shrink-0">
                    <div
                        className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ border: "3px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                    >
                        {photo ? (
                            <img src={photo} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                    <button
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                        style={{ background: "#FFC085", color: "#060834" }}
                    >
                        ✎
                    </button>
                </div>

                <div className="flex-1">
                    <h1 className="text-white font-bold text-2xl mb-1">
                        {name || <span style={{ color: "#B2B2D2", fontWeight: 400, fontSize: "1rem" }}>No name set</span>}
                    </h1>
                    <p className="text-sm mb-3" style={{ color: "#FFC085" }}>
                        Agent{company ? " · " + company : ""}{industry ? " · " + industry : ""}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                        {location && <span>{"📍 " + location}</span>}
                        {joinDate && <span>{"📅 Joined " + joinDate}</span>}
                    </div>
                </div>

                <button
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                >
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="flex flex-col gap-6">

                    {/* Bio */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <h2 className="text-white font-semibold mb-3">About Me</h2>
                        {bio ? (
                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{bio}</p>
                        ) : (
                            <p className="text-sm italic" style={{ color: "rgba(178,178,210,0.4)" }}>
                                No bio added yet.
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <h2 className="text-white font-semibold mb-4">Stats</h2>
                        <div className="flex flex-col gap-3">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</span>
                                    <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Posted Gigs */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold">Posted Gigs</h2>
                            <button
                                onClick={() => navigate("/post")}
                                className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                                style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}
                            >
                                + Post New Gig
                            </button>
                        </div>
                        {postedGigs.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {postedGigs.map((gig, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 rounded-xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <div>
                                            <p className="text-white text-sm font-medium">{gig.title}</p>
                                            <p className="text-xs" style={{ color: "#B2B2D2" }}>{gig.category}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{gig.budget}</span>
                                            <span
                                                className="text-xs px-3 py-1 rounded-full font-medium"
                                                style={{ background: "rgba(255,255,255,0.08)", color: statusColor[gig.status] }}
                                            >
                                                {gig.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center py-10 rounded-xl"
                                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-sm italic mb-3" style={{ color: "rgba(178,178,210,0.4)" }}>
                                    No gigs posted yet.
                                </p>
                                <button
                                    onClick={() => navigate("/post")}
                                    className="text-xs px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity text-white"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    Post Your First Gig
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Reviews */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <h2 className="text-white font-semibold mb-4">Reviews & Ratings</h2>
                        {reviews.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {reviews.map((r, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <img src={r.img || "https://i.pravatar.cc/40"} alt="" className="w-8 h-8 rounded-full object-cover" />
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
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center py-10 rounded-xl"
                                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <p className="text-sm italic" style={{ color: "rgba(178,178,210,0.4)" }}>
                                    No reviews yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}