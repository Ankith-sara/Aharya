import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import RecentlyViewed from '../components/RecentlyViewed';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Filter, SlidersHorizontal, X, ShoppingBag, GridIcon, ListIcon, Check, Gift, DollarSign, Star, Heart, Eye, TrendingUp, Palette, Ruler, Tag
} from 'lucide-react';

const Collection = () => {
  const {
    products = [],
    search,
    showSearch,
    navigate,
    currency,
    addToWishlist,
    removeFromWishlist,
    wishlist = []
  } = useContext(ShopContext);

  // Enhanced state management matching ProductPage
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortType, setSortType] = useState('relevant');
  const [giftingIdea, setGiftingIdea] = useState(false);
  const [budgetFriendly, setBudgetFriendly] = useState(false);
  const [rareItems, setRareItems] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    subCategory: true,
    price: true,
    features: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const productsPerPage = 16;

  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

  // Calculate price statistics
  const priceStats = products.length > 0 ? {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price)),
    avg: Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
  } : { min: 0, max: 10000, avg: 5000 };

  // Filter subcategories based on selected categories
  const getFilteredSubCategories = () => {
    if (category.length === 0) {
      return [...new Set(products.map(product => product.subCategory).filter(Boolean))];
    } else {
      return [...new Set(
        products
          .filter(product => category.includes(product.category))
          .map(product => product.subCategory)
          .filter(Boolean)
      )];
    }
  };

  const filteredSubCategories = getFilteredSubCategories();

  const toggleCategory = (selectedCategory) => {
    let newCategories;

    if (category.includes(selectedCategory)) {
      newCategories = category.filter(item => item !== selectedCategory);
    } else {
      newCategories = [...category, selectedCategory];
    }

    setCategory(newCategories);

    // Clear subcategories that are no longer valid for the new category selection
    if (newCategories.length > 0) {
      const validSubCategories = [...new Set(
        products
          .filter(product => newCategories.includes(product.category))
          .map(product => product.subCategory)
          .filter(Boolean)
      )];

      setSubCategory(prev => prev.filter(sub => validSubCategories.includes(sub)));
    }
  };

  const toggleSubCategory = (selectedSubCategory) => {
    if (subCategory.includes(selectedSubCategory)) {
      setSubCategory(prev => prev.filter(item => item !== selectedSubCategory));
    } else {
      setSubCategory(prev => [...prev, selectedSubCategory]);
    }
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange({ min: priceStats.min, max: priceStats.max });
    setSortType('relevant');
    setGiftingIdea(false);
    setBudgetFriendly(false);
    setRareItems(false);
  };

  // Count active filters for the badge
  useEffect(() => {
    let count = 0;
    if (category.length > 0) count++;
    if (subCategory.length > 0) count++;
    if (priceRange.min > priceStats.min || priceRange.max < priceStats.max) count++;
    if (sortType !== 'relevant') count++;
    if (giftingIdea) count++;
    if (budgetFriendly) count++;
    if (rareItems) count++;
    setActiveFiltersCount(count);
  }, [category, subCategory, priceRange, sortType, giftingIdea, budgetFriendly, rareItems, priceStats]);

  const applyFilter = () => {
    setIsLoading(true);
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    if (giftingIdea) {
      productsCopy = productsCopy.filter(
        (item) => item.giftable === true || item.category === 'Gift Sets' || item.price <= 2000
      );
    }

    if (budgetFriendly) {
      productsCopy = productsCopy.filter(
        (item) => item.price < 1000
      );
    }

    if (rareItems) {
      productsCopy = productsCopy.filter(
        (item) => item.rare === true || item.limited === true || item.stock < 5
      );
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Sorting logic separated to avoid infinite loop
  const sortProduct = (products) => {
    let fpCopy = [...products];
    switch (sortType) {
      case 'low-high':
        fpCopy = fpCopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        fpCopy = fpCopy.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        fpCopy = fpCopy.sort((a, b) => new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded));
        break;
      case 'popular':
        fpCopy = fpCopy.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'rating':
        fpCopy = fpCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-az':
        fpCopy = fpCopy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        fpCopy = fpCopy.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return fpCopy;
  };

  // Apply filtering when dependencies change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange, giftingIdea, budgetFriendly, rareItems]);

  // Apply sorting logic after filtering
  useEffect(() => {
    if (filterProducts.length > 0) {
      const sortedProducts = sortProduct(filterProducts);
      setFilterProducts(sortedProducts);
    }
  }, [sortType]);

  useEffect(() => {
    document.title = 'Aharyas Collection | Aharyas';
  }, []);

  // Calculate current products to display based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);

  // Page navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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

        {/* Categories Filter */}
        <FilterSection
          title="CATEGORIES"
          isExpanded={expandedFilters.category}
          onToggle={() => toggleFilterSection('category')}
          icon={Palette}
        >
          <div className="space-y-3">
            {categories.map((item) => (
              <label key={item} className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={category.includes(item)}
                    onChange={() => toggleCategory(item)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border transition-all duration-300 ${category.includes(item)
                      ? 'bg-black border-black'
                      : 'border-gray-300 group-hover:border-black'
                    }`}>
                    {category.includes(item) && (
                      <Check size={12} className="text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-light group-hover:text-black transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Sub Categories */}
        {filteredSubCategories.length > 0 && (
          <FilterSection
            title="TYPE"
            isExpanded={expandedFilters.subCategory}
            onToggle={() => toggleFilterSection('subCategory')}
            icon={Ruler}
          >
            <div className="space-y-3">
              {filteredSubCategories.map((item) => (
                <label key={item} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={subCategory.includes(item)}
                      onChange={() => toggleSubCategory(item)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border transition-all duration-300 ${subCategory.includes(item)
                        ? 'bg-black border-black'
                        : 'border-gray-300 group-hover:border-black'
                      }`}>
                      {subCategory.includes(item) && (
                        <Check size={12} className="text-white absolute top-0.5 left-0.5" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-light group-hover:text-black transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

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
                  checked={giftingIdea}
                  onChange={(e) => setGiftingIdea(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border transition-all duration-300 ${giftingIdea
                    ? 'bg-black border-black'
                    : 'border-gray-300 group-hover:border-black'
                  }`}>
                  {giftingIdea && (
                    <Check size={12} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <Gift size={14} className="ml-3 mr-2 text-gray-500" />
              <span className="text-sm font-light group-hover:text-black transition-colors">
                Gifting Ideas
              </span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={budgetFriendly}
                  onChange={(e) => setBudgetFriendly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border transition-all duration-300 ${budgetFriendly
                    ? 'bg-black border-black'
                    : 'border-gray-300 group-hover:border-black'
                  }`}>
                  {budgetFriendly && (
                    <Check size={12} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <DollarSign size={14} className="ml-3 mr-2 text-gray-500" />
              <span className="text-sm font-light group-hover:text-black transition-colors">
                Budget Friendly (Under ₹1K)
              </span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rareItems}
                  onChange={(e) => setRareItems(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border transition-all duration-300 ${rareItems
                    ? 'bg-black border-black'
                    : 'border-gray-300 group-hover:border-black'
                  }`}>
                  {rareItems && (
                    <Check size={12} className="text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <Star size={14} className="ml-3 mr-2 text-gray-500" />
              <span className="text-sm font-light group-hover:text-black transition-colors">
                Rare & Limited
              </span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-3xl mb-2">
              <Title text1="AHARYAS" text2="COLLECTION" />
            </div>
            {filterProducts.length > 0 && (
              <p className="text-gray-500 font-light">
                Discover {filterProducts.length} carefully curated piece{filterProducts.length !== 1 ? 's' : ''}
                {showSearch && search && ` matching "${search}"`}
              </p>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
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
                  onClick={() => setShowFilter(!showFilter)}
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
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
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
      {showFilter && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-start overflow-y-auto pt-10 px-4 pb-4">
          <div className="bg-white w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium tracking-wide">FILTERS</h3>
              <button onClick={() => setShowFilter(false)} className="p-2 hover:bg-gray-50 transition-colors">
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
                onClick={() => setShowFilter(false)}
                className="flex-1 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <span className="text-gray-600 font-light">Loading products...</span>
                  </div>
                </div>
              ) : filterProducts.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {currentProducts.map((product, index) => {
                        if (!product.name || !product._id || !product.price || !product.images?.length) {
                          return (
                            <div key={index} className="text-red-500 p-3 border border-red-300 bg-red-50">
                              Invalid Product
                            </div>
                          );
                        }
                        return (
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
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {currentProducts.map((product, index) => (
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

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 mb-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className={`flex items-center justify-center w-10 h-10 border transition-all duration-300 ${currentPage === 1
                              ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                              : 'border-gray-800 text-gray-800 hover:bg-black hover:text-white hover:border-black'
                            }`}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {getPaginationNumbers().map((num, index) => (
                          num === '...' ? (
                            <span key={`ellipsis-${index}`} className="w-10 text-center text-gray-600 font-light">
                              ...
                            </span>
                          ) : (
                            <button
                              key={num}
                              onClick={() => goToPage(num)}
                              className={`w-10 h-10 border transition-all duration-300 font-light tracking-wide ${currentPage === num
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-800 text-gray-800 hover:bg-black hover:text-white hover:border-black'
                                }`}
                            >
                              {num}
                            </button>
                          )
                        ))}

                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className={`flex items-center justify-center w-10 h-10 border transition-all duration-300 ${currentPage === totalPages
                              ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                              : 'border-gray-800 text-gray-800 hover:bg-black hover:text-white hover:border-black'
                            }`}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 shadow-sm">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <div className="text-center max-w-md">
                    <h3 className="text-2xl font-medium mb-3 tracking-wide">NO PRODUCTS FOUND</h3>
                    <p className="text-gray-600 font-light leading-relaxed mb-6">
                      We couldn't find any products matching your current filters.
                      Try adjusting your search criteria or browse our full collection.
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
      {filterProducts.length > 0 && (
        <section className="px-4 sm:px-8 md:px-10 lg:px-20 mb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
      )}
    </div>
  );
};

export default Collection;