import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory } = useContext(ShopContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const location = useLocation();
  const menuRef = useRef(null);

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
      return 'bg-transparent';
    } else {
      return 'bg-black shadow-md';
    }
  };

  const categories = [
    {
      name: 'Women',
      id: 'women',
      subcategories: [
        { name: 'Kurtis', path: '/shop/Kurtis' },
        { name: 'Tops', path: '/shop/Tops' },
        { name: 'Blazers', path: '/shop/blazers' },
        { name: 'Dresses', path: '/shop/Dresses' },
        { name: 'Corset tops', path: '/shop/Corset-tops' }
      ]
    },
    {
      name: 'Home Furnishing',
      id: 'home',
      subcategories: [
        { name: 'Home Décor', path: '/shop/home-decor' },
        { name: 'Handmade Toys', path: '/shop/handmade-toys' },
        { name: 'Baskets', path: '/shop/baskets' },
        { name: 'Bags and Pouches', path: '/shop/bags&pouches' },
        { name: 'Stationery', path: '/shop/stationery' },
        { name: 'Wall Decor', path: '/shop/wall-decor' }
      ]
    },
    {
      name: 'Kitchenware',
      id: 'kitchen',
      subcategories: [
        { name: 'Brass Bowls', path: '/shop/brass' },
        { name: 'Wooden Spoons', path: '/shop/wooden-spoons' }
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
      {/* Overlay for when menu is open */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-40 ${menuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuVisible(false)} />

      {/* Navbar */}
      <div className={`fixed top-0 left-0 right-0 px-4 sm:px-6 md:px-10 lg:px-20 z-50 flex items-center justify-between text-white py-5 transition-all duration-300 ${getNavbarBackground()}`}>
        <Link to='/' onClick={() => window.location.href = '/'} className="flex-shrink-0">
          <img src={assets.logo_white} className="w-36" alt="Logo" />
        </Link>
        <div className="flex items-center gap-5">
          <div onClick={() => { setShowSearch(true); navigate('/shop/collection') }} className="cursor-pointer hover:opacity-80 transition-opacity">
            <img src={assets.search_icon} className="w-5 h-5" alt="Search" />
          </div>

          <div className="relative group">
            <div onClick={() => token ? null : navigate('/login')} className="cursor-pointer hover:opacity-80 transition-opacity">
              <img className="w-5 h-5" src={assets.profile_icon} alt="Profile" />
            </div>
            {token && (
              <div className="hidden group-hover:block absolute right-0 pt-4 z-10">
                <div className="w-44 py-3 px-4 bg-white text-gray-800 rounded-md">
                  <div className="flex flex-col gap-3">
                    <NavLink to="/profile/:id" className="hover:text-black font-medium transition-colors">
                      My Profile
                    </NavLink>
                    <NavLink to="/orders" className="hover:text-black font-medium transition-colors">
                      My Orders
                    </NavLink>
                    <button onClick={() => { if (window.confirm("Are you sure you want to log out?")) logout(); }} className="text-left hover:text-black font-medium transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to='/cart' className='relative hover:opacity-80 transition-opacity'>
            <img src={assets.cart_icon} className='w-5 h-5' alt='Cart' />
            {getCartCount() > 0 && (
              <div className={`absolute -right-1.5 -bottom-1.5 w-4 h-4 flex items-center justify-center rounded-full text-xs ${isHomePage && !isScrolled ? 'bg-black text-white' : 'bg-white text-black'}`} >
                {getCartCount()}
              </div>
            )}
          </Link>
          <button id="menu-toggle-button" onClick={() => setMenuVisible(true)} className="cursor-pointer hover:opacity-80 transition-opacity" aria-label="Menu">
            <img src={assets.menu_icon} className="w-5 h-5" alt="Menu" />
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div ref={menuRef} className={`fixed top-0 right-0 bottom-0 h-full w-full sm:w-96 md:w-96 lg:w-96 bg-white shadow-lg overflow-y-auto transition-transform duration-300 z-50 ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-black text-white p-6 flex items-center justify-between">
          <h2 className="text-xl font-medium">Menu</h2>
          <button onClick={() => setMenuVisible(false)} className="text-white hover:text-gray-300 transition-colors" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          <NavLink to="/" onClick={() => setMenuVisible(false)} className={({ isActive }) => `block p-4 hover:bg-gray-50 transition-colors ${isActive ? 'text-secondary font-medium' : 'text-gray-800'}`}>
            Home
          </NavLink>
          {/* Shop Categories */}
          <div className="py-2">
            <div className="px-4 py-3 text-gray-500 uppercase text-sm font-medium tracking-wider">
              Shop Categories
            </div>

            {categories.map((category) => (
              <div key={category.id} className="border-t border-gray-100">
                <button className="w-full flex items-center justify-between p-4 text-gray-800 hover:bg-gray-50 transition-colors" onClick={() => toggleCategoryExpansion(category.id)}>
                  <span className="font-medium">{category.name}</span>
                  {expandedCategory === category.id ?
                    <ChevronDown size={18} className="text-gray-500" /> :
                    <ChevronRight size={18} className="text-gray-500" />
                  }
                </button>

                {expandedCategory === category.id && (
                  <div className="bg-gray-50 pl-4">
                    {category.subcategories.map((subcategory) => (
                      <NavLink key={subcategory.path} to={subcategory.path} onClick={() => handleCategoryClick(subcategory.name)} className={({ isActive }) => `block p-3 pl-6 hover:bg-gray-100 text-sm transition-colors ${isActive ? 'text-secondary font-medium' : 'text-gray-600'}`}>
                        {subcategory.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="py-2">
            <div className="px-4 py-3 text-gray-500 uppercase text-sm font-medium tracking-wider">
              My Account
            </div>

            {token ? (
              <>
                <NavLink to="/profile" onClick={() => setMenuVisible(false)} className={({ isActive }) => `block p-4 hover:bg-gray-50 transition-colors ${isActive ? 'text-secondary font-medium' : 'text-gray-800'}`}>
                  My Profile
                </NavLink>
                <NavLink to="/orders" onClick={() => setMenuVisible(false)} className={({ isActive }) => `block p-4 hover:bg-gray-50 transition-colors ${isActive ? 'text-secondary font-medium' : 'text-gray-800'}`}>
                  My Orders
                </NavLink>
                <button onClick={() => {
                  if (window.confirm("Are you sure you want to log out?")) {
                    logout();
                    setMenuVisible(false);
                  }
                }} className="w-full p-4 text-left text-gray-800 font-medium hover:bg-gray-50 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setMenuVisible(false)} className="block p-4 text-gray-800 hover:bg-gray-50 transition-colors">
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