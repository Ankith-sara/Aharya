import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext) || {};
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    if (!showSearch || !visible) return null;

    return (
        <div className="border-t border-secondary bg-primary py-4 px-4 text-center mt-20 mb-[-80px]">
            <div className="flex items-center justify-center bg-white border-2 border-secondary rounded-full px-5 py-3 mx-auto max-w-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <input  className="flex-1 outline-none bg-transparent text-text text-sm md:text-base placeholder-text-light px-2"  type="text"  value={search || ''}  onChange={(e) => setSearch?.(e.target.value)}  placeholder="Search for products..."  aria-label="Search" />
                <button  type="button"  className="focus:outline-none hover:scale-110 transition-transform duration-300">
                    <img className="w-5 h-5" src={assets.search_icon} alt="Search Icon" />
                </button>
                <button onClick={() => setShowSearch?.(false)} >
                    <img className="w-4 h-4" src={assets.cross_icon} alt="Close Icon" />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;