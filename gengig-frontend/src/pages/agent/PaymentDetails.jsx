import { useState } from "react";
import AgentLayout from "../../layouts/AgentLayout";

export default function AgentPayment() {
    const [cardData, setCardData] = useState({
        cardType: "Mastercard",
        name: "",
        number: "",
        expiry: "",
        ccv: "",
    });

    const handleChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    return (
        <AgentLayout>
            {/* Breadcrumb */}
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Payment Details</span>
            </p>

            <div className="flex gap-10 items-start">

                {/* Left - Title + Form */}
                <div className="flex-1">
                    <h1 className="font-semibold mb-8" style={{ fontSize: "1.3rem", color: "#FFC085" }}>
                        Payment method
                    </h1>

                    {/* Saved Card Dropdown */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-white font-semibold">Saved Card</p>
                        <select
                            name="cardType"
                            value={cardData.cardType}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-xl text-white text-sm outline-none"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                            <option style={{ background: "#060834" }}>Mastercard</option>
                            <option style={{ background: "#060834" }}>Visa</option>
                            <option style={{ background: "#060834" }}>Amex</option>
                        </select>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-5">
                        {/* Name on card */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm" style={{ color: "#B2B2D2" }}>Name on card:</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter Howard"
                                    value={cardData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#B2B2D2" }}>👤</span>
                            </div>
                        </div>

                        {/* Card Number */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm" style={{ color: "#B2B2D2" }}>Card number:</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="number"
                                    placeholder="123-456-789-"
                                    value={cardData.number}
                                    onChange={handleChange}
                                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#B2B2D2" }}>💳</span>
                            </div>
                        </div>

                        {/* Expiry + CCV */}
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm" style={{ color: "#B2B2D2" }}>Expiry date:</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="expiry"
                                        placeholder="MM / YY"
                                        value={cardData.expiry}
                                        onChange={handleChange}
                                        className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#B2B2D2" }}>📅</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm" style={{ color: "#B2B2D2" }}>CCV:</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="ccv"
                                        placeholder="• • •"
                                        value={cardData.ccv}
                                        onChange={handleChange}
                                        className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#B2B2D2" }}>👁</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Brand Icons */}
                        <div className="flex gap-3 justify-end mt-2">
                            <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "#1A1F71" }}>VISA</div>
                            <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
                                <div className="flex">
                                    <div className="w-5 h-5 rounded-full" style={{ background: "#EB001B" }} />
                                    <div className="w-5 h-5 rounded-full -ml-2" style={{ background: "#F79E1B" }} />
                                </div>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "#016FD0", color: "white" }}>AMEX</div>
                        </div>

                        {/* Save Button */}
                        <button className="w-full py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity mt-2" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Save Card
                        </button>
                    </div>
                </div>

                {/* Right - Card Visual */}
                <div className="w-72 flex-shrink-0">
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden p-5 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #1a3a6b, #0a1f4d)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        {/* Bank name */}
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-7 rounded-md" style={{ background: "rgba(255,192,133,0.4)" }} />
                            <span className="text-white font-bold text-sm">N Bank</span>
                        </div>
                        {/* Card number */}
                        <div>
                            <p className="text-white text-sm tracking-widest mb-3">
                                {cardData.number || "1234  5678  9876  5420"}
                            </p>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>1234</p>
                                    <p className="text-white text-sm font-medium">{cardData.name || "AL HOLDER"}</p>
                                </div>
                                <div className="flex">
                                    <div className="w-8 h-8 rounded-full opacity-80" style={{ background: "#EB001B" }} />
                                    <div className="w-8 h-8 rounded-full -ml-4 opacity-80" style={{ background: "#F79E1B" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add new card button */}
                    <button className="mt-4 w-full py-2.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors" style={{ border: "1px dashed rgba(255,255,255,0.2)", color: "#B2B2D2" }}>
                        <span className="text-lg">+</span> Add New Card
                    </button>
                </div>

            </div>
        </AgentLayout>
    );
}