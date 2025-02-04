import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-3 px-[4%] justify-between bg-background text-text shadow-md">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="Logo" />
      <button onClick={() => setToken('')} className="bg-secondary hover:bg-text hover:text-primary text-background px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300" >
        Logout
      </button>
    </div>
  );
};

export default Navbar;