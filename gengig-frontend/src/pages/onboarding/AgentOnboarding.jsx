import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Gengig LOGO.png";

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const workTypes = ["Graphic Design", "Video Editing", "Web Development", "UI/UX Design", "Content Writing", "Social Media", "Animation", "Photography", "Logo Design", "Marketing"];

export default function AgentOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        photo: null,
        companyName: "",
        industry: "",
        workTypes: [],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWorkTypeToggle = (type) => {
        setFormData({
            ...formData,
            workTypes: formData.workTypes.includes(type)
                ? formData.workTypes.filter((t) => t !== type)
                : [...formData.workTypes, type],
        });
    };

    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormData({ ...formData, photo: base64 });
        }
    };

    const handleSubmit = () => {
        localStorage.setItem("company", formData.companyName);
        localStorage.setItem("industry", formData.industry);
        localStorage.setItem("workTypes", JSON.stringify(formData.workTypes));
        if (formData.photo) localStorage.setItem("photo", formData.photo);

        console.log(formData);
        navigate("/agent/dashboard");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: "#060834" }}>

            {/* Logo */}
            <img src={logo} alt="Gengig" className="w-16 h-16 object-contain mb-6" />

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                            style={{
                                background: step >= s ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.1)",
                                color: step >= s ? "white" : "#B2B2D2",
                            }}
                        >
                            {s}
                        </div>
                        {s < 2 && <div className="w-12 h-0.5" style={{ background: step > s ? "#FFC085" : "rgba(255,255,255,0.1)" }} />}
                    </div>
                ))}
            </div>

            {/* Card */}
            <div className="w-full max-w-lg p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>

                {/* Step 1 - Photo + Company Info */}
                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-white font-bold text-xl mb-1">Set up your agent profile</h2>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Tell teenlancers about you and your company</p>
                        </div>

                        {/* Photo Upload */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer relative" style={{ border: "2px dashed #FFC085", background: "rgba(255,192,133,0.05)" }}>
                                {formData.photo ? (
                                    <img src={formData.photo} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl">📷</span>
                                )}
                                <input type="file" accept="image/*" onChange={handlePhoto} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>Click to upload profile photo</p>
                        </div>

                        {/* Company Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Company / Business Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="e.g. Creative Studio Co."
                                className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>

                        {/* Industry */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Industry / Field</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                                <option value="" style={{ background: "#060834" }}>Select your industry</option>
                                <option style={{ background: "#060834" }}>Marketing & Advertising</option>
                                <option style={{ background: "#060834" }}>Technology</option>
                                <option style={{ background: "#060834" }}>Education</option>
                                <option style={{ background: "#060834" }}>E-commerce</option>
                                <option style={{ background: "#060834" }}>Media & Entertainment</option>
                                <option style={{ background: "#060834" }}>Healthcare</option>
                                <option style={{ background: "#060834" }}>Fashion & Lifestyle</option>
                                <option style={{ background: "#060834" }}>Other</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 2 - Work Types */}
                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-white font-bold text-xl mb-1">What type of work do you need?</h2>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Select all the services you're looking for</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {workTypes.map((type) => {
                                const selected = formData.workTypes.includes(type);
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleWorkTypeToggle(type)}
                                        className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                                        style={{
                                            background: selected ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                                            color: selected ? "white" : "#B2B2D2",
                                            border: selected ? "none" : "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                        {formData.workTypes.length === 0 && (
                            <p className="text-xs" style={{ color: "#f87171" }}>Please select at least one type</p>
                        )}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2 rounded-full text-sm font-semibold transition-colors"
                            style={{ background: "rgba(255,255,255,0.08)", color: "#B2B2D2" }}
                        >
                            Back
                        </button>
                    ) : (
                        <div />
                    )}
                    {step < 2 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Complete Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Skip */}
            <button
                onClick={() => navigate("/agent/dashboard")}
                className="mt-4 text-xs hover:text-white transition-colors"
                style={{ color: "#B2B2D2" }}
            >
                Skip for now
            </button>
        </div>
    );
}