import { useNavigate } from "react-router-dom";
import logo from "../assets/Gengig LOGO.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
    const navigate = useNavigate();

    const values = [
        {
            title: "Youth First",
            desc: "We built Gengig specifically for teenagers who want to earn, learn, and grow through real-world freelance work.",
            accent: "#FFC085",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            title: "Safety & Trust",
            desc: "Every transaction is protected. We verify agents and ensure teenlancers are paid fairly for their work.",
            accent: "#4ade80",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
        {
            title: "Career Growth",
            desc: "Gengig isn't just about one gig — it's about building a portfolio, reputation, and a foundation for a career.",
            accent: "#63b3ed",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            title: "Community",
            desc: "Our community hub lets teenlancers share tips, collaborate, and support each other on their journey.",
            accent: "#a78bfa",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    const team = [
        { name: "Ahmed Negm", role: "Backend Developer", initials: "AN" },
        { name: "Ahmed Habib", role: "Frontend Developer", initials: "AH" },
        { name: "Nada Yasser", role: "UI/UX Designer", initials: "NY" },
        { name: "Omar Khaled", role: "Full Stack", initials: "OK" },
    ];

    const stats = [
        { value: "500+", label: "Active Teenlancers" },
        { value: "1,200+", label: "Gigs Completed" },
        { value: "50+", label: "Skill Categories" },
        { value: "98%", label: "Satisfaction Rate" },
    ];

    return (
        <div className="min-h-screen" style={{ background: "#060834" }}>
            <Navbar />
            {/* ── Navbar ── */}
            <nav className="flex items-center justify-between px-6 md:px-16 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={() => navigate("/")} className="flex items-center gap-3">
                    <img src={logo} alt="Gengig" className="w-10 h-10 object-contain" />
                </button>
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

            {/* ── 1. HERO ── kept as-is per your request ── */}
            <section className="text-center px-6 py-28 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(255,192,133,0.06) 0%, transparent 70%)" }} />

                <div className="relative z-10">
                    <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
                        style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}>
                        Our Story
                    </p>
                    <h1 className="text-white font-bold tracking-tight mb-6"
                        style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", lineHeight: 1.1 }}>
                        About{" "}
                        <span style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Gengig
                        </span>
                    </h1>
                    <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "#B2B2D2" }}>
                        Gengig was born from a simple belief — that age should never be a barrier to
                        earning from your skills. We built a platform where teenagers can freelance
                        professionally and agents can find fresh, creative talent at competitive rates.
                    </p>
                </div>
            </section>

            {/* ── 2. MISSION & VISION — kept as-is, visual upgrade ── */}
            <section className="px-6 md:px-16 py-20" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Mission */}
                    <div className="p-8 rounded-3xl relative overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                            style={{ background: "radial-gradient(circle, rgba(255,192,133,0.08) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                            style={{ background: "rgba(255,192,133,0.12)", border: "1px solid rgba(255,192,133,0.2)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-3 relative z-10">Our Mission</h3>
                        <p className="text-sm leading-relaxed relative z-10" style={{ color: "#B2B2D2" }}>
                            To empower the next generation of creative professionals by giving them
                            a legitimate, safe, and supportive platform to monetize their skills,
                            build real-world experience, and launch their careers — starting today.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="p-8 rounded-3xl relative overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                            style={{ background: "radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                            style={{ background: "rgba(99,179,237,0.12)", border: "1px solid rgba(99,179,237,0.2)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#63b3ed" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-3 relative z-10">Our Vision</h3>
                        <p className="text-sm leading-relaxed relative z-10" style={{ color: "#B2B2D2" }}>
                            A world where every talented teenager has access to real opportunities,
                            where skill matters more than age, and where the freelance economy
                            is inclusive for everyone — regardless of where you are in your journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 3. VALUES — kept as-is, visual upgrade ── */}
            <section className="px-6 md:px-16 py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-white font-bold text-3xl tracking-tight mb-3">Our Values</h2>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>What drives everything we build</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {values.map(v => (
                            <div key={v.title} className="p-7 rounded-3xl flex gap-5 group hover:border-opacity-30 transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
                                    style={{ background: `${v.accent}15`, border: `1px solid ${v.accent}25`, color: v.accent }}>
                                    {v.icon}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. STATS — visual upgrade replacing old plain cards ── */}
            <section className="px-6 md:px-16 py-24 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,192,133,0.04) 0%, transparent 65%)" }} />
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-white font-bold text-3xl tracking-tight mb-3">By The Numbers</h2>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>The impact Gengig is creating</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px"
                        style={{ background: "rgba(255,255,255,0.06)", borderRadius: "1.5rem", overflow: "hidden" }}>
                        {stats.map((stat, i) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center py-10 px-6 text-center"
                                style={{ background: "#060834" }}>
                                <p className="font-black tracking-tight mb-2"
                                    style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#FFC085", lineHeight: 1 }}>
                                    {stat.value}
                                </p>
                                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#B2B2D2" }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. TEAM — new visual design, initials instead of emojis ── */}
            <section className="px-6 md:px-16 py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-white font-bold text-3xl tracking-tight mb-3">The Team Behind Gengig</h2>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>A graduation project built with passion and purpose</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {team.map((member, i) => {
                            const colors = ["#FFC085", "#63b3ed", "#4ade80", "#a78bfa"];
                            const color = colors[i % colors.length];
                            return (
                                <div key={member.name}
                                    className="p-6 rounded-3xl text-center group transition-all duration-300 hover:translate-y-[-4px]"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                    {/* Avatar with initials */}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg"
                                        style={{ background: `${color}15`, border: `1.5px solid ${color}30`, color }}>
                                        {member.initials}
                                    </div>
                                    <p className="text-white font-semibold text-sm mb-1">{member.name}</p>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>{member.role}</p>
                                    {/* Accent line */}
                                    <div className="w-8 h-0.5 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: color }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 6. HOW WE WORK — new section replacing old plain team section ── */}
            <section className="px-6 md:px-16 py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-white font-bold text-3xl tracking-tight mb-3">What Makes Us Different</h2>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>Gengig is not just another freelance platform</p>
                    </div>

                    {/* Horizontal feature row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                number: "01",
                                title: "Built for Teenagers",
                                desc: "Every design decision, every feature, every policy is made with the teenage freelancer in mind — not as an afterthought.",
                                color: "#FFC085",
                            },
                            {
                                number: "02",
                                title: "Secure Payments",
                                desc: "Funds are held securely via Paymob and only released when work is completed and approved. No room for fraud on either side.",
                                color: "#4ade80",
                            },
                            {
                                number: "03",
                                title: "Real Portfolio Building",
                                desc: "Every completed gig becomes part of a verified portfolio that follows the teenlancer into adulthood and beyond.",
                                color: "#63b3ed",
                            },
                        ].map(item => (
                            <div key={item.number} className="p-7 rounded-3xl relative overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <span className="absolute top-4 right-5 font-black text-5xl select-none pointer-events-none"
                                    style={{ color: `${item.color}10`, lineHeight: 1 }}>
                                    {item.number}
                                </span>
                                <div className="w-1 h-8 rounded-full mb-5" style={{ background: item.color }} />
                                <h3 className="text-white font-semibold mb-3">{item.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. CTA — kept as-is per your request, visual upgrade ── */}
            <section className="px-6 md:px-16 py-28 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(255,192,133,0.07) 0%, transparent 60%)" }} />
                <div className="max-w-2xl mx-auto text-center relative z-10">
                    <div className="p-12 rounded-3xl"
                        style={{ background: "linear-gradient(135deg, rgba(255,192,133,0.1), rgba(232,160,96,0.04))", border: "1px solid rgba(255,192,133,0.18)" }}>
                        {/* Decorative top line */}
                        <div className="w-12 h-1 rounded-full mx-auto mb-8"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }} />
                        <h2 className="text-white font-bold text-3xl mb-4 tracking-tight">
                            Join the Gengig Community
                        </h2>
                        <p className="text-sm leading-relaxed mb-10" style={{ color: "#B2B2D2" }}>
                            Whether you're a talented teen or a business looking for creative help —
                            there's a place for you here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={() => navigate("/signup")}
                                className="px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                Get Started Free
                            </button>
                            <button onClick={() => navigate("/signin")}
                                className="px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-all"
                                style={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
}