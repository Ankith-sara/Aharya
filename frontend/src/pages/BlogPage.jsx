import React from 'react';
import Title from '../components/Title';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: 'Fibre2Fashion Featuring Manorath Dhillon',
      excerpt: 'Discover how Okhai’s initiatives have become a beacon of hope for rural artisans and their traditions.',
      imageUrl: 'https://okhai.org/cdn/shop/articles/About_Okhai_2024_S.jpg?v=1727855203',
      link: 'https://okhai.org/blogs/news/fibre2fashion-featuring-manorath-dhillon-okhai-head-and-trustee',
    },
    {
      id: 2,
      title: 'The Art & The Artisans',
      excerpt: 'Learn about Okhai’s commitment to supporting artisans from rural areas by providing them with the skills and confidence they need.',
      imageUrl: 'https://okhai.org/cdn/shop/files/The_art_the_artisans.jpg?v=1712295959&width=1070',
      link: 'https://okhai.org/pages/about-us',
    },
    // Add more posts as needed
  ];

  return (
    <div className="min-h-screen mt-20 mb-10 mx-4 sm:mx-8 md:mx-20 px-6 py-10 bg-primary">
      <div className="text-3xl text-text text-center mb-12">
        <Title text1="Our" text2="Blogs" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-background p-4 rounded-lg shadow-md overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.excerpt}</p>
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="bg-primary border-2 border-secondary text-secondary font-medium text-sm px-6 py-3 rounded-md hover:bg-secondary hover:text-primary transition-all duration-300">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
