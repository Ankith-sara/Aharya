import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-secondary text-grey-800 py-5 pt-5">
            <div className="flex bg-primary p-5 flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-1 mx-5 mb-5">
                <div className="flex flex-col">
                    <img className="mb-2 w-52" src={assets.logo} alt="Logo" />
                    <p className="w-full md:w-2/3">
                        Bringing the best products to your doorstep with trust and quality.
                    </p>
                </div>
                <div>
                    <p className="text-xl text-text font-medium mb-2 mt-3">Quick Links</p>
                    <ul className="flex flex-col gap-1">
                        <li className="hover:text-secondary cursor-pointer"><NavLink to='/about'>About Us</NavLink></li>
                        <li className="hover:text-secondary cursor-pointer"><NavLink to='/shop/collection'>Shop Now</NavLink></li>
                        <li className="hover:text-secondary cursor-pointer"><NavLink to='/blog'>Blog</NavLink></li>
                        <li className="hover:text-secondary cursor-pointer"><NavLink to='/sell'>Sell</NavLink></li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl text-text font-medium mb-2 mt-3">Policies</p>
                    <ul className="flex flex-col gap-1">
                        <li className="hover:text-secondary cursor-pointer">Return Policy</li>
                        <li className="hover:text-secondary cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-secondary cursor-pointer">Terms & Conditions</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl text-text font-medium mb-2 mt-3">Get in Touch</p>
                    <ul className="flex flex-col gap-1">
                        <li className="hover:text-secondary cursor-pointer"><NavLink to='/contact'>Contact Us</NavLink></li>
                        <li className="hover:text-secondary">+91 9063284008</li>
                        <li className="hover:text-secondary">contact@aharya.in</li>
                    </ul>
                    <div className="flex gap-3 mt-4">
                        <NavLink to="https://www.instagram.com/aharyas.in/" target='_blank' rel="noopener noreferrer"><img src={assets.instagram_icon} className="w-6 h-6 cursor-pointer hover:opacity-80" alt="Instagram" /></NavLink>
                        <NavLink to="https://in.linkedin.com/" target='_blank' rel="noopener noreferrer"><img src={assets.linkedin_icon} className="w-6 h-6 cursor-pointer hover:opacity-80" alt="Linkedin" /></NavLink>
                        <NavLink to="https://www.pinterest.com/" target='_blank' rel="noopener noreferrer"><img src={assets.pinterest_icon} className="w-6 h-6 cursor-pointer hover:opacity-80" alt="Pinterest" /></NavLink>
                    </div>
                </div>
            </div>
            <div className="mt-1">
                <p className="py-2 text-md text-primary text-center">
                    &copy; {currentYear} Aharya. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;
