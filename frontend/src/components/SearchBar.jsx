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
        <div className="border-t border-gray-300 bg-gray-100 py-3 px-4 text-center m-20 mb-[-80px]">
            <div className="flex items-center justify-center bg-white border border-gray-400 rounded-full px-4 py-2 mx-auto max-w-xl shadow-md">
                <input className="flex-1 outline-none bg-transparent text-gray-700 text-sm placeholder-gray-400" type="text" value={search || ''} onChange={(e) => setSearch?.(e.target.value)} placeholder="Search for products..." aria-label="Search"/>
                <button type="button" className="focus:outline-none">
                    <img className="w-5 h-5" src={assets.search_icon} alt="Search Icon" />
                </button>
                <button onClick={() => setShowSearch?.(false)} className="ml-3 focus:outline-none" >
                    <img className="w-5 h-5" src={assets.cross_icon} alt="Close Icon" />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;