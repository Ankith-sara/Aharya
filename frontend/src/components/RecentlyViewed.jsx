import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RecentlyViewed = () => {
  const { getRecentlyViewed } = useContext(ShopContext);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const viewed = getRecentlyViewed();
    setRecentlyViewed(viewed);
  }, [getRecentlyViewed]);

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="mt-10 p-6">
      <div className="text-center text-3xl py-2">
        <Title text1="RECENTLY" text2="VIEWED" />
      </div>
      <div className="grid grid-cols-2 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6">
        {recentlyViewed.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.images}
            company={item.company}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;