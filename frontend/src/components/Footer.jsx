import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { NavLink } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <img className="h-12 mb-6" src={assets.logo_white} alt="Aharya Logo" />
            <p className="text-gray-400 mb-8 pr-4 leading-relaxed">
              Bringing the finest curated products to your doorstep with a commitment to quality, authenticity, and exceptional service. Elevate your lifestyle with our premium selections.
            </p>
            <div className="flex space-x-4">
              <NavLink to="https://www.instagram.com/aharyass/" target='_blank' rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors rounded-xl">
                <Instagram size={24} />
              </NavLink>
              <NavLink to="https://in.linkedin.com/" target='_blank' rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors rounded-xl">
                <Linkedin size={24} />
              </NavLink>
              <NavLink to="https://www.pinterest.com/" target='_blank' rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors rounded-xl">
                <Twitter size={24} />
              </NavLink>
            </div>
          </div>
          
          {/* Quick Links column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium tracking-widest uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <NavLink to='/about' className="text-gray-400 hover:text-white transition-colors">About Us</NavLink>
              </li>
              <li>
                <NavLink to='/shop/collection' className="text-gray-400 hover:text-white transition-colors">Shop Now</NavLink>
              </li>
              <li>
                <NavLink to='/blog' className="text-gray-400 hover:text-white transition-colors">Blog</NavLink>
              </li>
              <li>
                <NavLink to='/sell' className="text-gray-400 hover:text-white transition-colors">Sell</NavLink>
              </li>
            </ul>
          </div>
          
          {/* Policies column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium tracking-widest uppercase mb-6">Policies</h4>
            <ul className="space-y-3">
              <li>
                <NavLink to='/' className="text-gray-400 hover:text-white transition-colors">Return Policy</NavLink>
              </li>
              <li>
                <NavLink to='/' className="text-gray-400 hover:text-white transition-colors">Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to='/' className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</NavLink>
              </li>
              <li>
                <NavLink to='/' className="text-gray-400 hover:text-white transition-colors">Shipping Policy</NavLink>
              </li>
            </ul>
          </div>
          
          {/* Contact column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-medium tracking-widest uppercase mb-6">Contact Us</h4>
            <ul className="space-y-4">
            <li>
                <NavLink to='/contact' className="text-gray-400 hover:text-white transition-colors">Contact Us</NavLink>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 flex-shrink-0 text-gray-400" />
                <span className="text-gray-400">+91 9063284008</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 flex-shrink-0 text-gray-400" />
                <span className="text-gray-400">contact@aharya.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Aharya. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">FAQs</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Support</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;