import { useState, useEffect } from "react";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";

const skillsList = [
    "UI/UX Design", "Logo Design", "Graphic Design", "Video Editing",
    "Motion Graphics", "Photography", "Web Development", "Content Writing",
    "Social Media", "Animation"
];

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function TeenlancerProfile() {
    const [editMode, setEditMode] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [profile, setProfile] = useState({
        name: localStorage.getItem("name") || "",
        photo: localStorage.getItem("photo") || null,
        bio: localStorage.getItem("bio") || "",
        location: localStorage.getItem("location") || "",
        skills: JSON.parse(localStorage.getItem("skills") || "[]"),
        portfolio: JSON.parse(localStorage.getItem("portfolio") || "[]"),
        hourlyRate: localStorage.getItem("hourlyRate") || "",
        availability: localStorage.getItem("availability") || "",
    });
    const [editData, setEditData] = useState({ ...profile });
    const [newPortfolioItem, setNewPortfolioItem] = useState({ title: "", category: "", img: null, imgPreview: null });
    const [showAddPortfolio, setShowAddPortfolio] = useState(false);

    // Dynamic data
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            // Fetch stats
            setStatsLoading(true);
            try {
                // TODO: Replace with API call: GET /teenlancer/stats
                // const statsRes = await api.get("/teenlancer/stats");
                // setStats(statsRes.data);

                // Mock until backend ready
                setStats({
                    completedGigs: 0,
                    totalEarnings: "$0",
                    responseRate: "—",
                    onTimeDelivery: "—",
                    rating: "—",
                });
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setStatsLoading(false);
            }

            // Fetch reviews
            setReviewsLoading(true);
            try {
                // TODO: Replace with API call: GET /teenlancer/reviews
                // const reviewsRes = await api.get("/teenlancer/reviews");
                // setReviews(reviewsRes.data);

                // Mock until backend ready — empty so empty state shows
                setReviews([]);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
        : null;

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setEditData((prev) => ({ ...prev, photo: base64 }));
        }
    };

    const handleSkillToggle = (skill) => {
        setEditData((prev) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s) => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    const handlePortfolioImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setNewPortfolioItem((prev) => ({ ...prev, img: file, imgPreview: base64 }));
        }
    };

    const handleAddPortfolio = () => {
        if (!newPortfolioItem.title || !newPortfolioItem.imgPreview) return;
        const item = {
            title: newPortfolioItem.title,
            category: newPortfolioItem.category,
            img: newPortfolioItem.imgPreview,
        };
        setEditData((prev) => ({ ...prev, portfolio: [...prev.portfolio, item] }));
        setNewPortfolioItem({ title: "", category: "", img: null, imgPreview: null });
        setShowAddPortfolio(false);
    };

    const handleRemovePortfolio = (index) => {
        setEditData((prev) => ({
            ...prev,
            portfolio: prev.portfolio.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            // TODO: Replace with API call: PUT /users/profile
            // await api.put("/users/profile", {
            //   name: editData.name,
            //   bio: editData.bio,
            //   location: editData.location,
            //   skills: editData.skills,
            //   portfolio: editData.portfolio,
            //   hourlyRate: editData.hourlyRate,
            //   availability: editData.availability,
            //   photo: editData.photo,
            // });

            localStorage.setItem("name", editData.name);
            localStorage.setItem("bio", editData.bio);
            localStorage.setItem("location", editData.location);
            localStorage.setItem("skills", JSON.stringify(editData.skills));
            localStorage.setItem("portfolio", JSON.stringify(editData.portfolio));
            localStorage.setItem("hourlyRate", editData.hourlyRate);
            localStorage.setItem("availability", editData.availability);
            if (editData.photo) localStorage.setItem("photo", editData.photo);

            setProfile({ ...editData });
            setEditMode(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({ ...profile });
        setEditMode(false);
        setShowAddPortfolio(false);
    };

    return (
        <TeenlancerLayout>
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
                        Teenlancer
                        {profile.skills.length > 0 && " · " + profile.skills.slice(0, 2).join(", ")}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                        {editMode ? (
                            <input
                                type="text"
                                value={editData.location}
                                onChange={(e) => setEditData((prev) => ({ ...prev, location: e.target.value }))}
                                placeholder="📍 Your location (e.g. Cairo, Egypt)"
                                className="rounded-xl px-4 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        ) : (
                            <>
                                {profile.location && <span>{"📍 " + profile.location}</span>}
                                {profile.hourlyRate && <span>{"💰 $" + profile.hourlyRate + "/hr"}</span>}
                                {profile.availability && <span>{"🕐 " + profile.availability}</span>}
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
                                placeholder="Tell clients about yourself..."
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

                    {/* Skills */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h2 className="text-white font-semibold mb-3">Skills</h2>
                        {editMode ? (
                            <div className="flex flex-wrap gap-2">
                                {skillsList.map((skill) => (
                                    <button
                                        key={skill}
                                        onClick={() => handleSkillToggle(skill)}
                                        className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                                        style={{
                                            background: editData.skills.includes(skill) ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                                            color: editData.skills.includes(skill) ? "white" : "#B2B2D2",
                                            border: editData.skills.includes(skill) ? "none" : "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        ) : profile.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.3)" }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic" style={{ color: "rgba(178,178,210,0.4)" }}>No skills added yet.</p>
                        )}
                    </div>

                    {/* Availability & Rate — edit mode only */}
                    {editMode && (
                        <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <h2 className="text-white font-semibold mb-4">Availability & Rate</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs" style={{ color: "#B2B2D2" }}>Hourly Rate (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#FFC085" }}>$</span>
                                        <input
                                            type="number"
                                            value={editData.hourlyRate}
                                            onChange={(e) => setEditData((prev) => ({ ...prev, hourlyRate: e.target.value }))}
                                            placeholder="0"
                                            className="w-full rounded-xl pl-7 pr-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs" style={{ color: "#B2B2D2" }}>Availability</label>
                                    <select
                                        value={editData.availability}
                                        onChange={(e) => setEditData((prev) => ({ ...prev, availability: e.target.value }))}
                                        className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    >
                                        <option value="" style={{ background: "#060834" }}>Select availability</option>
                                        <option style={{ background: "#060834" }}>Full-time</option>
                                        <option style={{ background: "#060834" }}>Part-time</option>
                                        <option style={{ background: "#060834" }}>Weekends only</option>
                                        <option style={{ background: "#060834" }}>Flexible</option>
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
                                    { label: "Completed Gigs", value: stats.completedGigs ?? "0" },
                                    { label: "Total Earnings", value: stats.totalEarnings ?? "$0" },
                                    { label: "Response Rate", value: stats.responseRate ?? "—" },
                                    { label: "On Time Delivery", value: stats.onTimeDelivery ?? "—" },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</span>
                                        <span
                                            className="text-sm font-semibold"
                                            style={{ color: stat.value === "—" || stat.value === "0" || stat.value === "$0" ? "rgba(178,178,210,0.5)" : "#FFC085" }}
                                        >
                                            {stat.value}
                                        </span>
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

                    {/* Portfolio */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold">
                                Portfolio
                                {!editMode && profile.portfolio.length > 0 && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                        {profile.portfolio.length} items
                                    </span>
                                )}
                            </h2>
                            {editMode && (
                                <button
                                    onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                                    className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                                    style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}
                                >
                                    + Add Work
                                </button>
                            )}
                        </div>

                        {/* Add portfolio form */}
                        {editMode && showAddPortfolio && (
                            <div
                                className="p-4 rounded-xl mb-4 flex flex-col gap-3"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,192,133,0.2)" }}
                            >
                                <input
                                    type="text"
                                    value={newPortfolioItem.title}
                                    onChange={(e) => setNewPortfolioItem((prev) => ({ ...prev, title: e.target.value }))}
                                    placeholder="Project title"
                                    className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <input
                                    type="text"
                                    value={newPortfolioItem.category}
                                    onChange={(e) => setNewPortfolioItem((prev) => ({ ...prev, category: e.target.value }))}
                                    placeholder="Category (e.g. UI/UX, Logo Design)"
                                    className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <label
                                    className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                                    style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>
                                        {newPortfolioItem.imgPreview ? "Image selected ✓" : "Upload project image"}
                                    </span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handlePortfolioImage} />
                                </label>
                                {newPortfolioItem.imgPreview && (
                                    <img src={newPortfolioItem.imgPreview} alt="preview" className="w-full h-28 object-cover rounded-xl" />
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddPortfolio}
                                        disabled={!newPortfolioItem.title || !newPortfolioItem.imgPreview}
                                        className="flex-1 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                    >
                                        Add to Portfolio
                                    </button>
                                    <button
                                        onClick={() => setShowAddPortfolio(false)}
                                        className="px-4 py-2 rounded-full text-sm transition-colors hover:bg-white/10"
                                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Portfolio Grid */}
                        {(editMode ? editData.portfolio : profile.portfolio).length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {(editMode ? editData.portfolio : profile.portfolio).map((item, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,52,0.9) 40%, transparent)" }} />
                                        <div className="absolute bottom-0 left-0 p-3">
                                            <p className="text-white text-sm font-semibold">{item.title}</p>
                                            {item.category && <p className="text-xs" style={{ color: "#FFC085" }}>{item.category}</p>}
                                        </div>
                                        {editMode && (
                                            <button
                                                onClick={() => handleRemovePortfolio(i)}
                                                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ background: "rgba(248,113,113,0.9)", color: "white" }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center py-10 rounded-xl"
                                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-medium text-white mb-1">No portfolio items yet</p>
                                <p className="text-xs mb-3" style={{ color: "#B2B2D2" }}>
                                    {editMode ? "Click Add Work to showcase your projects." : "Edit your profile to add portfolio items."}
                                </p>
                                {!editMode && (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="text-xs px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity text-white"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                    >
                                        Add Portfolio Items
                                    </button>
                                )}
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
                                {reviews.map((r, i) => (
                                    <div
                                        key={r.id || i}
                                        className="p-4 rounded-xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                                    style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}
                                                >
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
                                            <div className="flex gap-0.5 flex-shrink-0">
                                                {[...Array(5)].map((_, j) => (
                                                    <span key={j} style={{ color: j < r.stars ? "#FFC085" : "#555" }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        {r.text && <p className="text-sm" style={{ color: "#B2B2D2" }}>{r.text}</p>}
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
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>Complete gigs to start receiving reviews from agents.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeenlancerLayout>
    );
}