import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { ChevronLeft, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';

const Collection = () => {
  const { products = [], search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevent');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

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
      default:
        break;
    }
    return fpCopy;
  };

  // Apply filtering only when dependencies change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

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

  return (
    <div className="flex flex-col bg-primary px-4 sm:px-8 md:px-12 lg:px-20 sm:flex-row gap-6 border-t border-secondary py-10 mt-20 mb-10">
      {/* Filter sidebar */}
      <div className="sm:min-w-60 sm:max-w-60">
        <div onClick={() => setShowFilter(!showFilter)} className="flex items-center justify-between bg-secondary text-primary py-3 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all mb-4">
          <p className="font-medium flex items-center gap-2">
            <Filter size={18} />
            Filters
          </p>
          <img className={`h-3 sm:hidden transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="" />
        </div>

        <div className={`border-2 border-secondary px-5 py-4 mb-4 transition-all duration-300 ${showFilter ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden sm:opacity-100 sm:h-auto'}`}>
          <p className="mb-3 font-medium text-secondary">Categories</p>
          <div className="flex flex-col gap-3 text-text">
            {['Men', 'Women', 'Home Furnishing', 'Kitchenware'].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer hover:text-secondary transition-colors">
                <input className="w-4 h-4 accent-secondary" type="checkbox" value={item} checked={category.includes(item)} onChange={toggleCategory} />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className={`border-2 border-secondary px-5 py-4 transition-all duration-300 ${showFilter ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden sm:opacity-100 sm:h-auto'}`}>
          <p className="mb-3 font-medium text-secondary">Type</p>
          <div className="flex flex-col gap-3 text-text">
            {['Kurtis', 'Tops', 'Blazers'].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer hover:text-secondary transition-colors">
                <input className="w-4 h-4 accent-secondary" type="checkbox" value={item} checked={subCategory.includes(item)} onChange={toggleSubCategory} />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Title text1={'All'} text2={'Collections'} />
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-secondary" />
            <select onChange={(e) => setSortType(e.target.value)} className="border-2 border-secondary rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer" value={sortType}>
              <option value="relevent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        {filterProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((item, index) => {
                if (!item.name || !item._id || !item.price || !item.images?.length) {
                  return <div key={index} className="text-red-500 p-4 border border-red-300 rounded-lg bg-red-50">Invalid Product</div>;
                }
                return (
                  <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 mb-6">
                <div className="flex items-center gap-2">
                  <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 ${currentPage === 1 ? 'border-gray-300 text-gray-300 cursor-not-allowed' : 'border-secondary text-secondary hover:bg-secondary hover:text-primary'} transition-colors`}> <ChevronLeft size={20} /></button>
                  {getPaginationNumbers().map((num, index) => (
                    num === '...' ? (
                      <span key={`ellipsis-${index}`} className="w-10 text-center">...</span>
                    ) : (
                      <button key={num} onClick={() => goToPage(num)} className={`w-10 h-10 rounded-lg border-2 ${currentPage === num ? 'bg-secondary text-primary' : 'border-secondary text-secondary hover:bg-secondary hover:text-primary'} transition-colors`}> {num} </button>
                    )
                  ))}

                  <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 ${currentPage === totalPages ? 'border-gray-300 text-gray-300 cursor-not-allowed' : 'border-secondary text-secondary hover:bg-secondary hover:text-primary'} transition-colors`}> <ChevronRight size={20} /> </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-secondary opacity-50">
              <Filter size={64} />
            </div>
            <h3 className="text-xl font-medium text-secondary mb-2">No products found</h3>
            <p className="text-text-light">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;