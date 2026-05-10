import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import RoleGuard from "../components/RoleGuard";
import { useRoleGuard } from "../hooks/useRoleGuard";

export default function ApplyGig() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { showGuard, closeGuard, requireRole, userRole } = useRoleGuard();
    useEffect(() => { requireRole("teenlancer"); }, []);

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [formData, setFormData] = useState({
        message: "", proposedRate: "", timeline: "", portfolioLink: "", file: null,
    });

    useEffect(() => {
        const fetchGig = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/gigs/${id}`);
                setGig(response.data.gig || response.data);
            } catch (err) {
                console.error("Failed to fetch gig:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGig();
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) { setFormData({ ...formData, file }); setFileName(file.name); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.message.trim()) { setError("Please write an intro message."); return; }
        if (formData.message.trim().length < 20) { setError("Your intro message must be at least 20 characters."); return; }
        if (!formData.proposedRate) { setError("Please enter your proposed rate."); return; }
        if (!formData.timeline) { setError("Please select a delivery timeline."); return; }

        setSubmitting(true);
        setError(null);
        try {
            await api.post(`/gigs/${id}/apply`, {
                coverLetter: formData.message.trim(),
                proposedRate: Number(formData.proposedRate),
                timeline: formData.timeline,
                portfolioLink: formData.portfolioLink || "",
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Failed to submit application:", err);
            const errData = err.response?.data;
            if (Array.isArray(errData)) setError(errData.join(" · "));
            else setError(errData?.message || errData?.error || "Failed to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <RoleGuard isOpen={showGuard} onClose={closeGuard} userRole={userRole} />
                <div style={{ background: "#060834" }}>
                    <Navbar />
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-2 animate-spin"
                            style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (submitted) {
        return (
            <>
                <RoleGuard isOpen={showGuard} onClose={closeGuard} userRole={userRole} />
                <div style={{ background: "#060834" }}>
                    <Navbar />
                    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#FFC085" }} />
                            <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
                                style={{ background: "rgba(255,192,133,0.15)", border: "2px solid #FFC085" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-white font-bold mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Application Sent!</h2>
                        <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                            Your application for <strong className="text-white">"{gig?.title}"</strong> has been sent. The agent will review it and get back to you soon.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/Exploreagig"
                                className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                Explore More Gigs
                            </Link>
                            <Link to="/teenlancer/dashboard"
                                className="px-8 py-3 rounded-full font-semibold text-white hover:bg-white/10 transition-all"
                                style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <RoleGuard isOpen={showGuard} onClose={closeGuard} userRole={userRole} />

            <div style={{ background: "#060834" }}>
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
                    <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                        <Link to="/home" className="hover:text-[#FFC085] transition-colors">Home</Link>
                        {" › "}
                        <Link to="/Exploreagig" className="hover:text-[#FFC085] transition-colors">Explore</Link>
                        {" › "}
                        <Link to={`/gig/${id}`} className="hover:text-[#FFC085] transition-colors">Gig Details</Link>
                        {" › "}
                        <span style={{ color: "#FFC085" }}>Apply</span>
                    </p>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <h1 className="text-white font-bold mb-2" style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}>
                                Apply for this <span className="text-gradient">Gig</span>
                            </h1>
                            <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>Keep it short and clear — let your work speak for itself.</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium">Intro Message <span style={{ color: "#f87171" }}>*</span></label>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>2-3 sentences about yourself and why you are a good fit.</p>
                                    <textarea name="message" value={formData.message} onChange={handleChange}
                                        placeholder="Hi! I'm a graphic designer with experience in brand identity and logo design..."
                                        rows={4}
                                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-medium">Proposed Rate (USD) <span style={{ color: "#f87171" }}>*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#FFC085" }}>$</span>
                                            <input type="number" name="proposedRate" value={formData.proposedRate} onChange={handleChange}
                                                placeholder="0" min="1"
                                                className="w-full rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                                        </div>
                                        {gig?.budget && <p className="text-xs" style={{ color: "#B2B2D2" }}>Agent's budget: <span style={{ color: "#FFC085" }}>{gig.budget}</span></p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-medium">Delivery Timeline <span style={{ color: "#f87171" }}>*</span></label>
                                        <select name="timeline" value={formData.timeline} onChange={handleChange}
                                            className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                            <option value="" style={{ background: "#060834" }}>Select timeline</option>
                                            {["1-2 days", "3-5 days", "1 week", "2 weeks", "1 month"].map(t => (
                                                <option key={t} value={t} style={{ background: "#060834" }}>{t}</option>
                                            ))}
                                        </select>
                                        {gig?.deadline && <p className="text-xs" style={{ color: "#B2B2D2" }}>Agent's deadline: <span style={{ color: "#FFC085" }}>{gig.deadline}</span></p>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium">
                                        Portfolio Link <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                                    </label>
                                    <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange}
                                        placeholder="https://behance.net/yourprofile"
                                        className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium">
                                        Sample Work <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                                    </label>
                                    <label className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
                                        style={{ border: "2px dashed rgba(255,255,255,0.15)" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <p className="text-sm" style={{ color: "#B2B2D2" }}>
                                            {fileName ? <span style={{ color: "#FFC085" }}>{fileName}</span> : "Click to upload a file"}
                                        </p>
                                        <p className="text-xs" style={{ color: "#B2B2D2" }}>PNG, JPG, PDF up to 10MB</p>
                                        <input type="file" className="hidden" onChange={handleFile} accept=".png,.jpg,.jpeg,.pdf" />
                                    </label>
                                    {fileName && (
                                        <button type="button"
                                            onClick={() => { setFileName(null); setFormData(prev => ({ ...prev, file: null })); }}
                                            className="text-xs self-start hover:opacity-80" style={{ color: "#f87171" }}>
                                            Remove file
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 px-4 py-3 rounded-xl"
                                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                                        <span style={{ color: "#f87171" }}>⚠</span>
                                        <p className="text-xs leading-relaxed" style={{ color: "#f87171" }}>
                                            {typeof error === "object" ? JSON.stringify(error) : error}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                    <button type="submit" disabled={submitting}
                                        className="flex-1 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                        {submitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="w-4 h-4 rounded-full border-2 animate-spin inline-block"
                                                    style={{ borderColor: "white", borderTopColor: "transparent" }} />
                                                Submitting...
                                            </span>
                                        ) : "Submit Application"}
                                    </button>
                                    <Link to={`/gig/${id}`}
                                        className="flex-1 py-3 rounded-full font-semibold text-center hover:bg-white/10 transition-all"
                                        style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#B2B2D2" }}>
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* Gig Summary */}
                        <div className="w-full lg:w-64 flex-shrink-0">
                            {gig && (
                                <div className="p-5 rounded-2xl sticky top-28"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <h2 className="text-white font-semibold mb-4">Gig Summary</h2>
                                    {gig.agent && (
                                        <div className="flex items-center gap-3 mb-4 pb-4"
                                            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                                style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}>
                                                {gig.agent.img ? (
                                                    <img src={gig.agent.img} alt={gig.agent.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-bold text-sm" style={{ color: "#FFC085" }}>{gig.agent.name?.charAt(0) || "?"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-semibold">{gig.agent.name}</p>
                                                {gig.agent.company && <p className="text-xs" style={{ color: "#FFC085" }}>{gig.agent.company}</p>}
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-white font-semibold text-sm mb-4">{gig.title}</p>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            gig.category && { label: "Category", value: gig.category },
                                            gig.budget && { label: "Budget", value: gig.budget },
                                            gig.deadline && { label: "Deadline", value: gig.deadline },
                                        ].filter(Boolean).map(item => (
                                            <div key={item.label} className="flex items-center justify-between text-sm">
                                                <span style={{ color: "#B2B2D2" }}>{item.label}</span>
                                                <span className="font-medium" style={{ color: "#FFC085" }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to={`/gig/${id}`} className="mt-5 block text-center text-xs hover:text-white transition-colors" style={{ color: "#B2B2D2" }}>
                                        Back to gig details
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}