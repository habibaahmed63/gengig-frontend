import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";

export default function Chat() {
  const navigate = useNavigate();

  // User data from localStorage
  const userName = localStorage.getItem("name") || "You";
  const userPhoto = localStorage.getItem("photo") || null;

  // Contacts & messages state
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [contactsLoading, setContactsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // UI state
  const [activeContact, setActiveContact] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showContacts, setShowContacts] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      setContactsLoading(true);
      try {
        // TODO: Replace with real API call: GET /chat/contacts
        // const response = await api.get("/chat/contacts");
        // setContacts(response.data);
        // if (response.data.length > 0) setActiveContact(response.data[0]);

        // Mock data until backend is ready
        const mockContacts = [
          { id: 1, name: "Salma Tamer", role: "Graphic Designer", img: "https://i.pravatar.cc/100?img=1", online: true, lastMessage: "Hey! Did you finish the project?", time: "2m ago", unread: 2 },
          { id: 2, name: "Ahmed Karim", role: "UI/UX Designer", img: "https://i.pravatar.cc/100?img=2", online: true, lastMessage: "Thanks for the tip!", time: "1h ago", unread: 0 },
          { id: 3, name: "Mariam Assem", role: "Content Creator", img: "https://i.pravatar.cc/100?img=5", online: false, lastMessage: "Let me know when you are free", time: "3h ago", unread: 1 },
          { id: 4, name: "Omar Fathy", role: "Social Media Manager", img: "https://i.pravatar.cc/100?img=7", online: false, lastMessage: "Great work on the campaign!", time: "1d ago", unread: 0 },
          { id: 5, name: "Nour Hassan", role: "Video Editor", img: "https://i.pravatar.cc/100?img=9", online: true, lastMessage: "Can you review my portfolio?", time: "2d ago", unread: 0 },
        ];
        setContacts(mockContacts);
        setActiveContact(mockContacts[0]);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setContactsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Fetch messages when active contact changes
  useEffect(() => {
    if (!activeContact) return;
    if (messages[activeContact.id]) return; // already loaded

    const fetchMessages = async () => {
      setMessagesLoading(true);
      try {
        // TODO: Replace with real API call: GET /chat/messages/:userId
        // const response = await api.get(`/chat/messages/${activeContact.id}`);
        // setMessages((prev) => ({ ...prev, [activeContact.id]: response.data }));

        // Mock messages until backend is ready
        const mockMessages = {
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
        setMessages((prev) => ({
          ...prev,
          [activeContact.id]: mockMessages[activeContact.id] || [],
        }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [activeContact]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const handleSend = async () => {
    if (!input.trim() || !activeContact) return;
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    // Optimistic update
    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));
    // Update last message in contacts list
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContact.id
          ? { ...c, lastMessage: input.trim(), time: "Just now", unread: 0 }
          : c
      )
    );
    setInput("");
    try {
      // TODO: Replace with real API call: POST /chat/messages/:userId
      // await api.post(`/chat/messages/${activeContact.id}`, { text: newMsg.text });
      // For real-time: use Socket.io instead
      // socket.emit("send_message", { to: activeContact.id, text: newMsg.text });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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
    // Mark as read
    setContacts((prev) =>
      prev.map((c) => c.id === contact.id ? { ...c, unread: 0 } : c)
    );
    // TODO: Mark messages as read via API: PUT /chat/messages/:userId/read
    // api.put(`/chat/messages/${contact.id}/read`);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentMessages = activeContact ? (messages[activeContact.id] || []) : [];

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
          className={`flex-shrink-0 flex flex-col ${showContacts ? "flex" : "hidden"} md:flex w-full md:w-72`}
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
            {contactsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs" style={{ color: "#B2B2D2" }}>
                  {search ? "No contacts found" : "No conversations yet"}
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                  style={{
                    background: activeContact?.id === contact.id ? "rgba(255,192,133,0.08)" : "transparent",
                    borderLeft: activeContact?.id === contact.id ? "3px solid #FFC085" : "3px solid transparent",
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                      style={{ background: "rgba(255,192,133,0.1)" }}
                    >
                      {contact.img ? (
                        <img src={contact.img} alt={contact.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: "#FFC085" }}>
                          {contact.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                      style={{ background: contact.online ? "#4ade80" : "#555", borderColor: "#060834" }}
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
              ))
            )}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div className={`flex-1 flex flex-col ${showContacts ? "hidden md:flex" : "flex"}`}>

          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
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
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center"
                    style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                  >
                    {activeContact.img ? (
                      <img src={activeContact.img} alt={activeContact.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold" style={{ color: "#FFC085" }}>
                        {activeContact.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                    style={{ background: activeContact.online ? "#4ade80" : "#555", borderColor: "#060834" }}
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
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                  </div>
                ) : currentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <p className="text-3xl">💬</p>
                    <p className="text-sm font-medium text-white">Start the conversation</p>
                    <p className="text-xs" style={{ color: "#B2B2D2" }}>{"Say hi to " + activeContact.name + "!"}</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      {msg.sender === "them" && (
                        <div
                          className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mr-2 self-end flex items-center justify-center"
                          style={{ background: "rgba(255,192,133,0.1)" }}
                        >
                          {activeContact.img ? (
                            <img src={activeContact.img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                              {activeContact.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      )}
                      <div
                        className="max-w-xs px-4 py-2.5 rounded-2xl"
                        style={{
                          background: msg.sender === "me" ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                          borderBottomRightRadius: msg.sender === "me" ? "4px" : "16px",
                          borderBottomLeftRadius: msg.sender === "them" ? "4px" : "16px",
                        }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: msg.sender === "me" ? "white" : "#B2B2D2" }}>
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
                      {msg.sender === "me" && (
                        <div
                          className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ml-2 self-end flex items-center justify-center"
                          style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.3)" }}
                        >
                          {userPhoto ? (
                            <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                              {userName.charAt(0)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 flex items-center gap-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
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
            </>
          ) : (
            // No contact selected state
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-4xl">💬</p>
              <p className="text-sm font-medium text-white">Select a conversation</p>
              <p className="text-xs" style={{ color: "#B2B2D2" }}>Choose a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </TeenlancerLayout>
  );
}