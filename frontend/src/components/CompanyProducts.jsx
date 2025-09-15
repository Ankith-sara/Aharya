import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight, Building2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const CompanyProducts = () => {
  const { products } = useContext(ShopContext);
  const [companyProducts, setCompanyProducts] = useState([]);

  // Company data for Vasudhaa Vastrram Vishram
  const companyData = {
    name: 'vasudhaa vastrram vishram',
    displayName: 'Vasudhaa Vastrram Vishram',
    logo: 'https://brownliving.in/cdn/shop/collections/vasudhaa-vastrram-2557117.jpg?v=1755537249',
    description: 'Authentic traditional wear and sustainable fashion'
  };

  useEffect(() => {
    if (products && products.length > 0) {
      // Filter products for Vasudhaa Vastrram Vishram company
      const filteredProducts = products.filter(product => {
        const productCompany = product.company ? product.company.toLowerCase() : '';
        return productCompany === companyData.name;
      });

      setCompanyProducts(filteredProducts.slice(0, 4)); // Limit to 10 products
    } else {
      setCompanyProducts([]);
    }
  }, [products]);

  if (companyProducts.length === 0) {
    return (
      <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center mb-4">
              <Building2 size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium">No products available from {companyData.displayName}</p>
            <p className="mt-2 text-sm text-gray-500">Check back soon for new arrivals</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Main Container with Left Logo and Right Products */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-1/4 flex flex-col items-center lg:items-start">
            <div className="sticky top-8">
              {/* Company Logo */}
              <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
                <div className="flex items-center justify-center h-32 mb-4">
                  <img
                    src={companyData.logo}
                    alt={`${companyData.displayName} Logo`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/200x100/666666/FFFFFF?text=${companyData.displayName.split(' ').map(w => w[0]).join('')}`;
                    }}
                  />
                </div>
                
                {/* Company Info */}
                <div className="text-center lg:text-left">
                  <h2 className="text-xl font-medium text-black mb-2">
                    {companyData.displayName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {companyData.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {companyProducts.length} product{companyProducts.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>

              {/* View All Products Link */}
              <NavLink 
                to={`/shop/company/${companyData.name}`} 
                className="group flex items-center text-xs font-medium hover:text-gray-700 transition-colors justify-center lg:justify-start"
              >
                View all products
                <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </NavLink>
            </div>
          </div>

          <div className="lg:w-3/4">
            {/* Title Section */}
            <div className="flex flex-col mb-10 items-center lg:items-start text-center lg:text-left gap-2">
              <div>
                <Title text1="OUR" text2="TRUSTED PARTNERS" />
              </div>
              <p className="text-gray-600 max-w-2xl">
                Discover our curated selection from {companyData.displayName}
              </p>
            </div>

            {/* Products Grid */}
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

            {companyProducts.length >= 10 && (
              <div className="flex justify-center mt-10">
                <NavLink 
                  to={`/shop/company/${companyData.name}`}
                  className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  View More Products
                  <ChevronRight size={16} />
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProducts;