import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className=" bg-primary py-5 px-4 md:px-10">
      <div className="text-center py-8 text-3xl text-text">
        <Title text1="Best" text2="Sellers" />
        <p className="w-full md:w-3/4 m-auto text-sm md:text-base text-text-light">
          Explore our top picks that customers love the most. These bestsellers define quality and elegance.
        </p>
      </div>
      {bestSeller.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {bestSeller.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.images} name={item.name} price={item.price} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-xl text-text-light">No products available</div>
      )}
    </div>
  );
};

export default BestSeller;