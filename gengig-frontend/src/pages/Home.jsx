import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImg from "../assets/hero section.png";
import api from "../services/api";

const categories = [
    { icon: "🎨", label: "Graphic Design" },
    { icon: "🎬", label: "Video Editing" },
    { icon: "💻", label: "Web Development" },
    { icon: "📱", label: "UI/UX Design" },
    { icon: "📸", label: "Photography" },
    { icon: "✍️", label: "Content Writing" },
    { icon: "📣", label: "Social Media" },
    { icon: "🎵", label: "Music & Audio" },
    { icon: "🏷️", label: "Logo Design" },
    { icon: "🎭", label: "Animation" },
];

const agentSteps = [
    { icon: "📝", title: "Post a Gig", desc: "Describe the work you need done, set your budget, and publish your gig in minutes." },
    { icon: "🔍", title: "Find Your Teenlancer", desc: "Browse profiles, review skills and portfolios, then pick the perfect teenlancer for your project." },
    { icon: "✅", title: "Get It Done", desc: "Collaborate safely, track progress, and receive your completed work on time." },
];

const teenlancerSteps = [
    { icon: "🎨", title: "Build Your Profile", desc: "Showcase your skills, upload your portfolio, and set your availability and hourly rate." },
    { icon: "🔎", title: "Explore Gigs", desc: "Browse available gigs that match your skills and apply to the ones that excite you." },
    { icon: "💰", title: "Get Paid", desc: "Complete the work, impress your client, earn money and build your reputation." },
];

const features = [
    { icon: "💻", title: "Grow Your Skills", desc: "Work on real projects that challenge and develop your abilities." },
    { icon: "👥", title: "Work With Real Clients", desc: "Connect with agents and companies looking for fresh talent." },
    { icon: "🏅", title: "Build Credibility", desc: "Earn badges and reviews that showcase your expertise." },
    { icon: "🛡️", title: "Safe System", desc: "Our platform ensures secure payments and safe collaboration." },
];

// Fallback testimonials — TODO: replace with GET /testimonials
const fallbackTestimonials = [
    { name: "Salma Tamer", role: "Graphic Designer", stars: 5, text: "Gengig helped me land my first real client at 17. The platform is so easy to use and the support is amazing!" },
    { name: "Khaled Ramzy", role: "Marketing Manager", stars: 4, text: "I found incredible young talent through Gengig. Fresh ideas and professional delivery every time." },
    { name: "Mariam Assem", role: "Video Editor", stars: 4, text: "As a teen, I was nervous about freelancing. Gengig made it safe and simple to get started." },
];

