import { BrowserRouter, Routes, Route } from "react-router-dom";

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


// Auth
import SignUp from "../pages/SignUp";
import LogIn from "../pages/LogIn";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";

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


// Category pages — NEW
import GigsByCategory from "../pages/GigsByCategory";
import TeenlancersByCategory from "../pages/TeenlancersByCategory";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/home" element={<Home />} />
        <Route path="/Exploreagig" element={<ExplorePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/gig/:id" element={<GigDetails />} />
        <Route path="/gig/:id/apply" element={<ApplyGig />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/post" element={<PostGig />} />

        {/* ── Category Pages ── */}
        <Route path="/gigs/category/:category" element={<GigsByCategory />} />
        <Route path="/teenlancers/category/:category" element={<TeenlancersByCategory />} />

        {/* ── Auth ── */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<LogIn />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── Onboarding ── */}
        <Route path="/onboarding/teenlancer" element={<TeenlancerOnboarding />} />
        <Route path="/onboarding/agent" element={<AgentOnboarding />} />

        {/* ── Teenlancer ── */}
        <Route path="/teenlancer/dashboard" element={<TeenlancerDashboard />} />
        <Route path="/teenlancer/profile" element={<TeenlancerProfile />} />
        <Route path="/teenlancer/payment" element={<TeenlancerPayment />} />
        <Route path="/teenlancer/settings" element={<TeenlancerSettings />} />
        <Route path="/teenlancer/community" element={<TeenlancerCommunity />} />
        <Route path="/teenlancer/chat" element={<TeenlancerChat />} />

        {/* ── Agent ── */}
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/profile" element={<AgentProfile />} />
        <Route path="/agent/payment" element={<AgentPayment />} />
        <Route path="/agent/settings" element={<AgentSettings />} />
        <Route path="/agent/applications" element={<AgentApplications />} />
        <Route path="/agent/my-gigs" element={<MyGigs />} />


        {/* ── Fallback ── */}
        <Route path="/" element={<LogIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
