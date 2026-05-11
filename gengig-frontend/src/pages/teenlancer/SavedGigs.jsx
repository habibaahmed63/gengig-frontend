import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";

export default function SavedGigs() {
    const navigate = useNavigate();
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedGigs = async () => {
            setLoading(true);
            try {
                const res = await api.get("/teenlancer/saved-gigs");
                setGigs(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to fetch saved gigs:", err);
                setGigs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedGigs();
    }, []);

    const handleUnsave = async (gigId) => {
        try {
            await api.post(`/gigs/${gigId}/save`); // toggle — same endpoint
            setGigs(prev => prev.filter(g => (g._id || g.id) !== gigId));
        } catch (err) {
            console.error("Failed to unsave gig:", err);
        }
    };

    return (
        <TeenlancerLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                <Link to="/teenlancer/dashboard" className="hover:text-[#FFC085] transition-colors">Dashboard</Link>
                {" › "}
                <span style={{ color: "#FFC085" }}>Saved Gigs</span>
            </p>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-white font-bold text-2xl mb-1">Saved Gigs</h1>
                    <p className="text-sm" style={{ color: "#B2B2D2" }}>
                        Gigs you bookmarked for later
                    </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}>
                    {gigs.length} saved
                </span>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                    <p className="text-sm" style={{ color: "#B2B2D2" }}>Loading saved gigs...</p>
                </div>

            ) : gigs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                        style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none"
                            viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h2 className="text-white font-bold text-lg mb-2">No saved gigs yet</h2>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                        Browse gigs and click the bookmark icon to save them for later.
                    </p>
                    <button onClick={() => navigate("/Exploreagig")}
                        className="px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        Explore Gigs
                    </button>
                </div>

            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {gigs.map(gig => {
                        const gigId = gig._id || gig.id;
                        return (
                            <div key={gigId}
                                className="rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-200"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>

                                {gig.img && (
                                    <div className="h-36 overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`/gig/${gigId}`)}>
                                        <img src={gig.img} alt={gig.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                )}

                                <div className="p-4">
                                    {gig.category && (
                                        <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                                            style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085" }}>
                                            {gig.category}
                                        </span>
                                    )}
                                    <h3 className="text-white font-semibold text-sm mb-1 cursor-pointer hover:text-[#FFC085] transition-colors line-clamp-2"
                                        onClick={() => navigate(`/gig/${gigId}`)}>
                                        {gig.title}
                                    </h3>

                                    {gig.agent && (
                                        <p className="text-xs mb-3" style={{ color: "#B2B2D2" }}>
                                            by {gig.agent.name || "Unknown Agent"}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-xs" style={{ color: "#B2B2D2" }}>
                                            {gig.budget && <span style={{ color: "#FFC085", fontWeight: "600" }}>{gig.budget}</span>}
                                            {gig.deadline && <span>⏱ {gig.deadline}</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => navigate(`/gig/${gigId}/apply`)}
                                                className="text-xs px-3 py-1.5 rounded-full font-medium text-white hover:opacity-90 transition-opacity"
                                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                                Apply
                                            </button>
                                            <button onClick={() => handleUnsave(gigId)}
                                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                                                title="Remove from saved">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="#FFC085"
                                                    viewBox="0 0 24 24" stroke="#FFC085">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Backend note */}
            <p className="text-center text-xs mt-8" style={{ color: "rgba(178,178,210,0.3)" }}>
                Saved gigs are synced to your account
            </p>
        </TeenlancerLayout>
    );
}