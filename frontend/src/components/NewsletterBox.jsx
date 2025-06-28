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
      <div className="p-6 md:p-10 text-center max-w-5xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-black rounded-full p-3">
            <Mail size={24} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-medium text-black mb-4">
          JOIN THE AHARYA COMMUNITY
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
          Be the first to explore unique gifts, our latest collections, exclusive events, and initiatives.
          By subscribing, you agree to our <span className="text-black underline cursor-pointer hover:text-gray-800 transition-colors">Privacy Policy</span>.
        </p>
        
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-2xl mx-auto">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required  />
          <button type="submit" className="w-full sm:w-auto whitespace-nowrap px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
            SUBSCRIBE
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
  );
};

export default NewsletterBox;