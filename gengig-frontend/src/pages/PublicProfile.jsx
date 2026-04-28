import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

export default function PublicProfile() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // ✅ Uses slug instead of ID — GET /users/:slug
                const res = await api.get(`/users/${slug}`);
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                if (err.response?.status === 404) setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProfile();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ background: "#060834" }}>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                </div>
                <Footer />
            </div>
        );
    }

    if (notFound || !profile) {
        return (
            <div style={{ background: "#060834" }}>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                    <p className="text-5xl mb-4">👤</p>
                    <h2 className="text-white font-bold text-xl mb-2">Profile Not Found</h2>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                        This profile doesn't exist or may have been removed.
                    </p>
                    <button onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        Go Back
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const averageRating = profile.reviews?.length > 0
        ? (profile.reviews.reduce((s, r) => s + r.stars, 0) / profile.reviews.length).toFixed(1)
        : null;

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">

                <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                    Home › <span style={{ color: "#FFC085" }}>Profile</span>
                </p>

                {/* Profile Header */}
                <div className="p-6 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ border: "3px solid #FFC085", background: "rgba(255,192,133,0.1)" }}>
                        {profile.photo ? (
                            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold" style={{ color: "#FFC085" }}>
                                {profile.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-white font-bold text-2xl tracking-tight mb-1">{profile.name}</h1>
                        <p className="text-sm mb-2" style={{ color: "#FFC085" }}>
                            {profile.role === "teenlancer" ? "Teenlancer" : "Agent"}
                            {profile.skills?.length > 0 && " · " + profile.skills.slice(0, 2).join(", ")}
                            {profile.company && " · " + profile.company}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                            {profile.location && <span>📍 {profile.location}</span>}
                            {profile.hourlyRate && <span>💰 ${profile.hourlyRate}/hr</span>}
                            {profile.availability && <span>🕐 {profile.availability}</span>}
                            {averageRating && <span>⭐ {averageRating} rating</span>}
                            {profile.reviews?.length > 0 && <span>💬 {profile.reviews.length} reviews</span>}
                        </div>
                    </div>
                    {/* Message button — only show if logged in and not own profile */}
                    {localStorage.getItem("token") && localStorage.getItem("slug") !== slug && (
                        <button
                            onClick={() => navigate("/teenlancer/chat", {
                                state: { openContact: { id: profile.id, name: profile.name, photo: profile.photo } }
                            })}
                            className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            💬 Message
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left */}
                    <div className="flex flex-col gap-6">

                        {/* Bio */}
                        {profile.bio && (
                            <div className="p-6 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-3">About</h2>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{profile.bio}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {profile.skills?.length > 0 && (
                            <div className="p-6 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium"
                                            style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.3)" }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        {profile.stats && (
                            <div className="p-6 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-4">Stats</h2>
                                <div className="flex flex-col gap-3">
                                    {profile.role === "teenlancer" ? (
                                        <>
                                            {[
                                                { label: "Completed Gigs", value: profile.stats.completedGigs ?? "0" },
                                                { label: "Total Earnings", value: profile.stats.totalEarnings ?? "$0" },
                                                { label: "Response Rate", value: profile.stats.responseRate ?? "—" },
                                                { label: "On Time Delivery", value: profile.stats.onTimeDelivery ?? "—" },
                                            ].map(s => (
                                                <div key={s.label} className="flex items-center justify-between">
                                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>{s.label}</span>
                                                    <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{s.value}</span>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {[
                                                { label: "Gigs Posted", value: profile.stats.gigsPosted ?? "0" },
                                                { label: "Teenlancers Hired", value: profile.stats.teenlancersHired ?? "0" },
                                                { label: "Completion Rate", value: profile.stats.completionRate ?? "—" },
                                            ].map(s => (
                                                <div key={s.label} className="flex items-center justify-between">
                                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>{s.label}</span>
                                                    <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{s.value}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Portfolio — teenlancers only */}
                        {profile.role === "teenlancer" && profile.portfolio?.length > 0 && (
                            <div className="p-6 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-4">
                                    Portfolio
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                        {profile.portfolio.length} items
                                    </span>
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {profile.portfolio.map((item, i) => (
                                        <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer">
                                            <img src={item.img} alt={item.title}
                                                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute inset-0"
                                                style={{ background: "linear-gradient(to top, rgba(6,8,52,0.9) 40%, transparent)" }} />
                                            <div className="absolute bottom-0 left-0 p-3">
                                                <p className="text-white text-sm font-semibold">{item.title}</p>
                                                {item.category && <p className="text-xs" style={{ color: "#FFC085" }}>{item.category}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {profile.reviews?.length > 0 && (
                            <div className="p-6 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h2 className="text-white font-semibold mb-4">
                                    Reviews & Ratings
                                    {averageRating && (
                                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                            style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                            ⭐ {averageRating}
                                        </span>
                                    )}
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {profile.reviews.map((r, i) => (
                                        <div key={r.id || i} className="p-4 rounded-xl"
                                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
                                                        style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}>
                                                        {r.img ? (
                                                            <img src={r.img} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                                                                {r.name?.charAt(0) || "?"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-semibold">{r.name}</p>
                                                        {r.role && <p className="text-xs" style={{ color: "#B2B2D2" }}>{r.role}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, j) => (
                                                        <span key={j} style={{ color: j < r.stars ? "#FFC085" : "#555" }}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                            {r.text && <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{r.text}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}