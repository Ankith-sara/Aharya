import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import {
  ShoppingBag, X, ChevronDown, GridIcon, ListIcon, Check, Heart, SlidersHorizontal, TrendingUp, Star, ChevronUp, Tag, Building2, ArrowLeft
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

  // Company data mapping
  const companyLogos = {
    'biba': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYq3HEWU4nP1xdaWDzOr7YNmV-q8yg_IJjkcrGl4El207-C31gBbfwEcPBwBiry52hQPE&usqp=CAU',
    'fabindia': 'https://logos-world.net/wp-content/uploads/2021/02/FabIndia-Logo.png',
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

    // Company filter (takes precedence over subcategory)
    if (isCompanyPage && company) {
      updatedProducts = updatedProducts.filter(
        (product) => {
          const productCompany = product.company ? product.company.toLowerCase() : '';
          return productCompany === company.toLowerCase();
        }
      );
    }
    // Subcategory filter (only if not filtering by company)
    else if (subcategory || selectedSubCategory) {
      const targetSubCategory = subcategory || selectedSubCategory;
      updatedProducts = updatedProducts.filter(
        (product) => product.subCategory === targetSubCategory
      );
    }

    // Price range filter
    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sale filter
    if (showOnSale) {
      updatedProducts = updatedProducts.filter(
        (product) => product.onSale || product.discount > 0
      );
    }

    // New arrivals filter
    if (showNewArrivals) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      updatedProducts = updatedProducts.filter(
        (product) => new Date(product.createdAt || product.dateAdded) > thirtyDaysAgo
      );
    }

    // Enhanced sorting
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
    return `Discover ${filteredProducts.length} carefully curated piece${filteredProducts.length !== 1 ? 's' : ''}${
      (subcategory || selectedSubCategory) ? ` in ${(subcategory || selectedSubCategory).toLowerCase()}` : ''
    }`;
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
        className="w-full py-4 px-0 flex justify-between items-center text-left font-medium text-sm hover:text-black transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-gray-500" />}
          {title}
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded && (
        <div className="pb-4">
          <div className="w-8 h-0.5 bg-black mb-4"></div>
          {children}
        </div>
      )}
    </div>
  );

  const FilterPanel = () => (
    <div className="bg-white border border-gray-200 shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-wide">FILTERS</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-black transition-colors font-light"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      <div className="px-6">
        {/* Price Range Filter */}
        <FilterSection
          title="PRICE RANGE"
          isExpanded={expandedFilters.price}
          onToggle={() => toggleFilterSection('price')}
          icon={Tag}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-light">
              <span>{currency}{priceStats.min}</span>
              <span>AVG: {currency}{priceStats.avg}</span>
              <span>{currency}{priceStats.max}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  min={priceStats.min}
                  max={priceStats.max}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-light focus:border-black focus:outline-none transition-colors"
                  placeholder="Min"
                />
              </div>
              <span className="text-gray-400 font-light">—</span>
              <div className="flex-1">
                <input
                  type="number"
                  min={priceStats.min}
                  max={priceStats.max}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-light focus:border-black focus:outline-none transition-colors"
                  placeholder="Max"
                />
              </div>
            </div>
            {/* Quick price filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Under ₹1000', min: 0, max: 1000 },
                { label: '₹1000-₹3000', min: 1000, max: 3000 },
                { label: '₹3000-₹5000', min: 3000, max: 5000 },
                { label: 'Above ₹5000', min: 5000, max: priceStats.max }
              ].map((range, index) => (
                <button
                  key={index}
                  onClick={() => setPriceRange({ min: range.min, max: range.max })}
                  className="px-3 py-1 border border-gray-300 text-xs font-light hover:border-black transition-all duration-300"
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
          icon={TrendingUp}
        >
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showOnSale}
                  onChange={(e) => setShowOnSale(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border transition-all duration-300 ${showOnSale
                    ? 'bg-black border-black'
                    : 'border-gray-300 group-hover:border-black'
                  }`}>
                  {showOnSale && (
                    <Check size={12} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-light group-hover:text-black transition-colors">
                On Sale
              </span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showNewArrivals}
                  onChange={(e) => setShowNewArrivals(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border transition-all duration-300 ${showNewArrivals
                    ? 'bg-black border-black'
                    : 'border-gray-300 group-hover:border-black'
                  }`}>
                  {showNewArrivals && (
                    <Check size={12} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-sm font-light group-hover:text-black transition-colors">
                New Arrivals (30 days)
              </span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-3xl mb-2">
              <Title 
                text1={isCompanyPage ? companyDisplayName.toUpperCase() : getCollectionTitle()} 
                text2="COLLECTION" 
              />
            </div>
            {filteredProducts.length > 0 && (
              <p className="text-gray-500 font-light">
                {getCollectionSubtitle()}
              </p>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 bg-white overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:text-black'
                    }`}
                  aria-label="Grid view"
                >
                  <GridIcon size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:text-black'
                    }`}
                  aria-label="List view"
                >
                  <ListIcon size={16} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 bg-white hover:border-black transition-all duration-300 relative"
                >
                  <SlidersHorizontal size={16} />
                  <span className="font-light tracking-wide">FILTERS</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center font-medium">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-light text-gray-500 tracking-wide">SORT BY:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none border border-gray-300 bg-white px-4 py-3 pr-10 font-light tracking-wide focus:border-black focus:outline-none transition-colors"
                >
                  <option value="relevant">Relevance</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="name-az">Name: A to Z</option>
                  <option value="name-za">Name: Z to A</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-start overflow-y-auto pt-20 px-4 pb-4">
          <div className="bg-white w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium tracking-wide">FILTERS</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-50 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <FilterPanel />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border border-gray-300 font-light tracking-wide hover:border-black transition-all duration-300"
              >
                CLEAR ALL
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </div>

            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <span className="text-gray-600 font-light">Loading products...</span>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.map((product, index) => (
                        <div key={product._id} className="group">
                          <ProductItem
                            name={product.name}
                            id={product._id}
                            price={product.price}
                            image={product.images}
                            currency={currency}
                            onSale={product.onSale}
                            discount={product.discount}
                            rating={product.rating}
                            isNew={product.isNew}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredProducts.map((product, index) => (
                        <div
                          key={product._id}
                          className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="md:w-1/4 aspect-square overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-medium tracking-wide group-hover:text-gray-700 transition-colors">
                                  {product.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {product.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star size={14} className="text-yellow-400 fill-current" />
                                      <span className="text-sm text-gray-600">{product.rating}</span>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      if (wishlist.includes(product._id)) {
                                        removeFromWishlist(product._id);
                                      } else {
                                        addToWishlist(product._id);
                                      }
                                    }}
                                    className={`p-2 border transition-all duration-300 ${wishlist.includes(product._id)
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-300 hover:border-black'
                                      }`}
                                  >
                                    <Heart size={14} className={wishlist.includes(product._id) ? 'fill-current' : ''} />
                                  </button>
                                </div>
                              </div>

                              <div className="text-sm text-gray-500 mb-3 font-light">
                                {product.category} • {product.subCategory}
                              </div>

                              {product.description && (
                                <p className="text-gray-600 font-light leading-relaxed mb-4">
                                  {product.description.length > 200
                                    ? product.description.substring(0, 200) + '...'
                                    : product.description
                                  }
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-medium">
                                    {currency}{product.price}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through font-light">
                                      {currency}{product.originalPrice}
                                    </span>
                                  )}
                                </div>
                                {product.discount && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium">
                                    -{product.discount}% OFF
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate ? navigate(`/product/${product._id}`) : window.location.href = `/product/${product._id}`}
                                  className="text-gray-600 font-light tracking-wide hover:text-gray-900 transition-all duration-300"
                                >
                                  VIEW DETAILS
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}


                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 shadow-sm">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                    {isCompanyPage ? <Building2 size={32} className="text-gray-400" /> : <ShoppingBag size={32} className="text-gray-400" />}
                  </div>
                  <div className="text-center max-w-md">
                    <h3 className="text-2xl font-medium mb-3 tracking-wide">NO PRODUCTS FOUND</h3>
                    <p className="text-gray-600 font-light leading-relaxed mb-6">
                      {isCompanyPage 
                        ? `We couldn't find any products from ${companyDisplayName}. Check back soon for new arrivals.`
                        : "We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our full collection."
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
                      >
                        CLEAR ALL FILTERS
                      </button>
                      <button
                        onClick={() => navigate ? navigate('/') : window.location.href = '/'}
                        className="px-6 py-3 border border-black bg-white text-black font-light tracking-wide hover:bg-black hover:text-white transition-all duration-300"
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
        <section className="px-4 sm:px-8 md:px-10 lg:px-20 mb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;