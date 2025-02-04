import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products = [], search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevent');

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
  }, [sortType, filterProducts]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 border-t pt-10 m-20">
      <div className="min-w-60">
        <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">
          Filters
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Men" onChange={toggleCategory} /> Men
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Women" onChange={toggleCategory} /> Women
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Home Furnishing" onChange={toggleCategory} /> Home Furnishing
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Kitchenware" onChange={toggleCategory} /> Kitchenware
            </p>
          </div>
        </div>
        <div className={`border border-gray-300 pl-5 py-3 mt-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">Type</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Kurtis" onChange={toggleSubCategory} /> Kurtis
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Tops" onChange={toggleSubCategory} /> Tops
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value="Blazers" onChange={toggleSubCategory} /> Blazers
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={'All'} text2={'Collections'} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {
            filterProducts.length === 0 ? (
              <div className="col-span-4 text-center text-gray-500">No products found</div>
            ) : (
              filterProducts.map((item, index) => {
                if (!item.name || !item._id || !item.price || !item.images?.length) {
                  return <div key={index} className="text-red-500">Invalid Product</div>;
                }
                return (
                  <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} />
                );
              })
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Collection;
