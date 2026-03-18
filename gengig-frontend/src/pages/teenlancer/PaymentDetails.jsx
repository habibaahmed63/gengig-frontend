import TeenlancerLayout from "../../layouts/TeenlancerLayout";

const paymentHistory = [
    { id: "#15267", date: "Mar 1, 2023", amount: 100, questions: 1, status: "Success" },
    { id: "#153587", date: "Jan 26, 2023", amount: 300, questions: 3, status: "Success" },
    { id: "#12436", date: "Feb 12, 2023", amount: 100, questions: 1, status: "Success" },
    { id: "#16879", date: "Feb 12, 2023", amount: 500, questions: 5, status: "Success" },
    { id: "#16378", date: "Feb 28, 2023", amount: 500, questions: 5, status: "Rejected" },
    { id: "#16609", date: "March 13, 2023", amount: 100, questions: 1, status: "Success" },
    { id: "#16907", date: "March 18, 2023", amount: 100, questions: 1, status: "Pending" },
];

const statusColor = {
    Success: "#4ade80",
    Rejected: "#f87171",
    Pending: "#FFC085",
};

export default function TeenlancerPayment() {
    return (
        <TeenlancerLayout>
            {/* Breadcrumb */}
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Payment Details</span>
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>Total Earnings</p>
                    <p className="font-bold text-lg" style={{ color: "#FFC085" }}>₹430.00</p>
                    <p className="text-xs mt-1" style={{ color: "#B2B2D2" }}>as of 31 December 2022</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>Pending Payments</p>
                    <p className="font-bold text-lg" style={{ color: "#FFC085" }}>₹100.00</p>
                    <p className="text-xs mt-1" style={{ color: "#B2B2D2" }}>as of 31 December 2022</p>
                </div>
                <div className="p-4 rounded-2xl flex items-center justify-between" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div>
                        <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>Withdrawal Method</p>
                        <p className="text-white text-sm font-medium">1502••••••••4832</p>
                    </div>
                    <button className="text-[#FFC085] hover:opacity-80">✎</button>
                </div>
            </div>

            {/* Payment History Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="p-6 pb-3">
                    <h2 className="text-white font-semibold text-lg">Payment History</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            {["Order ID", "Date", "Amount", "Total Questions", "Status"].map((h) => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-semibold" style={{ color: "#B2B2D2" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((row) => (
                            <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td className="px-6 py-3 text-white">{row.id}</td>
                                <td className="px-6 py-3" style={{ color: "#B2B2D2" }}>{row.date}</td>
                                <td className="px-6 py-3 text-white">{row.amount}</td>
                                <td className="px-6 py-3 text-white">{row.questions}</td>
                                <td className="px-6 py-3 font-medium" style={{ color: statusColor[row.status] }}>{row.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="px-6 py-4 flex items-center gap-2">
                    <select className="text-xs px-3 py-1.5 rounded-lg outline-none" style={{ background: "rgba(255,255,255,0.08)", color: "#B2B2D2", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <span className="text-xs" style={{ color: "#B2B2D2" }}>per page</span>
                </div>
            </div>
        </TeenlancerLayout>
    );
}