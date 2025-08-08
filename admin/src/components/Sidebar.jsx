import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Package, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
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

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.to}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={({ isActive }) => `
        group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-primary text-text shadow-lg shadow-primary/25' 
          : 'text-secondary hover:bg-gradient-to-r hover:from-background/30 hover:to-background/10 hover:text-primary'
        }
        ${mobile ? 'mx-4' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
            ${isActive ? 'bg-text/20' : 'group-hover:bg-primary/10'}
          `}>
            <item.icon 
              size={18} 
              className={`transition-colors duration-200 ${
                isActive ? 'text-text' : 'text-secondary group-hover:text-primary'
              }`} 
            />
          </div>
          
          {(!isCollapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm transition-colors duration-200 ${
                isActive ? 'text-text' : 'text-primary group-hover:text-primary'
              }`}>
                {item.label}
              </p>
              <p className={`text-xs transition-colors duration-200 ${
                isActive ? 'text-text/80' : 'text-secondary group-hover:text-primary'
              }`}>
                {item.description}
              </p>
            </div>
          )}

          {/* Active indicator */}
          {isActive && !mobile && (
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-text rounded-l-full" />
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && !mobile && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-primary text-text text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              <div className="flex flex-col">
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs text-text/70">{item.description}</span>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-primary rotate-45" />
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
          className="p-2 bg-text rounded-lg shadow-lg border border-primary/20 hover:bg-background transition-colors"
        >
          <Menu size={20} className="text-primary" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-primary bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-background shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-text" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-primary">Admin Panel</h1>
              <p className="text-xs text-secondary">Management Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-background/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-secondary" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="py-6 space-y-2">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} mobile={true} />
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary/20 bg-background/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <User size={16} className="text-text" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">Admin User</p>
              <p className="text-xs text-secondary">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex flex-col h-screen bg-background border-r border-primary/20 shadow-lg transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="text-text" size={20} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-primary truncate">Admin Panel</h1>
                <p className="text-xs text-secondary truncate">Management Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary/20">
          {/* User Profile */}
          {!isCollapsed && (
            <div className="p-3 bg-gradient-to-r from-background/30 to-background/10 rounded-xl mb-4 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User size={16} className="text-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">Admin User</p>
                  <p className="text-xs text-secondary truncate">admin@example.com</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200
              bg-background/30 hover:bg-background/50 text-secondary hover:text-primary border border-primary/10
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
        </div>
      </div>
    </>
  );
};

export default Sidebar;