import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Gengig LOGO.png";

const skillsList = ["UI/UX Design", "Logo Design", "Graphic Design", "Video Editing", "Motion Graphics", "Photography", "Web Development", "Content Writing", "Social Media", "Animation"];

export default function TeenlancerOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        photo: null,
        bio: "",
        skills: [],
        availability: "",
        hourlyRate: "",
        education: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillToggle = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.includes(skill)
                ? formData.skills.filter((s) => s !== skill)
                : [...formData.skills, skill],
        });
    };

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = () => {
        localStorage.setItem("bio", formData.bio);
        localStorage.setItem("skills", JSON.stringify(formData.skills));
        localStorage.setItem("education", formData.education);
        localStorage.setItem("availability", formData.availability);
        localStorage.setItem("hourlyRate", formData.hourlyRate);
        if (formData.photo) localStorage.setItem("photo", formData.photo);

        console.log(formData);
        navigate("/teenlancer/dashboard");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: "#060834" }}>

            {/* Logo */}
            <img src={logo} alt="Gengig" className="w-16 h-16 object-contain mb-6" />

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
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
                        {s < 3 && <div className="w-12 h-0.5" style={{ background: step > s ? "#FFC085" : "rgba(255,255,255,0.1)" }} />}
                    </div>
                ))}
            </div>

            {/* Card */}
            <div className="w-full max-w-lg p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>

                {/* Step 1 - Photo + Bio */}
                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-white font-bold text-xl mb-1">Let's set up your profile</h2>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Tell clients a bit about yourself</p>
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

                        {/* Bio */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Bio / Description</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                                rows={4}
                                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>

                        {/* Education */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Education / School</label>
                            <input
                                type="text"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                placeholder="e.g. Cairo STEM High School"
                                className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2 - Skills */}
                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-white font-bold text-xl mb-1">What are your skills?</h2>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Select all that apply — you can always update later</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skillsList.map((skill) => {
                                const selected = formData.skills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => handleSkillToggle(skill)}
                                        className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                                        style={{
                                            background: selected ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                                            color: selected ? "white" : "#B2B2D2",
                                            border: selected ? "none" : "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>
                        {formData.skills.length === 0 && (
                            <p className="text-xs" style={{ color: "#f87171" }}>Please select at least one skill</p>
                        )}
                    </div>
                )}

                {/* Step 3 - Availability + Rate */}
                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-white font-bold text-xl mb-1">Availability & Rate</h2>
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Let clients know when you're available and your rate</p>
                        </div>

                        {/* Availability */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Availability</label>
                            <div className="flex flex-col gap-2">
                                {["Full-time", "Part-time", "Weekends only", "Flexible"].map((option) => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors" style={{ background: formData.availability === option ? "rgba(255,192,133,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${formData.availability === option ? "rgba(255,192,133,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                                        <input
                                            type="radio"
                                            name="availability"
                                            value={option}
                                            checked={formData.availability === option}
                                            onChange={handleChange}
                                            className="accent-[#FFC085]"
                                        />
                                        <span className="text-sm" style={{ color: formData.availability === option ? "#FFC085" : "white" }}>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Hourly Rate */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Hourly Rate (USD)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#FFC085" }}>$</span>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                            </div>
                        </div>
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
                    {step < 3 ? (
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
                onClick={() => navigate("/teenlancer/dashboard")}
                className="mt-4 text-xs hover:text-white transition-colors"
                style={{ color: "#B2B2D2" }}
            >
                Skip for now
            </button>
        </div>
    );
}