import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

function LatestCollection() {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    } else {
      setLatestProducts([]);
    }
  }, [products]);

  return (
    <div className="my-10 mx-20 bg-primary py-5 px-10 rounded-lg shadow-lg">
      <div className="text-center py-8 text-3xl text-text">
        <Title text1="Latest" text2="Collection" />
        <p className="w-3/4 m-auto text-sm md:text-base text-text-light">
          Discover our newest arrivals, carefully selected to bring you the best in style, comfort, and innovation.
        </p>
      </div>
      {latestProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {latestProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.images} name={item.name} price={item.price} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-xl text-text-light">No products available</div>
      )}
    </div>
  );
}

export default LatestCollection;