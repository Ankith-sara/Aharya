import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
    return (
        <div className="w-[18%] min-h-screen bg-[#e5e5cb] text-primary shadow-md">
            <div className="flex flex-col gap-4 pt-8 pl-[20%] text-[15px]">
                <NavLink className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-l-full transition-all duration-300 border-2  ${isActive ? 'bg-secondary text-background border-[#3c2a21]' : 'hover:bg-text hover:text-primary border-text'}`} to="/add" >
                    <img className="w-6 h-6" src={assets.add_icon} alt="Add Icon" />
                    <p className="hidden md:block font-semibold">Add Items</p>
                </NavLink>
                <NavLink className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-l-full transition-all duration-300 border-2 ${isActive ? 'bg-secondary text-background border-secondary' : 'hover:bg-text hover:text-primary border-text'}`} to="/list" >
                    <img className="w-6 h-6" src={assets.order_icon} alt="List Icon" />
                    <p className="hidden md:block font-semibold">List Items</p>
                </NavLink>
                <NavLink className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-l-full transition-all duration-300 border-2 ${isActive ? 'bg-secondary text-background border-secondary' : 'hover:bg-text hover:text-primary border-text'}`} to="/orders" >
                    <img className="w-6 h-6" src={assets.order_icon} alt="Orders Icon" />
                    <p className="hidden md:block font-semibold">Orders</p>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;