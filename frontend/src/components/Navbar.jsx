import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets, products } from '../assets/frontend_assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory, SelectedSubCategory } = useContext(ShopContext)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mobile menu state
  const [mobileDropdownVisible, setMobileDropdownVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Toggle mobile category expansion
  const toggleCategoryExpansion = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

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
    setVisible(false)
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
          <div className={`${isOpen ? 'flex' : 'hidden'} fixed bg-primary shadow-md mt-3 py-10 px-8 left-0 right-0 md:left-0 md:right-0 lg:left-20 lg:right-20 xl:left-60 xl:right-60 transition-all duration-500 ease-in-out`}>
            <div className="flex flex-row gap-10 justify-between items-start">
              <div className="flex flex-row gap-8 text-sm text-text">
                <div>
                  <h4 className="mb-2 text-lg">Women:</h4>
                  <ul className="flex flex-col gap-2 text-gray-600">
                    <li> <NavLink to="/shop/Kurtis" onClick={() => handleCategoryClick('Kurtis')} className="hover:text-secondary" > Kurtis </NavLink> </li>
                    <li> <NavLink to="/shop/Tops" onClick={() => handleCategoryClick('Tops')} className="hover:text-secondary" > Tops </NavLink> </li>
                    <li> <NavLink to="/shop/blazers" onClick={() => handleCategoryClick('Blazers')} className="hover:text-secondary" > Blazers </NavLink> </li>
                    <li> <NavLink to="/shop/Dresses" onClick={() => handleCategoryClick('Dresses')} className="hover:text-secondary" > Dresses </NavLink> </li>
                    <li> <NavLink to="/shop/Corset-tops" onClick={() => handleCategoryClick('Corset-tops')} className="hover:text-secondary" > Corset tops </NavLink> </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-lg">Men:</h4>
                  <ul className="flex flex-col gap-2 text-gray-600">
                    <li> <NavLink to="/shop/shirts" onClick={() => handleCategoryClick('Shirts')} className="hover:text-secondary" > Shirts </NavLink> </li>
                    <li> <NavLink to="/shop/Half-Hand Shirts" onClick={() => handleCategoryClick('Half-hand Shirts')} className="hover:text-secondary" > Half-Hand Shirts </NavLink> </li>
                    <li> <NavLink to="/shop/Vests" onClick={() => handleCategoryClick('Vests')} className="hover:text-secondary" > Vests </NavLink> </li>
                    <li> <NavLink to="/shop/Trousers" onClick={() => handleCategoryClick('Trousers')} className="hover:text-secondary" > Trousers </NavLink> </li>
                    <li> <NavLink to="/shop/Jackets" onClick={() => handleCategoryClick('Jackets')} className="hover:text-secondary" > Jackets </NavLink> </li>
                    <li> <NavLink to="/shop/men-blazers" onClick={() => handleCategoryClick('Men-Blazers')} className="hover:text-secondary" > Blazers </NavLink> </li>
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
                <div>
                  <h4 className="mb-2 text-lg">Special Product:</h4>
                  <ul className="flex flex-col gap-2 text-gray-600">
                    <li> <NavLink to="/shop/bags" onClick={() => handleCategoryClick('Bags')} className="hover:text-secondary" > Bags </NavLink> </li>
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
        <img onClick={() => {setShowSearch(true); navigate('/shop/collection')}} src={assets.search_icon} className="w-5 cursor-pointer" alt="" />
        <div className="group relative">
          <img onClick={() => token ? null : navigate('/login')} className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            {token && (
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-primary text-text rounded">
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
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="" />
      </div>

      {/* Menu Slide (for mobile) */}
      <div className={`fixed top-0 right-0 bottom-0 h-full overflow-y-auto bg-primary shadow-lg transition-all duration-300 z-30 ${visible ? 'w-full md:w-4/5' : 'w-0'}`}>
        <div className="flex flex-col h-full text-gray-800">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-4 bg-secondary cursor-pointer hover:bg-secondary">
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
            <p className="text-lg font-medium">Back</p>
          </div>
          {/* Menu Links */}
          <div className="flex flex-col flex-grow">
            <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold hover:bg-secondary transition" to='/'> Home </NavLink>
            <div className="relative">
              <button className="w-full py-4 px-6 text-lg font-semibold border-b text-left hover:bg-secondary transition flex justify-between items-center" onClick={() => setMobileDropdownVisible(!mobileDropdownVisible)}>
                Shop Now
                <span className={`transition-transform ${mobileDropdownVisible ? "rotate-180" : "rotate-0"}`}>
                  <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                </span>
              </button>

              {mobileDropdownVisible && (
                <div className="border-b bg-primary">
                  {/* Women Category */}
                  <div className="border-b">
                    <button className="w-full py-3 px-8 text-base font-medium text-left hover:bg-secondary transition flex justify-between items-center" onClick={() => toggleCategoryExpansion('women')}>
                      Women
                      <span className={`transition-transform ${expandedCategory === 'women' ? "rotate-180" : "rotate-0"}`}>
                        <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                      </span>
                    </button>

                    {expandedCategory === 'women' && (
                      <div className="py-2 bg-primary">
                        <NavLink to="/shop/Kurtis" onClick={() => { handleCategoryClick('Kurtis') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Kurtis </NavLink>
                        <NavLink to="/shop/Tops" onClick={() => { handleCategoryClick('Tops') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Tops </NavLink>
                        <NavLink to="/shop/blazers" onClick={() => { handleCategoryClick('Blazers') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Blazers </NavLink>
                        <NavLink to="/shop/Dresses" onClick={() => { handleCategoryClick('Dresses') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Dresses </NavLink>
                        <NavLink to="/shop/Corset-tops" onClick={() => { handleCategoryClick('Corset-tops') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Corset tops </NavLink>
                      </div>
                    )}
                  </div>
                  {/* Men Category */}
                  <div className="border-b">
                    <button className="w-full py-3 px-8 text-base font-medium text-left hover:bg-gray-100 transition flex justify-between items-center" onClick={() => toggleCategoryExpansion('men')}>
                      Men
                      <span className={`transition-transform ${expandedCategory === 'men' ? "rotate-180" : "rotate-0"}`}>
                        <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                      </span>
                    </button>
                    {expandedCategory === 'men' && (
                      <div className="py-2 bg-primary">
                        <NavLink to="/shop/shirts" onClick={() => { handleCategoryClick('Shirts') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Shirts</NavLink>
                        <NavLink to="/shop/Half-Hand Shirts" onClick={() => { handleCategoryClick('Half-hand Shirts') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Half-Hand Shirts</NavLink>
                        <NavLink to="/shop/Vests" onClick={() => { handleCategoryClick('Vests') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Vests</NavLink>
                        <NavLink to="/shop/Trousers" onClick={() => { handleCategoryClick('Trousers') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Trousers</NavLink>
                        <NavLink to="/shop/Jackets" onClick={() => { handleCategoryClick('Jackets') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Jackets</NavLink>
                        <NavLink to="/shop/men-blazers" onClick={() => { handleCategoryClick('Men-Blazers') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Blazers</NavLink>
                      </div>
                    )}
                  </div>
                  {/* Home Furnishing Category */}
                  <div className="border-b">
                    <button className="w-full py-3 px-8 text-base font-medium text-left hover:bg-gray-100 transition flex justify-between items-center" onClick={() => toggleCategoryExpansion('home')}>
                      Home Furnishing
                      <span className={`transition-transform ${expandedCategory === 'home' ? "rotate-180" : "rotate-0"}`}>
                        <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                      </span>
                    </button>
                    {expandedCategory === 'home' && (
                      <div className="py-2 bg-primary">
                        <NavLink to="/shop/home-decor" onClick={() => { handleCategoryClick('Home Décor') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Home Décor</NavLink>
                        <NavLink to="/shop/handmade-toys" onClick={() => { handleCategoryClick('Handmade Toys') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Handmade Toys</NavLink>
                        <NavLink to="/shop/baskets" onClick={() => { handleCategoryClick('baskets') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Baskets</NavLink>
                        <NavLink to="/shop/bags&pouches" onClick={() => { handleCategoryClick('Bags and Pouches') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Bags and Pouches</NavLink>
                        <NavLink to="/shop/stationery" onClick={() => { handleCategoryClick('Stationery') }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Stationery</NavLink>
                      </div>
                    )}
                  </div>
                  {/* Kitchenware Category */}
                  <div className="border-b">
                    <button className="w-full py-3 px-8 text-base font-medium text-left hover:bg-gray-100 transition flex justify-between items-center" onClick={() => toggleCategoryExpansion('kitchen')} >
                      Kitchenware
                      <span className={`transition-transform ${expandedCategory === 'kitchen' ? "rotate-180" : "rotate-0"}`}>
                        <img src={assets.down_arrow} alt="Arrow" className="w-3" />
                      </span>
                    </button>
                    {expandedCategory === 'kitchen' && (
                      <div className="py-2 bg-primary">
                        <NavLink to="/shop/brass" onClick={() => { handleCategoryClick('Brass'); setVisible(false); }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Brass Bowls</NavLink>
                        <NavLink to="/shop/wooden-spoons" onClick={() => { handleCategoryClick('Wooden Spoons'); setVisible(false); }} className="w-full py-2 px-12 text-base font-small text-left hover:bg-secondary transition flex justify-between items-center"> Wooden Spoons</NavLink>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold hover:bg-gray-100 transition" to='/about'> About</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold hover:bg-gray-100 transition" to='/sell'> Sell</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-4 px-6 border-b text-lg font-semibold hover:bg-gray-100 transition" to='/contact'> Contact</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;