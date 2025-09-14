import React, { useEffect } from 'react';
import Title from '../components/Title';
import { 
  Home, ShoppingBag, User, FileText, HelpCircle, Info, Zap,  Search,
} from 'lucide-react';

const Sitemap = () => {
  useEffect(() => {
    document.title = 'Sitemap | Aharyas'
  });

  const siteStructure = [
    {
      title: "Main Pages",
      icon: <Home size={24} />,
      color: "blue",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Blog", path: "/blog" }
      ]
    },
    {
      title: "Shopping",
      icon: <ShoppingBag size={24} />,
      color: "green",
      links: [
        { name: "Shop Collection", path: "/shop/collection" },
        { name: "Categories", path: "/categories" },
        { name: "New Arrivals", path: "/new-arrivals" },
        { name: "Best Sellers", path: "/best-sellers" },
        { name: "Sale Items", path: "/sale" },
        { name: "Sell With Us", path: "/sell" }
      ]
    },
    {
      title: "Account & User",
      icon: <User size={24} />,
      color: "purple",
      links: [
        { name: "My Account", path: "/account" },
        { name: "My Orders", path: "/orders" },
        { name: "Wishlist", path: "/wishlist" },
        { name: "Shopping Cart", path: "/cart" },
        { name: "Order Tracking", path: "/track-order" },
        { name: "Address Book", path: "/addresses" }
      ]
    },
    {
      title: "Policies & Legal",
      icon: <FileText size={24} />,
      color: "red",
      links: [
        { name: "Privacy Policy", path: "/privacypolicy" },
        { name: "Terms & Conditions", path: "/termsconditions" },
        { name: "Return Policy", path: "/refundpolicy" },
        { name: "Shipping Policy", path: "/shippingpolicy" },
        { name: "Cookie Policy", path: "/cookie-policy" },
        { name: "Disclaimer", path: "/disclaimer" }
      ]
    },
    {
      title: "Support & Help",
      icon: <HelpCircle size={24} />,
      color: "orange",
      links: [
        { name: "Customer Support", path: "/support" },
        { name: "FAQs", path: "/faqs" },
        { name: "Size Guide", path: "/size-guide" },
        { name: "Care Instructions", path: "/care-guide" },
        { name: "Bulk Orders", path: "/bulk-orders" }
      ]
    },
    {
      title: "Product Categories",
      icon: <Search size={24} />,
      color: "teal",
      links: [
        { name: "Electronics", path: "/category/electronics" },
        { name: "Fashion", path: "/category/fashion" },
        { name: "Home & Living", path: "/category/home-living" },
        { name: "Beauty & Personal Care", path: "/category/beauty" },
        { name: "Sports & Fitness", path: "/category/sports" },
        { name: "Books & Media", path: "/category/books" }
      ]
    },
    {
      title: "Company Info",
      icon: <Info size={24} />,
      color: "indigo",
      links: [
        { name: "Our Story", path: "/our-story" },
        { name: "Careers", path: "/careers" },
        { name: "Press & Media", path: "/press" },
        { name: "Sustainability", path: "/sustainability" },
        { name: "Community", path: "/community" },
        { name: "Affiliate Program", path: "/affiliate" }
      ]
    },
    {
      title: "Quick Links",
      icon: <Zap size={24} />,
      color: "yellow",
      links: [
        { name: "Cart", path: "/cart" },
        { name: "Wishlist", path: "/wishlist" },
        { name: "Account", path: "/account" },
        { name: "Support", path: "/support" }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        accent: "bg-blue-50"
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
        accent: "bg-green-50"
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        accent: "bg-purple-50"
      },
      red: {
        bg: "bg-red-100",
        text: "text-red-600",
        border: "border-red-200",
        accent: "bg-red-50"
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
        accent: "bg-orange-50"
      },
      teal: {
        bg: "bg-teal-100",
        text: "text-teal-600",
        border: "border-teal-200",
        accent: "bg-teal-50"
      },
      indigo: {
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        border: "border-indigo-200",
        accent: "bg-indigo-50"
      },
      yellow: {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        border: "border-yellow-200",
        accent: "bg-yellow-50"
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen text-black mt-20">
      <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-6">
            <Title text1="SITE" text2="MAP" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            Navigate through all pages and sections of Aharyas. Find exactly what you're looking for with our comprehensive site structure.
          </p>
        </div>
      </section>

      {/* Site Structure Grid */}
      <section className="pb-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {siteStructure.map((section, index) => {
              const colors = getColorClasses(section.color);
              return (
                <div 
                  key={index}
                  className={`bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <div className={colors.text}>
                        {section.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-black">{section.title}</h3>
                  </div>

                  <div className={`${colors.accent} p-4 rounded-lg`}>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a 
                            href={link.path}
                            className="text-gray-700 hover:text-black transition-colors duration-200 text-sm font-light flex items-center justify-between group"
                          >
                            <span>{link.name}</span>
                            <span className="text-gray-400 group-hover:text-black text-xs font-mono">
                              {link.path}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">NEED HELP NAVIGATING?</h2>
          <p className="text-gray-700 font-light mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our customer support team is here to help you navigate our site.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <h4 className="font-medium text-black mb-2">Customer Support</h4>
              <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <h4 className="font-medium text-black mb-2">Email Support</h4>
              <p className="text-lg text-gray-700 mb-1">aharyasofficial@gmail.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
          </div>

          <div className="mt-12 bg-black text-white p-8 rounded-lg max-w-3xl mx-auto">
            <h3 className="font-light text-xl mb-4">Search Our Site</h3>
            <p className="font-light leading-relaxed mb-4">
              Use the search functionality on any page to quickly find products, policies, or information.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Search size={16} />
              <span>Search available on all pages</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sitemap;