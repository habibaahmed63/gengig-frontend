import { useState } from "react";
import AgentLayout from "../../layouts/AgentLayout";

export default function AgentSettings() {
    const [formData, setFormData] = useState({
        name: "Habiba Ahmed",
        email: "habiba@example.com",
        language: "English",
        notifications: {
            email: true,
            push: false,
            sms: true,
        },
    });

    const [passwords, setPasswords] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleNotification = (key) => {
        setFormData({
            ...formData,
            notifications: {
                ...formData.notifications,
                [key]: !formData.notifications[key],
            },
        });
    };

    return (
        <AgentLayout>
            {/* Breadcrumb */}
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Settings</span>
            </p>

            <h1 className="text-white font-bold text-2xl mb-8">Settings</h1>

            <div className="flex flex-col gap-6 max-w-2xl">

                {/* Personal Info */}
                <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h2 className="text-white font-semibold mb-5">Personal Information</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                                <option style={{ background: "#060834" }}>English</option>
                                <option style={{ background: "#060834" }}>Arabic</option>
                                <option style={{ background: "#060834" }}>French</option>
                            </select>
                        </div>
                        <button className="self-end px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h2 className="text-white font-semibold mb-5">Change Password</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Current Password", name: "current" },
                            { label: "New Password", name: "newPass" },
                            { label: "Confirm New Password", name: "confirm" },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col gap-1">
                                <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>{field.label}</label>
                                <input
                                    type="password"
                                    name={field.name}
                                    value={passwords[field.name]}
                                    onChange={handlePasswordChange}
                                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                            </div>
                        ))}
                        <button className="self-end px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Update Password
                        </button>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h2 className="text-white font-semibold mb-5">Notification Preferences</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { key: "email", label: "Email Notifications", desc: "Receive updates and alerts via email" },
                            { key: "push", label: "Push Notifications", desc: "Receive notifications in your browser" },
                            { key: "sms", label: "SMS Notifications", desc: "Receive updates via text message" },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">{item.label}</p>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleNotification(item.key)}
                                    className="w-11 h-6 rounded-full transition-colors relative"
                                    style={{ background: formData.notifications[item.key] ? "#FFC085" : "rgba(255,255,255,0.15)" }}
                                >
                                    <span
                                        className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                                        style={{
                                            background: "white",
                                            left: formData.notifications[item.key] ? "22px" : "2px",
                                        }}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 rounded-2xl" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)" }}>
                    <h2 className="font-semibold mb-2" style={{ color: "#f87171" }}>Danger Zone</h2>
                    <p className="text-xs mb-4" style={{ color: "#B2B2D2" }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                            style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm" style={{ color: "#f87171" }}>Are you sure? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button className="px-6 py-2 rounded-full text-sm font-semibold text-white" style={{ background: "#f87171" }}>
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-2 rounded-full text-sm font-semibold"
                                    style={{ background: "rgba(255,255,255,0.08)", color: "#B2B2D2" }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Log Out */}
                <button className="w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90" style={{ background: "rgba(255,255,255,0.05)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                    Log Out
                </button>

            </div>
        </AgentLayout>
    );
}