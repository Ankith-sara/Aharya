import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ChevronDown, ChevronRight, X, Search, User, Menu, LogOut, ShoppingBagIcon, ShoppingCartIcon, Heart } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getWishlistCount, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory } = useContext(ShopContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const location = useLocation();
  const menuRef = useRef(null);

  let userId = "";

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Toggle category expansion
  const toggleCategoryExpansion = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
        const menuButton = document.getElementById('menu-toggle-button');
        if (!menuButton || !menuButton.contains(event.target)) {
          setMenuVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuVisible]);

  // Control body scroll when menu is open
  useEffect(() => {
    if (menuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuVisible]);

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setMenuVisible(false);
  };

  // Determine navbar background based on home page and scroll position
  const getNavbarBackground = () => {
    if (isHomePage && !isScrolled) {
      return 'bg-transparent backdrop-blur-none';
    } else {
      return 'bg-black/95 backdrop-blur-md';
    }
  };

  const categories = [
    {
      name: 'Women',
      id: 'women',
      subcategories: [
        { name: 'Kurtis', path: '/shop/Kurtis' },
        { name: 'Kurta Sets', path: '/shop/Kurta Sets' },
        { name: 'Tops', path: '/shop/Tops' },
        { name: 'Blazers', path: '/shop/Blazers' },
        { name: 'Dresses', path: '/shop/Dresses' },
        { name: 'Co-ord Sets', path: '/shop/Women Co-ord Sets' },
        { name: 'Short-tops', path: '/shop/Short-tops' },
        { name: 'Shirts', path: '/shop/Women Shirts' },
        { name: 'Sarees', path: '/shop/Sarees' }
      ]
    },
    {
      name: 'Men',
      id: 'men',
      subcategories: [
        { name: 'Shirts', path: '/shop/Men Shirts' },
        { name: 'Sleeve Shirts', path: '/shop/Sleeve Shirts' },
        { name: 'Kurtas', path: '/shop/Kurtas' },
        { name: 'Co-ord Sets', path: '/shop/Men Co-ord Sets' },
        { name: 'Trousers', path: '/shop/Trousers' },
      ]
    },
    {
      name: 'Handmade Toys',
      id: 'home',
      subcategories: [
        { name: ' Kondapalli Bommalu', path: '/shop/Kondapalli Bommalu' },
        { name: 'Paintings', path: '/shop/Paintings' },
        { name: 'Cheriyal Masks', path: '/shop/Cheriyal Masks' },
        { name: 'Bird houses', path: '/shop/Bird houses' }
      ]
    },
    {
      name: 'Stationary',
      id: 'stationary',
      subcategories: [
        { name: 'Journals', path: '/shop/Journals' }
      ]
    },
    {
      name: 'Special Products',
      id: 'special',
      subcategories: [
        { name: 'Bags', path: '/shop/bags' }
      ]
    }
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300 z-40 ${menuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuVisible(false)} />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 px-4 sm:px-6 md:px-10 z-50 transition-all duration-300 ${getNavbarBackground()}`}>
        <div className="flex items-center justify-between text-white py-4">
          <Link to='/' onClick={() => window.location.href = '/'} className="flex-shrink-0 group">
            <img
              src={assets.logo_white}
              className="w-28 md:w-36"
              alt="Logo"
            />
          </Link>

          {/* Action Icons */}
          <div className="flex items-center">
            <button
              onClick={() => { setShowSearch(true); navigate('/shop/collection') }}
              className="p-2.5 transition-all duration-200 group"
              aria-label="Search"
            >
              <Search size={20} className="transition-transform duration-200" />
            </button>

            <div className="relative group hidden md:block">
              <button
                onClick={() => token ? null : navigate('/login')}
                className="p-2.5 transition-all duration-200 group/profile"
                aria-label="Profile"
              >
                <User size={20} className="transition-transform duration-200" />
              </button>

              {token && (
                <div className="hidden group-hover:block absolute right-0 pt-2 z-10">
                  <div className="w-52 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">My Account</p>
                    </div>
                    <div className="py-2">
                      <NavLink
                        to={`/profile/${userId}`}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-all duration-200"
                      >
                        <User size={16} className="mr-3" />
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/orders"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-all duration-200"
                      >
                        <ShoppingBagIcon size={16} className="mr-3" />
                        My Orders
                      </NavLink>
                      <button
                        onClick={() => { if (window.confirm("Are you sure you want to log out?")) logout(); }}
                        className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:text-red-600 font-medium transition-all duration-200"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to='/wishlist' className='relative group '>
              <button
                className="p-2.5 transition-all duration-200 group relative"
                aria-label="Wishlist"
              >
                <Heart size={20} className="transition-transform duration-200" />
                {getWishlistCount() > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-200 ${isHomePage && !isScrolled ? 'bg-white text-black' : 'bg-white text-black'} shadow-md`}>
                    {getWishlistCount()}
                  </span>
                )}
              </button>
            </Link>

            <Link to='/cart' className='relative group'>
              <button className="p-2.5 transition-all duration-200" aria-label="Cart">
                <ShoppingCartIcon size={20} className="transition-transform duration-200" />
                {getCartCount() > 0 && (
                  <div className={`absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-200 ${isHomePage && !isScrolled ? 'bg-white text-black' : 'bg-white text-black'} shadow-md`}>
                    {getCartCount()}
                  </div>
                )}
              </button>
            </Link>

            {/* Menu Button */}
            <button
              id="menu-toggle-button"
              onClick={() => setMenuVisible(true)}
              className="p-2.5 transition-all duration-200 group"
              aria-label="Menu"
            >
              <Menu size={20} className="transition-transform duration-200" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div ref={menuRef} className={`fixed top-0 right-0 bottom-0 h-full w-full sm:w-96 md:w-96 lg:w-96 bg-white shadow-2xl overflow-y-auto transition-transform duration-300 z-50 ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-black text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={() => setMenuVisible(false)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <NavLink
            to="/"
            onClick={() => setMenuVisible(false)}
            className={({ isActive }) => `block px-6 py-4 hover:bg-gray-50 transition-all duration-200 font-medium ${isActive ? 'text-black bg-gray-50 border-r-4 border-black' : 'text-gray-800'}`}
          >
            Home
          </NavLink>

          <div className="py-2">
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-gray-600 uppercase text-sm font-semibold tracking-wider">
                Shop Categories
              </h3>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="border-b border-gray-50 last:border-b-0">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-gray-50 transition-all duration-200 font-medium"
                  onClick={() => toggleCategoryExpansion(category.id)}
                >
                  <span>{category.name}</span>
                  <div className={`p-1 rounded-full transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-0 bg-gray-100' : 'rotate-0'}`}>
                    {expandedCategory === category.id ?
                      <ChevronDown size={18} className="text-gray-600" /> :
                      <ChevronRight size={18} className="text-gray-600" />
                    }
                  </div>
                </button>

                {expandedCategory === category.id && (
                  <div className="bg-gray-50/50 border-t border-gray-100">
                    {category.subcategories.map((subcategory) => (
                      <NavLink
                        key={subcategory.path}
                        to={subcategory.path}
                        onClick={() => handleCategoryClick(subcategory.name)}
                        className={({ isActive }) => `block px-8 py-3 hover:bg-gray-100 text-sm transition-all duration-200 border-l-2 hover:border-l-black ${isActive ? 'text-black font-medium bg-gray-100 border-l-black' : 'text-gray-600 border-l-transparent'}`}
                      >
                        {subcategory.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="py-2">
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-gray-600 uppercase text-sm font-semibold tracking-wider">
                My Account
              </h3>
            </div>

            {token ? (
              <div className="space-y-1">
                <NavLink
                  to={`/profile/${userId}`}
                  onClick={() => setMenuVisible(false)}
                  className={({ isActive }) => `flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200 font-medium ${isActive ? 'text-black bg-gray-50 border-r-4 border-black' : 'text-gray-800'}`}
                >
                  <User size={18} className="mr-3" />
                  My Profile
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={() => setMenuVisible(false)}
                  className={({ isActive }) => `flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200 font-medium ${isActive ? 'text-black bg-gray-50 border-r-4 border-black' : 'text-gray-800'}`}
                >
                  <ShoppingBagIcon size={18} className="mr-3" />
                  My Orders
                </NavLink>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to log out?")) {
                      logout();
                      setMenuVisible(false);
                    }
                  }}
                  className="w-full flex items-center px-6 py-4 text-left text-gray-800 font-medium hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuVisible(false)}
                className="flex items-center px-6 py-4 text-gray-800 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <User size={18} className="mr-3" />
                Login / Sign Up
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;