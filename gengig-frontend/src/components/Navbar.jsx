import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Gengig LOGO.png";
import api from "../services/api";
import RoleGuard from "./RoleGuard";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [photo, setPhoto] = useState(localStorage.getItem("photo") || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showGuard, setShowGuard] = useState(false);

  useEffect(() => {
    const handleStorageUpdate = () => setPhoto(localStorage.getItem("photo") || null);
    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notifications/unread-count");
        setUnreadCount(response.data.count);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };
    fetchUnreadCount();
  }, [token]);

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Explore a Gig", path: "/Exploreagig" },
    { label: "Post a Gig", path: "/post" },
  ];

  const handlePostGig = (e) => {
    e.preventDefault();
    if (!token) { navigate("/signin"); return; }
    if (role !== "agent") { setShowGuard(true); return; }
    navigate("/post");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("photo");
    localStorage.removeItem("bio");
    localStorage.removeItem("skills");
    localStorage.removeItem("education");
    localStorage.removeItem("availability");
    localStorage.removeItem("hourlyRate");
    localStorage.removeItem("company");
    localStorage.removeItem("industry");
    localStorage.removeItem("workTypes");
    localStorage.removeItem("location");
    localStorage.removeItem("joinDate");
    navigate("/signin");
    setMenuOpen(false);
  };

  const handleDashboard = () => {
    if (role === "teenlancer") navigate("/teenlancer/dashboard");
    else if (role === "agent") navigate("/agent/dashboard");
    setMenuOpen(false);
  };

  const handleProfile = () => {
    if (role === "teenlancer") navigate("/teenlancer/profile");
    else if (role === "agent") navigate("/agent/profile");
    setMenuOpen(false);
  };

  return (
    <>
      <RoleGuard isOpen={showGuard} onClose={() => setShowGuard(false)} userRole={role} />

      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[100%] max-w-6xl">
        <nav className="w-full px-6 py-2 flex items-center justify-between rounded-full"
          style={{
            background: "rgba(10, 15, 61, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}>
          <Link to="/home">
            <img src={logo} alt="Gengig Logo" className="w-16 h-16 object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.label === "Post a Gig") {
                return (
                  <button key={link.path} onClick={handlePostGig}
                    className="flex flex-col items-center gap-1 transition-all">
                    <span className="text-sm transition-all"
                      style={{
                        color: isActive ? "#B2B2D2" : "white",
                        fontWeight: isActive ? "700" : "500",
                        textDecoration: isActive ? "underline" : "none",
                        textUnderlineOffset: "4px",
                      }}>
                      {link.label}
                    </span>
                  </button>
                );
              }
              return (
                <Link key={link.path} to={link.path} className="flex flex-col items-center gap-1 transition-all">
                  <span className="text-sm transition-all"
                    style={{
                      color: isActive ? "#B2B2D2" : "white",
                      fontWeight: isActive ? "700" : "500",
                      textDecoration: isActive ? "underline" : "none",
                      textUnderlineOffset: "4px",
                    }}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                <Link to="/notifications" className="relative text-[#B2B2D2] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center font-bold"
                      style={{ background: "#FFC085", color: "#060834", fontSize: "8px" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <button onClick={handleProfile}
                  className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.15)" }}>
                  {photo ? (
                    <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-sm font-medium transition-colors hover:text-[#FFC085]" style={{ color: "white" }}>
                  Login
                </Link>
                <Link to="/signup"
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="w-6 h-0.5 rounded-full transition-all" style={{ background: "white", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span className="w-6 h-0.5 rounded-full transition-all" style={{ background: "white", opacity: menuOpen ? 0 : 1 }} />
            <span className="w-6 h-0.5 rounded-full transition-all" style={{ background: "white", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 rounded-2xl flex flex-col px-6 py-4 gap-4"
            style={{ background: "rgba(10, 15, 61, 0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.label === "Post a Gig") {
                return (
                  <button key={link.path} onClick={handlePostGig}
                    className="text-sm font-medium py-2 text-left transition-colors"
                    style={{ color: isActive ? "#B2B2D2" : "white" }}>
                    {link.label}
                  </button>
                );
              }
              return (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium py-2 transition-colors"
                  style={{ color: isActive ? "#B2B2D2" : "white", fontWeight: isActive ? "700" : "500", textDecoration: isActive ? "underline" : "none", textUnderlineOffset: "4px" }}>
                  {link.label}
                </Link>
              );
            })}
            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.08)" }} />
            {token ? (
              <>
                <button onClick={handleProfile} className="text-sm font-medium text-left py-2 transition-colors hover:text-[#FFC085]" style={{ color: "#B2B2D2" }}>
                  My Profile
                </button>
                <Link to="/notifications" onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium py-2 transition-colors hover:text-[#FFC085] flex items-center gap-2"
                  style={{ color: "#B2B2D2" }}>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                      style={{ background: "#FFC085", color: "#060834" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-left py-2" style={{ color: "#f87171" }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2" style={{ color: "white" }}>Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white text-center hover:opacity-90"
                  style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      <div className="h-24" />
    </>
  );
}