import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicProfile from "../pages/PublicProfile";


// Public pages
import Home from "../pages/Home";
import ExplorePage from "../pages/Exploreagig";
import GigDetails from "../pages/GigDetails";
import ApplyGig from "../pages/ApplyGig";
import SearchResults from "../pages/SearchResults";
import Notifications from "../pages/Notifications";
import Support from "../pages/Support";
import Terms from "../pages/Terms";
import NotFound from "../pages/NotFound";
import PostGig from "../pages/PostGig";
<Route path="/profile/:slug" element={<PublicProfile />} />


// Auth
import SignUp from "../pages/SignUp";
import LogIn from "../pages/LogIn";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import GoogleSuccess from "../pages/auth/GoogleSuccess";

// Onboarding
import TeenlancerOnboarding from "../pages/onboarding/TeenlancerOnboarding";
import AgentOnboarding from "../pages/onboarding/AgentOnboarding";

// Teenlancer pages
import TeenlancerDashboard from "../pages/teenlancer/Dashboard";
import TeenlancerProfile from "../pages/teenlancer/Profile";
import TeenlancerPayment from "../pages/teenlancer/PaymentDetails";
import TeenlancerSettings from "../pages/teenlancer/Settings";
import TeenlancerCommunity from "../pages/teenlancer/Community";
import TeenlancerChat from "../pages/teenlancer/Chat";

// Agent pages
import AgentDashboard from "../pages/agent/Dashboard";
import AgentProfile from "../pages/agent/Profile";
import AgentPayment from "../pages/agent/PaymentDetails";
import AgentSettings from "../pages/agent/Settings";
import AgentApplications from "../pages/agent/Applications";
import MyGigs from "../pages/agent/MyGigs";

// Category pages
import GigsByCategory from "../pages/GigsByCategory";
import TeenlancersByCategory from "../pages/TeenlancersByCategory";

// ─────────────────────────────────────────────────────────────
// ✅ ROUTE GUARDS
// ─────────────────────────────────────────────────────────────

// Requires a valid token — redirects to /signin if not logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signin" replace />;
  return children;
}

// Requires a specific role — redirects to their own dashboard if wrong role
function RoleRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/signin" replace />;

  if (currentRole !== role) {
    // Redirect to their correct dashboard instead of 404
    if (currentRole === "teenlancer") return <Navigate to="/teenlancer/dashboard" replace />;
    if (currentRole === "agent") return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
}

// Redirects logged-in users away from auth pages
function GuestRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role === "teenlancer") return <Navigate to="/teenlancer/dashboard" replace />;
    if (role === "agent") return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
}

// ─────────────────────────────────────────────────────────────

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public — accessible by everyone ── */}
        <Route path="/home" element={<Home />} />
        <Route path="/Exploreagig" element={<ExplorePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/gig/:id" element={<GigDetails />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/gigs/category/:category" element={<GigsByCategory />} />
        <Route path="/teenlancers/category/:category" element={<TeenlancersByCategory />} />

        {/* ── Auth — guests only, logged-in users get redirected ── */}
        <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
        <Route path="/signin" element={<GuestRoute><LogIn /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />

        {/* ── Onboarding — requires login, any role ── */}
        <Route path="/onboarding/teenlancer" element={<PrivateRoute><TeenlancerOnboarding /></PrivateRoute>} />
        <Route path="/onboarding/agent" element={<PrivateRoute><AgentOnboarding /></PrivateRoute>} />

        {/* ── Protected — requires login ── */}
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/post" element={<PrivateRoute><PostGig /></PrivateRoute>} />

        {/* ── Teenlancer only ── */}
        <Route path="/teenlancer/dashboard" element={<RoleRoute role="teenlancer"><TeenlancerDashboard /></RoleRoute>} />
        <Route path="/teenlancer/profile" element={<RoleRoute role="teenlancer"><TeenlancerProfile /></RoleRoute>} />
        <Route path="/teenlancer/payment" element={<RoleRoute role="teenlancer"><TeenlancerPayment /></RoleRoute>} />
        <Route path="/teenlancer/settings" element={<RoleRoute role="teenlancer"><TeenlancerSettings /></RoleRoute>} />
        <Route path="/teenlancer/community" element={<RoleRoute role="teenlancer"><TeenlancerCommunity /></RoleRoute>} />
        <Route path="/teenlancer/chat" element={<RoleRoute role="teenlancer"><TeenlancerChat /></RoleRoute>} />

        {/* ── Apply gig — teenlancers only ── */}
        <Route path="/gig/:id/apply" element={<RoleRoute role="teenlancer"><ApplyGig /></RoleRoute>} />

        {/* ── Agent only ── */}
        <Route path="/agent/dashboard" element={<RoleRoute role="agent"><AgentDashboard /></RoleRoute>} />
        <Route path="/agent/profile" element={<RoleRoute role="agent"><AgentProfile /></RoleRoute>} />
        <Route path="/agent/payment" element={<RoleRoute role="agent"><AgentPayment /></RoleRoute>} />
        <Route path="/agent/settings" element={<RoleRoute role="agent"><AgentSettings /></RoleRoute>} />
        <Route path="/agent/applications" element={<RoleRoute role="agent"><AgentApplications /></RoleRoute>} />
        <Route path="/agent/my-gigs" element={<RoleRoute role="agent"><MyGigs /></RoleRoute>} />

        {/* ── Fallback ── */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}