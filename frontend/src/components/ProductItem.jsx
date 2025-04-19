import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="group cursor-pointer" to={`/product/${id}`}>
      <div className="relative overflow-hidden">
        <img className="w-full object-cover mb-4 transition-opacity duration-300 group-hover:opacity-0" src={image[0]} alt={name} />
        <img className="w-full object-cover mb-4 absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" src={image[1]} alt={`${name} alternate`} />
      </div>
      <p className="text-sm font-medium text-text">{name}</p>
      <p className="text-text font-semibold mt-2">
        {currency} {price}
      </p>
    </Link>
  );
};

export default ProductItem;