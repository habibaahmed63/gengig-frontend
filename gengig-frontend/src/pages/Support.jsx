import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const faqs = [
  { q: "How do I get started on Gengig?", a: "Simply create an account, choose your role as either a Teenlancer or Agent, complete your profile and start exploring gigs." },
  { q: "Is Gengig free to use?", a: "Yes! Creating an account and browsing gigs is completely free. We only charge a small service fee when a gig is completed." },
  { q: "How do payments work?", a: "Payments are handled securely through our platform. Agents pay upfront and funds are released to the teenlancer once the work is approved." },
  { q: "What if I have a dispute with a client?", a: "Our support team is here to help. Open a support ticket and we will mediate the situation fairly for both parties." },
];

const contactOptions = [
  { icon: "📧", title: "Email Us", desc: "We reply within 24 hours", value: "support@gengig.com" },
  { icon: "💬", title: "Live Chat", desc: "Available 9am - 6pm", value: "Start Chat" },
  { icon: "📱", title: "WhatsApp", desc: "Quick responses", value: "+20 100 000 0000" },
];

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    // TODO: send to backend
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div style={{ background: "#060834" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-white font-bold mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            How Can We <span className="text-gradient">Help You?</span>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "#B2B2D2" }}>
            Our support team is here to help you with anything you need. Reach out and we will get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {contactOptions.map((option) => (
            <div
              key={option.title}
              className="p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="text-3xl mb-3">{option.icon}</div>
              <h3 className="text-white font-semibold mb-1">{option.title}</h3>
              <p className="text-xs mb-2" style={{ color: "#B2B2D2" }}>{option.desc}</p>
              <p className="text-sm font-medium" style={{ color: "#FFC085" }}>{option.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left - Contact Form */}
          <div className="flex-1">
            <h2 className="text-white font-bold mb-6" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
              Send Us a Message
            </h2>

            {submitted ? (
              <div
                className="p-8 rounded-2xl text-center flex flex-col items-center gap-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#FFC085" }} />
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative z-10"
                    style={{ background: "rgba(255,192,133,0.15)", border: "2px solid #FFC085" }}
                  >
                    ✓
                  </div>
                </div>
                <h3 className="text-white font-semibold">Message Sent!</h3>
                <p className="text-sm" style={{ color: "#B2B2D2" }}>
                  Thanks for reaching out. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-6 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option value="" style={{ background: "#060834" }}>Select a subject</option>
                    <option style={{ background: "#060834" }}>Account Issue</option>
                    <option style={{ background: "#060834" }}>Payment Problem</option>
                    <option style={{ background: "#060834" }}>Gig Dispute</option>
                    <option style={{ background: "#060834" }}>Technical Bug</option>
                    <option style={{ background: "#060834" }}>General Question</option>
                    <option style={{ background: "#060834" }}>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "#B2B2D2" }}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your issue or question in detail..."
                    rows={5}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>

                {error && (
                  <p className="text-xs text-center" style={{ color: "#f87171" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                >
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </form>
            )}
          </div>

          {/* Right - FAQs */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <h2 className="text-white font-bold mb-6" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
              Quick Answers
            </h2>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#FFC085"
                      strokeWidth={2}
                      style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-xs leading-relaxed" style={{ color: "#B2B2D2" }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/faqs"
                className="text-sm text-center mt-2 hover:opacity-80 transition-opacity"
                style={{ color: "#FFC085" }}
              >
                View all FAQs →
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}