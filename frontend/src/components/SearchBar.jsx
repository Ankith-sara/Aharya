import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Clock } from 'lucide-react';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, products } = useContext(ShopContext) || {};
    const [visible, setVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchInputRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Generate suggestions based on search input
    useEffect(() => {
        if (search && search.length > 1 && products) {
            const filtered = products
                .filter(product =>
                    product.name.toLowerCase().includes(search.toLowerCase()) ||
                    product.category.toLowerCase().includes(search.toLowerCase()) ||
                    product.subCategory?.toLowerCase().includes(search.toLowerCase())
                )
                .slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [search, products]);

    const handleSearch = (value) => {
        setSearch?.(value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            // Save to recent searches
            const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (product) => {
        setSearch?.(product.name);
        setShowSuggestions(false);
        navigate(`/product/${product._id}`);
    };

    const handleRecentSearchClick = (searchTerm) => {
        setSearch?.(searchTerm);
        searchInputRef.current?.focus();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const handleClose = () => {
        setShowSearch?.(false);
        setSearch?.('');
        setShowSuggestions(false);
    };

    if (!showSearch || !visible) return null;

    return (
        <div className="mt-20 mb-[-75px] border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
            <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-300 text-base"
                                    value={search || ''}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Search for products, categories, brands..."
                                    aria-label="Search"
                                />
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto z-50">
                                    {/* Recent Searches */}
                                    {!search && recentSearches.length > 0 && (
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-gray-500" />
                                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Searches</h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearRecentSearches}
                                                    className="text-xs text-gray-500 hover:text-black uppercase tracking-wide"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {recentSearches.map((term, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleRecentSearchClick(term)}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 text-sm"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Clock size={14} className="text-gray-400" />
                                                            <span className="text-gray-700">{term}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Suggestions */}
                                    {search && suggestions.length > 0 && (
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Products</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {suggestions.map((product) => (
                                                    <button
                                                        key={product._id}
                                                        type="button"
                                                        onClick={() => handleSuggestionClick(product)}
                                                        className="w-full text-left p-3 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={product.images?.[0]}
                                                                alt={product.name}
                                                                className="w-12 h-full object-contain border border-gray-200"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-black truncate uppercase tracking-wide">
                                                                    {product.name}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
                                                                    <span className="text-xs text-gray-400">•</span>
                                                                    <span className="text-xs font-medium text-black">₹{product.price}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {search && suggestions.length === 0 && (
                                        <div className="p-8 text-center">
                                            <Search className="mx-auto text-gray-300 mb-3" size={32} />
                                            <p className="text-sm text-gray-600 font-light">No products found for "{search}"</p>
                                            <p className="text-xs text-gray-500 mt-2 font-light">Try different keywords</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-4 border-2 border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-300"
                            aria-label="Close search"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Click outside to close suggestions */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
};

export default SearchBar;