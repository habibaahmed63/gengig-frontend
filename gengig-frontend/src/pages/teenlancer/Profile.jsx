import TeenlancerLayout from "../../layouts/TeenlancerLayout";

const skills = ["UI/UX Design", "Logo Design", "Graphic Design", "Video Editing", "Motion Graphics"];

const portfolio = [
    { title: "Food Dashboard", category: "UI/UX", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400" },
    { title: "Brand Identity", category: "Logo Design", img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400" },
    { title: "App Concept", category: "UI/UX", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400" },
    { title: "Social Campaign", category: "Graphic Design", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400" },
];

const reviews = [
    { name: "Khaled Ramzy", role: "Marketing Manager", stars: 5, text: "Incredibly talented and professional. Delivered beyond expectations!" },
    { name: "Sara Ahmed", role: "Startup Founder", stars: 4, text: "Great work quality and very responsive. Would hire again." },
];

export default function TeenlancerProfile() {
    return (
        <TeenlancerLayout>
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
                    <p className="text-sm mb-3" style={{ color: "#FFC085" }}>Teenlancer · Graphic Designer</p>
                    <div className="flex gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                        <span>📍 Cairo, Egypt</span>
                        <span>📅 Joined Jan 2024</span>
                        <span>⭐ 4.8 Rating</span>
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
                            I'm a passionate teen designer with a love for creating beautiful, functional visuals. I specialize in UI/UX, branding, and motion graphics. Always eager to learn and grow through real-world projects.
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.3)" }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-4">Stats</h2>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Completed Gigs", value: "12" },
                                { label: "Total Earnings", value: "₹430" },
                                { label: "Response Rate", value: "98%" },
                                { label: "On Time Delivery", value: "100%" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</span>
                                    <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - spans 2 cols */}
                <div className="col-span-2 flex flex-col gap-6">
                    {/* Portfolio */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold">Portfolio</h2>
                            <button className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                + Add Work
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {portfolio.map((item) => (
                                <div key={item.title} className="relative rounded-xl overflow-hidden group cursor-pointer">
                                    <img src={item.img} alt={item.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,52,0.9) 40%, transparent)" }} />
                                    <div className="absolute bottom-0 left-0 p-3">
                                        <p className="text-white text-sm font-semibold">{item.title}</p>
                                        <p className="text-xs" style={{ color: "#FFC085" }}>{item.category}</p>
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
        </TeenlancerLayout>
    );
}