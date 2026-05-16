import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

export default function ReviewWork() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [approved, setApproved] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewDone, setReviewDone] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [error, setError] = useState(null);
    const [rejected, setRejected] = useState(false);


    useEffect(() => {
        api.get(`/applications/${applicationId}/submission`)
            .then(res => setSubmission(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [applicationId]);

    const handleApprove = async () => {
        setApproving(true);
        setError(null);
        try {
            await api.post(`/applications/${applicationId}/approve-work`);
            setApproved(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to approve. Please try again.");
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) return;
        setRejecting(true);
        try {
            await api.post(`/applications/${applicationId}/reject-work`, {
                reason: rejectReason,
            });
            setRejected(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send revision request.");
        } finally {
            setRejecting(false);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) { setError("Please select a rating."); return; }
        setSubmittingReview(true);
        setError(null);
        try {
            await api.post(`/applications/${applicationId}/review`, {
                stars: rating,
                text: review,
            });
            setReviewDone(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <AgentLayout>
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-2 animate-spin"
                    style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
            </div>
        </AgentLayout>
    );

    // ── Rate the teenlancer after approving ─//
    if (approved && !reviewDone) return (
        <AgentLayout>
            <div className="max-w-lg mx-auto py-12 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(74,222,128,0.15)", border: "2px solid #4ade80" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none"
                        viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-white font-bold text-2xl mb-2">Work Approved!</h2>
                <p className="text-sm mb-2" style={{ color: "#B2B2D2" }}>
                    Payment has been released to the teenlancer's account.
                </p>
                <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                    How would you rate{" "}
                    <span className="text-white font-semibold">
                        {submission?.teenlancer?.name || "this teenlancer"}
                    </span>
                    's work?
                </p>

                <div className="p-6 rounded-2xl mb-6"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="text-3xl transition-transform hover:scale-110">
                                <span style={{ color: star <= (hoverRating || rating) ? "#FFC085" : "rgba(178,178,210,0.3)" }}>
                                    ★
                                </span>
                            </button>
                        ))}
                    </div>

                    {rating > 0 && (
                        <p className="text-center text-sm mb-4" style={{ color: "#FFC085" }}>
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
                        </p>
                    )}

                    <textarea value={review}
                        onChange={e => setReview(e.target.value)}
                        placeholder="Share your experience working with this teenlancer... (optional)"
                        rows={3}
                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />

                    {error && <p className="text-xs mt-2 text-left" style={{ color: "#f87171" }}>{error}</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={handleSubmitReview} disabled={submittingReview || rating === 0}
                        className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 disabled:opacity-50"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        {submittingReview ? "Submitting..." : "Submit Review →"}
                    </button>
                    <button onClick={() => navigate("/agent/dashboard")}
                        className="w-full py-3 rounded-full font-semibold hover:bg-white/10 transition-all text-sm"
                        style={{ color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.12)" }}>
                        Skip for now
                    </button>
                </div>
            </div>
        </AgentLayout>
    );

    // ── Review submitted ──//
    if (reviewDone) return (
        <AgentLayout>
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "rgba(255,192,133,0.15)", border: "2px solid #FFC085" }}>
                    <span className="text-3xl">⭐</span>
                </div>
                <h2 className="text-white font-bold text-2xl mb-3">Review Submitted!</h2>
                <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                    Thank you for rating the teenlancer. Your review helps the community.
                </p>
                <button onClick={() => navigate("/agent/dashboard")}
                    className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    Back to Dashboard
                </button>
            </div>
        </AgentLayout>
    );
    if (rejected) return (
        <AgentLayout>
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "rgba(248,113,113,0.12)", border: "2px solid #f87171" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none"
                        viewBox="0 0 24 24" stroke="#f87171" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <h2 className="text-white font-bold text-2xl mb-3">Revision Requested!</h2>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "#B2B2D2" }}>
                    Your revision request has been sent to the teenlancer.
                </p>
                <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                    They'll be notified and asked to resubmit their work addressing your feedback.
                </p>
                <div className="p-4 rounded-2xl w-full mb-8"
                    style={{ background: "rgba(255,192,133,0.08)", border: "1px solid rgba(255,192,133,0.2)" }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: "#FFC085" }}>📋 Your Feedback</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>{rejectReason}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button onClick={() => navigate("/agent/applications")}
                        className="flex-1 py-3 rounded-full font-semibold text-white hover:opacity-90"
                        style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                        View All Applications
                    </button>
                    <button onClick={() => navigate("/agent/dashboard")}
                        className="flex-1 py-3 rounded-full font-semibold hover:bg-white/10"
                        style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#B2B2D2" }}>
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </AgentLayout>
    );

    // Review the submitted work //
    return (
        <AgentLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                <Link to="/agent/applications" className="hover:text-[#FFC085]">Applications</Link>
                {" › "}
                <span style={{ color: "#FFC085" }}>Review Work</span>
            </p>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-white font-bold text-2xl mb-2">Review Submitted Work</h1>
                <p className="text-sm mb-8" style={{ color: "#B2B2D2" }}>
                    Review the teenlancer's submission before approving and releasing payment.
                </p>

                {submission ? (
                    <div className="flex flex-col gap-5">

                        {/* Teenlancer info */}
                        {submission.teenlancer && (
                            <div className="p-5 rounded-2xl flex items-center gap-4"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                    style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}>
                                    {submission.teenlancer.photo ? (
                                        <img src={submission.teenlancer.photo} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold" style={{ color: "#FFC085" }}>
                                            {submission.teenlancer.name?.charAt(0) || "?"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{submission.teenlancer.name}</p>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Submitted work for review</p>
                                </div>
                            </div>
                        )}

                        {/* Work description */}
                        <div className="p-5 rounded-2xl"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <h3 className="text-white font-semibold mb-3">Work Description</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                {submission.description || "No description provided."}
                            </p>
                        </div>

                        {/* Deliverables */}
                        {submission.deliverables && (
                            <div className="p-5 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h3 className="text-white font-semibold mb-3">Deliverables</h3>
                                <ul className="flex flex-col gap-2">
                                    {submission.deliverables.split("\n").filter(Boolean).map((d, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#B2B2D2" }}>
                                            <span style={{ color: "#4ade80" }}>✓</span> {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Links and files */}
                        {(submission.portfolioLink || submission.fileUrl) && (
                            <div className="p-5 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h3 className="text-white font-semibold mb-3">Attachments</h3>
                                <div className="flex flex-col gap-2">
                                    {submission.portfolioLink && (
                                        <a href={submission.portfolioLink} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                                            style={{ color: "#FFC085" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View Portfolio / Drive Link
                                        </a>
                                    )}
                                    {submission.fileUrl && (
                                        <a href={submission.fileUrl} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                                            style={{ color: "#63b3ed" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download Submitted File
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {submission.notes && (
                            <div className="p-5 rounded-2xl"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h3 className="text-white font-semibold mb-3">Notes from Teenlancer</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>{submission.notes}</p>
                            </div>
                        )}

                        {/* Payment escrow info */}
                        <div className="p-4 rounded-xl flex gap-3"
                            style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none"
                                viewBox="0 0 24 24" stroke="#63b3ed" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div>
                                <p className="text-xs font-semibold mb-1" style={{ color: "#63b3ed" }}>💰 Payment on Hold</p>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                    Payment of <span className="text-white font-semibold">{submission.amount || "the agreed amount"}</span> is
                                    held securely by Gengig. Approving this work will release the payment to the teenlancer immediately.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                                <span style={{ color: "#f87171" }}>⚠</span>
                                <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
                            </div>
                        )}

                        {/* Reject form */}
                        {showRejectForm && (
                            <div className="p-5 rounded-2xl"
                                style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)" }}>
                                <h3 className="font-semibold mb-3 text-sm" style={{ color: "#f87171" }}>Request Revision</h3>
                                <textarea value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    placeholder="Explain what needs to be changed or improved..."
                                    rows={3}
                                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#f87171] resize-none mb-3"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(248,113,113,0.3)" }} />
                                <div className="flex gap-3">
                                    <button onClick={handleReject} disabled={rejecting || !rejectReason.trim()}
                                        className="px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                                        style={{ background: "#f87171" }}>
                                        {rejecting ? "Sending..." : "Send Back for Revision"}
                                    </button>
                                    <button onClick={() => setShowRejectForm(false)}
                                        className="px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/10"
                                        style={{ color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.12)" }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        {!showRejectForm && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleApprove} disabled={approving}
                                    className="flex-1 py-3 rounded-full font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)" }}>
                                    {approving ? (
                                        <><div className="w-4 h-4 rounded-full border-2 animate-spin"
                                            style={{ borderColor: "white", borderTopColor: "transparent" }} /> Approving...</>
                                    ) : "✓ Approve & Release Payment"}
                                </button>
                                <button onClick={() => setShowRejectForm(true)}
                                    className="flex-1 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                                    ✕ Request Revision
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                        style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <p className="text-white font-medium mb-1">No submission found</p>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>The teenlancer hasn't submitted work yet.</p>
                    </div>
                )}
            </div>
        </AgentLayout>
    );
}