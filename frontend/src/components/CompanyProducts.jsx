import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight, Building2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const CompanyProducts = () => {
  const { products } = useContext(ShopContext);
  const [companyProducts, setCompanyProducts] = useState([]);

  const companyData = {
    name: 'vasudhaa vastrram vishram',
    displayName: 'Vasudhaa Vastrram Vishram',
    logo: 'https://brownliving.in/cdn/shop/collections/vasudhaa-vastrram-2557117.jpg?v=1755537249',
    description: 'Authentic traditional wear and sustainable fashion'
  };

  useEffect(() => {
    if (products && products.length > 0) {
      const filteredProducts = products.filter(product => {
        const productCompany = product.company ? product.company.toLowerCase() : '';
        return productCompany === companyData.name;
      });
      setCompanyProducts(filteredProducts.slice(0, 4));
    } else {
      setCompanyProducts([]);
    }
  }, [products]);

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col mb-10 items-center text-center gap-2">
          <Title text1="OUR" text2="TRUSTED PARTNERS" />
          <NavLink
            to={`/shop/company/${companyData.name}`}
            className="mt-4 md:mt-0 group flex items-center text-xs font-medium hover:text-gray-700 transition-colors"
          >
            View all products
            <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </NavLink>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={companyData.logo}
                    alt={`${companyData.displayName} Logo`}
                    className="max-w-full h-24 lg:h-full object-contain"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/200x100/666666/FFFFFF?text=${companyData.displayName.split(' ').map(w => w[0]).join('')}`;
                    }}
                  />
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-sm text-gray-600 mb-3">
                    {companyData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {companyProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-gray-100 rounded-lg">
                <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Building2 size={32} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium">No products available from {companyData.displayName}</p>
                <p className="mt-2 text-sm text-gray-500">Check back soon for new arrivals</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-6">
                {companyProducts.map((item, index) => (
                  <div key={index} className="group">
                    <div className="relative overflow-hidden">
                      <ProductItem
                        id={item._id}
                        image={item.images}
                        name={item.name}
                        price={item.price}
                      />
                      {index < 1 && (
                        <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 font-medium">
                          FEATURED
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProducts;