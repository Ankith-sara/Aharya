import React, { useEffect } from "react";
import { X, MapPin, Scissors, Users, Camera } from "lucide-react";

const HandloomModal = ({ title, description, color, onClose }) => {
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

  // Textile image mapping - you can replace these with real images from your database
  const getTextileImage = (craftName) => {
    // This is a placeholder. Replace with actual image URLs from your database
    const placeholder = `https://via.placeholder.com/400x300/${color?.replace('#', '')}/ffffff?text=${encodeURIComponent(craftName)}`;
    
    // You can add specific image URLs here based on craft names
    const imageMap = {
      'Banarasi': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop',
      'Kanjeevaram': 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400&h=300&fit=crop',
      'Chanderi': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop',
      'Pochampally': 'https://images.unsplash.com/photo-1583391733981-6184c0f1ae67?w=400&h=300&fit=crop',
    };

    return imageMap[craftName] || placeholder;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header with State Color Accent */}
        <div 
          className="relative p-8 rounded-t-2xl border-b border-gray-100"
          style={{
            background: `linear-gradient(135deg, ${color}15 0%, white 100%)`
          }}
        >
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 opacity-20" style={{ borderColor: color }}></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 opacity-20" style={{ borderColor: color }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full shadow-md flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-black uppercase tracking-wider">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Traditional Textile Heritage</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group border border-gray-200" 
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
              </button>
            </div>
            <div className="w-24 h-1" style={{ backgroundColor: color }}></div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Header */}
          <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Scissors className="w-6 h-6" style={{ color: color }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{crafts.length}</div>
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Traditional Craft{crafts.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Users className="w-6 h-6" style={{ color: color }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">50+</div>
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Artisans
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Camera className="w-6 h-6" style={{ color: color }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{crafts.length}</div>
                <div className="text-gray-600 text-sm uppercase tracking-wider">
                  Textile{crafts.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-black mb-6 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-6" style={{ backgroundColor: color }}></div>
              Heritage Crafts of {title}
            </h3>
            
            {crafts.length > 0 ? (
              <div className="grid gap-6">
                {crafts.map((craft, index) => (
                  <div 
                    key={index} 
                    className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    style={{ borderColor: `${color}40` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Textile Image */}
                      <div className="md:w-2/5 relative overflow-hidden bg-gray-100">
                        <img
                          src={getTextileImage(craft.trim())}
                          alt={`${craft.trim()} textile`}
                          className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/400x300/${color?.replace('#', '')}/ffffff?text=${encodeURIComponent(craft.trim())}`;
                          }}
                        />
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                          style={{ backgroundColor: color }}
                        ></div>
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-3/5 p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-bold text-black">
                            {craft.trim()}
                          </h4>
                          <div 
                            className="text-xs px-3 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${color}20`,
                              color: color
                            }}
                          >
                            Traditional Craft
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          A time-honored craft tradition passed down through generations, 
                          representing the rich cultural heritage of {title}. Each piece tells 
                          a story of skilled artisans who have preserved these ancient techniques.
                        </p>

                        {/* Craft Details */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            Handwoven
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            Traditional Design
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            Heritage Craft
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4" style={{ color: `${color}40` }}>
                  <Scissors className="w-16 h-16 mx-auto" />
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

          {crafts.length > 0 && (
            <div 
              className="mt-8 rounded-lg p-6 border-l-4"
              style={{ 
                background: `linear-gradient(135deg, ${color}10 0%, transparent 100%)`,
                borderColor: color
              }}
            >
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
              className="px-6 py-2 rounded-lg transition-colors duration-200 font-medium text-white shadow-md hover:shadow-lg"
              style={{ backgroundColor: color }}
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