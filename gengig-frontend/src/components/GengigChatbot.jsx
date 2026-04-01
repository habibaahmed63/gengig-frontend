import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Gengig Assistant, a helpful AI chatbot for the Gengig platform. Gengig is a freelancing platform designed specifically for teenagers (called Teenlancers) and the businesses/individuals who hire them (called Agents).

Here is everything you know about Gengig:

PLATFORM OVERVIEW:
- Gengig connects young talented creators (Teenlancers aged 13-19) with Agents (businesses/individuals) who need creative work done
- It is free to join and browse. A small service fee is charged on completed transactions

TEENLANCERS CAN:
- Create a profile with photo, bio, skills, availability and hourly rate
- Browse and apply to gigs on the Explore page
- Build a portfolio of their work
- Earn money by completing gigs
- Connect with other teenlancers on the Community Hub
- Chat with other teenlancers

AGENTS CAN:
- Post gigs describing what they need, the budget and deadline
- Browse teenlancer applications and accept or reject them
- Pay teenlancers securely through the platform
- Leave reviews after gigs are completed

PAGES ON THE PLATFORM:
- /home - Landing page
- /explore - Browse all available gigs
- /search - Search for specific gigs
- /teenlancer/dashboard - Teenlancer's main dashboard
- /teenlancer/profile - Teenlancer profile page
- /teenlancer/community - Community hub for teenlancers
- /teenlancer/chat - Chat with other teenlancers
- /teenlancer/payment - Teenlancer payment details
- /teenlancer/settings - Teenlancer settings
- /agent/dashboard - Agent's main dashboard
- /agent/applications - View and manage applications
- /agent/profile - Agent profile page
- /agent/payment - Agent payment details
- /agent/settings - Agent settings
- /support - Contact support
- /faqs - Frequently asked questions
- /notifications - User notifications

PAYMENT:
- Agents pay upfront when accepting an application
- Funds are held securely and released to teenlancers when work is approved
- Supported cards: Visa, Mastercard, Amex

SUPPORT:
- Users can contact support via the Support page
- There is a live chat, email (support@gengig.com) and WhatsApp option

Always be friendly, helpful and encouraging. Keep responses concise and clear. If you don't know something specific about Gengig, suggest the user visit the Support page or FAQs. Never make up information.`;

export default function GengigChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the Gengig Assistant 👋 How can I help you today? You can ask me anything about the platform!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      response = await fetch("http://localhost:3000/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token  // the user's JWT token
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: "session-001",
          userType: "teenlancer"  // or "agent" depending on the user's role
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.content[0].text,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again or visit our Support page for help!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi! I'm the Gengig Assistant 👋 How can I help you today?",
      },
    ]);
  };

  const suggestions = [
    "How do I apply for a gig?",
    "How does payment work?",
    "How do I post a gig?",
    "How do I edit my profile?",
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setHasNewMessage(false); }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200"
        style={{ background: "linear-gradient(135deg, #FFC085, #e8a060)" }}
        title="Gengig Assistant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {hasNewMessage && !isOpen && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#f87171", color: "white", fontSize: "9px" }}
          >
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            background: "#0a0d2e",
            border: "1px solid rgba(255,255,255,0.1)",
            height: "480px",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.904.302M14.25 3.104c.251.023.501.05.75.082M19.5 12l-3.75 4.5m0 0L12 19.5m3.75-3l3.75-3" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Gengig Assistant</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                  <p className="text-white text-xs opacity-80">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-white opacity-70 hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded-lg hover:bg-white/10"
              title="Clear chat"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 self-end"
                    style={{ background: "linear-gradient(135deg, #FFC085, #e8a060)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5" />
                    </svg>
                  </div>
                )}
                <div
                  className="max-w-xs px-3 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                    color: msg.role === "user" ? "white" : "#B2B2D2",
                    borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                    borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 self-end"
                  style={{ background: "linear-gradient(135deg, #FFC085, #e8a060)" }}
                />
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.08)", borderBottomLeftRadius: "4px" }}
                >
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: "#FFC085", animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only on first message) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="flex items-center gap-2 p-3 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 rounded-full px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
              style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}