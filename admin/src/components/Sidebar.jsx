import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Plus, Package,
  ShoppingBag, ChevronLeft, ChevronRight, LogOut, Menu, X, Shield
} from 'lucide-react';

const Sidebar = ({ token, setToken }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      to: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    {
      to: '/add',
      icon: Plus,
      label: 'Add Product',
      description: 'Create new items'
    },
    {
      to: '/list',
      icon: Package,
      label: 'Products',
      description: 'Manage inventory'
    },
    {
      to: '/orders',
      icon: ShoppingBag,
      label: 'Orders',
      description: 'Track & fulfill'
    }
  ];

  const handleLogout = () => {
    setToken('');
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.to}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={({ isActive }) => `
        group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-black text-white shadow-md'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
        ${mobile ? 'mx-4' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
            ${isActive ? 'bg-white/20' : 'group-hover:bg-gray-200'}
          `}>
            <item.icon
              size={18}
              className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
                }`}
            />
          </div>

          {(!isCollapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-gray-900'
                }`}>
                {item.label}
              </p>
              <p className={`text-xs transition-colors duration-200 ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                }`}>
                {item.description}
              </p>
            </div>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && !mobile && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-gray-300">{item.description}</span>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="py-6 space-y-2">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} mobile={true} />
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Desktop Header */}
        {!isCollapsed && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Aharyas Admin Panel</h1>
                <p className="text-sm text-gray-600">Management System</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Header */}
        {isCollapsed && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-center">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* Desktop Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200
              bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 
              border border-gray-200 hover:border-gray-300 shadow-sm
              ${isCollapsed ? 'px-3' : 'gap-3'}
            `}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>

          {/* Collapsed Logout Button */}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200 group"
              title="Logout"
            >
              <LogOut size={16} />
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                Logout
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;