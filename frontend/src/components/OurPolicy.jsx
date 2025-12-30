import React from 'react';
import { Heart, Leaf, Globe } from 'lucide-react';
import Title from './Title';

const OurPolicy = () => {
  const principles = [
    {
      icon: <Heart className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors duration-500" />,
      title: 'HANDMADE WITH HEART',
    },
    {
      icon: <Leaf className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors duration-500" />,
      title: 'ECO-CONSCIOUS BY CHOICE',
    },
    {
      icon: <Globe className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors duration-500" />,
      title: 'CULTURALLY RICH BY SOUL',
    },
  ];

  return (
    <div className="py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Title text1="WHY CHOOSE" text2="AHARYAS?" />
          <p className="max-w-2xl mx-auto text-gray-700 text-lg mt-6">
            Because we don't do fast fashion—we do <em>forever fashion</em>.
          </p>
          <p className="max-w-2xl mx-auto text-gray-600 mt-4">
            At Aharyas, luxury isn't just in the fabric. It's in the hands that weave it, 
            the stories it tells, and the heritage it carries.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
          {principles.map((principle, index) => (
            <div key={index} className="group relative overflow-hidden bg-white hover:border-black transition-all duration-500 hover:shadow-lg">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="flex flex-col p-8 h-full">
                <div className="mb-8 relative mx-auto">
                  <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-black transition-colors duration-500 flex items-center justify-center">
                    {principle.icon}
                  </div>
                </div>
                <h3 className="text-sm font-medium tracking-widest text-center text-black mb-4">
                  {principle.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 italic">
            We craft clothing that <em>breathes, belongs,</em> and becomes a part of you.
          </p>
          <p className="text-lg text-gray-700 mt-2">
            Because at Aharyas, we don't just make clothes—we weave legacy into every stitch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;