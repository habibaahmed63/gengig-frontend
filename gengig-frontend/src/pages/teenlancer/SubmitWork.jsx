// ✅ Update SubmitWork.jsx — add revision mode detection at top:
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";

export default function SubmitWork() {
    const { applicationId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // ✅ Detect if this is a revision resubmission
    const isRevision = searchParams.get("revision") === "true";
    const revisionReason = searchParams.get("reason") || "";

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        description: "",
        deliverables: "",
        portfolioLink: "",
        notes: "",
        file: null,
        fileName: null,
    });

    useEffect(() => {
        api.get(`/teenlancer/applications/${applicationId}`)
            .then(res => setApplication(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [applicationId]);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) setForm(prev => ({ ...prev, file, fileName: file.name }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.description.trim()) { setError("Please describe your work."); return; }
        if (!form.deliverables.trim()) { setError("Please list your deliverables."); return; }

        setSubmitting(true);
        setError(null);
        try {
            const data = new FormData();
            data.append("description", form.description);
            data.append("deliverables", form.deliverables);
            data.append("portfolioLink", form.portfolioLink || "");
            data.append("notes", form.notes || "");
            data.append("isRevision", isRevision ? "true" : "false");
            if (form.file) data.append("file", form.file);

            // ✅ Same endpoint — backend handles both initial and revision
            await api.post(`/applications/${applicationId}/submit-work`, data);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit work. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <TeenlancerLayout>
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-2 animate-spin"
                    style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
            </div>
        </TeenlancerLayout>
    );

    if (submitted) return (
        <TeenlancerLayout>
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                    style={{ background: "rgba(74,222,128,0.15)", border: "2px solid #4ade80" }}>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-10"
                        style={{ background: "#4ade80" }} />
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 relative z-10" fill="none"
                        viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-white font-bold text-2xl mb-3">
                    {isRevision ? "Revision Submitted!" : "Work Submitted!"}
                </h2>
                <p className="text-sm mb-2 leading-relaxed" style={{ color: "#B2B2D2" }}>
                    {isRevision
                        ? "Your revised work has been sent to the agent for review."
                        : "Your work has been submitted to the agent for review."}
                </p>
                <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                    Once the agent approves your work, payment will be released to your account.
                </p>
                <div className="p-4 rounded-2xl w-full mb-8"
                    style={{ background: "rgba(255,192,133,0.08)", border: "1px solid rgba(255,192,133,0.2)" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#FFC085" }}>💰 Payment Status</p>
                    <p className="text-xs" style={{ color: "#B2B2D2" }}>
                        Payment is held securely by Gengig until the agent approves your work.
                        You'll be notified immediately when payment is released.
                    </p>
                </div>
                <button onClick={() => navigate("/teenlancer/dashboard")}
                    className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    Back to Dashboard
                </button>
            </div>
        </TeenlancerLayout>
    );

    return (
        <TeenlancerLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                <Link to="/teenlancer/dashboard" className="hover:text-[#FFC085]">Dashboard</Link>
                {" › "}
                <span style={{ color: "#FFC085" }}>
                    {isRevision ? "Submit Revision" : "Submit Work"}
                </span>
            </p>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-white font-bold text-2xl mb-2">
                    {isRevision ? "Submit Your Revision" : "Submit Your Work"}
                </h1>
                <p className="text-sm mb-6" style={{ color: "#B2B2D2" }}>
                    {isRevision
                        ? "The agent has requested changes. Upload your revised work below."
                        : "Upload your completed work for the agent to review and approve."}
                </p>

                {/* ✅ Show revision reason if this is a resubmission */}
                {isRevision && revisionReason && (
                    <div className="p-4 rounded-2xl mb-6 flex gap-3"
                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none"
                            viewBox="0 0 24 24" stroke="#f87171" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: "#f87171" }}>
                                Agent's Revision Request
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                {decodeURIComponent(revisionReason)}
                            </p>
                        </div>
                    </div>
                )}

                {application && (
                    <div className="p-4 rounded-2xl mb-6 flex items-center gap-4"
                        style={{ background: "rgba(255,192,133,0.08)", border: "1px solid rgba(255,192,133,0.2)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(255,192,133,0.15)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">
                                {application.gigTitle || application.gig?.title || "Gig"}
                            </p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                by {application.agentName || application.agent?.name || "Agent"}
                                {isRevision && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                                        style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                                        Revision #{(application.revisionCount || 0) + 1}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">
                            {isRevision ? "What did you change?" : "Work Description"}{" "}
                            <span style={{ color: "#f87171" }}>*</span>
                        </label>
                        <p className="text-xs" style={{ color: "#B2B2D2" }}>
                            {isRevision
                                ? "Explain what you changed based on the agent's feedback."
                                : "Describe what you've completed and how it meets the requirements."}
                        </p>
                        <textarea value={form.description}
                            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={isRevision
                                ? "I've made the following changes based on your feedback..."
                                : "I've completed the logo design with 3 variations as requested..."}
                            rows={4}
                            className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">
                            Deliverables <span style={{ color: "#f87171" }}>*</span>
                        </label>
                        <p className="text-xs" style={{ color: "#B2B2D2" }}>List what you're delivering (one per line)</p>
                        <textarea value={form.deliverables}
                            onChange={e => setForm(prev => ({ ...prev, deliverables: e.target.value }))}
                            placeholder={"Logo in PNG format (3 variations)\nSource files in AI format\nBrand guidelines PDF"}
                            rows={3}
                            className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">
                            Portfolio / Drive Link{" "}
                            <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                        </label>
                        <input type="url" value={form.portfolioLink}
                            onChange={e => setForm(prev => ({ ...prev, portfolioLink: e.target.value }))}
                            placeholder="https://drive.google.com/... or https://behance.net/..."
                            className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">
                            Upload File{" "}
                            <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                        </label>
                        <label className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                            style={{ border: "2px dashed rgba(255,255,255,0.15)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                                viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>
                                {form.fileName
                                    ? <span style={{ color: "#FFC085" }}>{form.fileName}</span>
                                    : "Click to upload your work file"}
                            </p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>ZIP, PDF, PNG, JPG up to 50MB</p>
                            <input type="file" className="hidden" onChange={handleFile}
                                accept=".zip,.pdf,.png,.jpg,.jpeg,.ai,.psd,.fig" />
                        </label>
                        {form.fileName && (
                            <button type="button"
                                onClick={() => setForm(prev => ({ ...prev, file: null, fileName: null }))}
                                className="text-xs self-start hover:opacity-80" style={{ color: "#f87171" }}>
                                Remove file
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">
                            Notes to Agent{" "}
                            <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                        </label>
                        <textarea value={form.notes}
                            onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder={isRevision
                                ? "Any additional notes about the changes made..."
                                : "Any additional notes, instructions for using the files..."}
                            rows={2}
                            className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>

                    <div className="p-4 rounded-xl flex gap-3"
                        style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none"
                            viewBox="0 0 24 24" stroke="#63b3ed" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>
                            Payment is securely held by <span className="text-white font-medium">Gengig</span> until
                            the agent approves your work. After approval, payment will be released automatically.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                            <span style={{ color: "#f87171" }}>⚠</span>
                            <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button type="submit" disabled={submitting}
                            className="flex-1 py-3 rounded-full font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            {submitting ? (
                                <><div className="w-4 h-4 rounded-full border-2 animate-spin"
                                    style={{ borderColor: "white", borderTopColor: "transparent" }} />
                                    Submitting...</>
                            ) : isRevision ? "Submit Revision →" : "Submit Work →"}
                        </button>
                        <Link to="/teenlancer/dashboard"
                            className="flex-1 py-3 rounded-full font-semibold text-center hover:bg-white/10 transition-all"
                            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#B2B2D2" }}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </TeenlancerLayout>
    );
}