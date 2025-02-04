import React from 'react';

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    alert('Thank you for subscribing!');
  };

  return (
    <div className="bg-primary border-2 border-secondary p-10 rounded-lg shadow-lg text-center mt-10 mb-20 mx-20">
      <p className="text-3xl font-semibold text-gray-800 mb-4">
        Join the Aharya Community
      </p>
      <p className="text-gray-600 text-base sm:text-lg mb-6">
        Be the first to explore unique gifts, our latest collections, exclusive events, and initiatives. 
        By subscribing, you agree to our <span className="text-text hover:text-secondary underline cursor-pointer">Privacy Policy</span>.
      </p>
      <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row items-center justify-center gap-4" >
        <input type="email" placeholder="Enter your email address" className="w-full sm:w-2/3 md:w-1/2 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary text-gray-700" required />
        <button type="submit" className="bg-primary border-2 border-secondary text-secondary font-medium text-sm px-6 py-3 rounded-md hover:bg-secondary hover:text-primary transition-all duration-300" > Subscribe </button>
      </form>
    </div>
  );
};

export default NewsletterBox;