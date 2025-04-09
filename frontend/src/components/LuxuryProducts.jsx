import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'; // You can use any icon library you prefer

const LuxuryProducts = () => {
  const { products = [] } = useContext(ShopContext);
  const [luxuryProducts, setLuxuryProducts] = useState([]);

  useEffect(() => {
    const specialProducts = products.filter(
      (product) => product.category?.toLowerCase() === 'special product'
    );
    setLuxuryProducts(specialProducts);
  }, [products]);

  return (
    <div className="bg-primary py-12 px-4 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Text Section - Left */}
        <div className="text-left text-text space-y-4">
          <Title text1="Special" text2="Products" />
          <p className="text-sm md:text-base text-text-light">
            Discover our exquisite collection of premium handcrafted luxury items. Each piece is
            meticulously designed with the finest materials and exceptional attention to detail.
          </p>
          <NavLink
            to="/shop/bags"
            className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            Shop Now <ArrowRight size={16} />
          </NavLink>
        </div>

        {/* Product Section - Right */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
            {luxuryProducts.length > 0 ? (
              luxuryProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  id={item._id}
                  image={item.images}
                  name={item.name}
                  price={item.price}
                />
              ))
            ) : (
              <div className="text-text-light text-center w-full py-10">
                No products available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryProducts;