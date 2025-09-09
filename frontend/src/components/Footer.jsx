import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { NavLink } from 'react-router-dom';
import {
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  FileText,
  HelpCircle,
  User,
  Home,
  Info,
  Settings,
  Shield,
  Truck,
  Heart,
  Search,
  Globe,
  Users,
  Leaf,
  Target
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sdgGoals = [
    {
      number: "1",
      title: "No Poverty",
      description: "Supporting artisan livelihoods and creating sustainable income opportunities",
      icon: <Users size={16} />
    },
    {
      number: "5",
      title: "Gender Equality",
      description: "Empowering women artisans and promoting inclusive economic growth",
      icon: <Heart size={16} />
    },
    {
      number: "8",
      title: "Decent Work",
      description: "Providing fair employment and economic opportunities for craftspeople",
      icon: <Target size={16} />
    },
    {
      number: "12",
      title: "Responsible Consumption",
      description: "Promoting sustainable production and conscious consumption patterns",
      icon: <Leaf size={16} />
    }
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-8">
            <div>
              <img className="h-10 sm:h-12 mb-4 lg:mb-6" src={assets.logo_white} alt="Aharya Logo" />
              <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base pr-0 lg:pr-4">
                Bringing you the finest curated handcrafted products with a commitment to quality,
                authenticity, and exceptional service. Each piece tells a story of artisan craftsmanship
                and cultural heritage.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              <NavLink
                to="https://www.instagram.com/aharyass/"
                target='_blank'
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-700 hover:border-white hover:bg-gray-800 transition-all duration-300 rounded-lg group"
              >
                <Instagram size={16} className="group-hover:text-white transition-colors" />
              </NavLink>
              <NavLink
                to="https://in.linkedin.com/in/aharya-in-3a265633a"
                target='_blank'
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-700 hover:border-white hover:bg-gray-800 transition-all duration-300 rounded-lg group"
              >
                <Linkedin size={16} className="group-hover:text-white transition-colors" />
              </NavLink>
              <NavLink
                to="https://www.pinterest.com/"
                target='_blank'
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-700 hover:border-white hover:bg-gray-800 transition-all duration-300 rounded-lg group"
              >
                <Twitter size={16} className="group-hover:text-white transition-colors" />
              </NavLink>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-7 lg:pl-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Quick Links */}
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <Settings size={14} className="text-gray-300" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium tracking-widest uppercase">Quick Links</h4>
                </div>
                <ul className="space-y-2 lg:space-y-3">
                  <li>
                    <NavLink to='/about' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <Info size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      About Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/contact' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <Mail size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Contact Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/shop/collection' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <Search size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Shop Collection
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/sell' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <Heart size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Sell With Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/blog' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <FileText size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Blog
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Policies & Legal */}
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <FileText size={14} className="text-gray-300" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium tracking-widest uppercase">Policies</h4>
                </div>
                <ul className="space-y-2 lg:space-y-3">
                  <li>
                    <NavLink to='/shippingpolicy' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <Truck size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Shipping Policy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/refundpolicy' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <Shield size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Return Policy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/privacypolicy' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <Shield size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Privacy Policy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/termsconditions' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <FileText size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Terms & Conditions
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Support & Help */}
              <div className="space-y-4 lg:space-y-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <HelpCircle size={14} className="text-gray-300" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium tracking-widest uppercase">Support</h4>
                </div>
                <ul className="space-y-2 lg:space-y-3">
                  <li>
                    <NavLink to='/support' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <HelpCircle size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      Get Help
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/faqs' className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <HelpCircle size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                      FAQs
                    </NavLink>
                  </li>
                  <li className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                    <Phone size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                    +91 9063284008
                  </li>
                  <li className="text-gray-400 hover:text-white transition-colors font-light flex items-center group text-sm">
                    <Mail size={12} className="mr-2 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                    aharyasofficial@gmail.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">

            {/* Copyright */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-gray-400 text-xs sm:text-sm font-light mb-1">
                &copy; {currentYear} Aharya. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs font-light">
                Handcrafted with care, delivered with precision.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs order-3 lg:order-2">
              <NavLink to="/faqs" className="text-gray-500 hover:text-white transition-colors duration-300 font-light">
                FAQs
              </NavLink>
              <span className="text-gray-700 hidden sm:inline">|</span>
              <NavLink to="/support" className="text-gray-500 hover:text-white transition-colors duration-300 font-light">
                Support
              </NavLink>
              <span className="text-gray-700 hidden sm:inline">|</span>
              <NavLink to="/sitemap" className="text-gray-500 hover:text-white transition-colors duration-300 font-light">
                Sitemap
              </NavLink>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-3 sm:gap-4 order-1 lg:order-3">
              <div className="flex items-center text-xs text-gray-500">
                <Shield size={10} className="mr-1 text-green-400 flex-shrink-0" />
                <span className="font-light">Secure</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Truck size={10} className="mr-1 text-blue-400 flex-shrink-0" />
                <span className="font-light">Fast Shipping</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Heart size={10} className="mr-1 text-red-400 flex-shrink-0" />
                <span className="font-light">Ethical</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;