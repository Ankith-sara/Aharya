import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Filter, ShoppingBag, X, ChevronDown, GridIcon, ListIcon, Check } from 'lucide-react';
import RecentlyViewed from '../components/RecentlyViewed';

const ProductPage = () => {
  const location = useLocation();
  const { category } = location.state || {};

  const { products = [], search, showSearch, selectedSubCategory, setSelectedSubCategory, navigate, currency } = useContext(ShopContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Extract unique categories and subcategories
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
  const subCategories = [...new Set(products.map(product => product.subCategory).filter(Boolean))];

  // Count active filters for the badge
  useEffect(() => {
    let count = 0;
    if (priceRange.min > 0 || priceRange.max < 10000) count++;
    if (sortOption !== 'relevant') count++;
    setActiveFiltersCount(count);
  }, [selectedCategories, selectedSubCategory, priceRange, sortOption]);

  useEffect(() => {
    document.title = `${getCollectionTitle()} | Aharyas`;
  }, [selectedSubCategory]);

  useEffect(() => {
    let updatedProducts = [...products];

    if (showSearch && search) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSubCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.subCategory === selectedSubCategory
      );
    }

    if (category) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter(
        (product) => selectedCategories.includes(product.category)
      );
    }

    // Price range filter
    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    updatedProducts.sort((a, b) => {
      if (sortOption === 'low-high') return a.price - b.price;
      if (sortOption === 'high-low') return b.price - a.price;
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    setFilteredProducts(updatedProducts);
  }, [products, search, showSearch, selectedSubCategory, category, sortOption, priceRange, selectedCategories]);

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setSortOption('relevant');
  };

  // Determine the title based on selectedSubCategory
  const getCollectionTitle = () => {
    return selectedSubCategory ? selectedSubCategory : "AHARYAS";
  };

  const FilterPanel = () => (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-neutral-600 hover:text-black transition-colors">
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs uppercase tracking-wider font-medium mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <input type="number" min="0" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })} className="w-20 border border-gray-300 p-1 text-xs rounded-md" placeholder="Min" />
          <span className="text-gray-400">-</span>
          <input type="number" min="0" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} className="w-20 border border-gray-300 p-1 text-xs rounded-md" placeholder="Max" />
        </div>
      </div>


    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-12 py-8 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <Title text1={getCollectionTitle()} text2="COLLECTION" />

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="hidden sm:flex items-center border border-neutral-300 bg-white rounded-md overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white'}`} aria-label="Grid view">
              <GridIcon size={14} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white'}`} aria-label="List view">
              <ListIcon size={14} />
            </button>
          </div>
          <div className="relative md:hidden">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-2 py-1.5 border border-neutral-300 bg-white rounded-md relative">
              <Filter size={14} />
              <span className="text-xs">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className="relative">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none text-xs border border-neutral-300 bg-white px-3 py-1.5 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-black">
              <option value="relevant">Sort: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto pt-16 px-4 pb-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-sm font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <FilterPanel />
            </div>
            <div className="p-3 border-t flex justify-end gap-3">
              <button onClick={clearFilters} className="px-3 py-1.5 border border-gray-300 rounded-md text-xs">
                Clear All
              </button>
              <button onClick={() => setShowFilters(false)} className="px-3 py-1.5 bg-black text-white rounded-md text-xs">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filter sidebar - Desktop - NARROWER */}
        <div className="hidden md:block md:w-52 lg:w-56">
          <div className="sticky top-24">
            <div className="flex items-center justify-between bg-black text-white py-2 px-3 rounded-t-md">
              <p className="text-xs font-medium flex items-center gap-1">
                <Filter size={14} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-4 h-4 bg-white text-black rounded-full text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </p>
            </div>
            <FilterPanel />
          </div>
        </div>

        {/* Main content - WIDER */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-xs text-neutral-600">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {/* Mobile View Mode Toggle */}
            <div className="flex sm:hidden items-center border border-neutral-300 bg-white rounded-md overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white'}`} aria-label="Grid view">
                <GridIcon size={14} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white'}`} aria-label="List view">
                <ListIcon size={14} />
              </button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProducts.map((product, index) => (
                    <div key={index}>
                      <ProductItem
                        name={product.name}
                        id={product._id}
                        price={product.price}
                        image={product.images}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-transparent hover:border-neutral-200 transition-all duration-300 rounded-md shadow-sm hover:shadow-md">
                      <div className="sm:w-1/5 aspect-square overflow-hidden">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-medium mb-2">{product.name}</h3>
                          <p className="text-neutral-600 text-xs mb-3">
                            {product.description ? product.description.substring(0, 150) + '...' : ''}
                          </p>
                          <div className="text-xs text-neutral-500">
                            {product.category} • {product.subCategory}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-neutral-100">
                          <span className="font-medium">{currency || '$'}{product.price.toFixed(2)}</span>
                          <button
                            onClick={() => navigate ? navigate(`/product/${product._id}`) : window.location.href = `/product/${product._id}`}
                            className="px-3 py-1.5 bg-black text-white text-xs hover:bg-neutral-800 transition-colors rounded-md"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center">
                <ShoppingBag size={24} className="text-black" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-1">No Products Found</h3>
                <p className="text-gray-600 text-sm max-w-md">Try adjusting your search or filter criteria</p>
              </div>
              <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-md">
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="mt-12">
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default ProductPage;