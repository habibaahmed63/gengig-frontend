import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: `By accessing or using Gengig, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform. These terms apply to all users including Teenlancers, Agents, and visitors.`
    },
    {
        id: "eligibility",
        title: "2. Eligibility",
        content: `Teenlancers must be between 13 and 19 years of age. Users under 18 must have parental or guardian consent to use Gengig. Agents must be at least 18 years old or a registered business entity. By using Gengig, you confirm that you meet these eligibility requirements.`
    },
    {
        id: "accounts",
        title: "3. User Accounts",
        content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration. Gengig reserves the right to suspend or terminate accounts that violate these terms. You may not transfer or share your account with another person.`
    },
    {
        id: "conduct",
        title: "4. User Conduct",
        content: `All users agree to behave professionally and respectfully on the platform. You must not post offensive, misleading, or inappropriate content. Harassment, discrimination, or abusive behavior of any kind is strictly prohibited. Any attempt to manipulate ratings, reviews, or the platform's systems is forbidden.`
    },
    {
        id: "gigs",
        title: "5. Gigs & Transactions",
        content: `Agents are responsible for providing clear and accurate gig descriptions. Teenlancers agree to deliver work that meets the agreed-upon requirements. All payments are processed securely through Gengig's payment system. Gengig charges a service fee on completed transactions. Refunds are handled on a case-by-case basis by our support team.`
    },
    {
        id: "intellectual",
        title: "6. Intellectual Property",
        content: `All work created by Teenlancers remains their intellectual property until full payment is received. Upon payment, ownership of the deliverables transfers to the Agent unless otherwise agreed. Gengig does not claim ownership over any user-generated content. You may not use Gengig's branding, logo, or trademarks without written permission.`
    },
    {
        id: "privacy",
        title: "7. Privacy Policy",
        content: `Gengig collects personal information including name, email, and payment details to operate the platform. We do not sell your personal data to third parties. Your information may be shared with payment processors and service providers as necessary. We use cookies to improve your experience on the platform. You may request deletion of your account and associated data at any time through Settings.`
    },
    {
        id: "data",
        title: "8. Data Security",
        content: `Gengig uses industry-standard encryption to protect your personal and payment information. While we take all reasonable precautions, no online platform can guarantee 100% security. You are responsible for keeping your login credentials secure. Please notify us immediately if you suspect any unauthorized access to your account.`
    },
    {
        id: "liability",
        title: "9. Limitation of Liability",
        content: `Gengig is a marketplace platform and is not responsible for the quality of work delivered by Teenlancers. We are not liable for any disputes between Agents and Teenlancers. Our total liability in any case shall not exceed the fees paid to Gengig in the previous 30 days. Gengig is not responsible for any indirect, incidental, or consequential damages.`
    },
    {
        id: "termination",
        title: "10. Termination",
        content: `Gengig reserves the right to suspend or permanently terminate any account that violates these terms. Users may delete their account at any time through the Settings page. Upon termination, any pending transactions will be resolved at Gengig's discretion. Sections relating to intellectual property and liability survive termination.`
    },
    {
        id: "changes",
        title: "11. Changes to Terms",
        content: `Gengig may update these Terms and Conditions at any time. Users will be notified of significant changes via email. Continued use of the platform after changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.`
    },
    {
        id: "contact",
        title: "12. Contact Us",
        content: `If you have any questions about these Terms and Conditions, please contact us through our Support page or email us at legal@gengig.com. We are committed to addressing all concerns promptly and fairly.`
    },
];

export default function Terms() {
    const [activeSection, setActiveSection] = useState("acceptance");

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 md:px-8 py-10">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1
                        className="text-white font-bold mb-3"
                        style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                    >
                        Terms & <span className="text-gradient">Conditions</span>
                    </h1>
                    <p className="text-sm max-w-lg mx-auto mb-2" style={{ color: "#B2B2D2" }}>
                        Please read these terms carefully before using Gengig. By using our platform you agree to these terms.
                    </p>
                    <p className="text-xs" style={{ color: "#B2B2D2" }}>
                        Last updated: <span style={{ color: "#FFC085" }}>March 2026</span>
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Table of Contents */}
                    <div className="w-full lg:w-60 flex-shrink-0">
                        <div
                            className="p-5 rounded-2xl sticky top-24"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <h3 className="text-white font-semibold text-sm mb-4">Table of Contents</h3>
                            <div className="flex flex-col gap-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }}
                                        className="text-left text-xs px-3 py-2 rounded-lg transition-all"
                                        style={{
                                            background: activeSection === section.id ? "rgba(255,192,133,0.15)" : "transparent",
                                            color: activeSection === section.id ? "#FFC085" : "#B2B2D2",
                                            fontWeight: activeSection === section.id ? "600" : "400",
                                            borderLeft: activeSection === section.id ? "2px solid #FFC085" : "2px solid transparent",
                                        }}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-6">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                id={section.id}
                                className="p-6 rounded-2xl scroll-mt-28"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <h2
                                    className="font-bold mb-4"
                                    style={{ color: "#FFC085", fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
                                >
                                    {section.title}
                                </h2>
                                <p className="text-sm leading-relaxed" style={{ color: "#B2B2D2" }}>
                                    {section.content}
                                </p>
                            </div>
                        ))}

                        {/* Agreement Banner */}
                        <div
                            className="p-6 rounded-2xl text-center mt-4"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,192,133,0.08), rgba(232,160,96,0.05))",
                                border: "1px solid rgba(255,192,133,0.2)",
                            }}
                        >
                            <p className="text-white font-semibold mb-2">
                                Questions about our terms?
                            </p>
                            <p className="text-sm mb-5" style={{ color: "#B2B2D2" }}>
                                Our support team is happy to clarify anything in these terms.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    to="/support"
                                    className="px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    Contact Support
                                </Link>
                                <Link
                                    to="/faqs"
                                    className="px-6 py-2.5 rounded-full text-sm font-semibold transition-colors hover:bg-white/10"
                                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#B2B2D2" }}
                                >
                                    View FAQs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}