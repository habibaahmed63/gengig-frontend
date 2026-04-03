import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeenlancerLayout from "../../layouts/TeenlancerLayout";
import api from "../../services/api";

const allTags = ["All", "Tips", "Design", "Branding", "VideoEditing", "Portfolio", "Mindset", "Freelancing", "ClientWork", "Advice", "Creative"];

export default function Community() {
    const navigate = useNavigate();

    // User data from localStorage
    const userName = localStorage.getItem("name") || "You";
    const userPhoto = localStorage.getItem("photo") || null;
    const userRole = localStorage.getItem("role") || "Teenlancer";

    // Posts state
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);

    // Sidebar state
    const [activeMembers, setActiveMembers] = useState([]);
    const [trendingTags, setTrendingTags] = useState([]);

    // UI state
    const [activeTag, setActiveTag] = useState("All");
    const [newPost, setNewPost] = useState({ content: "", image: null, imagePreview: null });
    const [newTags, setNewTags] = useState("");
    const [commentInputs, setCommentInputs] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [showCommentInput, setShowCommentInput] = useState({});
    const [postLoading, setPostLoading] = useState(false);

    useEffect(() => {
        const fetchCommunityData = async () => {
            setPostsLoading(true);
            try {
                const [postsRes, membersRes, tagsRes] = await Promise.all([
                    api.get("/community/posts"),
                    api.get("/community/active-members"),
                    api.get("/community/trending-tags"),
                ]);
                setPosts(postsRes.data);
                setActiveMembers(membersRes.data);
                setTrendingTags(tagsRes.data);

            } catch (err) {
                console.error("Failed to fetch community data:", err);
            } finally {
                setPostsLoading(false);
            }
        };
        fetchCommunityData();
    }, []);

    const handleLike = async (id) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                    : p
            )
        );
        try {
            await api.post(`/community/posts/${id}/like`);
        } catch (err) {
            console.error("Failed to like post:", err);
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                        : p
                )
            );
        }
    };

    const handleComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text || !text.trim()) return;
        const newComment = {
            id: Date.now(),
            user: {
                name: userName,
                img: userPhoto || null,
            },
            text,
        };
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId
                    ? { ...p, comments: [...p.comments, newComment] }
                    : p
            )
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        setExpandedComments((prev) => ({ ...prev, [postId]: true }));
        try {
            await api.post(`/community/posts/${postId}/comment`, { text });
        } catch (err) {
            console.error("Failed to post comment:", err);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setNewPost((prev) => ({ ...prev, image: file, imagePreview: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.content.trim()) return;
        setPostLoading(true);
        const tags = newTags.split(",").map((t) => t.trim()).filter(Boolean);
        const optimisticPost = {
            id: Date.now(),
            user: { name: userName, role: userRole, img: userPhoto || null },
            content: newPost.content,
            image: newPost.imagePreview || null,
            tags,
            likes: 0,
            comments: [],
            time: "Just now",
            liked: false,
        };
        setPosts((prev) => [optimisticPost, ...prev]);
        setNewPost({ content: "", image: null, imagePreview: null });
        setNewTags("");
        try {
            const formData = new FormData();
            formData.append("content", newPost.content);
            formData.append("tags", JSON.stringify(tags));
            if (newPost.image) formData.append("image", newPost.image);
            const response = await api.post("/community/posts", formData);
            setPosts((prev) => prev.map((p) => p.id === optimisticPost.id ? response.data : p));
        } catch (err) {
            console.error("Failed to create post:", err);
            setPosts((prev) => prev.filter((p) => p.id !== optimisticPost.id));
        } finally {
            setPostLoading(false);
        }
    };

    const filtered = activeTag === "All"
        ? posts
        : posts.filter((p) => p.tags.includes(activeTag));

    return (
        <TeenlancerLayout>
            <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                Home › <span style={{ color: "#FFC085" }}>Community Hub</span>
            </p>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* ── Main Feed ── */}
                <div className="flex-1 flex flex-col gap-5">

                    {/* Heading */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-white font-bold" style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}>
                            Community <span className="text-gradient">Hub</span>
                        </h1>
                        <button
                            onClick={() => navigate("/teenlancer/chat")}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 hover:scale-105 transition-all duration-200"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)", color: "white" }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                        </button>
                    </div>

                    {/* Create Post */}
                    <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-start gap-3">
                            {/* User avatar */}
                            <div
                                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                                style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                            >
                                {userPhoto ? (
                                    <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <textarea
                                value={newPost.content}
                                onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                                placeholder={"Share a tip, project or update with the community, " + userName.split(" ")[0] + "..."}
                                rows={3}
                                className="flex-1 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#FFC085] resize-none"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                        </div>

                        {newPost.imagePreview && (
                            <div className="relative ml-12">
                                <img src={newPost.imagePreview} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                                <button
                                    onClick={() => setNewPost((prev) => ({ ...prev, image: null, imagePreview: null }))}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                    style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <div className="ml-12 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <input
                                type="text"
                                value={newTags}
                                onChange={(e) => setNewTags(e.target.value)}
                                placeholder="Tags: Design, Tips (comma separated)"
                                className="flex-1 rounded-xl px-3 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-[#FFC085]"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                            <div className="flex items-center gap-2">
                                <label className="cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: "#B2B2D2" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPost.content.trim() || postLoading}
                                    className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    {postLoading ? "Posting..." : "Post"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tag Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
                                style={{
                                    background: activeTag === tag ? "linear-gradient(90deg, #FFC085, #e8a060)" : "rgba(255,255,255,0.05)",
                                    color: activeTag === tag ? "white" : "#B2B2D2",
                                    border: activeTag === tag ? "none" : "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                {tag === "All" ? "All" : "#" + tag}
                            </button>
                        ))}
                    </div>

                    {/* Posts List */}
                    {postsLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                            <p className="text-sm" style={{ color: "#B2B2D2" }}>Loading posts...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-16 rounded-2xl"
                            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
                        >
                            <p className="text-3xl mb-3">📭</p>
                            <p className="text-sm font-medium text-white mb-1">No posts yet</p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>
                                {activeTag === "All" ? "Be the first to post something!" : "No posts with #" + activeTag + " yet."}
                            </p>
                        </div>
                    ) : (
                        filtered.map((post) => (
                            <div
                                key={post.id}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="p-5">
                                    {/* Post Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                                            style={{ border: "2px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                                        >
                                            {post.user.img ? (
                                                <img src={post.user.img} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold" style={{ color: "#FFC085" }}>
                                                    {post.user.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-semibold">{post.user.name}</p>
                                            <div className="flex items-center gap-2">
                                                {post.user.role && <p className="text-xs" style={{ color: "#FFC085" }}>{post.user.role}</p>}
                                                <span style={{ color: "#B2B2D2" }}>·</span>
                                                <p className="text-xs" style={{ color: "#B2B2D2" }}>{post.time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#B2B2D2" }}>{post.content}</p>

                                    {post.image && (
                                        <img src={post.image} alt="" className="w-full h-52 object-cover rounded-xl mb-4" />
                                    )}

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setActiveTag(tag)}
                                                    className="text-xs px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                                                    style={{ background: "rgba(255,192,133,0.1)", color: "#FFC085" }}
                                                >
                                                    {"#" + tag}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
                                            style={{ color: post.liked ? "#FFC085" : "#B2B2D2" }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={post.liked ? "#FFC085" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {post.likes}
                                        </button>
                                        <button
                                            onClick={() => setShowCommentInput((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                                            className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
                                            style={{ color: "#B2B2D2" }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            {post.comments.length}
                                        </button>
                                    </div>
                                </div>

                                {/* Comments */}
                                {(showCommentInput[post.id] || post.comments.length > 0) && (
                                    <div className="px-5 pb-5 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                        {post.comments.length > 0 && (
                                            <div className="pt-3 flex flex-col gap-3">
                                                {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((c) => (
                                                    <div key={c.id} className="flex items-start gap-2">
                                                        <div
                                                            className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                                                            style={{ background: "rgba(255,192,133,0.1)", border: "1px solid rgba(255,192,133,0.2)" }}
                                                        >
                                                            {c.user.img ? (
                                                                <img src={c.user.img} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                                                                    {c.user.name.charAt(0)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                            <p className="text-xs font-semibold text-white mb-0.5">{c.user.name}</p>
                                                            <p className="text-xs" style={{ color: "#B2B2D2" }}>{c.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {post.comments.length > 2 && !expandedComments[post.id] && (
                                                    <button
                                                        onClick={() => setExpandedComments((prev) => ({ ...prev, [post.id]: true }))}
                                                        className="text-xs ml-9 text-left hover:opacity-80 transition-opacity"
                                                        style={{ color: "#FFC085" }}
                                                    >
                                                        {"View " + (post.comments.length - 2) + " more comments"}
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {showCommentInput[post.id] && (
                                            <div className="flex items-center gap-2 pt-1">
                                                <div
                                                    className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                                                    style={{ border: "1px solid #FFC085", background: "rgba(255,192,133,0.1)" }}
                                                >
                                                    {userPhoto ? (
                                                        <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                                                            {userName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={commentInputs[post.id] || ""}
                                                    onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleComment(post.id); }}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 rounded-full px-4 py-2 text-white text-xs outline-none focus:ring-1 focus:ring-[#FFC085]"
                                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                                                />
                                                <button
                                                    onClick={() => handleComment(post.id)}
                                                    className="p-2 rounded-full hover:opacity-80 transition-opacity"
                                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* ── Right Sidebar ── */}
                <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-5">

                    {/* Active Members */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h3 className="text-white font-semibold mb-4 text-sm">Active Members</h3>
                        {activeMembers.length === 0 ? (
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>No active members right now</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {activeMembers.map((member) => (
                                    <div key={member.id || member.name} className="flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
                                                style={{ background: "rgba(255,192,133,0.1)" }}
                                            >
                                                {member.img ? (
                                                    <img src={member.img} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold" style={{ color: "#FFC085" }}>
                                                        {member.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <span
                                                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                                                style={{ background: member.online ? "#4ade80" : "#B2B2D2", borderColor: "#0a0d2e" }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-xs font-medium truncate">{member.name}</p>
                                            {member.role && <p className="text-xs truncate" style={{ color: "#B2B2D2" }}>{member.role}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Trending Tags */}
                    <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <h3 className="text-white font-semibold mb-4 text-sm">Trending Tags</h3>
                        {trendingTags.length === 0 ? (
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>No trending tags yet</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {trendingTags.map((item) => (
                                    <button
                                        key={item.tag}
                                        onClick={() => setActiveTag(item.tag)}
                                        className="flex items-center justify-between hover:opacity-80 transition-opacity"
                                    >
                                        <span className="text-sm" style={{ color: "#FFC085" }}>{"#" + item.tag}</span>
                                        <span className="text-xs" style={{ color: "#B2B2D2" }}>{item.count + " posts"}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Go to Chat */}
                    <button
                        onClick={() => navigate("/teenlancer/chat")}
                        className="p-5 rounded-2xl flex items-center gap-3 hover:opacity-90 hover:scale-105 transition-all duration-200 w-full text-left"
                        style={{ background: "linear-gradient(135deg, rgba(255,192,133,0.15), rgba(232,160,96,0.1))", border: "1px solid rgba(255,192,133,0.2)" }}
                    >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,192,133,0.2)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FFC085" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">Community Chat</p>
                            <p className="text-xs" style={{ color: "#B2B2D2" }}>Chat with other teenlancers</p>
                        </div>
                    </button>
                </div>
            </div>
        </TeenlancerLayout>
    );
}