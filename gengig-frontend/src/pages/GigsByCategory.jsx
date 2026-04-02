import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeenlancerLayout from "../layouts/TeenlancerLayout";
import api from "../services/api";

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "budget_high", label: "Budget: High to Low" },
    { value: "budget_low", label: "Budget: Low to High" },
    { value: "popular", label: "Most Popular" },
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

export default function GigsByCategory() {
    const { category } = useParams();
    const navigate = useNavigate();

    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [savedGigs, setSavedGigs] = useState([]);

    const decodedCategory = decodeURIComponent(category || "");
    const icon = categoryIcons[decodedCategory] || "🔍";

    useEffect(() => {
        const fetchGigs = async () => {
            setLoading(true);
            try {
                // TODO: Replace with API call: GET /gigs?category=:category&sort=:sort
                // const res = await api.get(`/gigs?category=${encodeURIComponent(decodedCategory)}&sort=${sort}`);
                // setGigs(res.data);

                // Mock data until backend ready
                await new Promise((r) => setTimeout(r, 600));
                setGigs([
                    { id: 1, title: "Brand Identity Package", budget: 150, deadline: "7 days", applications: 8, skills: ["Figma", "Illustrator"], postedDate: "2 days ago" },
                    { id: 2, title: "Logo Design for Tech Startup", budget: 80, deadline: "5 days", applications: 12, skills: ["Illustrator", "Branding"], postedDate: "3 days ago" },
                    { id: 3, title: "Social Media Graphics Pack", budget: 200, deadline: "10 days", applications: 5, skills: ["Photoshop", "Canva"], postedDate: "1 day ago" },
                    { id: 4, title: "Packaging Design for Product", budget: 300, deadline: "14 days", applications: 3, skills: ["Illustrator", "3D"], postedDate: "5 days ago" },
                    { id: 5, title: "Business Card & Stationery", budget: 60, deadline: "3 days", applications: 15, skills: ["InDesign", "Illustrator"], postedDate: "4 hours ago" },
                    { id: 6, title: "Infographic Design", budget: 120, deadline: "6 days", applications: 7, skills: ["Illustrator", "Data Viz"], postedDate: "1 day ago" },
                ]);
            } catch (err) {
                console.error("Failed to fetch gigs:", err);
                setGigs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchGigs();
    }, [decodedCategory, sort]);

    const handleSave = (gigId) => {
        setSavedGigs((prev) =>
            prev.includes(gigId) ? prev.filter((id) => id !== gigId) : [...prev, gigId]
        );
        // TODO: API call: POST /gigs/:id/save
    };

    const filtered = gigs.filter((g) =>
        search.trim() === "" ||
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sort === "budget_high") return b.budget - a.budget;
        if (sort === "budget_low") return a.budget - b.budget;
        if (sort === "popular") return b.applications - a.applications;
        return 0; // newest — keep API order
    });

    return (
        <TeenlancerLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Explore › <span style={{ color: "#FFC085" }}>{decodedCategory}</span>
            </p>

            {/* Hero */}
            <div
                className="p-8 rounded-2xl mb-8 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(255,192,133,0.15), rgba(255,192,133,0.05))", border: "1px solid rgba(255,192,133,0.2)" }}
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="text-5xl">{icon}</span>
                        <div>
                            <h1 className="text-white font-bold text-3xl">{decodedCategory}</h1>
                            <p className="text-sm mt-1" style={{ color: "#B2B2D2" }}>
                                {loading ? "Loading gigs..." : `${filtered.length} gig${filtered.length !== 1 ? "s" : ""} available`}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm" style={{ color: "#B2B2D2" }}>
                        Find your next opportunity in {decodedCategory}. Apply and showcase your talent.
                    </p>
                </div>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div
                    className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder={`Search ${decodedCategory} gigs...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-white text-sm outline-none"
                        style={{ color: "#fff" }}
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

            {/* Gigs Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-5 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="h-3 rounded-full w-1/3 mb-3" style={{ background: "rgba(255,255,255,0.1)" }} />
                            <div className="h-5 rounded-full w-3/4 mb-4" style={{ background: "rgba(255,255,255,0.1)" }} />
                            <div className="flex gap-2 mb-4">
                                <div className="h-6 rounded-full w-16" style={{ background: "rgba(255,255,255,0.08)" }} />
                                <div className="h-6 rounded-full w-20" style={{ background: "rgba(255,255,255,0.08)" }} />
                            </div>
                            <div className="h-8 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }} />
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
                        {search ? "No matching gigs found" : `No ${decodedCategory} gigs yet`}
                    </p>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                        {search ? "Try a different search term" : "Check back soon — new gigs are posted daily!"}
                    </p>
                    <button
                        onClick={() => navigate("/Exploreagig")}
                        className="px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    >
                        Browse All Gigs
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sorted.map((gig) => (
                        <div
                            key={gig.id}
                            className="p-5 rounded-2xl flex flex-col gap-4 hover:border-[rgba(255,192,133,0.3)] transition-colors"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            {/* Top Row */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                            {decodedCategory}
                                        </span>
                                        <span className="text-xs" style={{ color: "#B2B2D2" }}>{gig.postedDate}</span>
                                    </div>
                                    <h3 className="text-white font-semibold text-base leading-snug">{gig.title}</h3>
                                </div>
                                <button
                                    onClick={() => handleSave(gig.id)}
                                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                                    style={{ background: savedGigs.includes(gig.id) ? "rgba(255,192,133,0.2)" : "rgba(255,255,255,0.05)" }}
                                    title={savedGigs.includes(gig.id) ? "Unsave" : "Save gig"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={savedGigs.includes(gig.id) ? "#FFC085" : "none"} viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Skills */}
                            {gig.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {gig.skills.map((skill) => (
                                        <span key={skill} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.08)" }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                                <span>⏱ {gig.deadline}</span>
                                <span>👥 {gig.applications} applicants</span>
                            </div>

                            {/* Bottom Row */}
                            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                <span className="text-xl font-bold" style={{ color: "#FFC085" }}>${gig.budget}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/gig/${gig.id}`)}
                                        className="px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
                                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/gig/${gig.id}/apply`)}
                                        className="px-4 py-1.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results count */}
            {!loading && sorted.length > 0 && (
                <p className="text-xs text-center mt-6" style={{ color: "#B2B2D2" }}>
                    Showing {sorted.length} of {gigs.length} gigs in {decodedCategory}
                </p>
            )}
        </TeenlancerLayout>
    );
}
