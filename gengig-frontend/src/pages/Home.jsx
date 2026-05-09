import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImg from "../assets/hero section.png";
import logo from "../assets/Gengig LOGO.png";
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

const fallbackTestimonials = [
    { name: "Salma Tamer", role: "Graphic Designer", stars: 5, text: "Gengig helped me land my first real client at 17. The platform is so easy to use and the support is amazing!" },
    { name: "Khaled Ramzy", role: "Marketing Manager", stars: 4, text: "I found incredible young talent through Gengig. Fresh ideas and professional delivery every time." },
    { name: "Mariam Assem", role: "Video Editor", stars: 4, text: "As a teen, I was nervous about freelancing. Gengig made it safe and simple to get started." },
];

export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || "";
    const isGuest = !token;

    const [activeTab, setActiveTab] = useState("For Agents");
    const [featuredGigs, setFeaturedGigs] = useState([]);
    const [gigsLoading, setGigsLoading] = useState(true);
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);
    const [newsletterLoading, setNewsletterLoading] = useState(false);
    const [stats, setStats] = useState({
        teenlancers: "500+",
        agents: "200+",
        gigs: "1,000+",
        rating: "4.8★",
    });

    useEffect(() => {
        const fetchHomeData = async () => {
            setGigsLoading(true);
            try {
                const [gigsRes, statsRes] = await Promise.all([
                    api.get("/gigs/featured"),
                    api.get("/platform/stats"),
                ]);
                setFeaturedGigs(gigsRes.data);
                setStats({
                    teenlancers: statsRes.data.teenlancers || "500+",
                    agents: statsRes.data.agents || "200+",
                    gigs: statsRes.data.gigs || "1,000+",
                    rating: statsRes.data.rating || "4.8★",
                });
            } catch (err) {
                console.error("Failed to fetch home data:", err);
                setFeaturedGigs([]);
            } finally {
                setGigsLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const handleCategoryClick = (categoryLabel) => {
        if (!token) { navigate("/signup"); return; }
        if (role === "agent") navigate(`/teenlancers/category/${encodeURIComponent(categoryLabel)}`);
        else navigate(`/gigs/category/${encodeURIComponent(categoryLabel)}`);
    };

    const handleNewsletter = async (e) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;
        setNewsletterLoading(true);
        try {
            await api.post("/newsletter/subscribe", { email: newsletterEmail });
        } catch (err) {
            console.error("Newsletter subscription failed:", err);
        } finally {
            setNewsletterSuccess(true);
            setNewsletterEmail("");
            setNewsletterLoading(false);
        }
    };

    return (
        <div style={{ background: "#060834" }}>

            {/* ── HEADER — guest sees signup/login, logged-in sees Navbar ── */}
            {isGuest ? (
                <nav className="flex items-center justify-between px-6 md:px-12 py-4 sticky top-0 z-50"
                    style={{
                        background: "rgba(6,8,52,0.85)",
                        backdropFilter: "blur(12px)",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    <Link to="/">
                        <img src={logo} alt="Gengig" className="w-14 h-14 object-contain" />
                    </Link>
                    <div className="flex items-center gap-6 text-sm" style={{ color: "#B2B2D2" }}>
                        <Link to="/about" className="hover:text-white transition-colors hidden sm:block">About</Link>
                        <Link to="/Exploreagig" className="hover:text-white transition-colors hidden sm:block">Explore</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate("/signin")}
                            className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all"
                            style={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                            Sign In
                        </button>
                        <button onClick={() => navigate("/signup")}
                            className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Get Started
                        </button>
                    </div>
                </nav>
            ) : (
                <Navbar />
            )}

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center px-6 md:px-16"
                style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to right, rgba(6,8,52,0.95) 50%, rgba(6,8,52,0.3))" }} />
                <div className="relative z-10 max-w-xl">
                    <h1 className="font-bold text-white leading-tight mb-4"
                        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                        Empowering the Next Generation of Creators and{" "}
                        <span className="text-gradient">Doers</span>
                    </h1>
                    <p className="mb-8 italic" style={{ color: "#B2B2D2", fontSize: "clamp(0.9rem, 2vw, 1.1rem)" }}>
                        Where Ambition Finds Its First Gig
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {token ? (
                            <Link to={role === "teenlancer" ? "/teenlancer/dashboard" : "/agent/dashboard"}
                                className="px-6 py-3 rounded-full font-semibold text-white text-sm hover:opacity-80 hover:scale-105 transition-all duration-200"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <button onClick={() => navigate("/signup")}
                                    className="px-6 py-3 rounded-full font-semibold text-white text-sm hover:opacity-80 hover:scale-105 transition-all duration-200"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                    Hire Now
                                </button>
                                <button onClick={() => navigate("/signup")}
                                    className="px-6 py-3 rounded-full font-semibold text-sm text-white border hover:bg-white/20 hover:scale-105 transition-all duration-200"
                                    style={{ borderColor: "rgba(255,255,255,0.4)" }}>
                                    Join as a Teenlancer
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-6 mt-10">
                        {[
                            { value: stats.teenlancers, label: "Teenlancers" },
                            { value: stats.agents, label: "Agents" },
                            { value: stats.gigs, label: "Gigs Done" },
                            { value: stats.rating, label: "Avg Rating" },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="font-bold text-white text-lg">{s.value}</p>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EXPLORE GENGIG ── */}
            <section className="py-24 px-6 md:px-16 text-center relative" style={{ background: "#0a0d2e" }}>
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFC085]/5 blur-[100px] rounded-full" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <h2 className="font-bold text-white mb-3 italic"
                        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        Because every great gig starts with a <span className="text-gradient">click</span>
                    </h2>
                    <p className="text-sm mb-14 uppercase tracking-[0.2em]" style={{ color: "#B2B2D2" }}>
                        Explore what Gengig has to offer
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map(f => (
                            <div key={f.title}
                                className="group p-8 rounded-3xl text-left transition-all duration-500 cursor-default relative overflow-hidden"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    backdropFilter: "blur(8px)"
                                }}>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC085]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="text-4xl mb-6 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-white font-bold mb-3 text-lg group-hover:text-[#FFC085] transition-colors">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                        {f.desc}
                                    </p>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 h-[2px] bg-[#FFC085] w-0 group-hover:w-full transition-all duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}

            <section className="py-24 px-6 md:px-16 text-center" style={{ background: "#060834" }}>

                <div className="max-w-5xl mx-auto">

                    <h2 className="font-bold text-white mb-3"

                        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>

                        How It <span className="text-gradient">Works</span>

                    </h2>

                    <p className="text-sm mb-14" style={{ color: "#B2B2D2" }}>Get started in just a few simple steps</p>



                    <div className="flex justify-center mb-12">

                        <div className="flex rounded-full p-1"

                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>

                            {["For Agents", "For Teenlancers"].map(tab => (

                                <button key={tab} onClick={() => setActiveTab(tab)}

                                    className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"

                                    style={{

                                        background: activeTab === tab ? "linear-gradient(90deg, #FFC085, #e8a060)" : "transparent",

                                        color: activeTab === tab ? "white" : "#B2B2D2",

                                    }}>

                                    {tab}

                                </button>

                            ))}

                        </div>

                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {(activeTab === "For Agents" ? agentSteps : teenlancerSteps).map((step, i) => (

                            <div key={i} className="relative p-8 rounded-2xl text-left hover:scale-105 transition-all duration-300"

                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-5"

                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", color: "white" }}>

                                    {i + 1}

                                </div>

                                <div className="text-4xl mb-4">{step.icon}</div>

                                <h3 className="text-white font-semibold mb-2 text-lg">{step.title}</h3>

                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{step.desc}</p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ── CATEGORIES ── */}
            <section className="py-24 px-6 md:px-16 text-center" style={{ background: "#0a0d2e" }}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-bold text-white mb-3"
                        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        Browse by <span className="text-gradient">Category</span>
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                        {role === "agent"
                            ? "Find talented teenlancers in your field"
                            : "Find the perfect gig for your skills"}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                        {categories.map(cat => (
                            <button key={cat.label} onClick={() => handleCategoryClick(cat.label)}
                                className="flex flex-col items-center gap-3 p-6 rounded-2xl group hover:scale-105 hover:border-[#FFC085] transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                                    style={{ background: "rgba(255,192,133,0.1)" }}>
                                    {cat.icon}
                                </div>
                                <p className="text-white text-sm font-medium">{cat.label}</p>
                            </button>
                        ))}
                    </div>

                    {/* Guest CTA under categories */}
                    {isGuest && (
                        <div className="mt-12 p-8 rounded-3xl max-w-xl mx-auto"
                            style={{ background: "linear-gradient(135deg, rgba(255,192,133,0.1), rgba(232,160,96,0.04))", border: "1px solid rgba(255,192,133,0.2)" }}>
                            <p className="text-white font-semibold mb-2">Ready to explore?</p>
                            <p className="text-sm mb-5" style={{ color: "#B2B2D2" }}>
                                Create a free account to apply for gigs or post your first project.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => navigate("/signup")}
                                    className="px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                    Create Account
                                </button>
                                <button onClick={() => navigate("/signin")}
                                    className="px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-all"
                                    style={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                                    Sign In
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── BANNER ── */}
            <section className="py-24 px-6 md:px-16 relative overflow-hidden"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600)", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0" style={{ background: "rgba(6,8,52,0.82)" }} />
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="font-bold text-white text-center md:text-left mb-3"
                            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                            Every Skill Deserves A <span className="text-gradient">Chance</span>
                        </h2>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>
                            {isGuest || role !== "agent"
                                ? "Apply to gigs and start building your career today."
                                : "Post your gig and find the right teenlancer today."}
                        </p>
                    </div>
                    <button
                        onClick={() => isGuest ? navigate("/signup") : navigate("/Exploreagig")}
                        className="flex-shrink-0 px-10 py-4 rounded-full font-semibold text-white hover:opacity-80 hover:scale-105 transition-all duration-200 text-lg"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        {isGuest ? "Join Free" : "Explore a Gig"}
                    </button>
                </div>
            </section>

            {/* ── WORK WITH CREATORS ── */}
            <section className="py-24 px-6 md:px-16" style={{ background: "#0a0d2e" }}>
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="font-bold text-white mb-4"
                            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                            Work With The Best{" "}
                            <span className="text-gradient">Of Creators</span>
                        </h2>
                        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#B2B2D2" }}>
                            Connect with talented teenlancers who bring fresh perspectives, creative energy, and dedication to every project.
                        </p>
                        <button onClick={() => navigate(isGuest ? "/signup" : "/post")}
                            className="inline-block px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-80 hover:scale-105 transition-all duration-200"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            {isGuest ? "Get Started Free" : "Hire Now"}
                        </button>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        {[
                            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
                            "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400",
                            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400",
                            "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
                        ].map((img, i) => (
                            <img key={i} src={img} alt=""
                                className="w-full h-40 md:h-52 object-cover rounded-2xl hover:scale-105 transition-transform duration-300" />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT US ── */}
            <section className="py-24 px-6 md:px-16" style={{ background: "#060834" }}>
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 w-full">
                        <img src="../src/assets/team3.png"
                            alt="About Gengig"
                            className="w-full h-72 md:h-96 object-cover rounded-2xl" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="font-bold text-white mb-3"
                            style={{ fontSize: "clamp(1.5rem, 3vw, 4rem)" }}>
                            A bit <span className="text-gradient">About Us</span>
                        </h2>
                        <p className="text-sm mb-3 italic" style={{ color: "#FFC085" }}>
                            Where young talent meets real opportunity
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                            GenGig was born from a simple idea — that young people should not have to wait to gain real-world experience. We built a platform where teen creators can showcase their skills, connect with real clients, and start building their professional journey today.
                        </p>
                        <button onClick={() => navigate("/about")}
                            className="mt-4 px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                            style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.25)" }}>
                            Learn More About Us
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-24 px-6 md:px-16 text-center" style={{ background: "#0a0d2e" }}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-bold text-white mb-3"
                        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        What Our Clients Say <span className="text-gradient">About Us</span>
                    </h2>
                    <p className="text-sm mb-14" style={{ color: "#B2B2D2" }}>Real stories from real people</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i}
                                className="p-8 rounded-2xl text-left flex flex-col gap-5 hover:scale-105 transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                        <span key={j} style={{ color: j < t.stars ? "#FFC085" : "#555" }}>★</span>
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed flex-1" style={{ color: "#B2B2D2" }}>"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-3"
                                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", color: "white" }}>
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



            <Footer />
        </div>
    );
}