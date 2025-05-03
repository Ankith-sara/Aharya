import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Filter, ShoppingBag, Sliders, ChevronDown, GridIcon, ListIcon } from 'lucide-react';
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

  // Extract unique categories and subcategories
  const categories = [...new Set(products.map(product => product.category))];
  const subCategories = [...new Set(products.map(product => product.subCategory))];

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

  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 10000 });
    setSelectedSubCategory('');
    setSortOption('relevant');
  };

  const FilterPanel = () => (
    <div className="space-y-6 p-6 bg-white border border-gray-200">
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
          <input type="number" min="0" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })} className="w-24 border border-gray-300 p-2 text-sm" placeholder="Min" />
          <span className="text-gray-400">-</span>
          <input type="number" min="0" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })} className="w-24 border border-gray-300 p-2 text-sm" placeholder="Max" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-neutral-900 mt-20 py-10">
      <div className="px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <Title text1="AHARYAS" text2="COLLECTION" />

          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <div className="flex items-center border border-neutral-300 bg-white">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100' : 'bg-white'}`} aria-label="Grid view">
                <GridIcon size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-neutral-100' : 'bg-white'}`} aria-label="List view">
                <ListIcon size={16} />
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 md:hidden px-3 py-2 border border-neutral-300 bg-white">
                <Filter size={16} />
                <span className="text-sm">Filters</span>
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="relative">
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none border border-neutral-300 bg-white px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-black">
                <option value="relevant">Sort: Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="md:hidden mb-6">
            <FilterPanel />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop filters */}
          <div className="hidden md:block">
            <FilterPanel />
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-6 bg-white border border-gray-200">
                <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
                  <ShoppingBag size={32} className="text-black" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">No Products Found</h3>
                  <p className="text-gray-600 max-w-md">Try adjusting your search or filter criteria</p>
                </div>
                <button onClick={clearFilters} className="mt-4 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 text-sm text-neutral-600">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                      <div key={index} className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-transparent hover:border-neutral-200 transition-all duration-300">
                        <div className="sm:w-1/4 aspect-square overflow-hidden">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                            <p className="text-neutral-600 text-sm mb-4">
                              {product.description ? product.description.substring(0, 150) + '...' : ''}
                            </p>
                            <div className="text-sm text-neutral-500">
                              {product.category} • {product.subCategory}
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-100">
                            <span className="font-medium">{currency}{product.price.toFixed(2)}</span>
                            <button onClick={() => navigate(`/product/${product._id}`)} className="px-4 py-2 bg-black text-white text-sm hover:bg-neutral-800 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 px-4 sm:px-6 md:px-10 lg:px-20">
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default ProductPage;