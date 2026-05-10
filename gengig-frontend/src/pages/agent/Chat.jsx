import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import AgentLayout from "../../layouts/AgentLayout";
import api from "../../services/api";

let socket = null;

export default function AgentChat() {
    const location = useLocation();
    const currentUserId = localStorage.getItem("userId")
        || localStorage.getItem("id")
        || localStorage.getItem("_id")
        || "";

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [contactsLoading, setContactsLoading] = useState(true);
    const [contactsError, setContactsError] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [isTyping, setIsTyping] = useState(false);
    const [connected, setConnected] = useState(false);
    const [search, setSearch] = useState("");
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchUsers, setSearchUsers] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    const messagesEndRef = useRef(null);
    const typingTimerRef = useRef(null);
    const inputRef = useRef(null);
    const searchTimerRef = useRef(null);
    const pollTimerRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        socket = io("http://localhost:3000", {
            auth: { token },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 10000,
        });

        socket.on("connect", () => {
            setConnected(true);
            socket.emit("join", { userId: currentUserId });
        });
        socket.on("disconnect", () => setConnected(false));
        socket.on("connect_error", (err) => { console.error("Socket error:", err.message); setConnected(false); });

        socket.on("receive_message", (message) => {
            const senderId = message.senderId || message.sender?._id || message.sender;
            if (String(senderId) === String(currentUserId)) return;

            setMessages(prev => {
                const msgId = message._id || message.id;
                if (prev.find(m => (m._id || m.id) === msgId)) return prev;
                return [...prev, message];
            });
            setContacts(prev => prev.map(c => {
                return String(c._id || c.id) === String(senderId)
                    ? { ...c, lastMessage: message.content, lastTime: "Just now", unread: (c.unread || 0) + 1 }
                    : c;
            }));
        });

        socket.on("user_typing", ({ userId }) => setTypingUsers(prev => new Set([...prev, userId])));
        socket.on("user_stop_typing", ({ userId }) => setTypingUsers(prev => { const n = new Set(prev); n.delete(userId); return n; }));
        socket.on("user_online", ({ userId }) => {
            setOnlineUsers(prev => new Set([...prev, userId]));
            setContacts(prev => prev.map(c => String(c._id || c.id) === String(userId) ? { ...c, online: true } : c));
        });
        socket.on("user_offline", ({ userId }) => {
            setOnlineUsers(prev => { const n = new Set(prev); n.delete(userId); return n; });
            setContacts(prev => prev.map(c => String(c._id || c.id) === String(userId) ? { ...c, online: false } : c));
        });

        return () => { socket?.disconnect(); socket = null; };
    }, [currentUserId]);

    const fetchContacts = async () => {
        setContactsLoading(true);
        setContactsError(false);
        try {
            const res = await api.get("/chat/contacts");
            setContacts(res.data);
        } catch (err) {
            console.error("Failed to fetch contacts:", err);
            setContactsError(true);
            setContacts([]);
        } finally {
            setContactsLoading(false);
        }
    };

    useEffect(() => { fetchContacts(); }, []);

    useEffect(() => {
        if (location.state?.openContact && contacts.length > 0) {
            const contact = contacts.find(c =>
                String(c._id || c.id) === String(location.state.openContact._id || location.state.openContact.id)
            ) || location.state.openContact;
            selectContact(contact);
            window.history.replaceState({}, document.title);
        }
    }, [contacts, location.state]);

    useEffect(() => {
        if (location.state?.openContact && !contactsLoading && contacts.length === 0) {
            const contact = location.state.openContact;
            if (contact && (contact._id || contact.id)) {
                setContacts([{ ...contact, lastMessage: "", unread: 0 }]);
                selectContact(contact);
                window.history.replaceState({}, document.title);
            }
        }
    }, [contactsLoading]);

    const getContactId = (contact) => contact?._id || contact?.id || "";

    const selectContact = async (contact) => {
        setSelectedContact(contact);
        setMessages([]);
        setMessagesLoading(true);
        const cId = getContactId(contact);
        setContacts(prev => prev.map(c => getContactId(c) === cId ? { ...c, unread: 0 } : c));

        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;

        try {
            const res = await api.get(`/chat/messages/${cId}`);
            const myId = localStorage.getItem("userId");
            const mapped = res.data.map(msg => ({
                ...msg,
                isMine: String(msg.sender) === myId ||
                    String(msg.sender?._id) === myId ||
                    msg.isMine === true,
            }));
            setMessages(mapped);
            await api.put(`/chat/messages/${cId}/read`).catch(() => { });
        } catch (err) {
            console.error("Failed to fetch messages:", err);
            setMessages([]);
        } finally {
            setMessagesLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);

            if (!connected) {
                pollTimerRef.current = setInterval(async () => {
                    if (connected) {
                        clearInterval(pollTimerRef.current);
                        pollTimerRef.current = null;
                        return;
                    }
                    try {
                        const pollRes = await api.get(`/chat/messages/${cId}`);
                        const myId = localStorage.getItem("userId");
                        setMessages(pollRes.data.map(msg => ({
                            ...msg,
                            isMine: String(msg.sender) === myId ||
                                String(msg.sender?._id) === myId ||
                                msg.isMine === true,
                        })));
                    } catch { }
                }, 5000);
            }
        }
    };

    useEffect(() => { return () => clearInterval(pollTimerRef.current); }, [selectedContact]);

    const sendMessage = async () => {
        if (!input.trim() || !selectedContact || sending) return;
        const content = input.trim();
        setInput("");
        setSending(true);
        stopTyping();

        const cId = getContactId(selectedContact);
        const tempMsg = {
            id: "temp-" + Date.now(),
            senderId: currentUserId,
            receiverId: cId,
            content,
            createdAt: new Date().toISOString(),
            status: "sending",
            isMine: true,
        };
        setMessages(prev => [...prev, tempMsg]);

        try {

            const res = await api.post(`/chat/messages/${cId}`, { content });
            setMessages(prev => prev.map(m =>
                m.id === tempMsg.id ? { ...res.data, status: "sent", isMine: true } : m
            ));
            setContacts(prev => prev.map(c =>
                getContactId(c) === cId ? { ...c, lastMessage: content, lastTime: "Just now" } : c
            ));
        } catch (err) {
            console.error("Failed to send message:", err);
            setMessages(prev => prev.map(m =>
                m.id === tempMsg.id ? { ...m, status: "failed" } : m
            ));
        } finally {
            setSending(false);
        }
    };

    const handleTyping = () => {
        if (!selectedContact || !socket) return;
        if (!isTyping) { setIsTyping(true); socket.emit("typing", { senderId: currentUserId, receiverId: getContactId(selectedContact) }); }
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => stopTyping(), 2000);
    };

    const stopTyping = () => {
        if (isTyping && socket && selectedContact) {
            setIsTyping(false);
            socket.emit("stop_typing", { senderId: currentUserId, receiverId: getContactId(selectedContact) });
        }
        clearTimeout(typingTimerRef.current);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const handleSearchUsers = (query) => {
        setSearchUsers(query);
        setSearchResults([]);
        if (!query.trim()) return;
        clearTimeout(searchTimerRef.current);
        setSearchingUsers(true);
        searchTimerRef.current = setTimeout(async () => {
            try {
                const res = await api.get(`/users/agents?search=${encodeURIComponent(query)}&limit=10`);
                setSearchResults(res.data);
            } catch (err) {
                console.error("Failed to search:", err);
                setSearchResults([]);
            } finally {
                setSearchingUsers(false);
            }
        }, 400);
    };

    const startNewConversation = async (user) => {
        const userId = getContactId(user);
        try { await api.post("/chat/conversations", { userId }); } catch { }
        setShowNewChat(false); setSearchUsers(""); setSearchResults([]);
        if (!contacts.find(c => getContactId(c) === userId))
            setContacts(prev => [{ ...user, lastMessage: "", unread: 0 }, ...prev]);
        selectContact(user);
    };

    const closeNewChat = () => { setShowNewChat(false); setSearchUsers(""); setSearchResults([]); };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        try { return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }
        catch { return ""; }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const d = new Date(dateStr), today = new Date(), yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (d.toDateString() === today.toDateString()) return "Today";
            if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch { return ""; }
    };

    const groupedMessages = messages.reduce((groups, msg) => {
        const date = formatDate(msg.createdAt);
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
        return groups;
    }, {});
    const filteredContacts = contacts.filter(c => !search.trim() || c.name?.toLowerCase().includes(search.toLowerCase()));
    const totalUnread = contacts.reduce((s, c) => s + (c.unread || 0), 0);
    const isContactTyping = selectedContact && typingUsers.has(getContactId(selectedContact));

    return (
        <AgentLayout>
            <div className="rounded-2xl overflow-hidden flex"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", height: "calc(100vh - 180px)", minHeight: "500px" }}>

                {/* ── Sidebar ── */}
                <div className={`flex flex-col flex-shrink-0 ${selectedContact ? "hidden md:flex" : "flex"}`}
                    style={{ width: "300px", borderRight: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>

                    <div className="p-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h2 className="text-white font-semibold text-sm">Messages</h2>
                                {totalUnread > 0 && (
                                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                                        style={{ background: "#FFC085", color: "#060834" }}>
                                        {totalUnread > 9 ? "9+" : totalUnread}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: connected ? "#4ade80" : "#f87171" }} />
                                <span className="text-xs" style={{ color: "#B2B2D2" }}>{connected ? "Online" : "Offline"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-2"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search contacts..."
                                className="flex-1 bg-transparent text-white text-xs outline-none" />
                            {search && <button onClick={() => setSearch("")} style={{ color: "#B2B2D2" }}>✕</button>}
                        </div>

                        <button onClick={() => setShowNewChat(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
                            style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New Conversation
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {contactsLoading ? (
                            <div className="flex flex-col gap-3 p-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 animate-pulse">
                                        <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
                                        <div className="flex-1">
                                            <div className="h-3 rounded-full w-2/3 mb-1.5" style={{ background: "rgba(255,255,255,0.08)" }} />
                                            <div className="h-2.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.05)" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : contactsError ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <p className="text-sm font-medium text-white mb-1">Couldn't load chats</p>
                                <p className="text-xs mb-3" style={{ color: "#B2B2D2" }}>Server error — tap retry</p>
                                <button onClick={fetchContacts}
                                    className="text-xs px-3 py-1.5 rounded-full hover:opacity-80 mb-2"
                                    style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085", border: "1px solid rgba(255,192,133,0.2)" }}>
                                    Retry
                                </button>
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <p className="text-sm font-medium text-white mb-1">
                                    {search ? "No contacts found" : "No conversations yet"}
                                </p>
                                <p className="text-xs mb-3" style={{ color: "#B2B2D2" }}>
                                    {search ? "Try a different name" : "Accept applications to start chatting"}
                                </p>
                            </div>
                        ) : (
                            filteredContacts.map(contact => {
                                const cId = getContactId(contact);
                                const selectedId = getContactId(selectedContact);
                                return (
                                    <button key={cId} onClick={() => selectContact(contact)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                                        style={{
                                            background: cId === selectedId ? "rgba(255,192,133,0.08)" : "transparent",
                                            borderLeft: cId === selectedId ? "2px solid #FFC085" : "2px solid transparent",
                                        }}>
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                                                style={{ background: "rgba(255,192,133,0.15)", border: "1.5px solid rgba(255,192,133,0.3)" }}>
                                                {contact.photo ? (
                                                    <img src={contact.photo} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold" style={{ color: "#FFC085" }}>
                                                        {contact.name?.charAt(0) || "?"}
                                                    </span>
                                                )}
                                            </div>
                                            {(onlineUsers.has(cId) || contact.online) && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                                                    style={{ background: "#4ade80", borderColor: "#090c28" }} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-white truncate">{contact.name}</p>
                                                {contact.lastTime && (
                                                    <span className="text-xs flex-shrink-0 ml-1" style={{ color: "#B2B2D2" }}>{contact.lastTime}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs truncate" style={{ color: "#B2B2D2" }}>
                                                    {typingUsers.has(cId)
                                                        ? <span style={{ color: "#4ade80" }}>typing...</span>
                                                        : (contact.lastMessage || "Start a conversation")}
                                                </p>
                                                {contact.unread > 0 && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 font-bold"
                                                        style={{ background: "#FFC085", color: "#060834", fontSize: "9px" }}>
                                                        {contact.unread > 9 ? "9+" : contact.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Chat Area ── */}
                <div className={`flex flex-col flex-1 min-w-0 ${selectedContact ? "flex" : "hidden md:flex"}`}>
                    {!selectedContact ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                                style={{ background: "rgba(255,192,133,0.1)", border: "2px solid rgba(255,192,133,0.2)" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Select a conversation</h3>
                            <p className="text-sm mb-4" style={{ color: "#B2B2D2" }}>
                                Choose a contact from the left or start a new conversation
                            </p>
                            <button onClick={() => setShowNewChat(true)}
                                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                + New Conversation
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                                <button onClick={() => setSelectedContact(null)}
                                    className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 flex-shrink-0"
                                    style={{ color: "#FFC085" }}>←</button>
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                                        style={{ background: "rgba(255,192,133,0.15)", border: "2px solid rgba(255,192,133,0.3)" }}>
                                        {selectedContact.photo ? (
                                            <img src={selectedContact.photo} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold" style={{ color: "#FFC085" }}>
                                                {selectedContact.name?.charAt(0) || "?"}
                                            </span>
                                        )}
                                    </div>
                                    {(onlineUsers.has(getContactId(selectedContact)) || selectedContact.online) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                                            style={{ background: "#4ade80", borderColor: "#090c28" }} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm">{selectedContact.name}</p>
                                    <p className="text-xs" style={{ color: isContactTyping ? "#4ade80" : "#B2B2D2" }}>
                                        {isContactTyping ? "typing..."
                                            : (onlineUsers.has(getContactId(selectedContact)) || selectedContact.online) ? "Online" : "Offline"}
                                    </p>
                                </div>
                                {!connected && (
                                    <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                                        style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                                        Reconnecting...
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
                                {messagesLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-8 h-8 rounded-full border-2 animate-spin"
                                            style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <p className="text-white font-semibold mb-1">Say hello!</p>
                                        <p className="text-sm" style={{ color: "#B2B2D2" }}>Start a conversation with {selectedContact.name}</p>
                                    </div>
                                ) : (
                                    Object.entries(groupedMessages).map(([date, msgs]) => (
                                        <div key={date}>
                                            <div className="flex items-center gap-3 my-4">
                                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                                                <span className="text-xs px-3 py-1 rounded-full"
                                                    style={{ background: "rgba(255,255,255,0.06)", color: "#B2B2D2" }}>{date}</span>
                                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                                            </div>
                                            {msgs.map((msg, i) => {
                                                const isMine =
                                                    msg.isMine === true ||
                                                    String(msg.senderId) === String(currentUserId) ||
                                                    String(msg.sender?._id) === String(currentUserId) ||
                                                    String(msg.sender) === String(currentUserId);

                                                const prevSender = String(msgs[i - 1]?.senderId || msgs[i - 1]?.sender?._id || msgs[i - 1]?.sender || "");
                                                const curSender = String(msg.senderId || msg.sender?._id || msg.sender || "");
                                                const showAvatar = !isMine && (i === 0 || prevSender !== curSender);

                                                return (
                                                    <div key={msg._id || msg.id}
                                                        className={`flex items-end gap-2 mb-1 ${isMine ? "justify-end" : "justify-start"}`}>
                                                        {!isMine && (
                                                            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                                                                style={{
                                                                    background: showAvatar ? "rgba(255,192,133,0.2)" : "transparent",
                                                                    border: showAvatar ? "1px solid rgba(255,192,133,0.3)" : "none",
                                                                    visibility: showAvatar ? "visible" : "hidden",
                                                                }}>
                                                                {showAvatar && (
                                                                    <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                                                                        {selectedContact.name?.charAt(0)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col gap-0.5 max-w-xs sm:max-w-sm"
                                                            style={{ alignItems: isMine ? "flex-end" : "flex-start" }}>
                                                            <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                                                                style={{
                                                                    background: isMine ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.08)",
                                                                    color: isMine ? "white" : "#B2B2D2",
                                                                    borderBottomRightRadius: isMine ? "4px" : "16px",
                                                                    borderBottomLeftRadius: isMine ? "16px" : "4px",
                                                                    opacity: msg.status === "sending" ? 0.7 : 1,
                                                                }}>
                                                                {msg.content}
                                                            </div>
                                                            <div className="flex items-center gap-1 px-1">
                                                                <span className="text-xs" style={{ color: "rgba(178,178,210,0.5)" }}>
                                                                    {formatTime(msg.createdAt)}
                                                                </span>
                                                                {isMine && (
                                                                    <span className="text-xs font-medium"
                                                                        style={{
                                                                            color: msg.isRead ? "#60a5fa"              
                                                                                : msg.isDelivered ? "rgba(178,178,210,0.7)" 
                                                                                    : msg.status === "sending" ? "rgba(178,178,210,0.4)"
                                                                                        : msg.status === "failed" ? "#f87171"
                                                                                            : "rgba(178,178,210,0.5)",
                                                                        }}>
                                                                        {msg.status === "sending" ? "⏳"
                                                                            : msg.status === "failed" ? "✕"
                                                                                : msg.isRead ? "✓✓" 
                                                                                    : msg.isDelivered ? "✓✓"  
                                                                                        : "✓"}  
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                                {isContactTyping && (
                                    <div className="flex items-end gap-2 mb-1 justify-start">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center"
                                            style={{ background: "rgba(255,192,133,0.2)", border: "1px solid rgba(255,192,133,0.3)" }}>
                                            <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                                                {selectedContact.name?.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl"
                                            style={{ background: "rgba(255,255,255,0.08)", borderBottomLeftRadius: "4px" }}>
                                            <div className="flex gap-1 items-center">
                                                {[0, 1, 2].map(i => (
                                                    <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                                        style={{ background: "#FFC085", animationDelay: `${i * 0.15}s` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="flex items-center gap-3 p-4 flex-shrink-0"
                                style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                                <input ref={inputRef} type="text" value={input}
                                    onChange={e => { setInput(e.target.value); handleTyping(); }}
                                    onKeyDown={handleKeyDown} onBlur={stopTyping}
                                    placeholder={`Message ${selectedContact.name}...`}
                                    className="flex-1 rounded-full px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085]"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <button onClick={sendMessage} disabled={!input.trim() || sending}
                                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-40 flex-shrink-0"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                    {sending ? (
                                        <div className="w-4 h-4 rounded-full border-2 animate-spin"
                                            style={{ borderColor: "white", borderTopColor: "transparent" }} />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeNewChat} />
                    <div className="relative w-full max-w-md rounded-2xl overflow-hidden z-10"
                        style={{ background: "#0a0d2e", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <div className="flex items-center justify-between p-5"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <h3 className="text-white font-semibold">New Conversation</h3>
                            <button onClick={closeNewChat}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
                                style={{ color: "#B2B2D2" }}>✕</button>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" value={searchUsers}
                                    onChange={e => handleSearchUsers(e.target.value)}
                                    placeholder="Search teenlancers by name..."
                                    className="flex-1 bg-transparent text-white text-sm outline-none"
                                    autoFocus />
                                {searchUsers && (
                                    <button onClick={() => { setSearchUsers(""); setSearchResults([]); }} style={{ color: "#B2B2D2" }}>✕</button>
                                )}
                            </div>
                        </div>
                        <div className="px-4 pb-4 max-h-72 overflow-y-auto">
                            {searchingUsers ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-6 h-6 rounded-full border-2 animate-spin"
                                        style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {searchResults.map(user => (
                                        <button key={getContactId(user)} onClick={() => startNewConversation(user)}
                                            className="flex items-center gap-3 p-3 rounded-xl w-full text-left hover:bg-white/5"
                                            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ background: "rgba(255,192,133,0.15)", border: "2px solid rgba(255,192,133,0.3)" }}>
                                                {user.photo ? (
                                                    <img src={user.photo} alt="" className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <span className="font-bold text-sm" style={{ color: "#FFC085" }}>{user.name?.charAt(0) || "?"}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                                {user.skills?.length > 0 && (
                                                    <p className="text-xs truncate" style={{ color: "#B2B2D2" }}>{user.skills.slice(0, 2).join(", ")}</p>
                                                )}
                                            </div>
                                            <span className="text-xs flex-shrink-0" style={{ color: "#FFC085" }}>Message →</span>
                                        </button>
                                    ))}
                                </div>
                            ) : searchUsers.trim() ? (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <p className="text-sm font-medium text-white mb-1">No results found</p>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Try a different name</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <p className="text-sm font-medium text-white mb-1">Find someone to chat with</p>
                                    <p className="text-xs" style={{ color: "#B2B2D2" }}>Type a name to search</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AgentLayout>
    );
}