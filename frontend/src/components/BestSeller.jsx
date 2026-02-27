import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
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

  const selectBalancedBestsellers = (products, categories, minPerCategory = 1) => {
    const bestsellerProducts = products.filter(item => item.bestseller);

    if (bestsellerProducts.length === 0) {
      return [];
    }

    const selectedProducts = [];
    const usedProductIds = new Set();

    categories.forEach(({ name, subcategories }) => {
      const categoryProducts = getProductsByCategory(bestsellerProducts, name, subcategories);

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

    const remainingProducts = bestsellerProducts.filter(p => !usedProductIds.has(p._id));
    const remainingSlots = Math.max(0, 10 - selectedProducts.length);

    for (let i = 0; i < Math.min(remainingSlots, remainingProducts.length); i++) {
      selectedProducts.push(remainingProducts[i]);
    }

    return selectedProducts.slice(0, 5);
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
            subcategories: ['Shirts', 'Sleeve Shirts']
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

        const balancedBestsellers = selectBalancedBestsellers(products, allCategories, 1);
        setBestSeller(balancedBestsellers);

      } else {
        // Handle specific category selection
        let categoryConfig = {};

        if (selectedCategory === 'Women') {
          categoryConfig = {
            name: 'Women',
            subcategories: ['Kurtis', 'Kurta Sets', 'Tops', 'Dresses']
          };
        } else if (selectedCategory === 'Men') {
          categoryConfig = {
            name: 'Men',
            subcategories: ['Shirts', 'Sleeve Shirts', 'Trousers']
          };
        } else if (selectedCategory === 'Handmade Toys') {
          categoryConfig = {
            name: 'Handmade Toys',
            subcategories: ['Kondapalli Bommalu', 'Paintings']
          };
        }

        if (categoryConfig.name) {
          const balancedBestsellers = selectBalancedBestsellers(products, [categoryConfig], 1);
          setBestSeller(balancedBestsellers);
        } else {
          const bestProduct = products.filter((item) => item.bestseller);
          setBestSeller(bestProduct.slice(0, 5));
        }
      }
    } else {
      setBestSeller([]);
    }
  }, [products, selectedCategory]);

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-10 items-center text-center gap-2">
          <div>
            <Title text1="BEST" text2="SELLERS" />
          </div>
          <Link to="/shop/collection" className="mt-4 md:mt-0 group flex items-center text-xs font-medium hover:text-gray-700 transition-colors">
            View all bestsellers
            <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {bestSeller.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-6">
            {bestSeller.map((item, index) => (
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
                      BESTSELLER
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium">No bestsellers available</p>
            <p className="mt-2 text-sm text-gray-500">Check back soon for our bestselling items</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;