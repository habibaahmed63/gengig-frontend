import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";

export default function TeenlancerSettings() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        language: localStorage.getItem("language") || "English",
        notifications: { email: true, push: true, sms: false },
    });
    const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [settingsLoading, setSettingsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            setSettingsLoading(true);
            try {
                // TODO: Replace with API call: GET /users/settings
                // const response = await api.get("/users/settings");
                // setFormData({
                //   name: response.data.name,
                //   email: response.data.email,
                //   language: response.data.language,
                //   notifications: response.data.notifications,
                // });

                // Load from localStorage until backend ready
                setFormData({
                    name: localStorage.getItem("name") || "",
                    email: localStorage.getItem("email") || "",
                    language: localStorage.getItem("language") || "English",
                    notifications: JSON.parse(localStorage.getItem("notificationPrefs") || '{"email":true,"push":true,"sms":false}'),
                });
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setSettingsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleNotification = async (key) => {
        const updated = {
            ...formData.notifications,
            [key]: !formData.notifications[key],
        };
        setFormData({ ...formData, notifications: updated });
        localStorage.setItem("notificationPrefs", JSON.stringify(updated));
        // TODO: Replace with API call: PUT /users/notifications
        // await api.put("/users/notifications", updated);
    };

    const handleSaveInfo = async () => {
        setSaveLoading(true);
        try {
            // TODO: Replace with API call: PUT /users/settings
            // await api.put("/users/settings", {
            //   name: formData.name,
            //   email: formData.email,
            //   language: formData.language,
            // });
            localStorage.setItem("name", formData.name);
            localStorage.setItem("email", formData.email);
            localStorage.setItem("language", formData.language);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch {
            // handle error
        } finally {
            setSaveLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        setPasswordError("");
        if (!passwords.current) { setPasswordError("Please enter your current password."); return; }
        if (passwords.newPass.length < 6) { setPasswordError("New password must be at least 6 characters."); return; }
        if (passwords.newPass !== passwords.confirm) { setPasswordError("Passwords do not match."); return; }
        setPasswordLoading(true);
        try {
            // TODO: Replace with API call: PUT /auth/change-password
            // await api.put("/auth/change-password", {
            //   currentPassword: passwords.current,
            //   newPassword: passwords.newPass,
            // });
            await new Promise((r) => setTimeout(r, 1000));
            setPasswords({ current: "", newPass: "", confirm: "" });
            setPasswordSuccess(true);
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch {
            setPasswordError("Current password is incorrect.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        ["token", "role", "name", "email", "photo", "bio", "skills", "education",
            "availability", "hourlyRate", "location", "joinDate", "language",
            "notificationPrefs", "portfolio", "savedCard", "paymentHistory"].forEach(
                (key) => localStorage.removeItem(key)
            );
        navigate("/signin");
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            // TODO: Replace with API call: DELETE /users/account
            // await api.delete("/users/account");
            await new Promise((r) => setTimeout(r, 1500));
            handleLogout();
        } catch {
            setDeleteLoading(false);
        }
    };

    if (settingsLoading) {
        return (
            <TeenlancerLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                </div>
            </TeenlancerLayout>
        );
    }

    return (
        <TeenlancerLayout>
            {saveSuccess && (
                <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg" style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                    ✓ Settings saved!
                </div>
            )}
            {passwordSuccess && (
                <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg" style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)" }}>
                    ✓ Password updated!
                </div>
            )}

            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › Account › <span style={{ color: "#FFC085" }}>Settings</span>
            </p>

            <h1 className="text-white font-bold text-2xl mb-8">Settings</h1>

            <div className="flex flex-col gap-6 max-w-2xl">

                {/* Personal Info */}
                <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h2 className="text-white font-semibold mb-5">Personal Information</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Full Name", name: "name", type: "text" },
                            { label: "Email Address", name: "email", type: "email" },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col gap-1">
                                <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                                {["English", "Arabic", "French"].map((lang) => (
                                    <option key={lang} style={{ background: "#060834" }}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSaveInfo}
                            disabled={saveLoading}
                            className="self-end px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            {saveLoading ? "Saving..." : "Save Changes"}
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
                        {passwordError && <p className="text-xs" style={{ color: "#f87171" }}>{passwordError}</p>}
                        <button
                            onClick={handleUpdatePassword}
                            disabled={passwordLoading}
                            className="self-end px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            {passwordLoading ? "Updating..." : "Update Password"}
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
                                    className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0"
                                    style={{ background: formData.notifications[item.key] ? "#FFC085" : "rgba(255,255,255,0.15)" }}
                                >
                                    <span
                                        className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                                        style={{ background: "white", left: formData.notifications[item.key] ? "22px" : "2px" }}
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
                        Once you delete your account, there is no going back. All your data will be permanently removed.
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
                            <p className="text-sm" style={{ color: "#f87171" }}>
                                Are you sure? This will permanently delete your account and all your data.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteLoading}
                                    className="px-6 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                                    style={{ background: "#f87171" }}
                                >
                                    {deleteLoading ? "Deleting..." : "Yes, Delete"}
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
                <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
                >
                    Log Out
                </button>
            </div>
        </TeenlancerLayout>
    );
}