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
      name: 'Dresses',
      imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1760774064/z6gonpmd9fqihaq0bw7x.webp',
      description: 'Elegant, handcrafted designs'
    },
    {
      name: 'Tops',
      imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1760803957/zoavoiw2al1kj8zy2uee.webp',
      description: 'Elegant, handcrafted designs'
    },
    {
      name: 'Men Shirts',
      imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1757408846/ab80rkpc7iqiekkdlhnx.webp',
      description: 'Classic and trendy for every occasion'
    },
    {
      name: 'Sleeve Shirts',
      imageUrl: 'https://res.cloudinary.com/dfzhqsfp7/image/upload/v1757408272/x9rzv13ziubou4qbrt84.webp',
      description: 'Handcrafted with care'
    },
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title text1="EXPLORE THE" text2="COLLECTIONS" />
        </div>
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