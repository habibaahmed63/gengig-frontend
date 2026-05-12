import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import socket from "../services/socket";

const typeColors = {
  application: { bg: "rgba(255,192,133,0.1)", color: "#FFC085" },
  gig: { bg: "rgba(99,179,237,0.1)", color: "#63b3ed" },
  payment: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  message: { bg: "rgba(167,139,250,0.1)", color: "#a78bfa" },
  system: { bg: "rgba(178,178,210,0.1)", color: "#B2B2D2" },
};

const typeIcons = {
  application: "📋",
  gig: "🎯",
  payment: "💰",
  message: "💬",
  system: "🔔",
};

export default function Notifications() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notifications");
        const normalized = (Array.isArray(res.data) ? res.data : []).map(n => ({
          ...n,
          read: n.read === true || n.isRead === true,
        }));
        setNotifications(normalized);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();

    const handleNewNotification = (notification) => {
      setNotifications(prev => [{
        ...notification,
        read: false,
      }, ...prev]);
    };
    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, []);

  const getNotificationPath = (notif) => {
    const type = notif.type || notif.notificationType || "";
    const gigId = notif.gigId || notif.gig?._id || notif.gig?.id || notif.relatedId;

    switch (type) {
      case "application":
      case "new_application":
        return role === "agent"
          ? "/agent/applications"
          : gigId ? `/gig/${gigId}` : "/teenlancer/dashboard";

      case "accepted":
      case "application_accepted":
        return gigId ? `/gig/${gigId}` : "/teenlancer/dashboard";

      case "rejected":
      case "application_rejected":
        return "/teenlancer/dashboard";

      case "work_submitted":
        return notif.applicationId
          ? `/agent/reviewwork/${notif.applicationId}`
          : "/agent/applications";

      case "work_approved":
        return gigId ? `/gig/${gigId}` : "/teenlancer/dashboard";

      case "work_rejected":
      case "revision_requested":
        return notif.applicationId
          ? `/teenlancer/submitwork/${notif.applicationId}`
          : "/teenlancer/dashboard";

      case "message":
      case "new_message":
        return role === "agent" ? "/agent/chat" : "/teenlancer/chat";

      case "gig":
      case "new_gig":
        return gigId ? `/gig/${gigId}` : "/Exploreagig";

      case "payment":
      case "payment_released":
        return role === "agent" ? "/agent/payment" : "/teenlancer/payment";

      default:
        return notif.link || notif.url || null;
    }
  };

  const handleNotificationClick = async (notif) => {
    const id = notif._id || notif.id;
    if (!notif.read) {
      setNotifications(prev => prev.map(n =>
        (n._id === id || n.id === id) ? { ...n, read: true } : n
      ));
      try { await api.put(`/notifications/${id}/read`); } catch { }
    }
    const path = getNotificationPath(notif);
    if (path) navigate(path);
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await api.put("/notifications/read-all"); } catch { }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n._id !== id && n.id !== id));
    try { await api.delete(`/notifications/${id}`); } catch {
      const res = await api.get("/notifications").catch(() => ({ data: [] }));
      setNotifications((Array.isArray(res.data) ? res.data : []).map(n => ({
        ...n, read: n.read === true || n.isRead === true,
      })));
    }
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ background: "#060834" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-white font-bold mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 text-sm px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}>
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: "#B2B2D2" }}>
              Stay updated on your gigs and applications
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-sm px-4 py-2 rounded-full transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}>
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            
          ].map(filter => (
            <button key={filter.key} onClick={() => setActiveFilter(filter.key)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeFilter === filter.key ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.05)",
                color: activeFilter === filter.key ? "white" : "#B2B2D2",
                border: activeFilter === filter.key ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}>
              {filter.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
            <p className="text-sm" style={{ color: "#B2B2D2" }}>Loading notifications...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                <p className="text-4xl mb-4">🔔</p>
                <p className="text-sm font-medium text-white mb-1">No notifications here</p>
                <p className="text-xs" style={{ color: "#B2B2D2" }}>
                  {activeFilter === "unread" ? "You are all caught up!" : "Nothing to show for this filter."}
                </p>
              </div>
            ) : (
              filtered.map(notif => {
                const notifId = notif._id || notif.id;
                const path = getNotificationPath(notif);
                const isClickable = !!path;

                return (
                  <div key={notifId}
                    onClick={() => handleNotificationClick(notif)}
                    className="flex items-start gap-4 p-4 rounded-2xl transition-all"
                    style={{
                      background: notif.read ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
                      border: notif.read ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,192,133,0.2)",
                      cursor: isClickable ? "pointer" : "default",
                    }}>

                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: typeColors[notif.type]?.bg || typeColors.system.bg }}>
                      {notif.icon || typeIcons[notif.type] || "🔔"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold mb-0.5"
                            style={{ color: notif.read ? "#B2B2D2" : "white" }}>
                            {notif.title}
                            {!notif.read && (
                              <span className="ml-2 w-2 h-2 rounded-full inline-block"
                                style={{ background: "#FFC085" }} />
                            )}
                          </p>
                          {notif.message && (
                            <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>
                              {notif.message}
                            </p>
                          )}
                          {notif.time && (
                            <p className="text-xs mt-1"
                              style={{ color: typeColors[notif.type]?.color || "#B2B2D2" }}>
                              {notif.time}
                            </p>
                          )}
                          {isClickable && (
                            <p className="text-xs mt-1 font-medium"
                              style={{ color: typeColors[notif.type]?.color || "#FFC085" }}>
                              {notif.read ? "View " : "Tap to view "}
                            </p>
                          )}
                        </div>
                        <button onClick={e => deleteNotification(notifId, e)}
                          className="p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                          style={{ color: "#B2B2D2" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}