import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const statusColor = { Active: "#4ade80", Completed: "#FFC085", Pending: "#63b3ed" };

const industryOptions = [
    "Marketing & Advertising", "Technology", "Education",
    "E-commerce", "Media & Entertainment", "Healthcare",
    "Fashion & Lifestyle", "Other"
];

export default function AgentProfile() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [profile, setProfile] = useState({
        name: localStorage.getItem("name") || "",
        photo: localStorage.getItem("photo") || null,
        bio: localStorage.getItem("bio") || "",
        location: localStorage.getItem("location") || "",
        company: localStorage.getItem("company") || "",
        industry: localStorage.getItem("industry") || "",
    });
    const [editData, setEditData] = useState({ ...profile });

    // Dynamic data
    const [postedGigs, setPostedGigs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [gigsLoading, setGigsLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            // Fetch gigs
            setGigsLoading(true);
            try {
                const gigsRes = await api.get("/agent/gigs");
                setPostedGigs(gigsRes.data);
            } catch (err) {
                console.error("Failed to fetch gigs:", err);
            } finally {
                setGigsLoading(false);
            }

            // Fetch reviews
            setReviewsLoading(true);
            try {
                // TODO: Replace with API call: GET /agent/reviews
                // const reviewsRes = await api.get("/agent/reviews");
                // setReviews(reviewsRes.data);

                // Mock until backend ready
                setReviews([
                    { id: 1, name: "Salma Tamer", role: "Graphic Designer", stars: 5, text: "Working with this agent was a great experience. Very clear instructions and prompt feedback!", img: "https://i.pravatar.cc/40?img=1" },
                    { id: 2, name: "Ahmed Karim", role: "Video Editor", stars: 4, text: "Professional and easy to work with. Always available and responsive.", img: "https://i.pravatar.cc/40?img=2" },
                ]);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setReviewsLoading(false);
            }

            // Fetch stats
            setStatsLoading(true);
            try {
                const statsRes = await api.get("/agent/stats");
                setStats(statsRes.data);


            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setEditData((prev) => ({ ...prev, photo: base64 }));
        }
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const res = await api.put("/users/profile", {
                name: editData.name,
                bio: editData.bio,
                location: editData.location,
                company: editData.company,
                industry: editData.industry,
                photo: editData.photo,
            });

            // Use backend response if available, fall back to editData
            const saved = res.data || editData;
            localStorage.setItem("name", saved.name || editData.name);
            localStorage.setItem("bio", saved.bio || editData.bio);
            localStorage.setItem("location", saved.location || editData.location);
            localStorage.setItem("company", saved.company || editData.company);
            localStorage.setItem("industry", saved.industry || editData.industry);
            if (editData.photo) localStorage.setItem("photo", saved.photo || editData.photo);

            // Update local state — only on success
            setProfile({ ...editData });
            setEditMode(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);

        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to save profile. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({ ...profile });
        setEditMode(false);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <AgentLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Profile</span>
            </p>

            {/* Saved toast */}
            {saved && (
                <div
                    className="fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                >
                    ✓ Profile saved successfully!
                </div>
            )}

            {/* Profile Header */}
            <div
                className="p-6 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div
                        className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ border: "3px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                    >
                        {(editMode ? editData.photo : profile.photo) ? (
                            <img src={editMode ? editData.photo : profile.photo} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold" style={{ color: "#FFC085" }}>
                                {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                            </span>
                        )}
                    </div>
                    {editMode && (
                        <label
                            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ background: "#FFC085", color: "#060834" }}
                        >
                            ✎
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    {editMode ? (
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                            className="w-full rounded-xl px-4 py-2 text-white font-bold text-xl outline-none focus:ring-1 focus:ring-[#FFC085] mb-2"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                    ) : (
                        <h1 className="text-white font-bold text-2xl mb-1">
                            {profile.name || <span style={{ color: "#B2B2D2", fontWeight: 400, fontSize: "1rem" }}>No name set</span>}
                        </h1>
                    )}

                    <p className="text-sm mb-2" style={{ color: "#FFC085" }}>
                        Agent{profile.company ? " · " + profile.company : ""}{profile.industry ? " · " + profile.industry : ""}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                        {editMode ? (
                            <input
                                type="text"
                                value={editData.location}
                                onChange={(e) => setEditData((prev) => ({ ...prev, location: e.target.value }))}
                                placeholder="📍 Your location"
                                className="rounded-xl px-4 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        ) : (
                            <>
                                {profile.location && <span>{"📍 " + profile.location}</span>}
                                {averageRating && <span>{"⭐ " + averageRating + " rating"}</span>}
                                {reviews.length > 0 && <span>{"💬 " + reviews.length + " reviews"}</span>}
                            </>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-shrink-0">
                    {editMode ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="px-5 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-white/10"
                                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#B2B2D2" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saveLoading}
                                className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                {saveLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="flex flex-col gap-6">

                    {/* Bio */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-3">About Me</h2>
                        {editMode ? (
                            <textarea
                                value={editData.bio}
                                onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell teenlancers about yourself and your company..."
                                rows={4}
                                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        ) : profile.bio ? (
                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{profile.bio}</p>
                        ) : (
                            <p className="text-sm italic" style={{ color: "rgba(178,178,210,0.4)" }}>No bio added yet.</p>
                        )}
                    </div>

                    {/* Company & Industry - edit mode only */}
                    {editMode && (
                        <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <h2 className="text-white font-semibold mb-4">Company Info</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs" style={{ color: "#B2B2D2" }}>Company / Business Name</label>
                                    <input
                                        type="text"
                                        value={editData.company}
                                        onChange={(e) => setEditData((prev) => ({ ...prev, company: e.target.value }))}
                                        placeholder="e.g. Creative Studio Co."
                                        className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs" style={{ color: "#B2B2D2" }}>Industry</label>
                                    <select
                                        value={editData.industry}
                                        onChange={(e) => setEditData((prev) => ({ ...prev, industry: e.target.value }))}
                                        className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    >
                                        <option value="" style={{ background: "#060834" }}>Select industry</option>
                                        {industryOptions.map((opt) => (
                                            <option key={opt} style={{ background: "#060834" }}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-4">Stats</h2>
                        {statsLoading ? (
                            <div className="flex justify-center py-4">
                                <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                            </div>
                        ) : stats ? (
                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Gigs Posted", value: stats.gigsPosted ?? "—" },
                                    { label: "Teenlancers Hired", value: stats.teenlancersHired ?? "—" },
                                    { label: "Total Spent", value: stats.totalSpent ?? "—" },
                                    { label: "Completion Rate", value: stats.completionRate ?? "—" },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</span>
                                        <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs italic" style={{ color: "rgba(178,178,210,0.4)" }}>Stats unavailable</p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Posted Gigs */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold">
                                Posted Gigs
                                {!gigsLoading && postedGigs.length > 0 && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                        {postedGigs.length}
                                    </span>
                                )}
                            </h2>
                            <button
                                onClick={() => navigate("/post")}
                                className="text-xs px-3 py-1 rounded-full hover:opacity-80 hover:scale-105 transition-all duration-200"
                                style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}
                            >
                                + Post New Gig
                            </button>
                        </div>

                        {gigsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                            </div>
                        ) : postedGigs.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {postedGigs.map((gig) => (
                                    <div
                                        key={gig.id}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                                        onClick={() => gig.id && navigate("/gig/" + gig.id)}
                                    >
                                        <div>
                                            <p className="text-white text-sm font-medium">{gig.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {gig.category && <p className="text-xs" style={{ color: "#B2B2D2" }}>{gig.category}</p>}
                                                {gig.applications !== undefined && (
                                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>
                                                        · {gig.applications} applicant{gig.applications !== 1 ? "s" : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            {gig.budget && (
                                                <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>{gig.budget}</span>
                                            )}
                                            {gig.status && (
                                                <span
                                                    className="text-xs px-3 py-1 rounded-full font-medium"
                                                    style={{ background: "rgba(255,255,255,0.08)", color: statusColor[gig.status] || "#B2B2D2" }}
                                                >
                                                    {gig.status}
                                                </span>
                                            )}
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
                                <p className="text-sm font-medium text-white mb-1">No gigs posted yet</p>
                                <p className="text-xs mb-4" style={{ color: "#B2B2D2" }}>Post your first gig and start finding teenlancers!</p>
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
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold">
                                Reviews & Ratings
                                {!reviewsLoading && reviews.length > 0 && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                        {"⭐ " + averageRating}
                                    </span>
                                )}
                            </h2>
                        </div>

                        {reviewsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {reviews.map((r) => (
                                    <div
                                        key={r.id}
                                        className="p-4 rounded-xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                                    style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}
                                                >
                                                    {r.img ? (
                                                        <img src={r.img} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                                                            {r.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-semibold">{r.name}</p>
                                                    {r.role && <p className="text-xs" style={{ color: "#B2B2D2" }}>{r.role}</p>}
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 flex-shrink-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} style={{ color: i < r.stars ? "#FFC085" : "#555" }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        {r.text && <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{r.text}</p>}
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
                                <p className="text-sm font-medium text-white mb-1">No reviews yet</p>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>Reviews will appear here after completing gigs.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}