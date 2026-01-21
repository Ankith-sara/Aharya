import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

function LatestCollection() {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getProductsByCategory = (products, categoryName, subcategories) => {
    return products.filter(item => {
      const itemCategory = item.category?.toLowerCase();
      const itemSubCategory = item.subCategory?.toLowerCase();

      return subcategories.some(sub =>
        itemCategory?.includes(sub.toLowerCase()) ||
        itemSubCategory?.includes(sub.toLowerCase())
      );
    });
  };

  const selectBalancedProducts = (products, categories, minPerCategory = 2) => {
    const selectedProducts = [];
    const usedProductIds = new Set();

    categories.forEach(({ name, subcategories }) => {
      const categoryProducts = getProductsByCategory(products, name, subcategories);

      const productsBySubcategory = {};
      subcategories.forEach(sub => {
        productsBySubcategory[sub] = categoryProducts.filter(item =>
          item.category?.toLowerCase().includes(sub.toLowerCase()) ||
          item.subCategory?.toLowerCase().includes(sub.toLowerCase())
        );
      });

      Object.values(productsBySubcategory).forEach(subProducts => {
        const availableProducts = subProducts.filter(p => !usedProductIds.has(p._id));
        const toSelect = Math.min(minPerCategory, availableProducts.length);

        for (let i = 0; i < toSelect; i++) {
          selectedProducts.push(availableProducts[i]);
          usedProductIds.add(availableProducts[i]._id);
        }
      });
    });

    const remainingProducts = products.filter(p => !usedProductIds.has(p._id));
    const remainingSlots = Math.max(0, 10 - selectedProducts.length);

    for (let i = 0; i < Math.min(remainingSlots, remainingProducts.length); i++) {
      selectedProducts.push(remainingProducts[i]);
    }

    return selectedProducts.slice(0, 10);
  };

  useEffect(() => {
    if (products && products.length > 0) {
      if (selectedCategory === 'All') {
        // Define all categories and their subcategories
        const allCategories = [
          {
            name: 'Women',
            subcategories: ['Kurtis', 'Dresses']
          },
          {
            name: 'Men',
            subcategories: ['Sleeve Shirts']
          }, 
          {
            name: 'Handmade Toys',
            subcategories: ['Kondapalli Bommalu', 'Paintings']
          },
          {
            name: 'Accessories',
            subcategories: ['Bags']
          }
        ];

        const balancedProducts = selectBalancedProducts(products, allCategories, 2);
        setLatestProducts(balancedProducts);

      } else {
        if (categoryConfig.name) {
          const balancedProducts = selectBalancedProducts(products, [categoryConfig], 2);
          setLatestProducts(balancedProducts);
        } else {
          setLatestProducts(products.slice(0, 10));
        }
      }
    } else {
      setLatestProducts([]);
    }
  }, [products, selectedCategory]);

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-10 items-center text-center gap-2">
          <div>
            <Title text1="LATEST" text2="COLLECTION" />
          </div>
          <NavLink to="/shop/collection" className="mt-4 md:mt-0 group flex items-center text-xs font-medium hover:text-gray-700 transition-colors">
            View all collections
            <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </NavLink>
        </div>

        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-6">
            {latestProducts.map((item, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden">
                  <ProductItem
                    id={item._id}
                    image={item.images}
                    name={item.name}
                    price={item.price}
                    company={item.company}
                  />
                  {index < 1 && (
                    <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 font-medium">
                      NEW
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-lg font-medium">No products available</p>
            <p className="mt-2 text-sm text-gray-500">New arrivals coming soon</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestCollection;