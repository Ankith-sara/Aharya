import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Mail } from 'lucide-react';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
 
  const onSubmitHandler = (event) => {
    event.preventDefault();
    toast.success('Thank you for subscribing!');
    setEmail("");
  };
 
  return (
    <div className="max-w-7xl mx-auto">
      <div>
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
              <Mail size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-wider text-black mb-4">
            JOIN THE <span className="font-medium">AHARYAS</span> COMMUNITY
          </h1>
          
          <div className="w-24 h-0.5 bg-black mx-auto mb-6"></div>
         
          <p className="text-gray-700 text-lg font-light leading-relaxed mb-10 max-w-5xl mx-auto">
            Be the first to explore handcrafted collections, exclusive artisan stories, and meaningful initiatives. 
            Join a community that celebrates heritage, sustainability, and conscious fashion.
          </p>
         
          <form onSubmit={onSubmitHandler} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-2 items-stretch">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <Mail size={20} className="text-gray-400 group-focus-within:text-black transition-colors duration-300" />
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email address" 
                  className="w-full pl-14 pr-4 py-4 bg-white border-b-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 font-light text-lg"
                  required  
                />
              </div>
              <button 
                type="submit" 
                className="md:w-auto px-12 py-4 bg-black text-white text-sm uppercase font-light tracking-widest hover:bg-gray-900 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </div>
          </form>
         
          <div className="space-y-3 text-center">
            <p className="text-gray-600 font-light">
              By subscribing, you agree to our{' '}
              <button className="text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-0.5">
                Privacy Policy
              </button>
            </p>
            <p className="text-sm text-gray-500 font-light">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBox;