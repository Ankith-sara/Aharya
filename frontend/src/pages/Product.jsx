import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Camera, ChevronDown, ChevronUp, Minus, Plus, Heart, Share2, Ruler } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import SizeChartModal from '../components/SizeChartModal';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate, addProductToRecentlyViewed, toggleWishlist, isInWishlist, token } = useContext(ShopContext) || {};
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const modalRef = useRef(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [expandedSection, setExpandedSection] = useState('description');

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Quantity handlers
  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Enhanced Add to Cart handler
  const handleAddToCart = () => {
    addToCart(productData._id, size, quantity);
    setIsAddedToCart(true);
    setSize('');
    setQuantity(1);
  };

  // Handle View Cart click
  const handleViewCart = () => {
    navigate('/cart');
  };

  // Wishlist handler
  const handleWishlistToggle = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    const wasAdded = await toggleWishlist(productId);
    if (wasAdded !== undefined) {
      setIsWishlisted(wasAdded);
    }
  };

  // Share product function
  const handleShare = () => {
    const shareData = {
      title: productData.name,
      text: `Check out this product: ${productData.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err));
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert("Product link copied to clipboard!");
      });
    }
  };

  // Image navigation
  const zoomIn = () => {
    if (zoomLevel < 1.5) setZoomLevel(zoomLevel + 0.1);
  };

  const zoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.1);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % productData.images.length;
    setCurrentIndex(nextIndex);
    if (isModalOpen) {
      setModalImage(productData.images[nextIndex]);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentIndex === 0 ? productData.images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    if (isModalOpen) {
      setModalImage(productData.images[prevIndex]);
    }
  };

  // Fixed modal functions
  const openModal = (img) => {
    setModalImage(img);
    setModalOpen(true);
    setZoomLevel(1);
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setModalOpen(false);
    setModalImage('');
    setZoomLevel(1);
    document.body.style.overflow = 'unset';
  };

  // Handle image click with proper event handling
  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(productData.images[currentIndex]);
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen && !showSizeChart) return;

      switch (e.key) {
        case 'Escape':
          if (showSizeChart) {
            setShowSizeChart(false);
          } else {
            closeModal();
          }
          break;
        case 'ArrowLeft':
          if (isModalOpen) handlePrev();
          break;
        case 'ArrowRight':
          if (isModalOpen) handleNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, showSizeChart, currentIndex, productData]);

  useEffect(() => {
    const product = products?.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      addProductToRecentlyViewed(product);
      setIsWishlisted(isInWishlist(productId));
    }
  }, [productId, products, addProductToRecentlyViewed, isInWishlist]);

  useEffect(() => {
    if (productData?.name) {
      document.title = `${productData.name} | Aharyas`;
    }
  }, [productData?.name]);

  useEffect(() => {
    if (productId) {
      setIsWishlisted(isInWishlist(productId));
    }
  }, [productId, isInWishlist]);

  // Reset cart button state when product changes
  useEffect(() => {
    setIsAddedToCart(false);
  }, [productId]);

  if (!productData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <span className="text-gray-600 font-light">Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black mt-20">
      {/* Product Section */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="relative overflow-hidden">
                  <img
                    src={productData.images[currentIndex]}
                    alt={productData.name}
                    onClick={handleImageClick}
                    className="w-full h-[80vh] object-contain transition-all duration-500 hover:scale-105 cursor-pointer filter"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  <div
                    onClick={(e) => { e.stopPropagation(); openModal(productData.images[currentIndex]); }}
                    className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    Click to zoom
                  </div>

                  <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 text-black shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  >
                    ◀
                  </button>
                  <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 text-black shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto p-2 bg-gray-100">
                {productData.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden cursor-pointer transition-all duration-300 ${currentIndex === index ? 'shadow-lg border-2 border-black' : 'shadow-md border border-gray-200 hover:border-gray-400'}`}
                  >
                    <img
                      src={img}
                      alt={`${productData.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white border border-gray-200 shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl tracking-wide text-black font-light">{productData.name}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-2 border transition-all duration-300 ${isWishlisted ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={16}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 border border-gray-300 bg-white text-black hover:border-black transition-all duration-300"
                      title="Share product"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-6">
                  <div className="text-xl font-medium text-black">{currency}{productData.price}</div>
                  <div className="text-sm text-gray-500 font-light">Prices include GST</div>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase tracking-wider text-gray-500 font-light">
                      Select Size
                    </label>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="flex items-center gap-1.5 text-sm text-black hover:text-gray-600 font-light transition-colors group"
                    >
                      <Ruler size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="underline">Size Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[...productData.sizes].sort((a, b) => {
                      const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7 };
                      const aNum = parseInt(a);
                      const bNum = parseInt(b);
                      if (!isNaN(aNum) && !isNaN(bNum)) {
                        return aNum - bNum;
                      }

                      const aOrder = sizeOrder[a.toUpperCase()] || 999;
                      const bOrder = sizeOrder[b.toUpperCase()] || 999;
                      return aOrder - bOrder;
                    }).map((s, index) => (
                      <button
                        key={index}
                        onClick={() => setSize(size === s ? '' : s)}
                        className={`py-2.5 px-4 transition-all duration-300 font-light ${size === s
                            ? 'bg-black text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-gray-500 font-light mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 w-fit">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-300"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-black"} />
                    </button>
                    <input
                      type="number"
                      className="w-16 h-10 text-center focus:outline-none bg-white font-light"
                      value={quantity}
                      min="1"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value !== "" && value !== "0") {
                          setQuantity(Number(value));
                        }
                      }}
                    />
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {!isAddedToCart ? (
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-4 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
                    >
                      ADD TO CART
                    </button>
                  ) : (
                    <button
                      onClick={handleViewCart}
                      className="w-full py-4 bg-gray-900 text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
                    >
                      VIEW CART
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/try-on', { state: { image: productData.images[currentIndex] } })}
                    className="w-full py-4 flex justify-center items-center gap-2 border border-black bg-white text-black font-light hover:bg-gray-50 transition-all duration-300"
                  >
                    <Camera size={16} />
                    <span>TRY-ON</span>
                  </button>
                </div>
              </div>

              {/* Product Information Dropdowns */}
              <div>
                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('description')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                    DESCRIPTION
                    {expandedSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'description' && (
                    <div className="p-6 pt-0 text-gray-600 font-light leading-relaxed">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <p>{productData.description}</p>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('artisan')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                    ARTISAN STORY
                    {expandedSection === 'artisan' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'artisan' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <div className="space-y-4">
                        <div className="border-l-2 border-gray-200 pl-4">
                          <h4 className="font-medium text-black mb-2">Master Craftsman: Rajesh Kumar</h4>
                          <p className="text-sm leading-relaxed">With over 25 years of experience, Rajesh Kumar leads a team of skilled artisans in the historic textile region of Varanasi. His workshop has been creating exquisite handwoven pieces for three generations.</p>
                        </div>

                        <div className="border-l-2 border-gray-200 pl-4">
                          <h4 className="font-medium text-black mb-2">Origin & Technique</h4>
                          <p className="text-sm leading-relaxed">This piece originates from the vibrant looms of Uttar Pradesh, where time-honored weaving traditions meet contemporary design.</p>
                        </div>

                        <div className="border-l-2 border-gray-200 pl-4">
                          <h4 className="font-medium text-black mb-2">Community Impact</h4>
                          <p className="text-sm leading-relaxed italic">By choosing this piece, you're directly supporting a community of 12 artisan families.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('washcare')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                    WASH CARE
                    {expandedSection === 'washcare' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'washcare' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <ul className="space-y-2">
                        <li>• Dry Clean or Hand Wash with Mild Detergent</li>
                        <li>• Do not Machine Wash</li>
                        <li>• Do not soak</li>
                        <li>• Wash separately</li>
                        <li>• Gently Dry Inside Out in shade</li>
                        <li>• Slight irregularities are a nature of handcrafted products</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('delivery')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                    DELIVERY TIMELINE
                    {expandedSection === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'delivery' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <p className="mb-2">Standard delivery: 3-5 business days</p>
                      <p>Express delivery: 1-2 business days (additional charges apply)</p>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('manufacturing')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                    MANUFACTURING DETAILS
                    {expandedSection === 'manufacturing' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'manufacturing' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <p className="mb-2">Handcrafted by skilled artisans</p>
                      <p className="mb-2">Made in certified workshops</p>
                      <p className="mb-2">Ethically sourced materials</p>
                      <p>Quality checked at multiple stages</p>
                    </div>
                  )}
                </div>

                <div>
                  <button onClick={() => toggleSection('returns')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                    RETURNS & EXCHANGES
                    {expandedSection === 'returns' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'returns' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <p className="mb-2">Easy return and exchange policy within 7 days of delivery</p>
                      <p className="mb-2">Items must be unused, unwashed and in original packaging</p>
                      <p>Refunds will be processed within 5-7 business days after receiving the returned item</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        productName={productData.name}
        category={productData.category}
        subCategory={productData.subCategory}
      />

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Product Detail View"
              className="max-w-full max-h-[95vh] object-contain transition-transform duration-200 shadow-2xl"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Modal Controls */}
          <button
            className="absolute top-4 right-4 text-white bg-black/50 w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            onClick={closeModal}
            aria-label="Close modal"
          >
            ✖
          </button>
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white text-black p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous image"
          >
            ◀
          </button>
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white text-black p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
          >
            ▶
          </button>

          {/* Zoom Controls */}
          <div className="absolute bottom-10 right-10 flex gap-2 z-10">
            <button
              className="bg-white text-black p-2 w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors font-bold text-xl"
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              className="bg-white text-black p-2 w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors font-bold text-xl"
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              aria-label="Zoom out"
            >
              -
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 text-sm backdrop-blur-sm">
            {currentIndex + 1} / {productData.images.length}
          </div>
        </div>
      )}

      {/* Related Products */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productId} />
      </section>

      {/* Recently Viewed */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 mb-20">
        <RecentlyViewed />
      </section>
    </div>
  );
};

export default Product;