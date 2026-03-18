import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialNotifications = [
  {
    id: 1,
    type: "application",
    title: "New Application Received",
    message: "Salma Tamer applied to your Brand Identity Design gig.",
    time: "2 minutes ago",
    read: false,
    link: "/agent/applications",
    icon: "📋",
  },
  {
    id: 2,
    type: "gig",
    title: "Gig Match Found",
    message: "A new gig matching your skills in Graphic Design was just posted.",
    time: "15 minutes ago",
    read: false,
    link: "/explore",
    icon: "🎯",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received",
    message: "You received a payment of $130 for Brand Identity Design.",
    time: "1 hour ago",
    read: false,
    link: "/teenlancer/payment",
    icon: "💰",
  },
  {
    id: 4,
    type: "application",
    title: "Application Accepted",
    message: "Your application for Social Media Campaign was accepted by Khaled Ramzy.",
    time: "3 hours ago",
    read: true,
    link: "/teenlancer/dashboard",
    icon: "✅",
  },
  {
    id: 5,
    type: "system",
    title: "Profile Incomplete",
    message: "Complete your profile to increase your chances of getting hired.",
    time: "1 day ago",
    read: true,
    link: "/teenlancer/profile",
    icon: "👤",
  },
  {
    id: 6,
    type: "application",
    title: "Application Rejected",
    message: "Your application for Logo Redesign was not accepted this time.",
    time: "2 days ago",
    read: true,
    link: "/teenlancer/dashboard",
    icon: "❌",
  },
  {
    id: 7,
    type: "gig",
    title: "Gig Completed",
    message: "Congratulations! Your gig Video Editing has been marked as completed.",
    time: "3 days ago",
    read: true,
    link: "/teenlancer/dashboard",
    icon: "🎉",
  },
  {
    id: 8,
    type: "system",
    title: "Welcome to Gengig",
    message: "Your account has been created successfully. Start exploring gigs now!",
    time: "1 week ago",
    read: true,
    link: "/explore",
    icon: "👋",
  },
];

const typeColors = {
  application: { bg: "rgba(255,192,133,0.1)", color: "#FFC085" },
  gig: { bg: "rgba(99,179,237,0.1)", color: "#63b3ed" },
  payment: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  system: { bg: "rgba(178,178,210,0.1)", color: "#B2B2D2" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("all");

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ background: "#060834" }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-white font-bold mb-1"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              Notifications
              {unreadCount > 0 && (
                <span
                  className="ml-3 text-sm px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(255,192,133,0.15)", color: "#FFC085" }}
                >
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: "#B2B2D2" }}>
              Stay updated on your gigs and applications
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm px-4 py-2 rounded-full transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "application", label: "Applications" },
            { key: "gig", label: "Gigs" },
            { key: "payment", label: "Payments" },
            { key: "system", label: "System" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background:
                  activeFilter === filter.key
                    ? "linear-gradient(90deg, #FFC085, #e8a060)"
                    : "rgba(255,255,255,0.05)",
                color: activeFilter === filter.key ? "white" : "#B2B2D2",
                border:
                  activeFilter === filter.key
                    ? "none"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: "#B2B2D2" }}>
              <p className="text-4xl mb-4">🔔</p>
              <p className="text-sm">No notifications here</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-4 p-4 rounded-2xl transition-all"
                style={{
                  background: notif.read
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.07)",
                  border: notif.read
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(255,192,133,0.2)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: typeColors[notif.type].bg,
                  }}
                >
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: notif.read ? "#B2B2D2" : "white" }}
                      >
                        {notif.title}
                        {!notif.read && (
                          <span
                            className="ml-2 w-2 h-2 rounded-full inline-block"
                            style={{ background: "#FFC085" }}
                          />
                        )}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>
                        {notif.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: typeColors[notif.type].color }}>
                        {notif.time}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                      style={{ color: "#B2B2D2" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      to={notif.link}
                      onClick={() => markRead(notif.id)}
                      className="text-xs font-medium hover:opacity-80 transition-opacity"
                      style={{ color: typeColors[notif.type].color }}
                    >
                      View details
                    </Link>
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="text-xs hover:text-white transition-colors"
                        style={{ color: "#B2B2D2" }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}