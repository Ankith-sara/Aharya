import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

const Collections = () => {
  const { setSelectedSubCategory } = useContext(ShopContext);

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const categories = [
    {
      name: 'Kurtis',
      imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1734960230/xwz3navthgy7tlzkiqma.webp',
      description: 'Elegant, handcrafted designs'
    },
    {
      name: 'Tops',
      imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1734961885/xmrbsna2rywkv2j801ky.webp',
      description: 'Chic silhouettes for everyday'
    },
    {
      name: 'Wall Decor',
      imageUrl: 'https://okhai.org/cdn/shop/files/7_e28f8fae-bd02-4f11-9917-a8fc4a4fd462.jpg?v=1716982545',
      description: 'Artful pieces for your space'
    },
    {
      name: 'Bags',
      imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1744127544/igwttafu4fgj6pwb54yw.webp',
      description: 'Handcrafted with care'
    },
  ];

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Title text1="EXPLORE THE" text2="COLLECTIONS" />
        </div>

        {/* Featured collections grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={category.name} className="flex flex-col h-full">
              <NavLink to={`/shop/${category.name}`} onClick={() => handleCategoryClick(category.name)} className="group h-full">
                <div className="relative overflow-hidden aspect-[3/4] mb-4">
                  <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="mt-1 w-8 h-8 rounded-full border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;