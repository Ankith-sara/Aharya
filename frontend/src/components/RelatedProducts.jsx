import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      let filteredProducts = products
        .filter((item) => item.category === category && item.subCategory === subCategory)
        .filter((item) => item._id !== currentProductId);
      setRelated(filteredProducts.slice(0, 5));
    }
  }, [products, category, subCategory, currentProductId]);

  return (
    <div className="mt-10 p-6">
      <div className="text-center text-3xl py-2">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>
      <div className="grid grid-cols-2 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6">
        {related.length === 0 ? (
          <p>No related products found.</p>
        ) : (
          related.map((item) => (
            <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.images} company={item.company} />
          ))
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;