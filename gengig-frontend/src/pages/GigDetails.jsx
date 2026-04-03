import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

export default function GigDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [relatedGigs, setRelatedGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchGig = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/gigs/${id}`);
                setGig(response.data.gig);
                setRelatedGigs(response.data.relatedGigs);
            } catch (err) {
                console.error("Failed to fetch gig:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGig();
    }, [id]);

    const handleApply = () => {
        if (!token) {
            navigate("/signin");
        } else {
            navigate(`/gig/${id}/apply`);
        }
    };

    const handleSave = async () => {
        setSaved(!saved);
        await api.post(`/gigs/${id}/save`);
    };

    // Loading State
    if (loading) {
        return (
            <div style={{ background: "#060834" }}>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>Loading gig details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Not Found State
    if (!gig) {
        return (
            <div style={{ background: "#060834" }}>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                    <p className="text-5xl mb-4">😕</p>
                    <h2 className="text-white font-bold text-xl mb-2">Gig Not Found</h2>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>This gig may have been removed or doesn't exist.</p>
                    <Link
                        to="/Exploreagig"
                        className="px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    >
                        Browse All Gigs
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">

                {/* Breadcrumb */}
                <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                    <Link to="/home" className="hover:text-white transition-colors">Home</Link>
                    {" / "}
                    <Link to="/Exploreagig" className="hover:text-white transition-colors">Explore</Link>
                    {" / "}
                    <span style={{ color: "#FFC085" }}>{gig.title}</span>
                </p>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left - Main Content */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Hero Image */}
                        {gig.img && (
                            <div className="w-full h-48 md:h-72 rounded-2xl overflow-hidden">
                                <img src={gig.img} alt={gig.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Title + Meta */}
                        <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <span className="text-xs px-3 py-1 rounded-full mb-3 inline-block" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                        {gig.category}
                                    </span>
                                    <h1 className="text-white font-bold mt-2" style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}>
                                        {gig.title}
                                    </h1>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="p-2 rounded-full transition-colors"
                                    style={{ background: saved ? "rgba(255,192,133,0.15)" : "rgba(255,255,255,0.05)" }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={saved ? "#FFC085" : "none"} viewBox="0 0 24 24" stroke="#FFC085">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#B2B2D2" }}>
                                {gig.budget && <span>💰 Budget: <strong className="text-white">{gig.budget}</strong></span>}
                                {gig.deadline && <span>⏱ Deadline: <strong className="text-white">{gig.deadline}</strong></span>}
                                {gig.postedDate && <span>📅 Posted: <strong className="text-white">{gig.postedDate}</strong></span>}
                                {gig.applications !== undefined && <span>👥 Applications: <strong className="text-white">{gig.applications}</strong></span>}
                            </div>
                        </div>

                        {/* Description */}
                        {gig.description && (
                            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-4">About This Gig</h2>
                                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#B2B2D2" }}>
                                    {gig.description}
                                </p>
                            </div>
                        )}

                        {/* Requirements */}
                        {gig.requirements && gig.requirements.length > 0 && (
                            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-4">Requirements</h2>
                                <ul className="flex flex-col gap-3">
                                    {gig.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#B2B2D2" }}>
                                            <span className="mt-0.5 flex-shrink-0" style={{ color: "#FFC085" }}>✓</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Skills */}
                        {gig.skills && gig.skills.length > 0 && (
                            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-4">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {gig.skills.map((skill) => (
                                        <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Sidebar */}
                    <div className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">

                        {/* Apply Card */}
                        <div className="p-6 rounded-2xl sticky top-28" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>Budget</p>
                                    <p className="font-bold text-2xl" style={{ color: "#FFC085" }}>{gig.budget || "—"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>Deadline</p>
                                    <p className="text-white font-semibold">{gig.deadline || "—"}</p>
                                </div>
                            </div>

                            {role === "agent" ? (
                                <p className="text-xs text-center py-3 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "#B2B2D2" }}>
                                    Agents cannot apply to gigs
                                </p>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    Apply Now →
                                </button>
                            )}

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>Safe & secure platform</p>
                            </div>
                        </div>

                        {/* Agent Info */}
                        {gig.agent && (
                            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-4">About the Agent</h2>
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                        style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                                    >
                                        {gig.agent.img ? (
                                            <img src={gig.agent.img} alt={gig.agent.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{gig.agent.name || "Unknown Agent"}</p>
                                        {gig.agent.company && <p className="text-xs" style={{ color: "#FFC085" }}>{gig.agent.company}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    {[
                                        gig.agent.rating && { label: "Rating", value: "⭐ " + gig.agent.rating },
                                        gig.agent.reviews && { label: "Reviews", value: gig.agent.reviews },
                                        gig.agent.gigsPosted && { label: "Gigs Posted", value: gig.agent.gigsPosted },
                                    ].filter(Boolean).map((item) => (
                                        <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                            <span style={{ color: "#B2B2D2" }}>{item.label}</span>
                                            <span className="text-white font-medium">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Gigs */}
                {relatedGigs.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-white font-bold mb-6" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
                            Related <span className="text-gradient">Gigs</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {relatedGigs.map((g) => (
                                <Link
                                    key={g.id}
                                    to={"/gig/" + g.id}
                                    className="rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                                >
                                    {g.img && <img src={g.img} alt={g.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />}
                                    <div className="p-4">
                                        {g.category && <p className="text-xs mb-1" style={{ color: "#FFC085" }}>{g.category}</p>}
                                        <p className="text-white font-semibold text-sm mb-2">{g.title}</p>
                                        {g.budget && <p className="font-bold text-sm" style={{ color: "#FFC085" }}>{g.budget}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}