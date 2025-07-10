import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import { BotMessageSquare } from 'lucide-react';

const ChatIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isPastInitialView = scrollY > windowHeight * 0.2;
      const isNearBottom = scrollY > (documentHeight - windowHeight) * 0.8;
      const isScrolledBackToTop = scrollY < 300 && scrollY > 100;

      setIsVisible(isPastInitialView || isNearBottom || isScrolledBackToTop);
    };

    window.addEventListener('scroll', handleScroll);
    setIsVisible(false);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
<<<<<<< HEAD:src/components/ChatIcon.jsx
    <div className={`fixed bottom-6 right-6 bg-black hover:bg-gray-900 text-white p-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 z-50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} aria-label="Chat with aa">
      <Link to="/aa-chatbot">
        <BotMessageSquare size={24} />
      </Link>
      <div className={`absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap cursor-text transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        Got questions? Chat with aa!
=======
    <Link to="/aa-chatbot">
      <div className={`fixed bottom-6 right-6 bg-black hover:bg-gray-900 text-white p-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 z-50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} aria-label="Chat with aa">
        <BotMessageSquare size={24}/>
        <div className={`absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          Got questions? Chat with aa!
        </div>
>>>>>>> b8c6ad68b28994f3916b4764c2a2c123c6a79f28:frontend/src/components/ChatIcon.jsx
      </div>
    </div>
  );
};

export default ChatIcon;