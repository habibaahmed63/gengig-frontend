import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function TeenlancerLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        {
            label: "Dashboard",
            path: "/teenlancer/dashboard",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            label: "Community Hub",
            path: "/teenlancer/community",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            label: "Support",
            path: "/teenlancer/support",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            label: "Payment Details",
            path: "/teenlancer/payment",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            label: "Settings",
            path: "/teenlancer/settings",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    const SidebarContent = () => (
        <>
            {/* Profile */}
            <Link
                to="/teenlancer/profile"
                className="flex items-center gap-3 mb-8 group"
                onClick={() => setSidebarOpen(false)}
            >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid #FFC085" }}>
                    <img src="../src/assets/profile.jpg" alt="profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-white text-sm font-semibold group-hover:text-[#FFC085] transition-colors">
                    Habiba Ahmed
                </span>
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
                            }}
                        >
                            {item.icon}
                            {item.label}
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
                        background: "#0a0d2e",
                        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    }}
                >
                    <button
                        className="self-end mb-6 text-white hover:text-[#FFC085]"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                    <SidebarContent />
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex w-52 min-h-screen flex-col py-8 px-4 flex-shrink-0" style={{ background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}