import React, { useState } from 'react';
import { toast } from 'react-toastify';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    toast('Thank you for subscribing!');
    setEmail("");
  };

  return (
    <div className="bg-primary border-2 border-secondary p-4 sm:p-8 md:p-10 my-10 text-center">
      <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
        Join the Aharya Community
      </p>
      <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6">
        Be the first to explore unique gifts, our latest collections, exclusive events, and initiatives.
        By subscribing, you agree to our <span className="text-text hover:text-secondary underline cursor-pointer">Privacy Policy</span>.
      </p>
      <form onSubmit={onSubmitHandler} className="flex flex-row sm:flex-row items-center justify-center gap-2">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full sm:w-2/3 md:w-1/2 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary text-gray-700" required />
        <button type="submit" className="bg-primary border-2 border-secondary text-secondary font-medium text-sm px-6 py-3 rounded-md hover:bg-secondary hover:text-primary transition-all duration-300">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;