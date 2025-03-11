import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const ProductPage = () => {
  const {
    products = [],
    search,
    showSearch,
    selectedCategory,
    selectedSubCategory,
    setSelectedSubCategory
  } = useContext(ShopContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');

  // Handle subcategory selection from the navbar dropdown menu
  const handleSubCategorySelection = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  // Filter and sort products
  useEffect(() => {
    let updatedProducts = [...products];

    // Apply search filtering
    if (showSearch && search) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply subcategory filtering
    if (selectedSubCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.subCategory === selectedSubCategory
      );
    }

    // Apply category filtering
    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply sorting
    updatedProducts.sort((a, b) => {
      if (sortOption === 'low-high') return a.price - b.price;
      if (sortOption === 'high-low') return b.price - a.price;
      return 0;
    });

    setFilteredProducts(updatedProducts);
  }, [products, search, showSearch, selectedSubCategory, selectedCategory, sortOption]);

  return (
    <div className="container m-20 px-4 py-10">
      {/* Product List Section */}
      <div className="flex justify-between items-center mb-6">
        <Title text1="Our" text2="Products" />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border px-2 py-1">
          <option value="relevant">Sort by: Relevant</option>
          <option value="low-high">Sort by: Price (Low to High)</option>
          <option value="high-low">Sort by: Price (High to Low)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-4 text-center py-10 text-xl text-text-light">No products found.</p>
        ) : (
          filteredProducts.map((product, index) => (
            <ProductItem key={index} name={product.name} id={product._id} price={product.price} image={product.images} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPage;