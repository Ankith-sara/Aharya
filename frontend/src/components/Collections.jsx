import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';

const Collections = () => {
  const { setSelectedSubCategory } = useContext(ShopContext);

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const categories = [
    { name: 'Kurtis', imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1734960230/xwz3navthgy7tlzkiqma.webp' },
    { name: 'Tops', imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1734961885/xmrbsna2rywkv2j801ky.webp' },
    { name: 'Shirts', imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1734967987/whht2yjmwpd9e8knhmvz.jpg' },
    { name: 'Trousers', imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1734969084/r7ep2jregib2dxl1xve4.webp' },
  ];

  return (
    <div className="bg-primary py-5 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="text-center py-8 text-3xl text-text">
        <Title text1="Explore the" text2="Collection" />
        <p className="w-full sm:w-3/4 m-auto text-sm md:text-base text-text-light">
          Explore our collections tailored for every style and occasion.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <NavLink key={category.name} to={`/shop/${category.name}`} onClick={() => handleCategoryClick(category.name)} className="group relative overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-white text-lg font-semibold">{category.name}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Collections;