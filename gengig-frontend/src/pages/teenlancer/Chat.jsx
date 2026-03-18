import { useState, useRef, useEffect } from "react";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";

const contacts = [
  {
    id: 1,
    name: "Salma Tamer",
    role: "Graphic Designer",
    img: "https://i.pravatar.cc/100?img=1",
    online: true,
    lastMessage: "Hey! Did you finish the project?",
    time: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    name: "Ahmed Karim",
    role: "UI/UX Designer",
    img: "https://i.pravatar.cc/100?img=2",
    online: true,
    lastMessage: "Thanks for the tip!",
    time: "1h ago",
    unread: 0,
  },
  {
    id: 3,
    name: "Mariam Assem",
    role: "Content Creator",
    img: "https://i.pravatar.cc/100?img=5",
    online: false,
    lastMessage: "Let me know when you are free",
    time: "3h ago",
    unread: 1,
  },
  {
    id: 4,
    name: "Omar Fathy",
    role: "Social Media Manager",
    img: "https://i.pravatar.cc/100?img=7",
    online: false,
    lastMessage: "Great work on the campaign!",
    time: "1d ago",
    unread: 0,
  },
  {
    id: 5,
    name: "Nour Hassan",
    role: "Video Editor",
    img: "https://i.pravatar.cc/100?img=9",
    online: true,
    lastMessage: "Can you review my portfolio?",
    time: "2d ago",
    unread: 0,
  },
];

const initialMessages = {
  1: [
    { id: 1, sender: "them", text: "Hey! How is the project going?", time: "10:00 AM" },
    { id: 2, sender: "me", text: "Going great! Almost done with the logo concepts.", time: "10:02 AM" },
    { id: 3, sender: "them", text: "Amazing! Can you send me a preview?", time: "10:03 AM" },
    { id: 4, sender: "me", text: "Sure, give me 10 minutes!", time: "10:04 AM" },
    { id: 5, sender: "them", text: "Hey! Did you finish the project?", time: "10:30 AM" },
  ],
  2: [
    { id: 1, sender: "them", text: "That tip about client briefs was super helpful.", time: "9:00 AM" },
    { id: 2, sender: "me", text: "Glad it helped! Always ask for a brief first.", time: "9:05 AM" },
    { id: 3, sender: "them", text: "Thanks for the tip!", time: "9:06 AM" },
  ],
  3: [
    { id: 1, sender: "them", text: "Hey are you free this weekend?", time: "Yesterday" },
    { id: 2, sender: "me", text: "Might be, what is up?", time: "Yesterday" },
    { id: 3, sender: "them", text: "Let me know when you are free", time: "Yesterday" },
  ],
  4: [
    { id: 1, sender: "them", text: "Just saw your latest work. Really impressive!", time: "Monday" },
    { id: 2, sender: "me", text: "Thank you so much! That means a lot.", time: "Monday" },
    { id: 3, sender: "them", text: "Great work on the campaign!", time: "Monday" },
  ],
  5: [
    { id: 1, sender: "them", text: "Hi! I just updated my portfolio.", time: "Sunday" },
    { id: 2, sender: "them", text: "Can you review my portfolio?", time: "Sunday" },
  ],
};

export default function Chat() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showContacts, setShowContacts] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setShowContacts(false);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentMessages = messages[activeContact.id] || [];

  return (
    <TeenlancerLayout>
      <p className="text-xs mb-4" style={{ color: "#B2B2D2" }}>
        Home › Community › <span style={{ color: "#FFC085" }}>Chat</span>
      </p>

      <div
        className="rounded-2xl overflow-hidden flex"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          height: "calc(100vh - 220px)",
          minHeight: "500px",
        }}
      >
        {/* ── Contacts Sidebar ── */}
        <div
          className={`
            flex-shrink-0 flex flex-col
            ${showContacts ? "flex" : "hidden"}
            md:flex w-full md:w-72
          `}
          style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Sidebar Header */}
          <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-white font-semibold mb-3">Messages</h2>
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full px-4 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-[#FFC085]"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                style={{
                  background: activeContact.id === contact.id ? "rgba(255,192,133,0.08)" : "transparent",
                  borderLeft: activeContact.id === contact.id ? "3px solid #FFC085" : "3px solid transparent",
                }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                    style={{
                      background: contact.online ? "#4ade80" : "#555",
                      borderColor: "#060834",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white text-sm font-medium truncate">{contact.name}</p>
                    <p className="text-xs flex-shrink-0 ml-2" style={{ color: "#B2B2D2" }}>{contact.time}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs truncate" style={{ color: "#B2B2D2" }}>{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span
                        className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 ml-2"
                        style={{ background: "#FFC085", color: "#060834", fontSize: "9px" }}
                      >
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div
          className={`
            flex-1 flex flex-col
            ${showContacts ? "hidden md:flex" : "flex"}
          `}
        >
          {/* Chat Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={() => setShowContacts(true)}
              className="md:hidden p-1 rounded-full hover:bg-white/10 transition-colors mr-1"
              style={{ color: "#B2B2D2" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="relative flex-shrink-0">
              <img
                src={activeContact.img}
                alt={activeContact.name}
                className="w-9 h-9 rounded-full object-cover"
                style={{ border: "2px solid #FFC085" }}
              />
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  background: activeContact.online ? "#4ade80" : "#555",
                  borderColor: "#060834",
                }}
              />
            </div>

            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{activeContact.name}</p>
              <p className="text-xs" style={{ color: activeContact.online ? "#4ade80" : "#B2B2D2" }}>
                {activeContact.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "them" && (
                  <img
                    src={activeContact.img}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mr-2 self-end"
                  />
                )}
                <div
                  className="max-w-xs px-4 py-2.5 rounded-2xl"
                  style={{
                    background:
                      msg.sender === "me"
                        ? "linear-gradient(90deg, #FFC085, #e8a060)"
                        : "rgba(255,255,255,0.08)",
                    borderBottomRightRadius: msg.sender === "me" ? "4px" : "16px",
                    borderBottomLeftRadius: msg.sender === "them" ? "4px" : "16px",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: msg.sender === "me" ? "white" : "#B2B2D2" }}
                  >
                    {msg.text}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: msg.sender === "me" ? "rgba(255,255,255,0.7)" : "rgba(178,178,210,0.6)",
                      textAlign: "right",
                    }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div
            className="p-4 flex items-center gap-3 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={"Message " + activeContact.name + "..."}
              className="flex-1 rounded-full px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
              style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </TeenlancerLayout>
  );
}