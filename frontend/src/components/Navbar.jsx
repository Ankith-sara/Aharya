import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets, products } from '../assets/frontend_assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory } = useContext(ShopContext)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mobileDropdownVisible, setMobileDropdownVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Toggle category expansion
  const toggleCategoryExpansion = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside menu slide
  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (visible && menuRef.current && !menuRef.current.contains(event.target)) {
        const menuButton = document.getElementById('menu-toggle-button');
        if (!menuButton || !menuButton.contains(event.target)) {
          setVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutsideMenu);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [visible]);

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setVisible(false)
    closeDropdown();
  };

  return (
    <>
      <div className={`fixed inset-0 bg-text bg-opacity-75 backdrop-blur-sm transition-opacity duration-300 z-10 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setVisible(false)}></div>
      <div className={`fixed top-0 left-0 right-0 px-4 sm:px-8 md:px-16 lg:px-24 z-20 flex items-center justify-between text-white py-5 font-medium transition-colors duration-300 ${isScrolled ? 'bg-secondary shadow-md' : 'bg-transparent'}`}>
        <Link to='/'>
          <img src={assets.logo_white} className="w-36" alt="Logo" />
        </Link>

        {/* Desktop navigation */}
        <div className="flex items-center gap-3 sm:gap-3 md:gap-4 lg:gap-6">
          <img onClick={() => { setShowSearch(true); navigate('/shop/collection') }} src={assets.search_icon} className="w-5 cursor-pointer" alt="" />
          <div className="group relative">
            <img onClick={() => token ? null : navigate('/login')} className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              {token && (
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-28 sm:w-36 md:w-44 py-2 sm:py-3 md:py-4 px-3 sm:px-5 md:px-6 bg-primary text-text rounded">
                  <p className="cursor-pointer hover:text-secondary" onClick={() => navigate('/profile')}> My Profile </p>
                  <p className="cursor-pointer hover:text-secondary" onClick={() => navigate('/orders')}> Orders </p>
                  <p className="cursor-pointer hover:text-secondary" onClick={() => { if (window.confirm("Are you sure you want to log out?")) logout(); }}> Logout </p>
                </div>
              )}
            </div>
          </div>
          <Link to='/cart' className='relative'>
            <img src={assets.cart_icon} className='w-5 min-w-5' alt='' />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
          </Link>
          <img id="menu-toggle-button" onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer" alt="Menu" />
        </div>

        {/* Menu Slide */}
        <div ref={menuRef} className={`fixed top-0 right-0 bottom-0 h-full overflow-y-auto bg-primary shadow-lg transition-all duration-300 z-30 ${visible ? 'w-full sm:w-96 md:w-96 lg:w-[32rem]' : 'w-0'}`}>
          <div className="flex flex-col h-full text-text">
            <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-4 bg-secondary cursor-pointer">
              <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
              <p className="text-lg font-medium">Back</p>
            </div>
            {/* Menu Links */}
            <div className="flex flex-col flex-grow">
              <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold" to='/'> Home </NavLink>
              <div className="relative">
                <button className="w-full py-4 px-6 text-lg font-semibold border-b text-left flex justify-between items-center" onClick={() => setMobileDropdownVisible(!mobileDropdownVisible)}>
                  Shop Now
                  <span className={`transition-transform ${mobileDropdownVisible ? "rotate-180" : "rotate-0"}`}>
                    <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                  </span>
                </button>

                {mobileDropdownVisible && (
                  <div className="border-b bg-primary">
                    {/* Women Category */}
                    <div className="border-b">
                      <button className="w-full py-3 px-8 text-base font-medium text-left flex justify-between items-center" onClick={() => toggleCategoryExpansion('women')}>
                        Women
                        <span className={`transition-transform ${expandedCategory === 'women' ? "rotate-180" : "rotate-0"}`}>
                          <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                        </span>
                      </button>

                      {expandedCategory === 'women' && (
                        <div className="py-2 bg-primary">
                          <NavLink to="/shop/Kurtis" onClick={() => { handleCategoryClick('Kurtis') }} className="block w-full py-2 px-12 text-base"> Kurtis </NavLink>
                          <NavLink to="/shop/Tops" onClick={() => { handleCategoryClick('Tops') }} className="block w-full py-2 px-12 text-base"> Tops </NavLink>
                          <NavLink to="/shop/blazers" onClick={() => { handleCategoryClick('Blazers') }} className="block w-full py-2 px-12 text-base"> Blazers </NavLink>
                          <NavLink to="/shop/Dresses" onClick={() => { handleCategoryClick('Dresses') }} className="block w-full py-2 px-12 text-base"> Dresses </NavLink>
                          <NavLink to="/shop/Corset-tops" onClick={() => { handleCategoryClick('Corset-tops') }} className="block w-full py-2 px-12 text-base"> Corset tops </NavLink>
                        </div>
                      )}
                    </div>
                    {/* Home Furnishing Category */}
                    <div className="border-b">
                      <button className="w-full py-3 px-8 text-base font-medium text-left flex justify-between items-center" onClick={() => toggleCategoryExpansion('home')}>
                        Home Furnishing
                        <span className={`transition-transform ${expandedCategory === 'home' ? "rotate-180" : "rotate-0"}`}>
                          <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                        </span>
                      </button>
                      {expandedCategory === 'home' && (
                        <div className="py-2 bg-primary">
                          <NavLink to="/shop/home-decor" onClick={() => { handleCategoryClick('Home Décor') }} className="block w-full py-2 px-12 text-base"> Home Décor</NavLink>
                          <NavLink to="/shop/handmade-toys" onClick={() => { handleCategoryClick('Handmade Toys') }} className="block w-full py-2 px-12 text-base"> Handmade Toys</NavLink>
                          <NavLink to="/shop/baskets" onClick={() => { handleCategoryClick('baskets') }} className="block w-full py-2 px-12 text-base"> Baskets</NavLink>
                          <NavLink to="/shop/bags&pouches" onClick={() => { handleCategoryClick('Bags and Pouches') }} className="block w-full py-2 px-12 text-base"> Bags and Pouches</NavLink>
                          <NavLink to="/shop/stationery" onClick={() => { handleCategoryClick('Stationery') }} className="block w-full py-2 px-12 text-base"> Stationery</NavLink>
                          <NavLink to="/shop/wall-decor" onClick={() => { handleCategoryClick('Wall Decor') }} className="block w-full py-2 px-12 text-base"> Wall Decor</NavLink>
                        </div>
                      )}
                    </div>
                    {/* Kitchenware Category */}
                    <div className="border-b">
                      <button className="w-full py-3 px-8 text-base font-medium text-left flex justify-between items-center" onClick={() => toggleCategoryExpansion('kitchen')} >
                        Kitchenware
                        <span className={`transition-transform ${expandedCategory === 'kitchen' ? "rotate-180" : "rotate-0"}`}>
                          <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                        </span>
                      </button>
                      {expandedCategory === 'kitchen' && (
                        <div className="py-2 bg-primary">
                          <NavLink to="/shop/brass" onClick={() => { handleCategoryClick('Brass'); setVisible(false); }} className="block w-full py-2 px-12 text-base"> Brass Bowls</NavLink>
                          <NavLink to="/shop/wooden-spoons" onClick={() => { handleCategoryClick('Wooden Spoons'); setVisible(false); }} className="block w-full py-2 px-12 text-base"> Wooden Spoons</NavLink>
                        </div>
                      )}
                    </div>
                    {/* Special Products Category */}
                    <div className="border-b">
                      <button className="w-full py-3 px-8 text-base font-medium text-left flex justify-between items-center" onClick={() => toggleCategoryExpansion('special')} >
                        Special Products
                        <span className={`transition-transform ${expandedCategory === 'special' ? "rotate-180" : "rotate-0"}`}>
                          <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                        </span>
                      </button>
                      {expandedCategory === 'special' && (
                        <div className="py-2 bg-primary">
                          <NavLink to="/shop/bags" onClick={() => { handleCategoryClick('Bags'); setVisible(false); }} className="block w-full py-2 px-12 text-base"> Bags</NavLink>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Additional links */}
              {token ? (
                <>
                  <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold" to='/profile'> My Profile </NavLink>
                  <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold" to='/orders'> My Orders </NavLink>
                  <button onClick={() => { if (window.confirm("Are you sure you want to log out?")) { logout(); setVisible(false); } }} className="py-4 px-6 border-b text-lg font-semibold text-left">Logout</button>
                </>
              ) : (
                <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold" to='/login'> Login / Sign Up </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;