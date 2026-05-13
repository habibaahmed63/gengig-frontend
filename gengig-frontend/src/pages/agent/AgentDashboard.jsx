import { useState, useEffect } from "react";
import api from "../services/api";

export default function AgentDashboard() {
    const [submittedRevisions, setSubmittedRevisions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmittedRevisions = async () => {
            try {
                const res = await api.get("/gigs/agent-revisions?status=submitted"); // Adjust endpoint
                setSubmittedRevisions(res.data);
            } catch (err) {
                console.error("Failed to fetch submitted revisions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmittedRevisions();
    }, []);

    const handleApprove = async (gigId) => {
        try {
            await api.post(`/gigs/${gigId}/approve-revision`);
            setSubmittedRevisions(prev => prev.filter(g => g._id !== gigId));
            // Notify teenlancer via socket or refresh
        } catch (err) {
            console.error("Failed to approve:", err);
        }
    };

    const handleRequestRevision = async (gigId, changes) => {
        try {
            await api.post(`/gigs/${gigId}/request-revision`, { requestedChanges: changes });
            setSubmittedRevisions(prev => prev.filter(g => g._id !== gigId));
            // Notify teenlancer via socket
        } catch (err) {
            console.error("Failed to request revision:", err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Agent Dashboard</h1>

            {/* Submitted Revisions Section */}
            {submittedRevisions.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Revisions to Review ({submittedRevisions.length})
                    </h2>
                    <div className="grid gap-4">
                        {submittedRevisions.map(gig => (
                            <div key={gig._id} className="p-4 rounded-lg border"
                                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(34,197,94,0.3)" }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-white font-semibold">{gig.title}</h3>
                                        <p className="text-sm text-gray-400">TeenLancer: {gig.teenlancerName}</p>
                                        <p className="text-sm text-green-400 mt-2">
                                            Submitted Notes: {gig.revisionRequests?.[gig.revisionRequests.length - 1]?.submittedNotes || "No notes"}
                                        </p>
                                        {/* Display submitted files if needed */}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApprove(gig._id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                                            Approve
                                        </button>
                                        <button onClick={() => {
                                            const changes = prompt("Describe requested changes:");
                                            if (changes) handleRequestRevision(gig._id, changes);
                                        }}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                            Request Revision
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other agent dashboard content */}
            {/* ...existing code... */}
        </div>
    );
}