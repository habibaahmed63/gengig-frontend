import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    { icon: "📝", title: "Post a Gig", desc: "Describe the work you need done, set your budget, and publish in minutes." },
    { icon: "🔍", title: "Find Your Teenlancer", desc: "Browse profiles, review skills and portfolios, then pick the perfect match." },
    { icon: "✅", title: "Get It Done", desc: "Collaborate safely, track progress, and receive your completed work on time." },
];

const teenlancerSteps = [
    { icon: "🎨", title: "Build Your Profile", desc: "Showcase your skills, upload your portfolio, and set your availability." },
    { icon: "🔎", title: "Explore Gigs", desc: "Browse available gigs that match your skills and apply to the ones you love." },
    { icon: "💰", title: "Get Paid", desc: "Complete the work, impress your client, earn money and build your reputation." },
];

const featuredGigs = [
    { title: "Brand Identity Design", category: "Graphic Design", budget: "$150", rating: "4.9", reviews: 23, img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400", badge: "Top Rated" },
    { title: "Social Media Campaign", category: "Marketing", budget: "$200", rating: "4.8", reviews: 18, img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400", badge: "Popular" },
    { title: "Mobile App UI Design", category: "UI/UX", budget: "$300", rating: "5.0", reviews: 31, img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400", badge: "New" },
    { title: "Product Video Edit", category: "Video Editing", budget: "$180", rating: "4.7", reviews: 15, img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400", badge: "Top Rated" },
];

const testimonials = [
    { name: "Salma Tamer", role: "Graphic Designer", stars: 5, text: "Gengig helped me land my first real client at 17. The platform is so easy to use and the support is amazing!" },
    { name: "Khaled Ramzy", role: "Marketing Manager", stars: 4, text: "I found incredible young talent through Gengig. Fresh ideas and professional delivery every time." },
    { name: "Mariam Assem", role: "Video Editor", stars: 4, text: "As a teen, I was nervous about freelancing. Gengig made it safe and simple to get started." },
];

const agentPerks = [
    { icon: "🎯", title: "Targeted Talent", desc: "Find teenlancers with the exact skills your project needs." },
    { icon: "💰", title: "Budget Friendly", desc: "Get high quality work at rates that fit any budget." },
    { icon: "⚡", title: "Fast Turnaround", desc: "Young creators are eager to deliver and impress." },
    { icon: "🛡️", title: "Safe & Secure", desc: "Payments and communication all handled safely on platform." },
];

const teenlancerPerks = [
    { icon: "🚀", title: "Real Experience", desc: "Work on actual projects and build a professional portfolio." },
    { icon: "💸", title: "Earn Money", desc: "Get paid for your skills while still in school." },
    { icon: "📈", title: "Grow Fast", desc: "Earn badges, ratings and credibility with every gig." },
    { icon: "🤝", title: "Safe Platform", desc: "We handle contracts and payments so you stay protected." },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState("For Agents");
    const [howItWorksTab, setHowItWorksTab] = useState("For Agents");
    const [gradientPos, setGradientPos] = useState(0);

    // Animated gradient
    useEffect(() => {
        const interval = setInterval(() => {
            setGradientPos((prev) => (prev + 1) % 360);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const isLoggedIn = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            {/* ───── HERO ───── */}
            <section
                className="relative min-h-screen flex items-center justify-center px-6 md:px-16 overflow-hidden"
                style={{
                    background: `radial-gradient(ellipse at ${50 + Math.sin(gradientPos * 0.02) * 20}% ${40 + Math.cos(gradientPos * 0.015) * 15}%, rgba(1,58,99,0.8) 0%, rgba(6,8,52,1) 60%)`,
                }}
            >
                {/* Floating orbs */}
                <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#FFC085", top: "-10%", right: "-5%", transform: `translate(${Math.sin(gradientPos * 0.01) * 20}px, ${Math.cos(gradientPos * 0.01) * 20}px)` }} />
                <div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#013A63", bottom: "10%", left: "-5%", transform: `translate(${Math.cos(gradientPos * 0.012) * 15}px, ${Math.sin(gradientPos * 0.012) * 15}px)` }} />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium" style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.3)", color: "#FFC085" }}>
                        ✦ The Platform for Teen Talent
                    </div>

                    <h1 className="font-bold text-white leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}>
                        Where Young{" "}
                        <span className="text-gradient">Talent</span>
                        {" "}Meets{" "}
                        <br className="hidden md:block" />
                        Real{" "}
                        <span className="text-gradient">Opportunity</span>
                    </h1>

                    <p className="mb-10 max-w-xl mx-auto" style={{ color: "#B2B2D2", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", lineHeight: "1.7" }}>
                        Gengig connects talented teenlancers with agents who need fresh, creative work done. Start your journey today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isLoggedIn ? (
                            <Link
                                to={role === "teenlancer" ? "/teenlancer/dashboard" : "/agent/dashboard"}
                                className="px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-90 transition-all"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    Get Started Free →
                                </Link>
                                <Link
                                    to="/explore"
                                    className="px-8 py-3.5 rounded-full font-semibold text-white hover:bg-white/10 transition-all"
                                    style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                                >
                                    Explore Gigs
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center gap-6 mt-12">
                        {[
                            { value: "500+", label: "Teenlancers" },
                            { value: "200+", label: "Agents" },
                            { value: "1,000+", label: "Gigs Done" },
                            { value: "4.8★", label: "Avg Rating" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="font-bold text-white text-lg">{stat.value}</p>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Scroll to explore</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* ───── FOR AGENTS & TEENLANCERS ───── */}
            <section className="py-20 px-6 md:px-8" style={{ background: "#0a0d2e" }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                            Built for <span className="text-gradient">Both Sides</span>
                        </h2>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>Whether you need work done or want to earn doing what you love</p>
                    </div>

                    {/* Toggle */}
                    <div className="flex justify-center mb-10">
                        <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {["For Agents", "For Teenlancers"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="px-6 py-2 rounded-full text-sm font-semibold transition-all"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(activeTab === "For Agents" ? agentPerks : teenlancerPerks).map((perk) => (
                            <div
                                key={perk.title}
                                className="p-6 rounded-2xl hover:scale-105 transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="text-3xl mb-4">{perk.icon}</div>
                                <h3 className="text-white font-semibold mb-2">{perk.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{perk.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <Link
                            to="/signup"
                            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            {activeTab === "For Agents" ? "Start Hiring →" : "Start Earning →"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ───── HOW IT WORKS ───── */}
            <section className="py-20 px-6 md:px-8 text-center" style={{ background: "#060834" }}>
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>Get started in just 3 simple steps</p>

                    <div className="flex justify-center mb-10">
                        <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {["For Agents", "For Teenlancers"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setHowItWorksTab(tab)}
                                    className="px-4 md:px-6 py-2 rounded-full text-sm font-semibold transition-all"
                                    style={{
                                        background: howItWorksTab === tab ? "linear-gradient(90deg, #FFC085, #e8a060)" : "transparent",
                                        color: howItWorksTab === tab ? "white" : "#B2B2D2",
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(howItWorksTab === "For Agents" ? agentSteps : teenlancerSteps).map((step, i) => (
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
                </div>
            </section>

            {/* ───── CATEGORIES ───── */}
            <section className="py-20 px-6 md:px-8 text-center" style={{ background: "#0a0d2e" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        Browse by <span className="text-gradient">Category</span>
                    </h2>
                    <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>Find the perfect skill for your next project</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                </div>
            </section>

            {/* ───── FEATURED GIGS ───── */}
            <section className="py-20 px-6 md:px-8" style={{ background: "#060834" }}>
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <h2 className="font-bold text-white mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                                Featured <span className="text-gradient">Gigs</span>
                            </h2>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Handpicked opportunities waiting for you</p>
                        </div>
                        <Link
                            to="/explore"
                            className="text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1 whitespace-nowrap"
                            style={{ color: "#FFC085" }}
                        >
                            View all gigs →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {featuredGigs.map((gig) => (
                            <div
                                key={gig.title}
                                className="rounded-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="relative">
                                    <img src={gig.img} alt={gig.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,52,0.6), transparent)" }} />
                                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,192,133,0.9)", color: "#060834" }}>
                                        {gig.badge}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs mb-1" style={{ color: "#FFC085" }}>{gig.category}</p>
                                    <h3 className="text-white font-semibold text-sm mb-3">{gig.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <span style={{ color: "#FFC085" }}>★</span>
                                            <span className="text-xs text-white">{gig.rating}</span>
                                            <span className="text-xs" style={{ color: "#B2B2D2" }}>({gig.reviews})</span>
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── TESTIMONIALS ───── */}
            <section className="py-20 px-6 md:px-8 text-center" style={{ background: "#0a0d2e" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                        What People Say <span className="text-gradient">About Us</span>
                    </h2>
                    <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>Real stories from real people</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.name}
                                className="p-6 rounded-2xl text-left flex flex-col gap-4"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: i < t.stars ? "#FFC085" : "#333" }}>★</span>
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed flex-1" style={{ color: "#B2B2D2" }}>"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                    <img src="https://i.pravatar.cc/40" alt="" className="w-9 h-9 rounded-full object-cover" style={{ border: "2px solid #FFC085" }} />
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

            {/* ───── FINAL CTA BANNER ───── */}
            <section className="py-20 px-6 md:px-8 relative overflow-hidden" style={{ background: "#060834" }}>
                {/* Background orbs */}
                <div className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#FFC085", top: "-20%", right: "-10%" }} />
                <div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#013A63", bottom: "-20%", left: "-10%" }} />

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <h2 className="font-bold text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                        Ready to Start Your{" "}
                        <span className="text-gradient">Journey?</span>
                    </h2>
                    <p className="mb-10 text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                        Join thousands of teenlancers and agents already using Gengig to connect, create, and grow together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Join as Teenlancer →
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-3.5 rounded-full font-semibold text-white hover:bg-white/10 transition-all"
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