import React, { useEffect } from 'react';
import Title from '../components/Title';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: 'Fibre2Fashion Featuring Manorath Dhillon',
      excerpt: "Discover how Okhai's initiatives have become a beacon of hope for rural artisans and their traditions.",
      imageUrl: 'https://okhai.org/cdn/shop/articles/About_Okhai_2024_S.jpg?v=1727855203',
      link: 'https://okhai.org/blogs/news/fibre2fashion-featuring-manorath-dhillon-okhai-head-and-trustee',
    },
    {
      id: 2,
      title: 'The Art & The Artisans',
      excerpt: "Learn about Okhai's commitment to supporting artisans from rural areas by providing them with the skills and confidence they need.",
      imageUrl: 'https://okhai.org/cdn/shop/files/The_art_the_artisans.jpg?v=1712295959&width=1070',
      link: 'https://okhai.org/pages/about-us',
    },
  ];

  useEffect(() => {
    document.title = 'Aharyas Blogs | Aharyas'
  })

  return (
    <div className="min-h-screen text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="text-3xl text-center mb-6">
        <Title text1="OUR" text2="BLOG" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="border border-gray-200 rounded-md overflow-hidden">
            <div className="w-full h-48 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="p-6">
              <h3 className="font-medium text-lg mb-3">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{post.excerpt}</p>
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                READ MORE
              </a>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">!</span>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">No Blog Posts Found</h3>
            <p className="text-gray-600 max-w-md">Check back later for new content</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;