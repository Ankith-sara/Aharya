import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight, Building2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyProducts = () => {
  const { products } = useContext(ShopContext);
  const [companiesData, setCompaniesData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Company logos mapping (you can update these URLs with actual logos)
  const companyLogos = {
    'biba': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYq3HEWU4nP1xdaWDzOr7YNmV-q8yg_IJjkcrGl4El207-C31gBbfwEcPBwBiry52hQPE&usqp=CAU',
    'fabindia': 'https://logos-world.net/wp-content/uploads/2021/02/FabIndia-Logo.png',
    'aharyas': assets.logo,
    'vasudhaa vastrram vishram': 'https://brownliving.in/cdn/shop/collections/vasudhaa-vastrram-2557117.jpg?v=1755537249'
  };

  useEffect(() => {
    if (products && products.length > 0) {
      const companies = [...new Set(products.map(product =>
        product.company ? product.company.toLowerCase() : 'aharyas'
      ))];

      const companiesWithProducts = companies
        .filter(company => company !== 'independent' && company !== 'aharyas')
        .map(company => {
          const companyProducts = products.filter(product =>
            (product.company ? product.company.toLowerCase() : 'aharyas') === company
          );

          return {
            name: company,
            displayName: company.charAt(0).toUpperCase() + company.slice(1),
            products: companyProducts,
            logo: companyLogos[company] || 'https://via.placeholder.com/200x100/666666/FFFFFF?text=' + company.toUpperCase()
          };
        })
        .filter(company => company.products.length > 0);


      setCompaniesData(companiesWithProducts);
    } else {
      setCompaniesData([]);
    }
  }, [products]);


  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
  };

  if (companiesData.length === 0) {
    return (
      <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center mb-4">
              <Building2 size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium">No company products available</p>
            <p className="mt-2 text-sm text-gray-500">Check back soon for new arrivals from our partner brands</p>
          </div>
        </div>
      </section>
    );
  }

  // If a company is selected, show its products
  if (selectedCompany) {
    return (
      <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToCompanies}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Companies</span>
          </button>

          {/* Company Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                <img
                  src={selectedCompany.logo}
                  alt={`${selectedCompany.displayName} Logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/64x64/666666/FFFFFF?text=${selectedCompany.displayName.charAt(0)}`;
                  }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-light text-black">
                  {selectedCompany.displayName.toUpperCase()}
                </h2>
                <p className="text-sm text-gray-500">{selectedCompany.products.length} products available</p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {selectedCompany.products.map((item, index) => (
              <div key={index} className="group">
                <ProductItem
                  id={item._id}
                  image={item.images}
                  name={item.name}
                  price={item.price}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10 text-center gap-2">
          <div className="flex items-center justify-center gap-4">
            <div>
              <Title text1="OUR" text2="TRUSTED PARTNERS" />
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of premium brands and artisan partners
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {companiesData.map((company, index) => (
            <div
              key={index}
              onClick={() => handleCompanyClick(company)}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            >
              {/* Company Logo */}
              <div className="flex items-center justify-center mb-4 h-56">
                <img
                  src={company.logo}
                  alt={`${company.displayName} Logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x100/666666/FFFFFF?text=${company.displayName.toUpperCase()}`;
                  }}
                />
              </div>

              {/* Company Info */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-black mb-2 group-hover:text-gray-700 transition-colors">
                  {company.displayName}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {company.products.length} product{company.products.length !== 1 ? 's' : ''} available
                </p>

                {/* View Products Button */}
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600 group-hover:text-black transition-colors">
                  <span>View Products</span>
                  <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyProducts;