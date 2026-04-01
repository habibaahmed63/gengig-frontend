import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import GengigChatbot from "../components/GengigChatbot";

export default function TeenlancerLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const name = localStorage.getItem("name") || "My Profile";
    const photo = localStorage.getItem("photo") || null;

    const navItems = [
        {
            label: "Dashboard",
            path: "/teenlancer/dashboard",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            label: "Community Hub",
            path: "/teenlancer/community",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            label: "Support",
            path: "/support",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            label: "Payment Details",
            path: "/teenlancer/payment",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            label: "Settings",
            path: "/teenlancer/settings",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    const SidebarContent = ({ isCollapsed = false }) => (
        <>
            {/* Collapse Toggle Button */}
            <button
                onClick={() => setCollapsed(!isCollapsed)}
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full mb-6 self-end hover:opacity-80 transition-opacity flex-shrink-0"
                style={{ background: "rgba(255,192,133,0.15)", border: "1px solid rgba(255,192,133,0.3)" }}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#FFC085"
                    strokeWidth={2}
                    style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Profile */}
            <Link
                to="/teenlancer/profile"
                className="flex items-center gap-3 mb-8 group flex-shrink-0"
                onClick={() => setSidebarOpen(false)}
                title="My Profile"
            >
                <div
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.15)" }}
                >
                    {photo ? (
                        <img src={photo} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                </div>
                {!isCollapsed && (
                    <span className="text-white text-sm font-semibold group-hover:text-[#FFC085] transition-colors truncate">
                        {name}
                    </span>
                )}
            </Link>

            {/* Nav Items */}
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                            style={{
                                background: isActive ? "rgba(255,192,133,0.15)" : "transparent",
                                color: isActive ? "#FFC085" : "#B2B2D2",
                                fontWeight: isActive ? "600" : "400",
                                justifyContent: isCollapsed ? "center" : "flex-start",
                            }}
                            title={isCollapsed ? item.label : ""}
                        >
                            {item.icon}
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </>
    );

    return (
        <div className="min-h-screen" style={{ background: "#060834" }}>
            <Navbar />
            <div className="flex relative">

                {/* Mobile Sidebar Toggle Button */}
                <button
                    className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-40"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile Sidebar Drawer */}
                <div
                    className="lg:hidden fixed top-0 left-0 h-full z-50 w-64 py-8 px-4 flex flex-col transition-transform duration-300"
                    style={{
                        background: "#060834",
                        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    }}
                >
                    <button
                        className="self-end mb-6 text-white hover:text-[#FFC085]"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                    <SidebarContent isCollapsed={false} />
                </div>

                {/* Desktop Sidebar */}
                <aside
                    className="hidden lg:flex flex-col py-8 px-4 flex-shrink-0 min-h-screen transition-all duration-300"
                    style={{
                        width: collapsed ? "64px" : "208px",
                        background: "#060834",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        overflow: "hidden",
                    }}
                >
                    <SidebarContent isCollapsed={collapsed} />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
                <GengigChatbot />

            </div>
        </div>
    );
}