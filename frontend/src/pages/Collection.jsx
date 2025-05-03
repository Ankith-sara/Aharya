import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import RecentlyViewed from '../components/RecentlyViewed';
import { ChevronLeft, ChevronRight, ChevronDown, Filter, SlidersHorizontal, X, ShoppingBag, GridIcon, ListIcon, Check } from 'lucide-react';

const Collection = () => {
  const { products = [], search, showSearch, navigate, currency } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  
  // Enhanced filtering options
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortType, setSortType] = useState('relevant');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Extract unique categories and subcategories
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
  const subCategories = [...new Set(products.map(product => product.subCategory).filter(Boolean))];

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(category.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange({ min: 0, max: 10000 });
    setSortType('relevant');
  };

  // Count active filters for the badge
  useEffect(() => {
    let count = 0;
    if (category.length > 0) count++;
    if (subCategory.length > 0) count++;
    if (priceRange.min > 0 || priceRange.max < 10000) count++;
    if (sortType !== 'relevant') count++;
    setActiveFiltersCount(count);
  }, [category, subCategory, priceRange, sortType]);

  const applyFilter = () => {
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

    // Price range filter
    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    setFilterProducts(productsCopy);
    setCurrentPage(1);
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
        fpCopy = fpCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    return fpCopy;
  };

  // Apply filtering only when dependencies change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange]);

  // Apply sorting logic after filtering
  useEffect(() => {
    if (filterProducts.length > 0) {
      const sortedProducts = sortProduct(filterProducts);
      setFilterProducts(sortedProducts);
    }
  }, [sortType]);

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
      // Show some page numbers with ellipsis
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

  const FilterPanel = () => (
    <div className="space-y-6 p-6 bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-neutral-600 hover:text-black transition-colors">
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm uppercase tracking-wider font-medium mb-3">Price Range</h4>
        <div className="flex items-center gap-4">
          <input type="number" min="0" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })} className="w-24 border border-gray-300 p-2 text-sm rounded-md" placeholder="Min"  />
          <span className="text-gray-400">-</span>
          <input type="number" min="0" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} className="w-24 border border-gray-300 p-2 text-sm rounded-md" placeholder="Max"  />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm uppercase tracking-wider font-medium mb-3">Categories</h4>
        <div className="flex flex-col gap-3 text-gray-700">
          {categories.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer hover:text-black transition-colors">
              <div className={`w-4 h-4 border rounded flex items-center justify-center ${category.includes(item) ? 'bg-black border-black' : 'border-gray-400'}`}>
                {category.includes(item) && <Check size={12} className="text-white" />}
              </div>
              <input className="sr-only" type="checkbox" value={item} checked={category.includes(item)} onChange={toggleCategory}  />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Sub Categories */}
      <div>
        <h4 className="text-sm uppercase tracking-wider font-medium mb-3">Type</h4>
        <div className="flex flex-col gap-3 text-gray-700">
          {subCategories.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer hover:text-black transition-colors">
              <div className={`w-4 h-4 border rounded flex items-center justify-center ${subCategory.includes(item) ? 'bg-black border-black' : 'border-gray-400'}`}>
                {subCategory.includes(item) && <Check size={12} className="text-white" />}
              </div>
              <input className="sr-only" type="checkbox" value={item} checked={subCategory.includes(item)} onChange={toggleSubCategory}  />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-20 py-10 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Title text1="AHARYAS" text2="COLLECTION" />

        <div className="flex items-center gap-4 mt-6 md:mt-0">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-neutral-300 bg-white rounded-md overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white'}`} aria-label="Grid view">
              <GridIcon size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white'}`} aria-label="List view">
              <ListIcon size={16} />
            </button>
          </div>

          {/* Filter Toggle for Mobile */}
          <div className="relative md:hidden">
            <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 px-3 py-2 border border-neutral-300 bg-white rounded-md relative">
              <Filter size={16} />
              <span className="text-sm">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown size={16} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="appearance-none border border-neutral-300 bg-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-black">
              <option value="relevant">Sort: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter sidebar - Desktop */}
        <div className="hidden md:block md:w-72">
          <div className="sticky top-24">
            <div className="flex items-center justify-between bg-black text-white py-3 px-4 rounded-t-md">
              <p className="font-medium flex items-center gap-2">
                <Filter size={18} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-white text-black rounded-full text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </p>
            </div>
            <FilterPanel />
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {showFilter && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto pt-20 px-4 pb-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-medium">Filters</h3>
                <button onClick={() => setShowFilter(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <FilterPanel />
              </div>
              <div className="p-4 border-t flex justify-end gap-4">
                <button onClick={clearFilters} className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                  Clear All
                </button>
                <button onClick={() => setShowFilter(false)} className="px-4 py-2 bg-black text-white rounded-md text-sm">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-neutral-600">
              Showing {filterProducts.length} product{filterProducts.length !== 1 ? 's' : ''}
            </div>
            
            {/* Mobile View Mode Toggle */}
            <div className="flex sm:hidden items-center border border-neutral-300 bg-white rounded-md overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white'}`} aria-label="Grid view">
                <GridIcon size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white'}`} aria-label="List view">
                <ListIcon size={16} />
              </button>
            </div>
          </div>

          {filterProducts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentProducts.map((item, index) => {
                    if (!item.name || !item._id || !item.price || !item.images?.length) {
                      return (
                        <div key={index} className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
                          Invalid Product
                        </div>
                      );
                    }
                    return (
                      <div key={index} >
                        <ProductItem 
                          name={item.name} 
                          id={item._id} 
                          price={item.price} 
                          image={item.images} 
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentProducts.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-transparent hover:border-neutral-200 transition-all duration-300 rounded-md shadow-sm hover:shadow-md">
                      <div className="sm:w-1/4 aspect-square overflow-hidden">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                          <p className="text-neutral-600 text-sm mb-4">
                            {item.description ? item.description.substring(0, 150) + '...' : ''}
                          </p>
                          <div className="text-sm text-neutral-500">
                            {item.category} • {item.subCategory}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-100">
                          <span className="font-medium">{currency || '$'}{item.price.toFixed(2)}</span>
                          <button onClick={() => navigate ? navigate(`/product/${item._id}`) : window.location.href = `/product/${item._id}`} className="px-4 py-2 bg-black text-white text-sm hover:bg-neutral-800 transition-colors rounded-md">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 mb-6">
                  <div className="flex items-center gap-2">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`flex items-center justify-center w-10 h-10 rounded-md border ${currentPage === 1 ? 'border-gray-300 text-gray-300 cursor-not-allowed' : 'border-gray-800 text-gray-800 hover:bg-black hover:text-white hover:border-black'} transition-colors`}>
                      <ChevronLeft size={18} />
                    </button>

                    {getPaginationNumbers().map((num, index) => (
                      num === '...' ? (
                        <span key={`ellipsis-${index}`} className="w-10 text-center text-gray-600">...</span>
                      ) : (
                        <button key={num} onClick={() => goToPage(num)} className={`w-10 h-10 rounded-md ${currentPage === num ? 'bg-black text-white' : 'border border-gray-800 text-gray-800 hover:bg-black hover:text-white hover:border-black'} transition-colors`}>
                          {num}
                        </button>
                      )
                    ))}

                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`flex items-center justify-center w-10 h-10 rounded-md border ${currentPage === totalPages ? 'border-gray-300 text-gray-300 cursor-not-allowed' : 'border-gray-800 text-gray-800 hover:bg-black hover:text-white hover:border-black'} transition-colors`}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-black" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">No Products Found</h3>
                <p className="text-gray-600 max-w-md">Try adjusting your search or filter criteria</p>
              </div>
              <button onClick={clearFilters} className="mt-4 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-md">
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="mt-16">
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default Collection;