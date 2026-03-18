import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const allGigs = [
    { id: 1, title: "Brand Identity Design", category: "Graphic Design", budget: "$150", rating: 4.9, reviews: 23, img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400", badge: "Top Rated", agent: "Khaled Ramzy" },
    { id: 2, title: "Social Media Campaign", category: "Marketing", budget: "$200", rating: 4.8, reviews: 18, img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400", badge: "Popular", agent: "Sara Ahmed" },
    { id: 3, title: "Mobile App UI Design", category: "UI/UX", budget: "$300", rating: 5.0, reviews: 31, img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400", badge: "New", agent: "Omar Hassan" },
    { id: 4, title: "Product Video Edit", category: "Video Editing", budget: "$180", rating: 4.7, reviews: 15, img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400", badge: "Top Rated", agent: "Mariam Fathy" },
    { id: 5, title: "Logo Design & Branding", category: "Logo Design", budget: "$120", rating: 4.6, reviews: 10, img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400", badge: "Popular", agent: "Ahmed Karim" },
    { id: 6, title: "Instagram Content Creation", category: "Social Media", budget: "$90", rating: 4.5, reviews: 8, img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400", badge: "New", agent: "Nour Salem" },
    { id: 7, title: "Website Landing Page", category: "Web Development", budget: "$250", rating: 4.8, reviews: 20, img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400", badge: "Top Rated", agent: "Khaled Ramzy" },
    { id: 8, title: "Photography & Editing", category: "Photography", budget: "$130", rating: 4.9, reviews: 27, img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400", badge: "Popular", agent: "Sara Ahmed" },
];

const categories = ["All", "Graphic Design", "Marketing", "UI/UX", "Video Editing", "Logo Design", "Social Media", "Web Development", "Photography"];
const budgetRanges = ["All", "Under $100", "$100 - $200", "$200 - $300", "Above $300"];
const sortOptions = ["Most Relevant", "Highest Rated", "Lowest Budget", "Highest Budget", "Most Reviews"];

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [search, setSearch] = useState(query);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeBudget, setActiveBudget] = useState("All");
    const [sortBy, setSortBy] = useState("Most Relevant");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: search });
    };

    const filterByBudget = (gig) => {
        const budget = parseInt(gig.budget.replace("$", ""));
        if (activeBudget === "All") return true;
        if (activeBudget === "Under $100") return budget < 100;
        if (activeBudget === "$100 - $200") return budget >= 100 && budget <= 200;
        if (activeBudget === "$200 - $300") return budget > 200 && budget <= 300;
        if (activeBudget === "Above $300") return budget > 300;
        return true;
    };

    const filtered = allGigs
        .filter((g) => {
            const matchesQuery =
                query === "" ||
                g.title.toLowerCase().includes(query.toLowerCase()) ||
                g.category.toLowerCase().includes(query.toLowerCase()) ||
                g.agent.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = activeCategory === "All" || g.category === activeCategory;
            return matchesQuery && matchesCategory && filterByBudget(g);
        })
        .sort((a, b) => {
            if (sortBy === "Highest Rated") return b.rating - a.rating;
            if (sortBy === "Most Reviews") return b.reviews - a.reviews;
            if (sortBy === "Lowest Budget") return parseInt(a.budget.replace("$", "")) - parseInt(b.budget.replace("$", ""));
            if (sortBy === "Highest Budget") return parseInt(b.budget.replace("$", "")) - parseInt(a.budget.replace("$", ""));
            return 0;
        });

    return (
        <div style={{ background: "#060834" }}>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div
                        className="flex items-center gap-3 rounded-full px-5 py-3 max-w-2xl mx-auto"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#B2B2D2" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search gigs, categories, agents..."
                            className="flex-1 bg-transparent text-white text-sm outline-none"
                        />
                        <button
                            type="submit"
                            className="px-4 py-1.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-white font-bold mb-1" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
                            {query ? (
                                <>Results for <span className="text-gradient">"{query}"</span></>
                            ) : (
                                "All Gigs"
                            )}
                        </h1>
                        <p className="text-xs" style={{ color: "#B2B2D2" }}>
                            {filtered.length + " gig" + (filtered.length !== 1 ? "s" : "") + " found"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-xl px-3 py-2 text-white text-xs outline-none"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt} style={{ background: "#060834" }}>{opt}</option>
                            ))}
                        </select>

                        {/* Filter Toggle (mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors sm:hidden"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#B2B2D2" }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            Filters
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">

                    {/* Filters Sidebar */}
                    <div
                        className={`w-full sm:w-52 flex-shrink-0 flex-col gap-5 ${showFilters ? "flex" : "hidden sm:flex"}`}
                    >
                        {/* Category Filter */}
                        <div
                            className="p-4 rounded-2xl"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <h3 className="text-white font-semibold text-sm mb-3">Category</h3>
                            <div className="flex flex-col gap-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className="text-left text-xs px-3 py-2 rounded-lg transition-colors"
                                        style={{
                                            background: activeCategory === cat ? "rgba(255,192,133,0.15)" : "transparent",
                                            color: activeCategory === cat ? "#FFC085" : "#B2B2D2",
                                            fontWeight: activeCategory === cat ? "600" : "400",
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget Filter */}
                        <div
                            className="p-4 rounded-2xl"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <h3 className="text-white font-semibold text-sm mb-3">Budget</h3>
                            <div className="flex flex-col gap-1">
                                {budgetRanges.map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setActiveBudget(range)}
                                        className="text-left text-xs px-3 py-2 rounded-lg transition-colors"
                                        style={{
                                            background: activeBudget === range ? "rgba(255,192,133,0.15)" : "transparent",
                                            color: activeBudget === range ? "#FFC085" : "#B2B2D2",
                                            fontWeight: activeBudget === range ? "600" : "400",
                                        }}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(activeCategory !== "All" || activeBudget !== "All") && (
                            <button
                                onClick={() => { setActiveCategory("All"); setActiveBudget("All"); }}
                                className="text-xs px-4 py-2 rounded-full transition-colors hover:bg-white/10"
                                style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {filtered.length === 0 ? (
                            <div className="text-center py-16" style={{ color: "#B2B2D2" }}>
                                <p className="text-4xl mb-4">🔍</p>
                                <p className="text-sm mb-2">No gigs found for "{query}"</p>
                                <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
                                    Try different keywords or browse all categories
                                </p>
                                <Link
                                    to="/explore"
                                    className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                                    style={{ background: "linear-gradient(90deg, #FFC085, #e8a060)" }}
                                >
                                    Explore All Gigs
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filtered.map((gig) => (
                                    <Link
                                        key={gig.id}
                                        to={"/gig/" + gig.id}
                                        className="rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    >
                                        <div className="relative">
                                            <img
                                                src={gig.img}
                                                alt={gig.title}
                                                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: "linear-gradient(to top, rgba(6,8,52,0.6), transparent)" }}
                                            />
                                            <span
                                                className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold"
                                                style={{ background: "rgba(255,192,133,0.9)", color: "#060834" }}
                                            >
                                                {gig.badge}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs mb-1" style={{ color: "#FFC085" }}>{gig.category}</p>
                                            <h3 className="text-white font-semibold text-sm mb-1">{gig.title}</h3>
                                            <p className="text-xs mb-3" style={{ color: "#B2B2D2" }}>{"by " + gig.agent}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <span style={{ color: "#FFC085" }}>★</span>
                                                    <span className="text-xs text-white">{gig.rating}</span>
                                                    <span className="text-xs" style={{ color: "#B2B2D2" }}>{"(" + gig.reviews + ")"}</span>
                                                </div>
                                                <span className="text-sm font-bold" style={{ color: "#FFC085" }}>{gig.budget}</span>
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