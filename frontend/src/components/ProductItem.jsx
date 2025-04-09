import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="cursor-pointer p-4 bg-[#e2d9cd] transition-transform" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="w-full object-cover mb-4"
          src={image[0]}
          alt={name} />
      </div>
      <p className="text-lg font-semibold text-text">{name}</p>
      <p className="text-secondary font-medium mt-2">
        {currency} {price}
      </p>
    </Link>
  );
}

export default ProductItem;