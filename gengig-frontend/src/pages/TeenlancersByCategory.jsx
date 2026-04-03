import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgentLayout from "../layouts/AgentLayout";
import api from "../services/api";

const sortOptions = [
    { value: "newest", label: "Newest Members" },
    { value: "rate_low", label: "Rate: Low to High" },
    { value: "rate_high", label: "Rate: High to Low" },
    { value: "rating", label: "Highest Rated" },
];

const categoryIcons = {
    "Graphic Design": "🎨",
    "Video Editing": "🎬",
    "Web Development": "💻",
    "UI/UX Design": "📱",
    "Content Writing": "✍️",
    "Photography": "📸",
    "Social Media": "📣",
    "Animation": "✨",
    "Logo Design": "🖊️",
    "Motion Graphics": "🎥",
};

const availabilityColor = {
    "Full-time": "#4ade80",
    "Part-time": "#FFC085",
    "Weekends only": "#63b3ed",
    "Flexible": "#a78bfa",
};

export default function TeenlancersByCategory() {
    const { category } = useParams();
    const navigate = useNavigate();

    const [teenlancers, setTeenlancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [availabilityFilter, setAvailabilityFilter] = useState("All");

    const decodedCategory = decodeURIComponent(category || "");
    const icon = categoryIcons[decodedCategory] || "👤";

    const availabilityOptions = ["All", "Full-time", "Part-time", "Weekends only", "Flexible"];

    useEffect(() => {
        const fetchTeenlancers = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/users/teenlancers?skill=${encodeURIComponent(decodedCategory)}&sort=${sort}`);
                setTeenlancers(res.data);


            } catch (err) {
                console.error("Failed to fetch teenlancers:", err);
                setTeenlancers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTeenlancers();
    }, [decodedCategory, sort]);

    const filtered = teenlancers.filter((t) => {
        const matchesSearch =
            search.trim() === "" ||
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.bio.toLowerCase().includes(search.toLowerCase()) ||
            t.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
        const matchesAvailability =
            availabilityFilter === "All" || t.availability === availabilityFilter;
        return matchesSearch && matchesAvailability;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === "rate_low") return a.hourlyRate - b.hourlyRate;
        if (sort === "rate_high") return b.hourlyRate - a.hourlyRate;
        if (sort === "rating") return b.rating - a.rating;
        return 0;
    });

    return (
        <AgentLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Browse › <span style={{ color: "#FFC085" }}>{decodedCategory}</span>
            </p>

            {/* Hero */}
            <div
                className="p-8 rounded-2xl mb-8 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(255,192,133,0.15), rgba(255,192,133,0.05))", border: "1px solid rgba(255,192,133,0.2)" }}
            >
                <div className="flex items-center gap-4 mb-3">
                    <span className="text-5xl">{icon}</span>
                    <div>
                        <h1 className="text-white font-bold text-3xl">{decodedCategory}</h1>
                        <p className="text-sm mt-1" style={{ color: "#B2B2D2" }}>
                            {loading ? "Finding teenlancers..." : `${filtered.length} teenlancer${filtered.length !== 1 ? "s" : ""} available`}
                        </p>
                    </div>
                </div>
                <p className="text-sm" style={{ color: "#B2B2D2" }}>
                    Browse talented young {decodedCategory} specialists ready to work on your project.
                </p>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div
                    className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder={`Search ${decodedCategory} teenlancers...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-white text-sm outline-none"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} style={{ color: "#B2B2D2" }}>✕</button>
                    )}
                </div>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", minWidth: "180px" }}
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} style={{ background: "#060834" }}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Availability Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
                {availabilityOptions.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setAvailabilityFilter(opt)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                            background: availabilityFilter === opt ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.05)",
                            color: availabilityFilter === opt ? "white" : "#B2B2D2",
                            border: availabilityFilter === opt ? "none" : "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {/* Teenlancers Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-5 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                                <div className="flex-1">
                                    <div className="h-4 rounded-full w-2/3 mb-2" style={{ background: "rgba(255,255,255,0.1)" }} />
                                    <div className="h-3 rounded-full w-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />
                                </div>
                            </div>
                            <div className="h-3 rounded-full w-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }} />
                            <div className="h-3 rounded-full w-4/5 mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />
                            <div className="h-8 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                        </div>
                    ))}
                </div>
            ) : sorted.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center py-20 rounded-2xl"
                    style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
                >
                    <span className="text-5xl mb-4">{icon}</span>
                    <p className="text-white font-semibold text-lg mb-2">
                        {search || availabilityFilter !== "All" ? "No matching teenlancers" : `No ${decodedCategory} teenlancers yet`}
                    </p>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                        {search || availabilityFilter !== "All" ? "Try different filters" : "More talent joining every day!"}
                    </p>
                    <button
                        onClick={() => { setSearch(""); setAvailabilityFilter("All"); }}
                        className="px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sorted.map((t) => (
                        <div
                            key={t.id}
                            className="p-5 rounded-2xl flex flex-col gap-4 hover:border-[rgba(255,192,133,0.3)] transition-all"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            {/* Profile Header */}
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: "rgba(255,192,133,0.15)", border: "2px solid rgba(255,192,133,0.3)" }}
                                >
                                    <span className="text-lg font-bold" style={{ color: "#FFC085" }}>
                                        {t.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold truncate">{t.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs" style={{ color: availabilityColor[t.availability] || "#B2B2D2" }}>
                                            ● {t.availability}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <span className="text-xs" style={{ color: "#FFC085" }}>★</span>
                                    <span className="text-xs font-semibold text-white">{t.rating}</span>
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>({t.reviews})</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#B2B2D2" }}>{t.bio}</p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1.5">
                                {t.skills.slice(0, 3).map((skill) => (
                                    <span key={skill} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}>
                                        {skill}
                                    </span>
                                ))}
                                {t.skills.length > 3 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "#B2B2D2" }}>
                                        +{t.skills.length - 3}
                                    </span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-xs pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#B2B2D2" }}>
                                <span>✅ {t.completedGigs} gigs done</span>
                                <span className="font-semibold" style={{ color: "#FFC085" }}>${t.hourlyRate}/hr</span>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => navigate(`/post?teenlancer=${t.id}`)}
                                className="w-full py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                Invite to a Gig
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!loading && sorted.length > 0 && (
                <p className="text-xs text-center mt-6" style={{ color: "#B2B2D2" }}>
                    Showing {sorted.length} of {teenlancers.length} teenlancers in {decodedCategory}
                </p>
            )}
        </AgentLayout>
    );
}
