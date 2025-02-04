import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className="mt-24">
      <div className="text-center text-3xl py-2">
        <Title text1="Related" text2="Products" />
      </div>
      <div className="grid grid-cols-2 pt-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.length === 0 ? (
          <p>No related products found.</p>
        ) : (
          related.map((item) => (
            <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.images} />
          ))
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;