import { useState } from "react";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";

const statusColor = {
    Success: "#4ade80",
    Rejected: "#f87171",
    Pending: "#FFC085",
};

export default function TeenlancerPayment() {
    // TODO: Replace with API call: GET /payments/cards
    const [savedCard, setSavedCard] = useState(() => {
        const stored = localStorage.getItem("savedCard");
        return stored ? JSON.parse(stored) : null;
    });

    const [showCardForm, setShowCardForm] = useState(false);
    const [cardData, setCardData] = useState({
        cardType: "Mastercard",
        name: "",
        number: "",
        expiry: "",
        ccv: "",
    });
    const [cardSaved, setCardSaved] = useState(false);
    const [cardError, setCardError] = useState("");

    // TODO: Replace with API call: GET /payments/transactions
    const paymentHistory = JSON.parse(localStorage.getItem("paymentHistory") || "[]");

    // TODO: Replace with API call: GET /teenlancer/stats
    const totalEarnings = localStorage.getItem("totalEarnings") || "$0";
    const pendingPayments = localStorage.getItem("pendingPayments") || "$0";

    const handleCardChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
        setCardError("");
    };

    const handleSaveCard = () => {
        if (!cardData.name.trim()) { setCardError("Please enter the name on card."); return; }
        if (cardData.number.replace(/\s/g, "").length < 12) { setCardError("Please enter a valid card number."); return; }
        if (!cardData.expiry.trim()) { setCardError("Please enter the expiry date."); return; }
        if (!cardData.ccv.trim()) { setCardError("Please enter the CCV."); return; }

        const card = {
            cardType: cardData.cardType,
            name: cardData.name,
            number: cardData.number,
            expiry: cardData.expiry,
            maskedNumber: "**** **** **** " + cardData.number.replace(/\s/g, "").slice(-4),
        };

        // TODO: Replace with API call: POST /payments/save-card
        localStorage.setItem("savedCard", JSON.stringify(card));
        setSavedCard(card);
        setShowCardForm(false);
        setCardData({ cardType: "Mastercard", name: "", number: "", expiry: "", ccv: "" });
        setCardSaved(true);
        setTimeout(() => setCardSaved(false), 3000);
    };

    const handleRemoveCard = () => {
        // TODO: Replace with API call: DELETE /payments/cards
        localStorage.removeItem("savedCard");
        setSavedCard(null);
    };

    return (
        <TeenlancerLayout>
            {cardSaved && (
                <div
                    className="fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                >
                    ✓ Card saved successfully!
                </div>
            )}

            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Payment Details</span>
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>Total Earnings</p>
                    <p className="font-bold text-lg" style={{ color: "#FFC085" }}>{totalEarnings}</p>
                    <p className="text-xs mt-1" style={{ color: "#B2B2D2" }}>Updated from completed gigs</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>Pending Payments</p>
                    <p className="font-bold text-lg" style={{ color: "#FFC085" }}>{pendingPayments}</p>
                    <p className="text-xs mt-1" style={{ color: "#B2B2D2" }}>Awaiting approval</p>
                </div>
                <div
                    className="p-4 rounded-2xl flex items-center justify-between"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <div>
                        <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>Withdrawal Method</p>
                        {savedCard ? (
                            <p className="text-white text-sm font-medium">{savedCard.maskedNumber}</p>
                        ) : (
                            <p className="text-sm italic" style={{ color: "rgba(178,178,210,0.4)" }}>No card added</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowCardForm(!showCardForm)}
                        className="hover:opacity-80 transition-opacity"
                        style={{ color: "#FFC085" }}
                    >
                        ✎
                    </button>
                </div>
            </div>

            {/* Saved Card Display */}
            {savedCard && !showCardForm && (
                <div
                    className="p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <div
                        className="relative w-64 h-36 rounded-2xl overflow-hidden p-4 flex flex-col justify-between flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #1a3a6b, #0a1f4d)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-8 h-6 rounded-md" style={{ background: "rgba(255,192,133,0.4)" }} />
                            <span className="text-white font-bold text-xs">{savedCard.cardType}</span>
                        </div>
                        <div>
                            <p className="text-white text-xs tracking-widest mb-2">{savedCard.maskedNumber}</p>
                            <p className="text-white text-xs font-medium">{savedCard.name}</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-semibold mb-1">{savedCard.cardType} ending in {savedCard.number.replace(/\s/g, "").slice(-4)}</p>
                        <p className="text-xs mb-4" style={{ color: "#B2B2D2" }}>Expires {savedCard.expiry}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCardForm(true)}
                                className="px-4 py-2 rounded-full text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                Edit Card
                            </button>
                            <button
                                onClick={handleRemoveCard}
                                className="px-4 py-2 rounded-full text-xs font-semibold transition-colors hover:bg-white/10"
                                style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
                            >
                                Remove Card
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Card Form */}
            {(showCardForm || !savedCard) && (
                <div
                    className="p-6 rounded-2xl mb-8"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white font-semibold">
                            {savedCard ? "Edit Card" : "Add Payment Card"}
                        </h2>
                        {savedCard && (
                            <button
                                onClick={() => setShowCardForm(false)}
                                className="text-xs hover:opacity-80 transition-opacity"
                                style={{ color: "#B2B2D2" }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Card Type */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Card Type</label>
                                <select
                                    name="cardType"
                                    value={cardData.cardType}
                                    onChange={handleCardChange}
                                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                >
                                    <option style={{ background: "#060834" }}>Mastercard</option>
                                    <option style={{ background: "#060834" }}>Visa</option>
                                    <option style={{ background: "#060834" }}>Amex</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Name on Card</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={cardData.name}
                                    onChange={handleCardChange}
                                    placeholder="Your full name"
                                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                            </div>

                            {/* Card Number */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Card Number</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={cardData.number}
                                    onChange={handleCardChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                            </div>

                            {/* Expiry + CCV */}
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Expiry Date</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        value={cardData.expiry}
                                        onChange={handleCardChange}
                                        placeholder="MM / YY"
                                        maxLength={7}
                                        className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>CCV</label>
                                    <input
                                        type="password"
                                        name="ccv"
                                        value={cardData.ccv}
                                        onChange={handleCardChange}
                                        placeholder="• • •"
                                        maxLength={4}
                                        className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                </div>
                            </div>

                            {cardError && (
                                <p className="text-xs" style={{ color: "#f87171" }}>{cardError}</p>
                            )}

                            <button
                                onClick={handleSaveCard}
                                className="w-full py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                            >
                                Save Card
                            </button>
                        </div>

                        {/* Card Preview */}
                        <div className="w-full lg:w-64 flex-shrink-0">
                            <div
                                className="relative w-full h-40 rounded-2xl overflow-hidden p-5 flex flex-col justify-between"
                                style={{ background: "linear-gradient(135deg, #1a3a6b, #0a1f4d)", border: "1px solid rgba(255,255,255,0.15)" }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-7 rounded-md" style={{ background: "rgba(255,192,133,0.4)" }} />
                                    <span className="text-white font-bold text-xs">{cardData.cardType}</span>
                                </div>
                                <div>
                                    <p className="text-white text-xs tracking-widest mb-2">
                                        {cardData.number || "•••• •••• •••• ••••"}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-white text-xs font-medium">{cardData.name || "YOUR NAME"}</p>
                                        <div className="flex">
                                            <div className="w-6 h-6 rounded-full opacity-80" style={{ background: "#EB001B" }} />
                                            <div className="w-6 h-6 rounded-full -ml-3 opacity-80" style={{ background: "#F79E1B" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-center mt-2" style={{ color: "#B2B2D2" }}>Card preview</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment History */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
                <div className="p-6 pb-3">
                    <h2 className="text-white font-semibold text-lg">Payment History</h2>
                </div>

                {paymentHistory.length > 0 ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                                {["Order ID", "Date", "Amount", "Status"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold" style={{ color: "#B2B2D2" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((row, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <td className="px-6 py-3 text-white">{row.id}</td>
                                    <td className="px-6 py-3" style={{ color: "#B2B2D2" }}>{row.date}</td>
                                    <td className="px-6 py-3 text-white">{row.amount}</td>
                                    <td className="px-6 py-3 font-medium" style={{ color: statusColor[row.status] }}>{row.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center py-12"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                        </svg>
                        <p className="text-sm italic" style={{ color: "rgba(178,178,210,0.4)" }}>No payment history yet.</p>
                        <p className="text-xs mt-1" style={{ color: "rgba(178,178,210,0.3)" }}>
                            Payments will appear here once you complete gigs.
                        </p>
                    </div>
                )}
            </div>
        </TeenlancerLayout>
    );
}