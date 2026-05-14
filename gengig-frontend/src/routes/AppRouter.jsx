import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import AboutUs from "../pages/AboutUs";
import PublicProfile from "../pages/PublicProfile";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import PremiumPage from "../pages/PremiumPage";
import PremiumCheckout from "../pages/PremiumCheckout";

// Auth
import SignUp from "../pages/SignUp";
import LogIn from "../pages/LogIn";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import GoogleSuccess from "../pages/auth/GoogleSuccess";
import AuthCallback from "../pages/AuthCallback";


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
import SavedGigs from "../pages/teenlancer/SavedGigs";
import SubmitWork from "../pages/teenlancer/SubmitWork";


// Agent pages
import AgentDashboard from "../pages/agent/Dashboard";
import AgentProfile from "../pages/agent/Profile";
import AgentPayment from "../pages/agent/PaymentDetails";
import AgentSettings from "../pages/agent/Settings";
import AgentApplications from "../pages/agent/Applications";
import MyGigs from "../pages/agent/MyGigs";
import PostGig from "../pages/PostGig";
import AgentChat from "../pages/agent/Chat";
import ReviewWork from "../pages/agent/ReviewWork";
import ReviewRevision from "../pages/agent/ReviewRevision";



// Category pages
import GigsByCategory from "../pages/GigsByCategory";
import TeenlancersByCategory from "../pages/TeenlancersByCategory";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/*Fully public*/}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/Exploreagig" element={<ExplorePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/gig/:id" element={<GigDetails />} />
        <Route path="/gigs/category/:category" element={<GigsByCategory />} />
        <Route path="/teenlancers/category/:category" element={<TeenlancersByCategory />} />
        <Route path="/profile/:slug" element={<PublicProfile />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium/checkout" element={<PremiumCheckout />} />

        {/*Auth*/}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
        <Route path="/google/success" element={<GoogleSuccess />} />
        <Route path="/auth/callback" element={<GoogleSuccess />} />
        <Route path="/auth/callback" element={<AuthCallback />} />



        {/*Onboarding*/}
        <Route path="/onboarding/teenlancer" element={<PrivateRoute><TeenlancerOnboarding /></PrivateRoute>} />
        <Route path="/onboarding/agent" element={<PrivateRoute><AgentOnboarding /></PrivateRoute>} />

        {/*Requires login only — no role check*/}
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/post" element={<PrivateRoute><PostGig /></PrivateRoute>} />
        <Route path="/gig/:id/apply" element={<PrivateRoute><ApplyGig /></PrivateRoute>} />

        {/*Teenlancer pages — login required only*/}
        <Route path="/teenlancer/dashboard" element={<PrivateRoute><TeenlancerDashboard /></PrivateRoute>} />
        <Route path="/teenlancer/profile" element={<PrivateRoute><TeenlancerProfile /></PrivateRoute>} />
        <Route path="/teenlancer/payment" element={<PrivateRoute><TeenlancerPayment /></PrivateRoute>} />
        <Route path="/teenlancer/settings" element={<PrivateRoute><TeenlancerSettings /></PrivateRoute>} />
        <Route path="/teenlancer/community" element={<PrivateRoute><TeenlancerCommunity /></PrivateRoute>} />
        <Route path="/teenlancer/chat" element={<PrivateRoute><TeenlancerChat /></PrivateRoute>} />
        <Route path="/teenlancer/savedgigs" element={<PrivateRoute><SavedGigs /></PrivateRoute>} />
        <Route path="/teenlancer/submitwork/:applicationId" element={<PrivateRoute><SubmitWork /></PrivateRoute>} />




        {/*Agent pages — login required only*/}
        <Route path="/agent/dashboard" element={<PrivateRoute><AgentDashboard /></PrivateRoute>} />
        <Route path="/agent/profile" element={<PrivateRoute><AgentProfile /></PrivateRoute>} />
        <Route path="/agent/payment" element={<PrivateRoute><AgentPayment /></PrivateRoute>} />
        <Route path="/agent/settings" element={<PrivateRoute><AgentSettings /></PrivateRoute>} />
        <Route path="/agent/applications" element={<PrivateRoute><AgentApplications /></PrivateRoute>} />
        <Route path="/agent/my-gigs" element={<PrivateRoute><MyGigs /></PrivateRoute>} />
        <Route path="/agent/chat" element={<PrivateRoute><AgentChat /></PrivateRoute>} />
        <Route path="/agent/reviewwork/:applicationId" element={<PrivateRoute><ReviewWork /></PrivateRoute>} />
        <Route path="/agent/review-revision/:applicationId"
          element={<PrivateRoute><ReviewRevision /></PrivateRoute>} />



        {/*404*/}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}