
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgentLayout from "../layouts/AgentLayout";
import api from "../services/api";

const CATEGORIES = [
    { label: "Graphic Design", icon: "🎨" },
    { label: "Video Editing", icon: "🎬" },
    { label: "Web Development", icon: "💻" },
    { label: "UI/UX Design", icon: "📱" },
    { label: "Content Writing", icon: "✍️" },
    { label: "Photography", icon: "📸" },
    { label: "Social Media", icon: "📣" },
    { label: "Animation", icon: "✨" },
    { label: "Logo Design", icon: "🖊️" },
    { label: "Motion Graphics", icon: "🎥" },
];

const BUDGETS = ["$50–$100", "$100–$200", "$200–$500", "$500–$1000", "$1000+"];

const DEADLINES = [
    { label: "1–2 days", value: "1-2 days" },
    { label: "3–5 days", value: "3-5 days" },
    { label: "1 week", value: "1 week" },
    { label: "2 weeks", value: "2 weeks" },
    { label: "1 month", value: "1 month" },
    { label: "Flexible", value: "Flexible" },
];

const STEPS = ["Details", "Budget & Timeline", "Requirements", "Review"];

const FIELD_LIMITS = { title: 80, description: 1000 };

export default function PostGig() {
    const navigate = useNavigate();
    const agentName = localStorage.getItem("name") || "Agent";
    const agentCompany = localStorage.getItem("company") || "";

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        budget: "",
        customBudget: "",
        deadline: "",
        skillsInput: "",
        skills: [],
        requirements: [""],
        attachments: [],
    });

    // ── helpers ──────────────────────────────────────────────────
    const set = (key, val) => {
        setForm(prev => ({ ...prev, [key]: val }));
        setErrors(prev => ({ ...prev, [key]: "" }));
    };

    const completionPct = () => {
        let filled = 0, total = 5;
        if (form.title.trim()) filled++;
        if (form.category) filled++;
        if (form.description.trim()) filled++;
        if (form.budget) filled++;
        if (form.deadline) filled++;
        return Math.round((filled / total) * 100);
    };

    // ── skills chip logic ────────────────────────────────────────
    const handleSkillKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && form.skillsInput.trim()) {
            e.preventDefault();
            const skill = form.skillsInput.trim().replace(/,$/, "");
            if (skill && !form.skills.includes(skill) && form.skills.length < 10) {
                set("skills", [...form.skills, skill]);
            }
            set("skillsInput", "");
        }
        if (e.key === "Backspace" && !form.skillsInput && form.skills.length > 0) {
            set("skills", form.skills.slice(0, -1));
        }
    };

    const removeSkill = (skill) =>
        set("skills", form.skills.filter(s => s !== skill));

    // ── requirements ─────────────────────────────────────────────
    const setReq = (i, val) => {
        const reqs = [...form.requirements];
        reqs[i] = val;
        set("requirements", reqs);
    };
    const addReq = () => form.requirements.length < 8 && set("requirements", [...form.requirements, ""]);
    const removeReq = (i) => form.requirements.length > 1 && set("requirements", form.requirements.filter((_, idx) => idx !== i));

    // ── validation per step ──────────────────────────────────────
    const validate = (s) => {
        const e = {};
        if (s === 0) {
            if (!form.title.trim()) e.title = "Gig title is required.";
            if (!form.category) e.category = "Please select a category.";
            if (!form.description.trim()) e.description = "Please describe your gig.";
            else if (form.description.trim().length < 30)
                e.description = "Description must be at least 30 characters.";
        }
        if (s === 1) {
            if (!form.budget) e.budget = "Please select a budget range.";
            if (!form.deadline) e.deadline = "Please select a deadline.";
            if (form.budget === "Custom" && !form.customBudget.trim())
                e.customBudget = "Please enter a custom budget amount.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => { if (validate(step)) setStep(s => s + 1); };
    const prevStep = () => setStep(s => s - 1);

    // ── submit ───────────────────────────────────────────────────
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                title: form.title.trim(),
                category: form.category,
                description: form.description.trim(),
                budget: form.budget === "Custom" ? form.customBudget : form.budget,
                deadline: form.deadline,
                skills: form.skills,
                requirements: form.requirements.filter(r => r.trim()),
            };
            await api.post("/gigs", payload);
            setSubmitted(true);
        } catch (err) {
            console.error("Failed to post gig:", err);
        } finally {
            setLoading(false);
        }
    };

    // ── success screen ───────────────────────────────────────────
    if (submitted) {
        return (
            <AgentLayout>
                <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                        style={{ background: "rgba(255,192,133,0.15)", border: "2px solid #FFC085" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h1 className="text-white font-bold text-3xl mb-3">Gig Posted! 🎉</h1>
                    <p className="text-sm mb-2" style={{ color: "#B2B2D2" }}>
                        Your gig <span className="text-white font-semibold">"{form.title}"</span> is now live.
                    </p>
                    <p className="text-sm mb-10" style={{ color: "#B2B2D2" }}>
                        Teenlancers can now browse and apply. You'll get notified when applications come in.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => navigate("/agent/my-gigs")}
                            className="flex-1 py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            View All My Gigs →
                        </button>
                        <button
                            onClick={() => navigate("/agent/dashboard")}
                            className="flex-1 py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setStep(0);
                            setForm({ title: "", category: "", description: "", budget: "", customBudget: "", deadline: "", skillsInput: "", skills: [], requirements: [""], attachments: [] });
                        }}
                        className="mt-3 text-sm hover:opacity-80 transition-opacity"
                        style={{ color: "#FFC085" }}
                    >
                        + Post Another Gig
                    </button>
                </div>
            </AgentLayout>
        );
    }

    return (
        <AgentLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › <span style={{ color: "#FFC085" }}>Post a Gig</span>
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* ── LEFT PANEL ── */}
                <div className="xl:col-span-1 flex flex-col gap-5">

                    {/* Header card */}
                    <div
                        className="p-6 rounded-2xl"
                        style={{ background: "linear-gradient(135deg, rgba(255,192,133,0.15), rgba(255,192,133,0.05))", border: "1px solid rgba(255,192,133,0.25)" }}
                    >
                        <h1 className="text-white font-bold text-2xl mb-2">Post Your Next Gig</h1>
                        <p className="text-sm" style={{ color: "#B2B2D2" }}>
                            Connect with talented teenlancers ready to bring your vision to life.
                        </p>
                    </div>

                    {/* Step tracker */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <p className="text-xs font-semibold mb-4" style={{ color: "#B2B2D2" }}>PROGRESS</p>
                        <div className="flex flex-col gap-3">
                            {STEPS.map((s, i) => (
                                <div key={s} className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                                        style={{
                                            background: i < step ? "linear-gradient(90deg, #FFC085, #e8a060)"
                                                : i === step ? "rgba(255,192,133,0.2)"
                                                    : "rgba(255,255,255,0.06)",
                                            border: i === step ? "2px solid #FFC085" : "none",
                                            color: i < step ? "white" : i === step ? "#FFC085" : "#B2B2D2",
                                        }}
                                    >
                                        {i < step ? "✓" : i + 1}
                                    </div>
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: i === step ? "#FFC085" : i < step ? "#fff" : "#B2B2D2" }}
                                    >
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Completion bar */}
                        <div className="mt-5">
                            <div className="flex justify-between text-xs mb-1.5" style={{ color: "#B2B2D2" }}>
                                <span>Completion</span>
                                <span style={{ color: "#FFC085" }}>{completionPct()}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${completionPct()}%`, background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live Preview card */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <p className="text-xs font-semibold mb-4" style={{ color: "#B2B2D2" }}>LIVE PREVIEW</p>
                        <div
                            className="p-4 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            {form.category && (
                                <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                                    {CATEGORIES.find(c => c.label === form.category)?.icon} {form.category}
                                </span>
                            )}
                            <p className="text-white font-semibold text-sm mb-2">
                                {form.title || <span style={{ color: "rgba(178,178,210,0.4)", fontWeight: 400 }}>Your gig title will appear here...</span>}
                            </p>
                            <p className="text-xs leading-relaxed mb-3" style={{ color: "#B2B2D2" }}>
                                {form.description
                                    ? form.description.slice(0, 100) + (form.description.length > 100 ? "..." : "")
                                    : <span style={{ color: "rgba(178,178,210,0.3)" }}>Description preview...</span>}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold" style={{ color: "#FFC085" }}>
                                    {form.budget === "Custom" ? (form.customBudget ? `$${form.customBudget}` : "—") : (form.budget || "—")}
                                </span>
                                {form.deadline && (
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>⏱ {form.deadline}</span>
                                )}
                            </div>
                        </div>

                        {/* Posted by */}
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(255,192,133,0.2)", border: "1px solid rgba(255,192,133,0.3)" }}
                            >
                                <span className="text-xs font-bold" style={{ color: "#FFC085" }}>{agentName.charAt(0)}</span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-white">{agentName}</p>
                                {agentCompany && <p className="text-xs" style={{ color: "#B2B2D2" }}>{agentCompany}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Tips card */}
                    <div
                        className="p-5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <p className="text-xs font-semibold mb-3" style={{ color: "#B2B2D2" }}>💡 TIPS FOR BETTER RESULTS</p>
                        <ul className="flex flex-col gap-2">
                            {[
                                "Write a clear, specific title",
                                "Set a realistic budget for quality work",
                                "List required skills precisely",
                                "Break requirements into bullet points",
                            ].map((tip) => (
                                <li key={tip} className="flex items-start gap-2">
                                    <span style={{ color: "#FFC085" }}>✓</span>
                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── RIGHT PANEL — Form ── */}
                <div className="xl:col-span-2">
                    <div
                        className="p-6 sm:p-8 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >

                        {/* Step label */}
                        <div className="flex items-center gap-3 mb-8">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", color: "#060834" }}
                            >
                                {step + 1}
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">{STEPS[step]}</h2>
                                <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                    {["Tell teenlancers what you need", "Set your budget and timeline", "Specify what teenlancers must deliver", "Review your gig before posting"][step]}
                                </p>
                            </div>
                        </div>

                        {/* ── STEP 0: Details ── */}
                        {step === 0 && (
                            <div className="flex flex-col gap-6">

                                {/* Title */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-white">
                                            Gig Title <span style={{ color: "#f87171" }}>*</span>
                                        </label>
                                        <span className="text-xs" style={{ color: form.title.length > FIELD_LIMITS.title * 0.9 ? "#f87171" : "#B2B2D2" }}>
                                            {form.title.length}/{FIELD_LIMITS.title}
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => set("title", e.target.value.slice(0, FIELD_LIMITS.title))}
                                        placeholder="e.g. Brand Identity Design for Tech Startup"
                                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                        style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${errors.title ? "#f87171" : "rgba(255,255,255,0.1)"}` }}
                                    />
                                    {errors.title && <p className="text-xs" style={{ color: "#f87171" }}>{errors.title}</p>}
                                </div>

                                {/* Category */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white">
                                        Category <span style={{ color: "#f87171" }}>*</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat.label}
                                                onClick={() => set("category", cat.label)}
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:opacity-90"
                                                style={{
                                                    background: form.category === cat.label ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.06)",
                                                    border: form.category === cat.label ? "none" : "1px solid rgba(255,255,255,0.08)",
                                                    color: form.category === cat.label ? "white" : "#B2B2D2",
                                                }}
                                            >
                                                <span>{cat.icon}</span>
                                                <span className="font-medium text-xs">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.category && <p className="text-xs" style={{ color: "#f87171" }}>{errors.category}</p>}
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-white">
                                            Description <span style={{ color: "#f87171" }}>*</span>
                                        </label>
                                        <span className="text-xs" style={{ color: form.description.length > FIELD_LIMITS.description * 0.9 ? "#f87171" : "#B2B2D2" }}>
                                            {form.description.length}/{FIELD_LIMITS.description}
                                        </span>
                                    </div>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                        Describe what you need, the style you're going for, and any important details.
                                    </p>
                                    <textarea
                                        value={form.description}
                                        onChange={e => set("description", e.target.value.slice(0, FIELD_LIMITS.description))}
                                        placeholder="We are looking for a talented designer to create a complete brand identity including logo, color palette, typography and brand guidelines..."
                                        rows={5}
                                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                                        style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${errors.description ? "#f87171" : "rgba(255,255,255,0.1)"}` }}
                                    />
                                    {errors.description && <p className="text-xs" style={{ color: "#f87171" }}>{errors.description}</p>}
                                </div>

                                {/* Skills */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white">Required Skills</label>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Type a skill and press Enter or comma to add. Max 10.</p>
                                    <div
                                        className="w-full rounded-xl px-3 py-2 flex flex-wrap gap-2 min-h-[48px] cursor-text"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                        onClick={() => document.getElementById("skills-input")?.focus()}
                                    >
                                        {form.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                                style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.3)" }}
                                            >
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} style={{ color: "#FFC085", lineHeight: 1 }}>×</button>
                                            </span>
                                        ))}
                                        {form.skills.length < 10 && (
                                            <input
                                                id="skills-input"
                                                type="text"
                                                value={form.skillsInput}
                                                onChange={e => set("skillsInput", e.target.value)}
                                                onKeyDown={handleSkillKeyDown}
                                                placeholder={form.skills.length === 0 ? "e.g. Figma, Illustrator, Photoshop..." : ""}
                                                className="flex-1 min-w-[120px] bg-transparent text-white text-sm outline-none"
                                                style={{ color: "#fff" }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 1: Budget & Timeline ── */}
                        {step === 1 && (
                            <div className="flex flex-col gap-6">

                                {/* Budget */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white">
                                        Budget Range <span style={{ color: "#f87171" }}>*</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {[...BUDGETS, "Custom"].map(b => (
                                            <button
                                                key={b}
                                                onClick={() => set("budget", b)}
                                                className="py-3 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                                                style={{
                                                    background: form.budget === b ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.06)",
                                                    border: form.budget === b ? "none" : "1px solid rgba(255,255,255,0.08)",
                                                    color: form.budget === b ? "white" : "#B2B2D2",
                                                }}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.budget && <p className="text-xs" style={{ color: "#f87171" }}>{errors.budget}</p>}

                                    {form.budget === "Custom" && (
                                        <div className="relative mt-2">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: "#FFC085" }}>$</span>
                                            <input
                                                type="number"
                                                value={form.customBudget}
                                                onChange={e => set("customBudget", e.target.value)}
                                                placeholder="Enter your budget"
                                                className="w-full rounded-xl pl-8 pr-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                                style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${errors.customBudget ? "#f87171" : "rgba(255,255,255,0.1)"}` }}
                                            />
                                            {errors.customBudget && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.customBudget}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white">
                                        Project Deadline <span style={{ color: "#f87171" }}>*</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {DEADLINES.map(d => (
                                            <button
                                                key={d.value}
                                                onClick={() => set("deadline", d.value)}
                                                className="py-3 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                                                style={{
                                                    background: form.deadline === d.value ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.06)",
                                                    border: form.deadline === d.value ? "none" : "1px solid rgba(255,255,255,0.08)",
                                                    color: form.deadline === d.value ? "white" : "#B2B2D2",
                                                }}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.deadline && <p className="text-xs" style={{ color: "#f87171" }}>{errors.deadline}</p>}
                                </div>

                                {/* Budget summary */}
                                {form.budget && form.deadline && (
                                    <div
                                        className="p-4 rounded-xl flex items-center gap-4"
                                        style={{ background: "rgba(255,192,133,0.08)", border: "1px solid rgba(255,192,133,0.2)" }}
                                    >
                                        <div className="flex-1">
                                            <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>Budget</p>
                                            <p className="text-white font-bold">
                                                {form.budget === "Custom" ? (form.customBudget ? `$${form.customBudget}` : "—") : form.budget}
                                            </p>
                                        </div>
                                        <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.1)" }} />
                                        <div className="flex-1">
                                            <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>Deadline</p>
                                            <p className="text-white font-bold">{form.deadline}</p>
                                        </div>
                                        <span className="text-2xl">✅</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── STEP 2: Requirements ── */}
                        {step === 2 && (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-white">Deliverable Requirements</label>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                        List specific things the teenlancer must deliver. Be clear and detailed.
                                    </p>
                                    {form.requirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-xs font-bold w-5 text-center flex-shrink-0" style={{ color: "#FFC085" }}>{i + 1}</span>
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={e => setReq(i, e.target.value)}
                                                placeholder={`Requirement ${i + 1}... e.g. Deliver source files in Figma`}
                                                className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                            />
                                            {form.requirements.length > 1 && (
                                                <button
                                                    onClick={() => removeReq(i)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs hover:opacity-80 transition-opacity flex-shrink-0"
                                                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {form.requirements.length < 8 && (
                                        <button
                                            onClick={addReq}
                                            className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity self-start"
                                            style={{ color: "#FFC085" }}
                                        >
                                            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs" style={{ borderColor: "#FFC085" }}>+</span>
                                            Add requirement
                                        </button>
                                    )}
                                </div>

                                {/* Optional note */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white">
                                        Additional Notes <span className="text-xs font-normal" style={{ color: "#B2B2D2" }}>(optional)</span>
                                    </label>
                                    <textarea
                                        value={form.notes || ""}
                                        onChange={e => set("notes", e.target.value)}
                                        placeholder="Any other information teenlancers should know... e.g. preferred tools, style references, communication preferences"
                                        rows={3}
                                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: Review ── */}
                        {step === 3 && (
                            <div className="flex flex-col gap-5">
                                <p className="text-sm" style={{ color: "#B2B2D2" }}>
                                    Review everything before posting. You can go back to edit any section.
                                </p>

                                {/* Review cards */}
                                {[
                                    {
                                        title: "Gig Details",
                                        step: 0,
                                        items: [
                                            { label: "Title", value: form.title },
                                            { label: "Category", value: form.category },
                                            { label: "Description", value: form.description, multiline: true },
                                            { label: "Skills", value: form.skills.length > 0 ? form.skills.join(", ") : "Not specified" },
                                        ],
                                    },
                                    {
                                        title: "Budget & Timeline",
                                        step: 1,
                                        items: [
                                            { label: "Budget", value: form.budget === "Custom" ? `$${form.customBudget}` : form.budget },
                                            { label: "Deadline", value: form.deadline },
                                        ],
                                    },
                                    {
                                        title: "Requirements",
                                        step: 2,
                                        items: [
                                            { label: "Deliverables", value: form.requirements.filter(r => r.trim()).join(" · ") || "None specified", multiline: true },
                                            ...(form.notes ? [{ label: "Notes", value: form.notes, multiline: true }] : []),
                                        ],
                                    },
                                ].map(section => (
                                    <div
                                        key={section.title}
                                        className="p-5 rounded-2xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-white font-semibold text-sm">{section.title}</h3>
                                            <button
                                                onClick={() => setStep(section.step)}
                                                className="text-xs hover:opacity-80 transition-opacity"
                                                style={{ color: "#FFC085" }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {section.items.map(item => (
                                                <div key={item.label}>
                                                    <p className="text-xs mb-1" style={{ color: "#B2B2D2" }}>{item.label}</p>
                                                    <p className={`text-white text-sm ${item.multiline ? "leading-relaxed" : "font-medium"}`}>
                                                        {item.value || <span style={{ color: "rgba(178,178,210,0.4)", fontStyle: "italic" }}>Not provided</span>}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Terms reminder */}
                                <div
                                    className="p-4 rounded-xl flex gap-3"
                                    style={{ background: "rgba(255,192,133,0.06)", border: "1px solid rgba(255,192,133,0.15)" }}
                                >
                                    <span className="text-lg flex-shrink-0">📋</span>
                                    <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>
                                        By posting this gig you agree to Gengig's{" "}
                                        <button
                                            onClick={() => window.open("/Terms", "_blank")}
                                            className="hover:opacity-80"
                                            style={{ color: "#FFC085" }}
                                        >
                                            Terms of Service
                                        </button>
                                        . A small service fee applies on completed transactions.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Navigation buttons ── */}
                        <div className={`flex gap-3 mt-8 ${step > 0 ? "justify-between" : "justify-end"}`}>
                            {step > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                                    style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                                >
                                    ← Back
                                </button>
                            )}
                            {step < STEPS.length - 1 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-8 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-8 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
                                            Posting...
                                        </>
                                    ) : "🚀 Post Gig"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}