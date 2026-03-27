import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/LogIn";
import Home from "../pages/Home";
import Exploreagig from "../pages/Exploreagig";
import TeenlancerDashboard from "../pages/teenlancer/Dashboard";
import TeenlancerProfile from "../pages/teenlancer/Profile";
import TeenlancerPayment from "../pages/teenlancer/PaymentDetails";
import TeenlancerSettings from "../pages/teenlancer/Settings";
import AgentDashboard from "../pages/agent/Dashboard";
import AgentProfile from "../pages/agent/Profile";
import AgentPayment from "../pages/agent/PaymentDetails";
import AgentSettings from "../pages/agent/Settings";
import TeenlancerOnboarding from "../pages/onboarding/TeenlancerOnboarding";
import AgentOnboarding from "../pages/onboarding/AgentOnboarding";
import NotFound from "../pages/NotFound";
import GigDetails from "../pages/GigDetails";
import ApplyGig from "../pages/ApplyGig";
import AgentApplications from "../pages/agent/Applications";
import Notifications from "../pages/Notifications";
import Support from "../pages/Support";
import Community from "../pages/teenlancer/Community";
import Chat from "../pages/teenlancer/Chat";
import SearchResults from "../pages/SearchResults";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import Terms from "../pages/Terms";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/exploreagig" element={<Exploreagig />} />
        <Route path="/teenlancer/dashboard" element={<TeenlancerDashboard />} />
        <Route path="/teenlancer/profile" element={<TeenlancerProfile />} />
        <Route path="/teenlancer/payment" element={<TeenlancerPayment />} />
        <Route path="/teenlancer/settings" element={<TeenlancerSettings />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/profile" element={<AgentProfile />} />
        <Route path="/agent/payment" element={<AgentPayment />} />
        <Route path="/agent/settings" element={<AgentSettings />} />
        <Route path="/onboarding/teenlancer" element={<TeenlancerOnboarding />} />
        <Route path="/onboarding/agent" element={<AgentOnboarding />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/gig/:id" element={<GigDetails />} />
        <Route path="/gig/:id/apply" element={<ApplyGig />} />
        <Route path="/agent/applications" element={<AgentApplications />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/support" element={<Support />} />
        <Route path="/teenlancer/community" element={<Community />} />
        <Route path="/teenlancer/chat" element={<Chat />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}