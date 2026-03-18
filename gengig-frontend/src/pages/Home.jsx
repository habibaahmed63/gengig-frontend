import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImg from "../assets/hero section.png";

const categories = [
    { icon: "🎨", label: "Graphic Design", count: "120+" },
    { icon: "🎬", label: "Video Editing", count: "85+" },
    { icon: "💻", label: "Web Development", count: "95+" },
    { icon: "📱", label: "UI/UX Design", count: "70+" },
    { icon: "📸", label: "Photography", count: "60+" },
    { icon: "✍️", label: "Content Writing", count: "110+" },
    { icon: "📣", label: "Social Media", count: "90+" },
    { icon: "🎵", label: "Music & Audio", count: "45+" },
    { icon: "🏷️", label: "Logo Design", count: "130+" },
    { icon: "🎭", label: "Animation", count: "55+" },
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

const testimonials = [
    { name: "Salma Tamer", role: "Graphic designer", stars: 5, text: "Gengig helped me land my first real client at 17. The platform is so easy to use and the support is amazing!" },
    { name: "Khaled Ramzy", role: "Marketing manager", stars: 4, text: "I found incredible young talent through Gengig. Fresh ideas and professional delivery every time." },
    { name: "Mariam Assem", role: "Video Editor", stars: 4, text: "As a teen, I was nervous about freelancing. Gengig made it safe and simple to get started." },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState("For Agents");

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
                        Where Ambition Finds Its first gig
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {localStorage.getItem("token") ? (
                            <Link
                                to={localStorage.getItem("role") === "teenlancer" ? "/teenlancer/dashboard" : "/agent/dashboard"}
                                className="px-6 py-2.5 rounded-full font-semibold text-white text-sm hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/post" className="px-6 py-2.5 rounded-full font-semibold text-white text-sm hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                    Hire now
                                </Link>
                                <Link to="/signup" className="px-6 py-2.5 rounded-full font-semibold text-sm text-white border hover:bg-white/10 transition-colors" style={{ borderColor: "rgba(255,255,255,0.4)" }}>
                                    Join as a teenlancer
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ───── EXPLORE GENGIG ───── */}
            <section className="py-16 px-6 md:px-8 text-center" style={{ background: "#0a0d2e" }}>
                <h2 className="font-bold text-white mb-2 italic" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                    Because every great gig starts with a click
                </h2>
                <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>Explore what Gengig has to offer</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {features.map((f) => (
                        <div key={f.title} className="p-6 rounded-2xl text-left" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="text-3xl mb-3">{f.icon}</div>
                            <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── HOW IT WORKS ───── */}
            <section className="py-16 px-6 md:px-8 text-center" style={{ background: "#060834" }}>
                <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                    How It <span className="text-gradient">Works</span>
                </h2>
                <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>Get started in just a few simple steps</p>

                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {["For Agents", "For Teenlancers"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="px-4 md:px-6 py-2 rounded-full text-sm font-semibold transition-all"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {(activeTab === "For Agents" ? agentSteps : teenlancerSteps).map((step, i) => (
                        <div key={i} className="relative p-6 rounded-2xl text-left" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-4" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", color: "white" }}>
                                {i + 1}
                            </div>
                            <div className="text-3xl mb-3">{step.icon}</div>
                            <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{step.desc}</p>
                            {i < 2 && (
                                <div className="hidden md:block absolute top-10 -right-3 text-xl" style={{ color: "#FFC085" }}>→</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── CATEGORIES ───── */}
            <section className="py-16 px-6 md:px-8 text-center" style={{ background: "#0a0d2e" }}>
                <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                    Browse by <span className="text-gradient">Category</span>
                </h2>
                <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>Find the perfect skill for your next project</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                    {categories.map((cat) => (
                        <Link
                            to="/explore"
                            key={cat.label}
                            className="flex flex-col items-center gap-3 p-5 rounded-2xl group hover:scale-105 transition-all duration-300"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform" style={{ background: "rgba(255,192,133,0.1)" }}>
                                {cat.icon}
                            </div>
                            <p className="text-white text-sm font-medium">{cat.label}</p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>{cat.count} gigs</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ───── BANNER ───── */}
            <section
                className="py-16 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                style={{ background: "#013A63" }}
            >
                <div className="absolute inset-0" style={{ background: "rgba(6,8,52,0.5)" }} />
                <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
                    <h2 className="font-bold text-white text-center md:text-left" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        Every Skill Deserves A Stage
                    </h2>
                    <Link
                        to="/explore"
                        className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    >
                        Explore a gig <span>→</span>
                    </Link>
                </div>
            </section>

            {/* ───── WORK WITH CREATORS ───── */}
            <section className="py-16 px-6 md:px-8" style={{ background: "#060834" }}>
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="font-bold text-white mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                            Work With The Best{" "}
                            <span className="text-gradient">Of Creators</span>
                        </h2>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#B2B2D2" }}>
                            Connect with talented teenlancers who bring fresh perspectives, creative energy, and dedication to every project.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Hire Now
                        </Link>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                        {[
                            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
                            "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400",
                            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400",
                            "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
                        ].map((img, i) => (
                            <img key={i} src={img} alt="" className="w-full h-36 md:h-44 object-cover rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── ABOUT US ───── */}
            <section className="py-16 px-6 md:px-8" style={{ background: "#0a0d2e" }}>
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1 w-full">
                        <img
                            src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600"
                            alt="About Gengig"
                            className="w-full h-64 md:h-80 object-cover rounded-2xl"
                        />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                            A bit <span className="text-gradient">About Us</span>
                        </h2>
                        <p className="text-sm mb-3 italic" style={{ color: "#FFC085" }}>
                            Where young talent meets real opportunity
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                            GenGig was born from a simple idea — that young people shouldn't have to wait to gain real-world experience. We built a platform where teen creators can showcase their skills, connect with real clients, and start building their professional journey today.
                        </p>
                    </div>
                </div>
            </section>

            {/* ───── TESTIMONIALS ───── */}
            <section className="py-16 px-6 md:px-8 text-center" style={{ background: "#060834" }}>
                <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                    What Our Client Says{" "}
                    <span className="text-gradient">About Us</span>
                </h2>
                <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>Real stories from real people</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((t) => (
                        <div key={t.name} className="p-6 rounded-2xl text-left flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>"{t.text}"</p>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ color: i < t.stars ? "#FFC085" : "#555" }}>★</span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/40" alt="" className="w-9 h-9 rounded-full object-cover" />
                                    <div>
                                        <p className="text-white text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs" style={{ color: "#B2B2D2" }}>{t.role}</p>
                                    </div>
                                </div>
                                <Link to="/signup" className="text-xs px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                    Connect now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}