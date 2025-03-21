import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const ProductPage = () => {
  const location = useLocation();
  const { category } = location.state || {};

  const {
    products = [],
    search,
    showSearch,
    selectedSubCategory,
    setSelectedSubCategory,
  } = useContext(ShopContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');

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
    if (category) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category.toLowerCase() === category
      );
    }

    // Apply sorting
    updatedProducts.sort((a, b) => {
      if (sortOption === 'low-high') return a.price - b.price;
      if (sortOption === 'high-low') return b.price - a.price;
      return 0;
    });

    setFilteredProducts(updatedProducts);
  }, [products, search, showSearch, selectedSubCategory, category, sortOption]);

  return (
    <div className="bg-primary mt-20 mb-10 py-5 px-4 sm:px-6 md:px-10 lg:px-20">
      {/* Product List Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <Title text1="Our" text2="Products" />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-2 py-1 mt-4 md:mt-0"
        >
          <option value="relevant">Sort by: Relevant</option>
          <option value="low-high">Sort by: Price (Low to High)</option>
          <option value="high-low">Sort by: Price (High to Low)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center py-10 text-xl text-text-light">
            No products found.
          </p>
        ) : (
          filteredProducts.map((product, index) => (
            <ProductItem
              key={index}
              name={product.name}
              id={product._id}
              price={product.price}
              image={product.images}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPage;