export default function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("For Agents");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || "";

    // TODO: Replace with API call: GET /gigs/featured
    const [featuredGigs, setFeaturedGigs] = useState([]);
    const [gigsLoading, setGigsLoading] = useState(true);

    // TODO: Replace with API call: GET /platform/stats
    const [stats, setStats] = useState({
        teenlancers: "500+",
        agents: "200+",
        gigs: "1,000+",
        rating: "4.8★",
    });

    const [testimonials, setTestimonials] = useState(fallbackTestimonials);

    useEffect(() => {
        const fetchHomeData = async () => {
            setGigsLoading(true);
            try {
                // TODO: Uncomment when backend is ready
                // const [gigsRes, statsRes] = await Promise.all([
                //   api.get("/gigs/featured"),
                //   api.get("/platform/stats"),
                // ]);
                // setFeaturedGigs(gigsRes.data);
                // setStats(statsRes.data);

                // Mock featured gigs until backend is ready
                setFeaturedGigs([
                    { id: 1, title: "Brand Identity Design", category: "Graphic Design", budget: "$150", rating: "4.9", reviews: 23, img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400", badge: "Top Rated" },
                    { id: 2, title: "Social Media Campaign", category: "Marketing", budget: "$200", rating: "4.8", reviews: 18, img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400", badge: "Popular" },
                    { id: 3, title: "Mobile App UI Design", category: "UI/UX", budget: "$300", rating: "5.0", reviews: 31, img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400", badge: "New" },
                    { id: 4, title: "Product Video Edit", category: "Video Editing", budget: "$180", rating: "4.7", reviews: 15, img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400", badge: "Top Rated" },
                ]);
            } catch (err) {
                console.error("Failed to fetch home data:", err);
            } finally {
                setGigsLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const handleCategoryClick = (categoryLabel) => {
        const role = localStorage.getItem("role");
        if (role === "agent") {
            // Agents see teenlancers filtered by that skill
            navigate(`/teenlancers/category/${encodeURIComponent(categoryLabel)}`);
        } else {
            // Teenlancers (and logged-out users) see gigs filtered by category
            navigate(`/gigs/category/${encodeURIComponent(categoryLabel)}`);
        }
    };
    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            {/* ───── HERO ───── */}
            <section
                className="relative min-h-screen flex items-center px-6 md:px-16"
                style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(6,8,52,0.95) 50%, rgba(6,8,52,0.3))" }} />
                <div className="relative z-10 max-w-xl">
                    <h1 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                        Empowering the Next Generation of Creators and{" "}
                        <span className="text-gradient">Doers</span>
                    </h1>
                    <p className="mb-8 italic" style={{ color: "#B2B2D2", fontSize: "clamp(0.9rem, 2vw, 1.1rem)" }}>
                        Where Ambition Finds Its First Gig
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {token ? (
                            <Link
                                to={role === "teenlancer" ? "/teenlancer/dashboard" : "/agent/dashboard"}
                                className="px-6 py-3 rounded-full font-semibold text-white text-sm hover:opacity-80 hover:scale-105 transition-all duration-200"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/post"
                                    className="px-6 py-3 rounded-full font-semibold text-white text-sm hover:opacity-80 hover:scale-105 transition-all duration-200"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    Hire Now
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-3 rounded-full font-semibold text-sm text-white border hover:bg-white/20 hover:scale-105 transition-all duration-200"
                                    style={{ borderColor: "rgba(255,255,255,0.4)" }}
                                >
                                    Join as a Teenlancer
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap gap-6 mt-10">
                        {[
                            { value: stats.teenlancers, label: "Teenlancers" },
                            { value: stats.agents, label: "Agents" },
                            { value: stats.gigs, label: "Gigs Done" },
                            { value: stats.rating, label: "Avg Rating" },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="font-bold text-white text-lg">{s.value}</p>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── EXPLORE GENGIG ───── */}
            <section className="py-24 px-6 md:px-16 text-center" style={{ background: "#0a0d2e" }}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-bold text-white mb-3 italic" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        Because every great gig starts with a click
                    </h2>
                    <p className="text-sm mb-14" style={{ color: "#B2B2D2" }}>Explore what Gengig has to offer</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="p-8 rounded-2xl text-left hover:scale-105 hover:border-[#FFC085] transition-all duration-300 cursor-default"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-white font-semibold mb-2 text-lg">{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── HOW IT WORKS ───── */}
            <section className="py-24 px-6 md:px-16 text-center" style={{ background: "#060834" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="text-sm mb-14" style={{ color: "#B2B2D2" }}>Get started in just a few simple steps</p>

                    <div className="flex justify-center mb-12">
                        <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {["For Agents", "For Teenlancers"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
                                    style={{
                                        background: activeTab === tab ? "linear-gradient(90deg, #FFC085, #e8a060)" : "transparent",
                                        color: activeTab === tab ? "white" : "#B2B2D2",
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(activeTab === "For Agents" ? agentSteps : teenlancerSteps).map((step, i) => (
                            <div key={i} className="relative p-8 rounded-2xl text-left hover:scale-105 transition-all duration-300" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-5" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", color: "white" }}>
                                    {i + 1}
                                </div>
                                <div className="text-4xl mb-4">{step.icon}</div>
                                <h3 className="text-white font-semibold mb-2 text-lg">{step.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{step.desc}</p>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-10 -right-4 text-2xl" style={{ color: "#FFC085" }}>→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── CATEGORIES ───── */}
            <section className="py-24 px-6 md:px-16 text-center" style={{ background: "#0a0d2e" }}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        Browse by <span className="text-gradient">Category</span>
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                        {role === "agent"
                            ? "Find talented teenlancers in your field"
                            : "Find the perfect gig for your skills"}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                        {categories.map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => handleCategoryClick(cat.label)}
                                className="flex flex-col items-center gap-3 p-6 rounded-2xl group hover:scale-105 hover:border-[#FFC085] transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform" style={{ background: "rgba(255,192,133,0.1)" }}>
                                    {cat.icon}
                                </div>
                                <p className="text-white text-sm font-medium">{cat.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── BANNER ───── */}
            <section
                className="py-24 px-6 md:px-16 relative overflow-hidden"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0" style={{ background: "rgba(6,8,52,0.82)" }} />
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="font-bold text-white text-center md:text-left mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                            Every Skill Deserves A <span className="text-gradient">Chance</span>
                        </h2>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>
                            {role === "agent"
                                ? "Post your gig and find the right teenlancer today."
                                : "Apply to gigs and start building your career today."}
                        </p>
                    </div>
                    <Link
                        to="/Exploreagig"
                        className="flex-shrink-0 px-10 py-4 rounded-full font-semibold text-white hover:opacity-80 hover:scale-105 transition-all duration-200 text-lg"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    >
                        Explore a Gig →
                    </Link>
                </div>
            </section>

            {/* ───── FEATURED GIGS ───── */}
            <section className="py-24 px-6 md:px-16" style={{ background: "#060834" }}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
                        <div>
                            <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                                Featured <span className="text-gradient">Gigs</span>
                            </h2>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Handpicked opportunities waiting for you</p>
                        </div>
                        <Link
                            to="/Exploreagig"
                            className="text-sm font-medium hover:opacity-80 hover:scale-105 transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
                            style={{ color: "#FFC085" }}
                        >
                            View all gigs →
                        </Link>
                    </div>

                    {gigsLoading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                        </div>
                    ) : featuredGigs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredGigs.map((gig) => (
                                <Link
                                    key={gig.id}
                                    to={"/gig/" + gig.id}
                                    className="rounded-2xl overflow-hidden group hover:scale-105 hover:shadow-lg transition-all duration-300"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                                >
                                    <div className="relative">
                                        <img src={gig.img} alt={gig.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,52,0.7), transparent)" }} />
                                        {gig.badge && (
                                            <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,192,133,0.9)", color: "#060834" }}>
                                                {gig.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        {gig.category && <p className="text-xs mb-1" style={{ color: "#FFC085" }}>{gig.category}</p>}
                                        <h3 className="text-white font-semibold mb-3">{gig.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span style={{ color: "#FFC085" }}>★</span>
                                                <span className="text-xs text-white">{gig.rating}</span>
                                                {gig.reviews && <span className="text-xs" style={{ color: "#B2B2D2" }}>{"(" + gig.reviews + ")"}</span>}
                                            </div>
                                            {gig.budget && <span className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16" style={{ color: "#B2B2D2" }}>
                            <p className="text-4xl mb-4">🎯</p>
                            <p className="text-sm">No featured gigs available yet.</p>
                            <Link
                                to="/Exploreagig"
                                className="inline-block mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                Browse All Gigs
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ───── WORK WITH CREATORS ───── */}
            <section className="py-24 px-6 md:px-16" style={{ background: "#0a0d2e" }}>
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="font-bold text-white mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                            Work With The Best{" "}
                            <span className="text-gradient">Of Creators</span>
                        </h2>
                        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#B2B2D2" }}>
                            Connect with talented teenlancers who bring fresh perspectives, creative energy, and dedication to every project.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-80 hover:scale-105 transition-all duration-200"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Hire Now
                        </Link>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        {[
                            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
                            "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400",
                            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400",
                            "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
                        ].map((img, i) => (
                            <img key={i} src={img} alt="" className="w-full h-40 md:h-52 object-cover rounded-2xl hover:scale-105 transition-transform duration-300" />
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── ABOUT US ───── */}
            <section className="py-24 px-6 md:px-16" style={{ background: "#060834" }}>
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 w-full">
                        <img
                            src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600"
                            alt="About Gengig"
                            className="w-full h-72 md:h-96 object-cover rounded-2xl"
                        />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                            A bit <span className="text-gradient">About Us</span>
                        </h2>
                        <p className="text-sm mb-3 italic" style={{ color: "#FFC085" }}>
                            Where young talent meets real opportunity
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                            GenGig was born from a simple idea — that young people should not have to wait to gain real-world experience. We built a platform where teen creators can showcase their skills, connect with real clients, and start building their professional journey today.
                        </p>
                    </div>
                </div>
            </section>

            {/* ───── TESTIMONIALS ───── */}
            <section className="py-24 px-6 md:px-16 text-center" style={{ background: "#0a0d2e" }}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        What Our Clients Say{" "}
                        <span className="text-gradient">About Us</span>
                    </h2>
                    <p className="text-sm mb-14" style={{ color: "#B2B2D2" }}>Real stories from real people</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="p-8 rounded-2xl text-left flex flex-col gap-5 hover:scale-105 transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                        <span key={j} style={{ color: j < t.stars ? "#FFC085" : "#555" }}>★</span>
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed flex-1" style={{ color: "#B2B2D2" }}>"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", color: "white" }}
                                    >
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs" style={{ color: "#FFC085" }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── FINAL CTA ───── */}
            <section className="py-24 px-6 md:px-16 relative overflow-hidden" style={{ background: "#060834" }}>
                <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#FFC085", top: "-20%", right: "-10%" }} />
                <div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#013A63", bottom: "-20%", left: "-10%" }} />
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <h2 className="font-bold text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                        Ready to Start Your{" "}
                        <span className="text-gradient">Journey?</span>
                    </h2>
                    <p className="mb-12 text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                        Join thousands of teenlancers and agents already using Gengig to connect, create, and grow together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="px-8 py-4 rounded-full font-semibold text-white hover:opacity-80 hover:scale-105 transition-all duration-200 text-lg"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Join as Teenlancer →
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-4 rounded-full font-semibold text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 text-lg"
                            style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                        >
                            Hire a Teenlancer
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}