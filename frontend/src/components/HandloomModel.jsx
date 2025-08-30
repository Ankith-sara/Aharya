import React, { useEffect } from "react";
import { X, MapPin, Scissors, Users } from "lucide-react";

const HandloomModal = ({ title, description, onClose }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Parse crafts from description
  const crafts = description.split(', ').filter(craft => craft.trim() !== '');
  const hasMultipleCrafts = crafts.length > 1;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-out"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-50 to-white p-8 rounded-t-2xl border-b border-gray-100">
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-black opacity-20"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-black opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-black" />
                <h2 className="text-3xl font-bold text-black uppercase tracking-wider">
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group border border-gray-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
              </button>
            </div>
            
            <div className="w-24 h-1 bg-black"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Header */}
          <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Scissors className="w-6 h-6 text-black" />
              <div>
                <div className="text-2xl font-bold text-black">{crafts.length}</div>
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Traditional Craft{crafts.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-black" />
              <div>
                <div className="text-2xl font-bold text-black">50+</div>
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Artisans
                </div>
              </div>
            </div>
          </div>

          {/* Craft Details */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-6 uppercase tracking-wider">
              Heritage Crafts of {title}
            </h3>
            
            {crafts.length > 0 ? (
              <div className="grid gap-4">
                {crafts.map((craft, index) => (
                  <div 
                    key={index} 
                    className="bg-white border-l-4 border-black p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-black">
                        {craft.trim()}
                      </h4>
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Traditional Craft
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      A time-honored craft tradition passed down through generations, 
                      representing the rich cultural heritage of {title}.
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Scissors className="w-16 h-16 mx-auto opacity-50" />
                </div>
                <p className="text-gray-600 text-lg">
                  Craft information for {title} will be available soon.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  We're continuously expanding our heritage craft database.
                </p>
              </div>
            )}
          </div>

          {/* Quote Section */}
          {crafts.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-gray-100 to-transparent rounded-lg p-6 border-l-4 border-black">
              <p className="text-gray-700 italic text-center">
                "Every thread tells a story, every weave carries wisdom, <br />
                and every craft connects us to our roots."
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Part of Aharyas Heritage Collection
            </div>
            <button
              onClick={onClose}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandloomModal;