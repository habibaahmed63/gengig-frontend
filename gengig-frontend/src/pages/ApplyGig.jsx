import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const gig = {
    id: 1,
    title: "Brand Identity Design",
    category: "Graphic Design",
    budget: "$150",
    deadline: "7 days",
    agent: {
        name: "Khaled Ramzy",
        company: "Creative Studio Co.",
        img: "https://i.pravatar.cc/100?img=3",
    },
};

export default function ApplyGig() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [formData, setFormData] = useState({
        message: "",
        proposedRate: "",
        timeline: "",
        portfolioLink: "",
        file: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, file });
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.message || !formData.proposedRate || !formData.timeline) {
            setError("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        setError(null);
        // TODO: send to backend
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    // Success screen
    if (submitted) {
        return (
            <div style={{ background: "#060834" }}>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#FFC085" }} />
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl relative z-10" style={{ background: "rgba(255,192,133,0.15)", border: "2px solid #FFC085" }}>
                            ✓
                        </div>
                    </div>
                    <h2 className="text-white font-bold mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                        Application Sent!
                    </h2>
                    <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                        Your application for <strong className="text-white">"{gig.title}"</strong> has been sent. The agent will review it and get back to you soon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/explore" className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Explore More Gigs
                        </Link>
                        <Link to="/teenlancer/dashboard" className="px-8 py-3 rounded-full font-semibold text-white hover:bg-white/10 transition-all" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">

                {/* Breadcrumb */}
                <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                    <Link to="/home" className="hover:text-white">Home</Link>
                    {" / "}
                    <Link to="/explore" className="hover:text-white">Explore</Link>
                    {" / "}
                    <Link to={`/gig/${id}`} className="hover:text-white">Gig Details</Link>
                    {" / "}
                    <span style={{ color: "#FFC085" }}>Apply</span>
                </p>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left - Form */}
                    <div className="flex-1">
                        <h1 className="text-white font-bold mb-2" style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}>
                            Apply for this <span className="text-gradient">Gig</span>
                        </h1>
                        <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                            Keep it short and clear — let your work speak for itself.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Intro Message */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">
                                    Intro Message <span style={{ color: "#f87171" }}>*</span>
                                </label>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                    2-3 sentences about yourself and why you're a good fit for this gig.
                                </p>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Hi! I'm a graphic designer with experience in brand identity and logo design. I've worked on similar projects and I'm confident I can deliver great results within your timeline."
                                    rows={4}
                                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                            </div>

                            {/* Rate + Timeline */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium">
                                        Proposed Rate (USD) <span style={{ color: "#f87171" }}>*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#FFC085" }}>$</span>
                                        <input
                                            type="number"
                                            name="proposedRate"
                                            value={formData.proposedRate}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            className="w-full rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                        />
                                    </div>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Agent's budget: {gig.budget}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium">
                                        Delivery Timeline <span style={{ color: "#f87171" }}>*</span>
                                    </label>
                                    <select
                                        name="timeline"
                                        value={formData.timeline}
                                        onChange={handleChange}
                                        className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    >
                                        <option value="" style={{ background: "#060834" }}>Select timeline</option>
                                        <option style={{ background: "#060834" }}>1-2 days</option>
                                        <option style={{ background: "#060834" }}>3-5 days</option>
                                        <option style={{ background: "#060834" }}>1 week</option>
                                        <option style={{ background: "#060834" }}>2 weeks</option>
                                        <option style={{ background: "#060834" }}>1 month</option>
                                    </select>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Agent's deadline: {gig.deadline}</p>
                                </div>
                            </div>

                            {/* Portfolio Link */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">
                                    Portfolio Link <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#B2B2D2" }}>🔗</span>
                                    <input
                                        type="url"
                                        name="portfolioLink"
                                        value={formData.portfolioLink}
                                        onChange={handleChange}
                                        placeholder="https://behance.net/yourprofile"
                                        className="w-full rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">
                                    Sample Work <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                                </label>
                                <label
                                    className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
                                    style={{ border: "2px dashed rgba(255,255,255,0.15)" }}
                                >
                                    <span className="text-2xl">📎</span>
                                    <p className="text-sm" style={{ color: "#B2B2D2" }}>
                                        {fileName ? (
                                            <span style={{ color: "#FFC085" }}>{fileName}</span>
                                        ) : (
                                            "Click to upload a file"
                                        )}
                                    </p>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>PNG, JPG, PDF up to 10MB</p>
                                    <input type="file" className="hidden" onChange={handleFile} accept=".png,.jpg,.jpeg,.pdf" />
                                </label>
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-xs text-center" style={{ color: "#f87171" }}>{error}</p>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    {loading ? "Submitting..." : "Submit Application →"}
                                </button>
                                <Link
                                    to={`/gig/${id}`}
                                    className="flex-1 py-3 rounded-full font-semibold text-center hover:bg-white/10 transition-all"
                                    style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#B2B2D2" }}
                                >
                                    Cancel
                                </Link>
                            </div>

                        </form>
                    </div>

                    {/* Right - Gig Summary */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="p-5 rounded-2xl sticky top-28" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <h2 className="text-white font-semibold mb-4">Gig Summary</h2>

                            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                                <img src={gig.agent.img} alt="" className="w-10 h-10 rounded-full object-cover" style={{ border: "2px solid #FFC085" }} />
                                <div>
                                    <p className="text-white text-sm font-semibold">{gig.agent.name}</p>
                                    <p className="text-xs" style={{ color: "#FFC085" }}>{gig.agent.company}</p>
                                </div>
                            </div>

                            <p className="text-white font-semibold text-sm mb-4">{gig.title}</p>

                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Category", value: gig.category },
                                    { label: "Budget", value: gig.budget },
                                    { label: "Deadline", value: gig.deadline },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between text-sm">
                                        <span style={{ color: "#B2B2D2" }}>{item.label}</span>
                                        <span className="font-medium" style={{ color: "#FFC085" }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to={`/gig/${id}`}
                                className="mt-5 block text-center text-xs hover:text-white transition-colors"
                                style={{ color: "#B2B2D2" }}
                            >
                                ← Back to gig details
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}