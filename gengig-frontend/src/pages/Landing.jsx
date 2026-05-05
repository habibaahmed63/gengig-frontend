import { useNavigate } from "react-router-dom";
import logo from "../assets/Gengig LOGO.png";

export default function Landing() {
    const navigate = useNavigate();

    const features = [
        { icon: "🎨", title: "Find Creative Talent", desc: "Connect with skilled teenage freelancers ready to bring your vision to life." },
        { icon: "💼", title: "Post Your Gig", desc: "Describe what you need, set your budget, and receive applications within hours." },
        { icon: "💬", title: "Chat & Collaborate", desc: "Communicate directly with teenlancers through our built-in real-time chat." },
        { icon: "🔒", title: "Safe & Secure", desc: "Payments are protected and only released when you're satisfied with the work." },
        { icon: "⭐", title: "Ratings & Reviews", desc: "Build your reputation through honest reviews after every completed gig." },
        { icon: "🚀", title: "Launch Your Career", desc: "Teenlancers build their portfolio and earn real income doing what they love." },
    ];

    const stats = [
        { value: "500+", label: "Teenlancers" },
        { value: "1,200+", label: "Gigs Posted" },
        { value: "98%", label: "Satisfaction Rate" },
        { value: "50+", label: "Categories" },
    ];

    return (
        <div className="min-h-screen" style={{ background: "#060834" }}>

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <img src={logo} alt="Gengig" className="w-12 h-12 object-contain" />
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

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
                    style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.25)" }}>
                    🚀 The freelance platform built for the next generation
                </div>

                <h1 className="font-bold tracking-tight mb-6 max-w-3xl"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.1 }}>
                    <span className="text-white">Where Young Talent</span>
                    <br />
                    <span style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Meets Opportunity
                    </span>
                </h1>

                <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: "#B2B2D2" }}>
                    Gengig connects talented teenagers with agents who need creative work done.
                    Design, video, writing, development — find the perfect match today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigate("/signup")}
                        className="px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200 text-base"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        Start as a Teenlancer →
                    </button>
                    <button onClick={() => navigate("/signup")}
                        className="px-8 py-3.5 rounded-full font-semibold text-base hover:bg-white/10 transition-all"
                        style={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                        Post a Gig as Agent
                    </button>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap justify-center gap-8 mt-16 pt-16"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {stats.map(stat => (
                        <div key={stat.label} className="text-center">
                            <p className="font-bold text-2xl mb-1" style={{ color: "#FFC085" }}>{stat.value}</p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="px-6 md:px-12 py-20" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-white font-bold text-3xl text-center mb-4 tracking-tight">How It Works</h2>
                    <p className="text-center text-sm mb-14" style={{ color: "#B2B2D2" }}>
                        Three simple steps to get started
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Create Your Account", desc: "Sign up as a Teenlancer or Agent in under 2 minutes. Complete your profile to stand out.", icon: "👤" },
                            { step: "02", title: "Post or Apply for Gigs", desc: "Agents post detailed gigs. Teenlancers browse and apply with a personalized proposal.", icon: "📋" },
                            { step: "03", title: "Work & Get Paid", desc: "Collaborate through our chat, deliver great work, and receive secure payment.", icon: "💰" },
                        ].map(item => (
                            <div key={item.step} className="p-6 rounded-2xl relative"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <span className="text-5xl font-black absolute top-4 right-5 opacity-10 select-none"
                                    style={{ color: "#FFC085" }}>{item.step}</span>
                                <span className="text-3xl mb-4 block">{item.icon}</span>
                                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-6 md:px-12 py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-white font-bold text-3xl text-center mb-4 tracking-tight">Everything You Need</h2>
                    <p className="text-center text-sm mb-14" style={{ color: "#B2B2D2" }}>
                        Built specifically for the next generation of freelancers
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map(feature => (
                            <div key={feature.title} className="p-5 rounded-2xl hover:border-[rgba(255,192,133,0.3)] transition-colors"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <span className="text-2xl mb-3 block">{feature.icon}</span>
                                <h3 className="text-white font-semibold mb-2 text-sm">{feature.title}</h3>
                                <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Teaser */}
            <section className="px-6 md:px-12 py-20" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-white font-bold text-3xl mb-4 tracking-tight">Our Mission</h2>
                    <p className="text-base leading-relaxed mb-8" style={{ color: "#B2B2D2" }}>
                        We believe every teenager with a skill deserves a real platform to grow.
                        Gengig was built to bridge the gap between young creative talent and the
                        agents who need them — creating opportunities that build careers, not just gigs.
                    </p>
                    <button onClick={() => navigate("/about")}
                        className="px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ background: "rgba(255,192,133,0.12)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.25)" }}>
                        Learn More About Us →
                    </button>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="px-6 md:px-12 py-20">
                <div className="max-w-3xl mx-auto p-10 rounded-3xl text-center"
                    style={{ background: "linear-gradient(135deg, rgba(255,192,133,0.12), rgba(232,160,96,0.06))", border: "1px solid rgba(255,192,133,0.2)" }}>
                    <h2 className="text-white font-bold text-3xl mb-4 tracking-tight">Ready to Get Started?</h2>
                    <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                        Join hundreds of teenlancers and agents already using Gengig.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate("/signup")}
                            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Create Free Account
                        </button>
                        <button onClick={() => navigate("/signin")}
                            className="px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
                            style={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Gengig" className="w-8 h-8 object-contain" />
                    <span className="text-sm font-semibold" style={{ color: "#FFC085" }}>Gengig</span>
                </div>
                <div className="flex gap-6 text-xs" style={{ color: "#B2B2D2" }}>
                    <button onClick={() => navigate("/about")} className="hover:text-[#FFC085] transition-colors">About Us</button>
                    <button onClick={() => navigate("/Support")} className="hover:text-[#FFC085] transition-colors">Support</button>
                    <button onClick={() => navigate("/Terms")} className="hover:text-[#FFC085] transition-colors">Terms</button>
                </div>
                <p className="text-xs" style={{ color: "#B2B2D2" }}>© 2026 Gengig. All rights reserved.</p>
            </footer>
        </div>
    );
}