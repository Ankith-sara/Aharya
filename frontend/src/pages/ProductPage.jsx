import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import {
  ShoppingBag, X, ChevronDown, GridIcon, ListIcon, Check, Heart, SlidersHorizontal, 
  TrendingUp, Star, ChevronUp, Tag, Building2, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import RecentlyViewed from '../components/RecentlyViewed';

const ProductPage = () => {
  const location = useLocation();
  const { subcategory, company } = useParams();
  const { category } = location.state || {};

  const { 
    products = [], 
    selectedSubCategory, 
    setSelectedSubCategory, 
    navigate, 
    currency, 
    addToWishlist, 
    removeFromWishlist, 
    wishlist = [] 
  } = useContext(ShopContext);

  // Enhanced state management
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
    features: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Company data mapping
  const companyLogos = {
    'vasudhaa vastrram vishram': 'https://brownliving.in/cdn/shop/collections/vasudhaa-vastrram-2557117.jpg?v=1755537249'
  };

  const getCompanyDisplayName = (companyName) => {
    return companyName ? companyName.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : '';
  };

  // Determine if this is a company page
  const isCompanyPage = !!company;
  const companyDisplayName = getCompanyDisplayName(company);
  const companyLogo = company ? (companyLogos[company.toLowerCase()] ||
    `https://via.placeholder.com/200x100/666666/FFFFFF?text=${companyDisplayName.split(' ').map(w => w[0]).join('')}`) : null;

  // Calculate price statistics
  const priceStats = products.length > 0 ? {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price)),
    avg: Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
  } : { min: 0, max: 10000, avg: 5000 };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 3) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 1) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (priceRange.min > priceStats.min || priceRange.max < priceStats.max) count++;
    if (showOnSale) count++;
    if (showNewArrivals) count++;
    if (sortOption !== 'relevant') count++;
    setActiveFiltersCount(count);
  }, [priceRange, sortOption, showOnSale, showNewArrivals, priceStats]);

  useEffect(() => {
    if (isCompanyPage) {
      document.title = `${companyDisplayName} Collection | Aharyas`;
    } else {
      document.title = `${getCollectionTitle()} | Aharyas`;
    }
  }, [selectedSubCategory, company, companyDisplayName, isCompanyPage]);

  // Enhanced filtering logic
  useEffect(() => {
    setIsLoading(true);
    let updatedProducts = [...products];

    if (isCompanyPage && company) {
      updatedProducts = updatedProducts.filter((product) => {
        const productCompany = product.company ? product.company.toLowerCase() : '';
        return productCompany === company.toLowerCase();
      });
    } else if (subcategory || selectedSubCategory) {
      const targetSubCategory = subcategory || selectedSubCategory;
      updatedProducts = updatedProducts.filter(
        (product) => product.subCategory === targetSubCategory
      );
    }

    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (showOnSale) {
      updatedProducts = updatedProducts.filter(
        (product) => product.onSale || product.discount > 0
      );
    }

    if (showNewArrivals) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      updatedProducts = updatedProducts.filter(
        (product) => new Date(product.createdAt || product.dateAdded) > thirtyDaysAgo
      );
    }

    updatedProducts.sort((a, b) => {
      switch (sortOption) {
        case 'low-high':
          return a.price - b.price;
        case 'high-low':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded);
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(updatedProducts);
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 300);
  }, [
    products, selectedSubCategory, subcategory, company, category, sortOption,
    priceRange, showOnSale, showNewArrivals, isCompanyPage
  ]);

  const clearFilters = () => {
    setPriceRange({ min: priceStats.min, max: priceStats.max });
    setSortOption('relevant');
    setShowOnSale(false);
    setShowNewArrivals(false);
  };

  const getCollectionTitle = () => {
    if (isCompanyPage && companyDisplayName) {
      return companyDisplayName.toUpperCase();
    }
    if (subcategory) return subcategory.toUpperCase();
    if (selectedSubCategory) return selectedSubCategory.toUpperCase();
    if (category) return category.toUpperCase();
    return "AHARYAS";
  };

  const getCollectionSubtitle = () => {
    if (isCompanyPage) {
      return `Discover ${filteredProducts.length} carefully curated piece${filteredProducts.length !== 1 ? 's' : ''} from ${companyDisplayName}`;
    }
    return `Discover ${filteredProducts.length} carefully curated piece${filteredProducts.length !== 1 ? 's' : ''}${(subcategory || selectedSubCategory) ? ` in ${(subcategory || selectedSubCategory).toLowerCase()}` : ''}`;
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, isExpanded, onToggle, children, icon: Icon }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-3 sm:py-4 px-0 flex justify-between items-center text-left font-medium text-xs sm:text-sm hover:text-black transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />}
          <span className="truncate">{title}</span>
        </div>
        {isExpanded ? <ChevronUp size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> : <ChevronDown size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />}
      </button>
      {isExpanded && (
        <div className="pb-3 sm:pb-4">
          <div className="w-6 sm:w-8 h-0.5 bg-black mb-3 sm:mb-4"></div>
          {children}
        </div>
      )}
    </div>
  );

  const FilterPanel = () => (
    <div className="bg-white border border-gray-200 shadow-lg">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-medium tracking-wide">FILTERS</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-black active:text-black transition-colors font-light"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6">
        {/* Price Range Filter */}
        <FilterSection
          title="PRICE RANGE"
          isExpanded={expandedFilters.price}
          onToggle={() => toggleFilterSection('price')}
          icon={Tag}
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-light">
              <span>{currency}{priceStats.min}</span>
              <span className="hidden sm:inline">AVG: {currency}{priceStats.avg}</span>
              <span>{currency}{priceStats.max}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  min={priceStats.min}
                  max={priceStats.max}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-light focus:border-black focus:outline-none transition-colors"
                  placeholder="Min"
                />
              </div>
              <span className="text-gray-400 font-light text-xs">—</span>
              <div className="flex-1">
                <input
                  type="number"
                  min={priceStats.min}
                  max={priceStats.max}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-light focus:border-black focus:outline-none transition-colors"
                  placeholder="Max"
                />
              </div>
            </div>
            {/* Quick price filters */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { label: '<₹1K', min: 0, max: 1000 },
                { label: '₹1K-₹3K', min: 1000, max: 3000 },
                { label: '₹3K-₹5K', min: 3000, max: 5000 },
                { label: '>₹5K', min: 5000, max: priceStats.max }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => setPriceRange({ min: range.min, max: range.max })}
                  className="px-2 sm:px-3 py-1 border border-gray-300 text-xs font-light hover:border-black active:bg-gray-100 transition-all duration-300"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Special Features */}
        <FilterSection
          title="SPECIAL FEATURES"
          isExpanded={expandedFilters.features}
          onToggle={() => toggleFilterSection('features')}
          icon={Sparkles}
        >
          <div className="space-y-2 sm:space-y-3">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={showOnSale}
                  onChange={(e) => setShowOnSale(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border transition-all duration-300 ${showOnSale
                  ? 'bg-black border-black'
                  : 'border-gray-300 group-hover:border-black group-active:bg-gray-100'
                  }`}>
                  {showOnSale && (
                    <Check size={10} className="sm:w-3 sm:h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-light group-hover:text-black transition-colors">
                On Sale
              </span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={showNewArrivals}
                  onChange={(e) => setShowNewArrivals(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border transition-all duration-300 ${showNewArrivals
                  ? 'bg-black border-black'
                  : 'border-gray-300 group-hover:border-black group-active:bg-gray-100'
                  }`}>
                  {showNewArrivals && (
                    <Check size={10} className="sm:w-3 sm:h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-light group-hover:text-black transition-colors">
                <span className="hidden sm:inline">New Arrivals (30 days)</span>
                <span className="sm:hidden">New Arrivals</span>
              </span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
      {/* Header Section */}
      <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-2xl sm:text-3xl mb-2">
              <Title
                text1={isCompanyPage ? companyDisplayName.toUpperCase() : getCollectionTitle()}
                text2="COLLECTION"
              />
            </div>
            {filteredProducts.length > 0 && (
              <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light px-4">
                {getCollectionSubtitle()}
              </p>
            )}
          </div>

          {/* Controls Bar - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-1">
              {/* View Mode Toggle - Hidden on Mobile */}
              <div className="hidden sm:flex items-center border border-gray-300 bg-white overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 transition-all duration-300 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:text-black'
                    }`}
                  aria-label="Grid view"
                >
                  <GridIcon size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 transition-all duration-300 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:text-black'
                    }`}
                  aria-label="List view"
                >
                  <ListIcon size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border border-gray-300 bg-white hover:border-black active:bg-gray-50 transition-all duration-300 relative text-xs sm:text-sm font-light tracking-wide"
              >
                <SlidersHorizontal size={14} className="sm:w-4 sm:h-4" />
                <span>FILTERS</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-black text-white rounded-full text-[10px] sm:text-xs flex items-center justify-center font-medium">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Products count */}
              <div className="hidden md:block text-xs sm:text-sm text-gray-600 font-light whitespace-nowrap">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 sm:gap-4 order-1 sm:order-2">
              <span className="text-xs sm:text-sm font-light text-gray-500 tracking-wide hidden sm:inline">SORT BY:</span>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none w-full border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 font-light tracking-wide focus:border-black focus:outline-none transition-colors text-xs sm:text-sm"
                >
                  <option value="relevant">Relevance</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="name-az">Name: A-Z</option>
                  <option value="name-za">Name: Z-A</option>
                </select>
                <ChevronDown size={14} className="sm:w-4 sm:h-4 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal - Bottom Sheet Style */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md shadow-2xl sm:rounded-sm max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col animate-slideUp">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-base sm:text-lg font-medium tracking-wide">FILTERS</h3>
              <button 
                onClick={() => setShowFilters(false)} 
                className="p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterPanel />
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 sm:py-3 border border-gray-300 font-light tracking-wide hover:border-black active:bg-gray-50 transition-all duration-300 text-xs sm:text-sm"
              >
                CLEAR ALL
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 text-xs sm:text-sm"
              >
                APPLY ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-20 pb-8 sm:pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 sm:gap-6 lg:gap-8">
            <div className="hidden lg:block w-64 xl:w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </div>

            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-12 sm:py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-black mx-auto mb-3 sm:mb-4"></div>
                    <span className="text-sm sm:text-base text-gray-600 font-light">Loading products...</span>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                      {currentItems.map((product) => (
                        <div key={product._id} className="group">
                          <ProductItem
                            name={product.name}
                            id={product._id}
                            price={product.price}
                            image={product.images}
                            currency={currency}
                            company={product.company}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {currentItems.map((product) => (
                        <div
                          key={product._id}
                          className="flex gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-sm sm:text-base md:text-lg font-medium tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2 flex-1">
                                  {product.name}
                                </h3>
                                {product.rating && (
                                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                    <Star size={12} className="sm:w-[14px] sm:h-[14px] text-yellow-400 fill-current" />
                                    <span className="text-xs sm:text-sm text-gray-600">{product.rating}</span>
                                  </div>
                                )}
                              </div>

                              <div className="text-xs sm:text-sm text-gray-500 mb-2 font-light truncate">
                                {product.category} • {product.subCategory}
                              </div>

                              {product.description && (
                                <p className="hidden sm:block text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-3 line-clamp-2">
                                  {product.description.length > 150
                                    ? product.description.substring(0, 150) + '...'
                                    : product.description
                                  }
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg md:text-xl font-medium">
                                  {currency}{product.price}
                                </span>
                                {product.discount && (
                                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] sm:text-xs font-medium">
                                    -{product.discount}%
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => navigate ? navigate(`/product/${product._id}`) : window.location.href = `/product/${product._id}`}
                                className="text-xs sm:text-sm text-gray-600 font-light tracking-wide hover:text-gray-900 active:text-black transition-all duration-300 whitespace-nowrap"
                              >
                                <span className="hidden sm:inline">VIEW DETAILS</span>
                                <span className="sm:hidden">VIEW</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination - Mobile Optimized */}
                  {totalPages > 1 && (
                    <div className="mt-8 sm:mt-12 flex items-center justify-center border-t border-gray-200 pt-6 sm:pt-8">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={goToPrevious}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 hover:border-black hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
                          title="Previous Page"
                        >
                          <ChevronLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </button>

                        <div className="flex gap-1">
                          {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                              <span key={`ellipsis-${index}`} className="w-8 sm:w-10 text-center text-gray-400 flex items-center justify-center text-xs sm:text-sm">...</span>
                            ) : (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 border transition-all duration-300 text-xs sm:text-sm font-light ${currentPage === page
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-300 hover:border-black hover:bg-gray-50 active:bg-gray-100'
                                  }`}
                              >
                                {page}
                              </button>
                            )
                          ))}
                        </div>

                        <button
                          onClick={goToNext}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 hover:border-black hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
                          title="Next Page"
                        >
                          <ChevronRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    {isCompanyPage ? <Building2 size={24} className="sm:w-8 sm:h-8 text-gray-400" /> : <ShoppingBag size={24} className="sm:w-8 sm:h-8 text-gray-400" />}
                  </div>
                  <div className="text-center max-w-md px-4">
                    <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3 tracking-wide">NO PRODUCTS FOUND</h3>
                    <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed mb-4 sm:mb-6">
                      {isCompanyPage
                        ? `We couldn't find any products from ${companyDisplayName}. Check back soon for new arrivals.`
                        : "We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our full collection."
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                      <button
                        onClick={clearFilters}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 text-xs sm:text-sm"
                      >
                        CLEAR ALL FILTERS
                      </button>
                      <button
                        onClick={() => navigate ? navigate('/') : window.location.href = '/'}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 border border-black bg-white text-black font-light tracking-wide hover:bg-black hover:text-white active:bg-gray-900 transition-all duration-300 text-xs sm:text-sm"
                      >
                        BROWSE ALL PRODUCTS
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {filteredProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-20 mb-12 sm:mb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;