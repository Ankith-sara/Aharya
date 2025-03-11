import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets, products } from '../assets/frontend_assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory,SelectedSubCategory } = useContext(ShopContext)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    closeDropdown();
  };
  return (
    <div className={`fixed top-0 left-0 right-0 z-20 flex items-center justify-around text-white py-5 font-medium transition-colors duration-300 ${isScrolled ? 'bg-secondary shadow-md' : 'bg-transparent'}`}>
      <Link to='/'>
        <img src={assets.logo_white} className="w-36" alt="Logo" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-grey-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className="w-2/4 h-[2px] bg-gray-700 border-none hidden" />
        </NavLink>
        <div className="relative group" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex flex-col items-center gap-1">
            <p className="flex flex-row gap-1 items-center">Shop Now <span className={`flex items-center transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}> &#x2B9F; </span> </p>
          </button>
          <div className={`${isOpen ? 'flex' : 'hidden'} fixed bg-primary shadow-md mt-3  p-10 left-60 right-60 transition-all duration-300 ease-in-out`} >
            <div className="flex flex-row gap-10 justify-between items-start">
              <div className="flex flex-row gap-8 text-sm text-text">
                <div>
                  <h4 className="mb-2 text-lg">Women:</h4>
                  <ul className="flex flex-col gap-2 text-gray-600">
                    <li> <NavLink to="/shop/Kurtis" onClick={() => handleCategoryClick('Kurtis')} className="hover:text-secondary" > Kurtis </NavLink> </li>
                    <li> <NavLink to="/shop/Tops" onClick={() => handleCategoryClick('Tops')} className="hover:text-secondary" > Tops </NavLink> </li>
                    <li> <NavLink to="/shop/blazers" onClick={() => handleCategoryClick('Blazers')} className="hover:text-secondary" > Blazers </NavLink> </li>
                    <li> <NavLink to="/shop/Dresses" onClick={() => handleCategoryClick('Dresses')} className="hover:text-secondary" > Dresses </NavLink> </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-lg">Men:</h4>
                  <ul className="flex flex-col gap-2 text-gray-600">
                    <li> <NavLink to="/shop/shirts" onClick={() => handleCategoryClick('Shirts')} className="hover:text-secondary" > Shirts </NavLink> </li>
                    <li> <NavLink to="/shop/Half-Hand Shirts"onClick={() => handleCategoryClick('Half-hand Shirts')} className="hover:text-secondary" > Half-Hand Shirts </NavLink> </li>
                    <li> <NavLink to="/shop/Vests"onClick={() => handleCategoryClick('Vests')} className="hover:text-secondary" > Vests </NavLink> </li>
                    <li> <NavLink to="/shop/Trousers" onClick={() => handleCategoryClick('Trousers')}  className="hover:text-secondary" > Trousers </NavLink> </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-lg">Home Furnishing:</h4>
                  <ul className="flex flex-col gap-2 text-gray-600">
                    <li> <NavLink to="/shop/home-decor" onClick={() => handleCategoryClick('Home Décor')} className="hover:text-secondary" > Home Décor </NavLink> </li>
                    <li> <NavLink to="/shop/handmade-toys" onClick={() => handleCategoryClick('Handmade Toys')} className="hover:text-secondary" > Handmade Toys </NavLink> </li>
                    <li> <NavLink to="/shop/baskets" onClick={() => handleCategoryClick('baskets')} className="hover:text-secondary" > Baskets </NavLink> </li>
                    <li> <NavLink to="/shop/bags&pouches" onClick={() => handleCategoryClick('Bags and Pouches')} className="hover:text-secondary" > Bags and Pouches </NavLink> </li>
                    <li> <NavLink to="/shop/stationery" onClick={() => handleCategoryClick('Stationery')} className="hover:text-secondary" > Stationery </NavLink> </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-lg">Kitchenware:</h4>
                  <ul className="flex flex-col gap-2 text-gray-600">
                    <li> <NavLink to="/shop/brass" onClick={() => handleCategoryClick('Brass')} className="hover:text-secondary" > Brass Bowls </NavLink> </li>
                    <li> <NavLink to="/shop/wooden-spoons" onClick={() => handleCategoryClick('Wooden Spoons')} className="hover:text-secondary" > Wooden Spoons </NavLink> </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-40 h-60 bg-cover bg-center cursor-pointer" >
                  <NavLink to="/shop/collection" onClick={closeDropdown}><img src={assets.nav_1} alt="New Arrivals" className="object-cover w-full h-full" /></NavLink>
                  <p className="text-text mt-2"> New Arrivals </p>
                </div>
                <div className="w-40 h-60 bg-cover bg-center cursor-pointer" >
                  <NavLink to="/shop/wall-decor" onClick={() => handleCategoryClick('Wall Decor')}><img src={assets.nav_2} alt="Wall Décor" className="object-cover w-full h-full" /></NavLink>
                  <p className="text-text mt-2"> Wall Décor </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
          <hr className="w-2/4 h-[2px] bg-gray-700 border-none hidden" />
        </NavLink>
        <NavLink to="/sell" className="flex flex-col items-center gap-1">
          <p>Sell</p>
          <hr className="w-2/4 h-[2px] bg-gray-700 border-none hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
          <hr className="w-2/4 h-[2px] bg-gray-700 border-none hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt="" />
        <div className="group relative">
          <img onClick={() => token ? null : navigate('/login')} className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            {token && (
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-primary text-text rounded">
                <p className="cursor-pointer hover:text-secondary" onClick={() => navigate('/profile')}>My Profile</p>
                <p className="cursor-pointer hover:text-secondary" onClick={() => navigate('/orders')}>Orders</p>
                <p className="cursor-pointer hover:text-secondary" onClick={() => { if (window.confirm("Are you sure you want to log out?")) logout(); }}>
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="" />
      </div>

      {/* Menu Slide (for mobile) */}
      <div className={`fixed top-0 right-0 bottom-0 h-full overflow-hidden bg-white shadow-lg transition-all duration-300 ${visible ? 'w-full md:w-1/3' : 'w-0'}`}>
        <div className="flex flex-col h-full text-gray-800">
          {/* Back Button */}
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-4 bg-gray-100 cursor-pointer hover:bg-gray-200">
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
            <p className="text-lg font-medium">Back</p>
          </div>

          {/* Dropdown Links */}
          <div className="flex flex-col flex-grow">
            {/* Home Link */}
            <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold hover:bg-gray-100 transition" to='/'>
              Home
            </NavLink>

            {/* Shop Now Button with Dropdown */}
            <div className="relative">
              <button className="w-full py-4 px-6 text-lg font-semibold border-b text-left hover:bg-gray-100 transition" onClick={() => setDropdownVisible(!dropdownVisible)}>
                Shop Now <img src={assets.down_arrow} alt="Arrow" className="w-3 ml-2 inline transition-transform transform {dropdownVisible ? 'rotate-180' : ''}" />
              </button>
              {dropdownVisible && (
                <div className="pl-6 mt-2 flex flex-col">
                  <NavLink to="/shop/clothes" className="py-2 hover:bg-gray-100">Clothes</NavLink>
                  <NavLink to="/shop/baskets" className="py-2 hover:bg-gray-100">Baskets</NavLink>
                  <NavLink to="/shop/handmade-toys" className="py-2 hover:bg-gray-100">Handmade Toys</NavLink>
                  <NavLink to="/shop/home-decor" className="py-2 hover:bg-gray-100">Home Decor</NavLink>
                  <NavLink to="/shop/bags" className="py-2 hover:bg-gray-100">Bags</NavLink>
                  <NavLink to="/shop/stationery" className="py-2 hover:bg-gray-100">Stationery</NavLink>
                  <NavLink to="/shop/kitchenware" className="py-2 hover:bg-gray-100">Kitchenware</NavLink>
                  <NavLink to="/shop/seasonal-specials" className="py-2 hover:bg-gray-100">Seasonal Specials</NavLink>
                </div>
              )}
            </div>

            {/* About and Contact Links */}
            <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold hover:bg-gray-100 transition" to='/about'>
              About
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold hover:bg-gray-100 transition" to='/contact'>
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
