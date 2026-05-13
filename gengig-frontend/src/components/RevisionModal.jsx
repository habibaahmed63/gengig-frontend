import { useState } from "react";
import api from "../services/api";

export default function RevisionModal({ message, gig, onClose, onSubmit }) {
    const [files, setFiles] = useState([]);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleFileSelect = (e) => {
        setFiles([...files, ...e.target.files]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmitRevision = async () => {
        if (!files.length) return;
        setSubmitting(true);

        try {
            const formData = new FormData();
            files.forEach(f => formData.append("files", f));
            formData.append("gigId", gig._id);
            formData.append("revisionNotes", notes);
            formData.append("revisionNumber", message.revisionData?.revisionNumber || 1);

            const res = await api.post("/gigs/submit-revision", formData);
            onSubmit(res.data);
            onClose();
        } catch (err) {
            console.error("Failed to submit revision:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl p-6 z-10"
                style={{ background: "#0a0d2e", border: "1px solid rgba(255,255,255,0.12)" }}>

                <h3 className="text-white font-bold text-lg mb-2">Submit Revision</h3>
                <p className="text-sm mb-4" style={{ color: "#B2B2D2" }}>
                    Requested changes: {message.content}
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-white mb-2">Upload Files</label>
                    <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-white/5 transition-colors"
                        style={{ borderColor: "rgba(255,192,133,0.3)" }}
                        onClick={() => document.getElementById("file-input").click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-sm font-medium text-white">Click to upload or drag files</p>
                        <p className="text-xs" style={{ color: "#B2B2D2" }}>PNG, JPG, PDF up to 10MB</p>
                    </div>
                    <input id="file-input" type="file" multiple onChange={handleFileSelect} className="hidden" />
                </div>

                {files.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-white mb-2">Selected Files ({files.length})</p>
                        <div className="space-y-1">
                            {files.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded"
                                    style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <span className="text-xs text-white truncate">{f.name}</span>
                                    <button onClick={() => removeFile(i)} className="text-xs" style={{ color: "#f87171" }}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-white mb-2">Notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                        placeholder="Add any notes about your changes..."
                        className="w-full h-20 p-3 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#B2B2D2" }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmitRevision} disabled={!files.length || submitting}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors"
                        style={{ background: files.length ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.1)" }}>
                        {submitting ? "Submitting..." : "Submit Revision"}
                    </button>
                </div>
            </div>
        </div>
    );
}