import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight, Building2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const CompanyProducts = () => {
  const { products } = useContext(ShopContext);
  const [vasudhaaProducts, setVasudhaaProducts] = useState([]);
  const [anemoneProducts, setAnemoneProducts] = useState([]);

  const companies = [
    {
      name: 'vasudhaa vastrram vishram',
      displayName: 'Vasudhaa Vastrram Vishram',
      logo: 'https://brownliving.in/cdn/shop/collections/vasudhaa-vastrram-2557117.jpg?v=1755537249',
      description: 'Authentic traditional wear and sustainable fashion'
    },
    {
      name: 'anemone vinkel',
      displayName: 'Anemone Vinkel',
      logo: 'https://anemonevinkel.com/cdn/shop/files/Anemone-Logo-Png_2_1445x.png?v=1730113307',
      description: 'Contemporary designs with timeless elegance'
    }
  ];

  useEffect(() => {
    if (products && products.length > 0) {
      // Filter Vasudhaa products
      const filteredVasudhaa = products.filter(product => {
        const productCompany = product.company ? product.company.toLowerCase() : '';
        return productCompany === companies[0].name;
      });
      setVasudhaaProducts(filteredVasudhaa.slice(0, 4));

      // Filter Anemone Vinkel products
      const filteredAnemone = products.filter(product => {
        const productCompany = product.company ? product.company.toLowerCase() : '';
        return productCompany === companies[1].name;
      });
      setAnemoneProducts(filteredAnemone.slice(0, 4));
    } else {
      setVasudhaaProducts([]);
      setAnemoneProducts([]);
    }
  }, [products]);

  const CompanySection = ({ company, products: companyProducts }) => (
    <div className="mb-16 last:mb-0">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-1/4">
          <div className="sticky top-8">
            <div className="w-full border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={company.logo}
                  alt={`${company.displayName} Logo`}
                  className="max-w-full h-24 lg:h-full object-contain"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x100/666666/FFFFFF?text=${company.displayName.split(' ').map(w => w[0]).join('')}`;
                  }}
                />
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.displayName}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {company.description}
                </p>
                <NavLink
                  to={`/shop/company/${company.name}`}
                  className="inline-flex items-center text-sm font-medium text-black hover:text-black transition-colors group"
                >
                  View all products
                  <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </NavLink>
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
              <p className="text-lg font-medium">No products available from {company.displayName}</p>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-12 items-center text-center gap-2">
          <Title text1="OUR" text2="TRUSTED PARTNERS" />
          <p className="text-gray-600 max-w-2xl mt-2">
            Discover curated collections from our featured brand partners
          </p>
        </div>

        <CompanySection company={companies[0]} products={vasudhaaProducts} />

        <div className="border-t border-gray-200 my-12"></div>

        <CompanySection company={companies[1]} products={anemoneProducts} />
      </div>
    </section>
  );
};

export default CompanyProducts;