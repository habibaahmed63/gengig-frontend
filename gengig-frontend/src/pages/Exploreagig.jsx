import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const categories = [
    { label: "Graphic Design", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400" },
    { label: "Logo Design", img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400" },
    { label: "Video Editing", img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400" },
    { label: "Web Design", img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400" },
    { label: "Photography", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400" },
];

const tips = [
    { title: "Respect the Clock", desc: "Always confirm deadlines early — and deliver before they expect it. Reliability builds reputation faster than talent alone.", img: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400" },
    { title: "Keep It Clear", desc: "A short, polite message beats a long confusing one. Always restate what you understood from the client — it shows you listen.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400" },
    { title: "Save Everything Smart", desc: "Organize your files neatly with clear names and folders. Small detail, big difference — professionalism starts here.", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400" },
    { title: "Show Progress", desc: "If something goes wrong, update the client early. Clients appreciate honesty and effort over silence and last-minute excuses.", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
];

export default function ExplorePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState(0);
    const [email, setEmail] = useState("");
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [recommended, setRecommended] = useState([]);
    const [recommendedLoading, setRecommendedLoading] = useState(true);

    const role = localStorage.getItem("role");
    const skills = JSON.parse(localStorage.getItem("skills") || "[]");

    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
            const idx = categories.findIndex(c =>
                c.label.toLowerCase().includes(categoryFromUrl.toLowerCase()) ||
                categoryFromUrl.toLowerCase().includes(c.label.toLowerCase())
            );
            if (idx >= 0) setActiveCategory(idx);
            fetchRecommendedByCategory(categoryFromUrl);
        } else {
            fetchRecommended();
        }
    }, [searchParams]);

    const fetchRecommended = async () => {
        setRecommendedLoading(true);
        try {
            const res = await api.get("/gigs/recommended");
            setRecommended(Array.isArray(res.data) ? res.data : []);
        } catch {
            setRecommended([]);
        } finally {
            setRecommendedLoading(false);
        }
    };

    const fetchRecommendedByCategory = async (category) => {
        setRecommendedLoading(true);
        try {
            const res = await api.get(`/gigs?category=${encodeURIComponent(category)}`);
            setRecommended(Array.isArray(res.data) ? res.data : []);
        } catch {
            setRecommended([]);
        } finally {
            setRecommendedLoading(false);
        }
    };

    const handleSkillClick = (skill) => {
        navigate(`/Exploreagig?category=${encodeURIComponent(skill)}`);
    };

    const handleCategoryClick = (categoryLabel) => {
        if (role === "agent") {
            navigate(`/teenlancers/category/${encodeURIComponent(categoryLabel)}`);
        } else {
            navigate(`/Exploreagig?category=${encodeURIComponent(categoryLabel)}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate("/search?q=" + encodeURIComponent(search.trim()));
    };

    const handleSubscribe = async () => {
        if (!email.trim()) return;
        setEmailLoading(true);
        try {
            await api.post("/newsletter/subscribe", { email });
        } catch { }
        setEmailSubmitted(true);
        setEmail("");
        setEmailLoading(false);
    };

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            <div className="px-6 md:px-8 pt-4 pb-2">
                <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                    <Link to="/home" className="hover:text-[#FFC085] transition-colors">Home</Link>
                    {" › "}
                    <span style={{ color: "#FFC085" }}>Explore a gig</span>
                </p>
            </div>

            {/* HERO */}
            <section className="py-10 md:py-12 px-6 md:px-8 flex flex-col items-center text-center">
                <h1 className="font-bold text-white mb-2" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                    Your Next <span className="text-gradient">Opportunity</span> Awaits ✦
                </h1>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-3 mb-2">
                        {skills.slice(0, 6).map(skill => (
                            <button key={skill}
                                onClick={() => {
                                    navigate(`/Exploreagig?category=${encodeURIComponent(skill)}`);
                                    setTimeout(() => {
                                        document.getElementById("recommended-section")?.scrollIntoView({ behavior: "smooth" });
                                    }, 300);
                                }}
                                className="text-xs px-3 py-1.5 rounded-full hover:scale-105 hover:opacity-90 transition-all duration-200 cursor-pointer"
                                style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.25)" }}>
                                {skill}
                            </button>
                        ))}
                    </div>
                )}
                {searchParams.get("category") && (
                    <div className="flex items-center gap-2 mt-2 mb-1">
                        <span className="text-xs px-3 py-1 rounded-full font-medium"
                            style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.3)" }}>
                            Showing: {searchParams.get("category")}
                        </span>
                        <button onClick={() => navigate("/Exploreagig")}
                            className="text-xs hover:opacity-80 transition-opacity"
                            style={{ color: "#B2B2D2" }}>
                            ✕ Clear
                        </button>
                    </div>
                )}

                <form onSubmit={handleSearch}
                    className="mt-6 w-full max-w-md flex items-center gap-2 rounded-full px-4 py-2.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text"
                        placeholder={role === "agent" ? "Search for teenlancers or gigs..." : "Search for gigs..."}
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#B2B2D2]" />
                    <button type="submit" className="text-[#FFC085] hover:opacity-80 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>
            </section>

            {/* SKILL ZONE */}
            <section className="py-10 px-6 md:px-8 text-center overflow-hidden">
                <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 2.2rem)" }}>
                    Tap Into Your <span className="text-gradient">Skill Zone</span>
                </h2>
                <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                    {role === "agent"
                        ? "Find teenlancers by the skills your project needs."
                        : "From creative to tech — explore gigs built around your strengths."}
                </p>

                {/* Desktop Carousel */}
                <div className="hidden md:flex items-center justify-center gap-8 relative max-w-5xl mx-auto">
                    <button onClick={() => setActiveCategory(prev => Math.max(prev - 1, 0))}
                        disabled={activeCategory === 0}
                        className="z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFC085] hover:text-[#060834] transition-all disabled:opacity-30"
                        style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
                        ‹
                    </button>
                    <div className="overflow-hidden w-full py-10">
                        <div className="flex items-center justify-center gap-6 transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(calc(0px - (${activeCategory} * 10px)))` }}>
                            {categories.map((cat, i) => {
                                const isActive = i === activeCategory;
                                return (
                                    <div key={cat.label}
                                        onClick={() => { setActiveCategory(i); handleCategoryClick(cat.label); }}
                                        className="cursor-pointer flex flex-col items-center gap-4 transition-all duration-500"
                                        style={{
                                            transform: isActive ? "scale(1.2)" : "scale(0.85)",
                                            opacity: isActive ? 1 : 0.4,
                                            minWidth: isActive ? "180px" : "120px",
                                            filter: isActive ? "none" : "grayscale(80%)",
                                        }}>
                                        <img src={cat.img} alt={cat.label}
                                            className="rounded-2xl object-cover shadow-2xl transition-all duration-500"
                                            style={{
                                                width: isActive ? "180px" : "120px",
                                                height: isActive ? "240px" : "160px",
                                                border: isActive ? "3px solid #FFC085" : "1px solid rgba(255,255,255,0.1)",
                                            }} />
                                        <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${isActive ? "text-[#FFC085]" : "text-white"}`}>
                                            {cat.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button onClick={() => setActiveCategory(prev => Math.min(prev + 1, categories.length - 1))}
                        disabled={activeCategory === categories.length - 1}
                        className="z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFC085] hover:text-[#060834] transition-all disabled:opacity-30"
                        style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
                        ›
                    </button>
                </div>

                {/* Mobile grid */}
                <div className="md:hidden grid grid-cols-2 gap-3">
                    {categories.map((cat, i) => (
                        <div key={cat.label}
                            onClick={() => { setActiveCategory(i); handleCategoryClick(cat.label); }}
                            className="flex flex-col items-center gap-2 cursor-pointer rounded-xl overflow-hidden"
                            style={{ border: i === activeCategory ? "2px solid #FFC085" : "2px solid transparent" }}>
                            <img src={cat.img} alt={cat.label} className="w-full h-28 object-cover rounded-xl" />
                            <span className="text-white text-xs font-medium pb-2">{cat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* RECOMMENDED */}

            <section id="recommended-section" className="py-10 md:py-12 px-6 md:px-8 text-center">
                <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 2.2rem)" }}>
                    {searchParams.get("category")
                        ? <>{searchParams.get("category")} <span className="text-gradient">Gigs</span></>
                        : <>Recommended <span className="text-gradient">For You</span></>
                    }
                </h2>
                <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                    {searchParams.get("category")
                        ? `Gigs matching "${searchParams.get("category")}"`
                        : skills.length > 0
                            ? "Gigs matched to your skills — " + skills.slice(0, 2).join(", ")
                            : "Opportunities that push your limits and level up your skills."}
                </p>

                {recommendedLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 rounded-full border-2 animate-spin"
                            style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                    </div>
                ) : recommended.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {recommended.map(gig => (
                            <div key={gig._id || gig.title}
                                onClick={() => gig._id && navigate("/gig/" + gig._id)}
                                className="relative rounded-2xl p-5 group cursor-pointer border border-white/5 transition-all duration-300 hover:border-white/20 flex flex-col justify-between min-h-[160px] text-left"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-white/60">
                                        {gig.category || "General"}
                                    </span>
                                    <h3 className="text-white text-base font-semibold line-clamp-2 mb-2 mt-3 group-hover:text-[#FFC085] transition-colors">
                                        {gig.title}
                                    </h3>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div>
                                        <p className="text-xs" style={{ color: "#B2B2D2" }}>Budget</p>
                                        <p className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget || "Competitive"}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                        style={{ background: "#FFC085" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#060834">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 rounded-2xl max-w-4xl mx-auto"
                        style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <p className="text-3xl mb-3">🎯</p>
                        <p className="text-sm font-medium text-white mb-1">No gigs found</p>
                        <p className="text-xs mb-4" style={{ color: "#B2B2D2" }}>
                            {searchParams.get("category")
                                ? `No gigs in "${searchParams.get("category")}" yet.`
                                : "Complete your profile and add skills to get personalized gig recommendations."}
                        </p>
                        {searchParams.get("category") ? (
                            <button onClick={() => navigate("/Exploreagig")}
                                className="text-xs px-4 py-2 rounded-full font-medium hover:opacity-90 text-white"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                View All Gigs
                            </button>
                        ) : (
                            <Link to="/teenlancer/profile"
                                className="text-xs px-4 py-2 rounded-full font-medium hover:opacity-90 text-white"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                Complete Profile
                            </Link>
                        )}
                    </div>
                )}
            </section>

            {/* SMART MOVES */}
            <section className="py-10 md:py-12 px-6 md:px-8 text-center">
                <h2 className="font-bold text-white mb-10" style={{ fontSize: "clamp(1.2rem, 3vw, 2.2rem)" }}>
                    Smart Moves for Every Gig
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {tips.map(tip => (
                        <div key={tip.title}
                            className="relative rounded-2xl overflow-hidden flex flex-col justify-end hover:scale-105 transition-all duration-300"
                            style={{ height: "320px" }}>
                            <img src={tip.img} alt={tip.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,52,0.95) 50%, rgba(6,8,52,0.2))" }} />
                            <div className="relative z-10 p-4 text-left">
                                <h3 className="text-white font-bold text-sm mb-2">{tip.title}</h3>
                                <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="mx-4 md:mx-8 my-12 rounded-2xl overflow-hidden relative" style={{ minHeight: "200px" }}>
                <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200"
                    alt="newsletter" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "rgba(6,8,52,0.7)" }} />
                <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="font-bold mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "#FFC085" }}>
                        We Will Help You To Grow
                    </h2>
                    <p className="text-white text-sm mb-6">Sign Up For Newsletter</p>
                    {emailSubmitted ? (
                        <div className="flex items-center gap-3 max-w-sm">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(74,222,128,0.2)", border: "1px solid #4ade80" }}>
                                <span className="text-sm" style={{ color: "#4ade80" }}>✓</span>
                            </div>
                            <p className="text-sm" style={{ color: "#4ade80" }}>You are subscribed! We will keep you updated.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3 max-w-sm">
                            <input type="email" placeholder="Your email"
                                value={email} onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") handleSubscribe(); }}
                                className="flex-1 rounded-full px-4 py-2 text-white text-sm outline-none"
                                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }} />
                            <button onClick={handleSubscribe} disabled={emailLoading || !email.trim()}
                                className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                {emailLoading ? "Subscribing..." : "Subscribe"}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}