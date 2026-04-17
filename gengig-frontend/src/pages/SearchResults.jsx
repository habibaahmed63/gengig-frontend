import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const categories = ["All", "Graphic Design", "Marketing", "UI/UX", "Video Editing", "Logo Design", "Social Media", "Web Development", "Photography"];
const budgetRanges = ["All", "Under $100", "$100 - $200", "$200 - $300", "Above $300"];
const sortOptions = ["Most Relevant", "Highest Rated", "Lowest Budget", "Highest Budget", "Most Reviews"];

const formatBudget = (budget) => {
    if (!budget) return "";
    const str = String(budget);
    return str.startsWith("$") ? str : `$${str}`;
};

export default function SearchResults() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [search, setSearch] = useState(query);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeBudget, setActiveBudget] = useState("All");
    const [sortBy, setSortBy] = useState("Most Relevant");
    const [showFilters, setShowFilters] = useState(false);

    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.append("search", query);
                const response = await api.get(`/gigs?${params.toString()}`);
                setGigs(response.data);
            } catch (err) {
                console.error("Failed to fetch search results:", err);
                setGigs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) setSearchParams({ q: search.trim() });
    };

    const filterByBudget = (gig) => {
        const budget = parseFloat(String(gig.budget).replace(/[^0-9.]/g, "")) || 0;
        if (activeBudget === "All") return true;
        if (activeBudget === "Under $100") return budget < 100;
        if (activeBudget === "$100 - $200") return budget >= 100 && budget <= 200;
        if (activeBudget === "$200 - $300") return budget > 200 && budget <= 300;
        if (activeBudget === "Above $300") return budget > 300;
        return true;
    };

    const filtered = gigs
        .filter((g) => {
            const matchesCategory = activeCategory === "All" || g.category === activeCategory;
            return matchesCategory && filterByBudget(g);
        })
        .sort((a, b) => {
            const budgetA = parseFloat(String(a.budget).replace(/[^0-9.]/g, "")) || 0;
            const budgetB = parseFloat(String(b.budget).replace(/[^0-9.]/g, "")) || 0;
            if (sortBy === "Highest Rated") return (b.rating || 0) - (a.rating || 0);
            if (sortBy === "Most Reviews") return (b.reviews || 0) - (a.reviews || 0);
            if (sortBy === "Lowest Budget") return budgetA - budgetB;
            if (sortBy === "Highest Budget") return budgetB - budgetA;
            return 0;
        });

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex items-center gap-3 rounded-full px-5 py-3 max-w-2xl mx-auto"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search gigs, categories, agents..."
                            className="flex-1 bg-transparent text-white text-sm outline-none" />
                        <button type="submit"
                            className="px-4 py-1.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                            Search
                        </button>
                    </div>
                </form>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-white font-bold mb-1" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
                            {query ? <>Results for <span className="text-gradient">"{query}"</span></> : "All Gigs"}
                        </h1>
                        <p className="text-xs" style={{ color: "#B2B2D2" }}>
                            {loading ? "Searching..." : `${filtered.length} gig${filtered.length !== 1 ? "s" : ""} found`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="rounded-xl px-3 py-2 text-white text-xs outline-none"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            {sortOptions.map(opt => (
                                <option key={opt} style={{ background: "#060834" }}>{opt}</option>
                            ))}
                        </select>
                        <button onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors sm:hidden"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#B2B2D2" }}>
                            Filters
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">

                    {/* Filters Sidebar */}
                    <div className={`w-full sm:w-52 flex-shrink-0 flex-col gap-5 ${showFilters ? "flex" : "hidden sm:flex"}`}>
                        <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <h3 className="text-white font-semibold text-sm mb-3">Category</h3>
                            <div className="flex flex-col gap-1">
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => setActiveCategory(cat)}
                                        className="text-left text-xs px-3 py-2 rounded-lg transition-colors"
                                        style={{
                                            background: activeCategory === cat ? "rgba(255,192,133,0.15)" : "transparent",
                                            color: activeCategory === cat ? "#FFC085" : "#B2B2D2",
                                            fontWeight: activeCategory === cat ? "600" : "400",
                                        }}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <h3 className="text-white font-semibold text-sm mb-3">Budget</h3>
                            <div className="flex flex-col gap-1">
                                {budgetRanges.map(range => (
                                    <button key={range} onClick={() => setActiveBudget(range)}
                                        className="text-left text-xs px-3 py-2 rounded-lg transition-colors"
                                        style={{
                                            background: activeBudget === range ? "rgba(255,192,133,0.15)" : "transparent",
                                            color: activeBudget === range ? "#FFC085" : "#B2B2D2",
                                            fontWeight: activeBudget === range ? "600" : "400",
                                        }}>
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(activeCategory !== "All" || activeBudget !== "All") && (
                            <button onClick={() => { setActiveCategory("All"); setActiveBudget("All"); }}
                                className="text-xs px-4 py-2 rounded-full transition-colors hover:bg-white/10"
                                style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-16">
                                <div className="w-10 h-10 rounded-full border-2 animate-spin"
                                    style={{ borderColor: "#FFC085", borderTopColor: "transparent" }} />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-16" style={{ color: "#B2B2D2" }}>
                                <p className="text-4xl mb-4">🔍</p>
                                <p className="text-sm mb-2">
                                    {query ? `No gigs found for "${query}"` : "No gigs available"}
                                </p>
                                <p className="text-xs mb-6">Try different keywords or browse all categories</p>
                                <Link to="/Exploreagig"
                                    className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}>
                                    Explore All Gigs
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filtered.map(gig => (
                                    <Link key={gig.id} to={`/gig/${gig.id}`}
                                        className="rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        {gig.img && (
                                            <div className="relative">
                                                <img src={gig.img} alt={gig.title}
                                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                <div className="absolute inset-0"
                                                    style={{ background: "linear-gradient(to top, rgba(6,8,52,0.6), transparent)" }} />
                                                {gig.badge && (
                                                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold"
                                                        style={{ background: "rgba(255,192,133,0.9)", color: "#060834" }}>
                                                        {gig.badge}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-4">
                                            {gig.category && <p className="text-xs mb-1" style={{ color: "#FFC085" }}>{gig.category}</p>}
                                            <h3 className="text-white font-semibold text-sm mb-1">{gig.title}</h3>
                                            {gig.agent?.name && (
                                                <p className="text-xs mb-3" style={{ color: "#B2B2D2" }}>by {gig.agent.name}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    {gig.rating && (
                                                        <>
                                                            <span style={{ color: "#FFC085" }}>★</span>
                                                            <span className="text-xs text-white">{gig.rating}</span>
                                                            {gig.reviews && (
                                                                <span className="text-xs" style={{ color: "#B2B2D2" }}>({gig.reviews})</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {gig.budget && (
                                                    <span className="text-sm font-bold" style={{ color: "#FFC085" }}>
                                                        {formatBudget(gig.budget)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}