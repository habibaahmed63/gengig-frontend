import { useState, useEffect } from "react";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";
import { Link } from "react-router-dom";

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

function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg flex items-center gap-2"
            style={{
                background: toast.type === "error"
                    ? "rgba(248,113,113,0.95)"
                    : "linear-gradient(90deg, #FFC085, #e8a060)",
            }}>
            <span>{toast.type === "error" ? "✕" : "✓"}</span>
            {toast.message}
        </div>
    );
}

export default function TeenlancerProfile() {
    const [editMode, setEditMode] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    const [toast, setToast] = useState(null);
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

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
    const [newPortfolioItem, setNewPortfolioItem] = useState({ title: "", category: "", img: null, imgPreview: null, uploading: false });
    const [showAddPortfolio, setShowAddPortfolio] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            setProfileLoading(true);
            try {
                const profileRes = await api.get("/users/profile");
                const d = profileRes.data;
                const updatedProfile = {
                    name: d.name || localStorage.getItem("name") || "",
                    photo: d.photo || localStorage.getItem("photo") || null,
                    bio: d.bio || localStorage.getItem("bio") || "",
                    location: d.location || localStorage.getItem("location") || "",
                    skills: d.skills || JSON.parse(localStorage.getItem("skills") || "[]"),
                    portfolio: d.portfolio || JSON.parse(localStorage.getItem("portfolio") || "[]"),
                    hourlyRate: d.hourlyRate || localStorage.getItem("hourlyRate") || "",
                    availability: d.availability || localStorage.getItem("availability") || "",
                };
                setProfile(updatedProfile);
                setEditData({ ...updatedProfile });
                localStorage.setItem("name", updatedProfile.name);
                localStorage.setItem("bio", updatedProfile.bio);
                localStorage.setItem("location", updatedProfile.location);
                localStorage.setItem("hourlyRate", updatedProfile.hourlyRate);
                localStorage.setItem("availability", updatedProfile.availability);
                localStorage.setItem("skills", JSON.stringify(updatedProfile.skills));
                localStorage.setItem("portfolio", JSON.stringify(updatedProfile.portfolio));
                if (updatedProfile.photo) localStorage.setItem("photo", updatedProfile.photo);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            } finally {
                setProfileLoading(false);
            }

            setStatsLoading(true);
            try {
                const statsRes = await api.get("/teenlancer/stats");
                setStats(statsRes.data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setStatsLoading(false);
            }

            setReviewsLoading(true);
            try {
                const reviewsRes = await api.get("/teenlancer/reviews");
                setReviews(reviewsRes.data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
        : null;

    const compressImage = (file, maxSize = 400, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let w = img.width, h = img.height;
                    if (w > maxSize || h > maxSize) {
                        if (w > h) { h = Math.round((h * maxSize) / w); w = maxSize; }
                        else { w = Math.round((w * maxSize) / h); h = maxSize; }
                    }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL("image/jpeg", quality));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast("Image is too large. Please choose an image under 2MB.", "error");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await api.post("/uploads/image", formData);
            setEditData(prev => ({ ...prev, photo: res.data.url }));
        } catch {
            const compressed = await compressImage(file, 400, 0.7);
            setEditData(prev => ({ ...prev, photo: compressed }));
        }
    };

    const handleSkillToggle = (skill) => {
        setEditData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    const handlePortfolioImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast("Image is too large. Please choose an image under 2MB.", "error");
            return;
        }
        setNewPortfolioItem(prev => ({ ...prev, uploading: true }));
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await api.post("/uploads/image", formData);
            setNewPortfolioItem(prev => ({ ...prev, img: res.data.url, imgPreview: res.data.url, uploading: false }));
        } catch {
            const compressed = await compressImage(file, 600, 0.75);
            setNewPortfolioItem(prev => ({ ...prev, img: file, imgPreview: compressed, uploading: false }));
        }
    };

    const handleAddPortfolio = () => {
        if (!newPortfolioItem.title || !newPortfolioItem.imgPreview) return;
        const item = {
            title: newPortfolioItem.title,
            category: newPortfolioItem.category,
            img: newPortfolioItem.imgPreview,
        };
        setEditData(prev => ({ ...prev, portfolio: [...prev.portfolio, item] }));
        setNewPortfolioItem({ title: "", category: "", img: null, imgPreview: null, uploading: false });
        setShowAddPortfolio(false);
    };

    const handleRemovePortfolio = (index) => {
        setEditData(prev => ({
            ...prev,
            portfolio: prev.portfolio.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const res = await api.put("/users/profile", {
                name: editData.name,
                bio: editData.bio,
                location: editData.location,
                skills: editData.skills,
                portfolio: editData.portfolio,
                hourlyRate: editData.hourlyRate,
                availability: editData.availability,
                photo: editData.photo,
            });
            const savedData = res.data || editData;
            localStorage.setItem("name", savedData.name || editData.name);
            localStorage.setItem("bio", savedData.bio || editData.bio);
            localStorage.setItem("location", savedData.location || editData.location);
            localStorage.setItem("skills", JSON.stringify(savedData.skills || editData.skills));
            localStorage.setItem("portfolio", JSON.stringify(savedData.portfolio || editData.portfolio));
            localStorage.setItem("hourlyRate", savedData.hourlyRate || editData.hourlyRate);
            localStorage.setItem("availability", savedData.availability || editData.availability);
            if (editData.photo) {
                localStorage.setItem("photo", savedData.photo || editData.photo);
                window.dispatchEvent(new Event("storage"));
            }
            setProfile({ ...editData });
            setEditMode(false);
            showToast("Profile saved successfully!");
        } catch (err) {
            console.error("Failed to save profile:", err);
            showToast("Failed to save profile. Please try again.", "error");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({ ...profile });
        setEditMode(false);
        setShowAddPortfolio(false);
    };

    if (profileLoading) {
        return (
            <TeenlancerLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                </div>
            </TeenlancerLayout>
        );
    }

    return (
        <TeenlancerLayout>
            <Toast toast={toast} />


            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                <Link to="/home" className="hover:text-[#FFC085] transition-colors">Home</Link>
                {" › "}
                <span style={{ color: "#FFC085" }}>Profile</span>
            </p>

            {/* Profile Header */}
            <div className="p-6 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ border: "3px solid #FFC085", background: "rgba(255,192,133,0.1)" }}>
                        {(editMode ? editData.photo : profile.photo) ? (
                            <img src={editMode ? editData.photo : profile.photo} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold" style={{ color: "#FFC085" }}>
                                {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                            </span>
                        )}
                    </div>
                    {editMode && (
                        <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ background: "#FFC085", color: "#060834" }}>
                            ✎
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                    )}
                </div>

                <div className="flex-1">
                    {editMode ? (
                        <input type="text" value={editData.name}
                            onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
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
                        Teenlancer{profile.skills.length > 0 && " · " + profile.skills.slice(0, 2).join(", ")}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#B2B2D2" }}>
                        {editMode ? (
                            <input type="text" value={editData.location}
                                onChange={e => setEditData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="📍 Your location (e.g. Cairo, Egypt)"
                                className="rounded-xl px-4 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        ) : (
                            <>
                                {profile.location && <span>📍 {profile.location}</span>}
                                {profile.hourlyRate && <span>💰 ${profile.hourlyRate}/hr</span>}
                                {profile.availability && <span>🕐 {profile.availability}</span>}
                                {averageRating && <span>⭐ {averageRating} rating</span>}
                                {reviews.length > 0 && <span>💬 {reviews.length} reviews</span>}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 flex-shrink-0">
                    {editMode ? (
                        <>
                            <button onClick={handleCancel}
                                className="px-5 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-white/10"
                                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#B2B2D2" }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saveLoading}
                                className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                {saveLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setEditMode(true)}
                            className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
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
                            <textarea value={editData.bio}
                                onChange={e => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell clients about yourself..." rows={4}
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
                                {skillsList.map(skill => (
                                    <button key={skill} onClick={() => handleSkillToggle(skill)}
                                        className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                                        style={{
                                            background: editData.skills.includes(skill) ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                                            color: editData.skills.includes(skill) ? "white" : "#B2B2D2",
                                            border: editData.skills.includes(skill) ? "none" : "1px solid rgba(255,255,255,0.1)",
                                        }}>
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        ) : profile.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.3)" }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic" style={{ color: "rgba(178,178,210,0.4)" }}>No skills added yet.</p>
                        )}
                    </div>

                    {/* Availability & Rate — edit only */}
                    {editMode && (
                        <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <h2 className="text-white font-semibold mb-4">Availability & Rate</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs" style={{ color: "#B2B2D2" }}>Hourly Rate (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#FFC085" }}>$</span>
                                        <input type="number" value={editData.hourlyRate}
                                            onChange={e => setEditData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                                            placeholder="0"
                                            className="w-full rounded-xl pl-7 pr-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs" style={{ color: "#B2B2D2" }}>Availability</label>
                                    <select value={editData.availability}
                                        onChange={e => setEditData(prev => ({ ...prev, availability: e.target.value }))}
                                        className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                        <option value="" style={{ background: "#060834" }}>Select availability</option>
                                        {["Full-time", "Part-time", "Weekends only", "Flexible"].map(o => (
                                            <option key={o} style={{ background: "#060834" }}>{o}</option>
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
                                <div className="w-6 h-6 rounded-full border-2 animate-spin"
                                    style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                            </div>
                        ) : stats ? (
                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Completed Gigs", value: stats.completedGigs ?? "0" },
                                    { label: "Total Earnings", value: stats.totalEarnings ?? "$0" },
                                    { label: "Response Rate", value: stats.responseRate ?? "—" },
                                    { label: "On Time Delivery", value: stats.onTimeDelivery ?? "—" },
                                ].map(stat => (
                                    <div key={stat.label} className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</span>
                                        <span className="text-sm font-semibold"
                                            style={{ color: stat.value === "—" || stat.value === "0" || stat.value === "$0" ? "rgba(178,178,210,0.5)" : "#FFC085" }}>
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
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                        {profile.portfolio.length} items
                                    </span>
                                )}
                            </h2>
                            {editMode && (
                                <button onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                                    className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                                    style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                    + Add Work
                                </button>
                            )}
                        </div>

                        {editMode && showAddPortfolio && (
                            <div className="p-4 rounded-xl mb-4 flex flex-col gap-3"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,192,133,0.2)" }}>
                                <input type="text" value={newPortfolioItem.title}
                                    onChange={e => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Project title"
                                    className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <input type="text" value={newPortfolioItem.category}
                                    onChange={e => setNewPortfolioItem(prev => ({ ...prev, category: e.target.value }))}
                                    placeholder="Category (e.g. UI/UX, Logo Design)"
                                    className="w-full rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <label className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                                    style={{ border: "1px dashed rgba(255,255,255,0.15)" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>
                                        {newPortfolioItem.uploading ? "Uploading..." : newPortfolioItem.imgPreview ? "Image ready ✓" : "Upload project image"}
                                    </span>
                                    <input type="file" accept="image/*" className="hidden"
                                        onChange={handlePortfolioImage} disabled={newPortfolioItem.uploading} />
                                </label>
                                {newPortfolioItem.imgPreview && !newPortfolioItem.uploading && (
                                    <img src={newPortfolioItem.imgPreview} alt="preview" className="w-full h-28 object-cover rounded-xl" />
                                )}
                                <div className="flex gap-2">
                                    <button onClick={handleAddPortfolio}
                                        disabled={!newPortfolioItem.title || !newPortfolioItem.imgPreview || newPortfolioItem.uploading}
                                        className="flex-1 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                        Add to Portfolio
                                    </button>
                                    <button onClick={() => setShowAddPortfolio(false)}
                                        className="px-4 py-2 rounded-full text-sm transition-colors hover:bg-white/10"
                                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {(editMode ? editData.portfolio : profile.portfolio).length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {(editMode ? editData.portfolio : profile.portfolio).map((item, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer">
                                        <img src={item.img} alt={item.title}
                                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0"
                                            style={{ background: "linear-gradient(to top, rgba(6,8,52,0.9) 40%, transparent)" }} />
                                        <div className="absolute bottom-0 left-0 p-3">
                                            <p className="text-white text-sm font-semibold">{item.title}</p>
                                            {item.category && <p className="text-xs" style={{ color: "#FFC085" }}>{item.category}</p>}
                                        </div>
                                        {editMode && (
                                            <button onClick={() => handleRemovePortfolio(i)}
                                                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ background: "rgba(248,113,113,0.9)", color: "white" }}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 rounded-xl"
                                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-medium text-white mb-1">No portfolio items yet</p>
                                <p className="text-xs mb-3" style={{ color: "#B2B2D2" }}>
                                    {editMode ? "Click Add Work to showcase your projects." : "Edit your profile to add portfolio items."}
                                </p>
                                {!editMode && (
                                    <button onClick={() => setEditMode(true)}
                                        className="text-xs px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity text-white"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
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
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                        ⭐ {averageRating}
                                    </span>
                                )}
                            </h2>
                        </div>
                        {reviewsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 rounded-full border-2 animate-spin"
                                    style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {reviews.map((r, i) => (
                                    <div key={r.id || i} className="p-4 rounded-xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                                    style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}>
                                                    {r.img ? <img src={r.img} alt="" className="w-full h-full object-cover" /> : (
                                                        <span className="text-xs font-bold" style={{ color: "#FFC085" }}>{r.name?.charAt(0) || "?"}</span>
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
                            <div className="flex flex-col items-center justify-center py-10 rounded-xl"
                                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                                <p className="text-sm font-medium text-white mb-1">No reviews yet</p>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>Complete gigs to start receiving reviews.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeenlancerLayout>
    );
}