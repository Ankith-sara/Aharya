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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
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
    // If product has sizes and no size is selected, don't add to cart
    if (productData.sizes?.length > 0 && !size) {
      return;
    }

    // Pass empty string for products without sizes (will be converted to 'N/A' in context)
    const selectedSize = productData.sizes?.length > 0 ? size : '';
    addToCart(productData._id, selectedSize, quantity);
    setIsAddedToCart(true);
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
      navigator.share(shareData).catch((err) => console.error('Share failed:', err));
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

  // Check if product has multiple images
  const hasMultipleImages = productData?.images?.length > 1;

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  // Categories that don't need wash care instructions
  const WASH_CARE_EXCLUDED_SUBCATEGORIES = [
    'Bags',
    'bags',
    'Paintings',
    'Kondapalli Bommalu',
    'Cheriyal Masks',
    'Bird houses',
    'Journals'
  ];

  // Check if wash care should be shown
  const shouldShowWashCare =
    productData?.subCategory &&
    !WASH_CARE_EXCLUDED_SUBCATEGORIES.includes(productData.subCategory);

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

  // Reset cart button when size changes
  useEffect(() => {
    setIsAddedToCart(false);
  }, [size]);

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
    setSize('');
    setQuantity(1);
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
    <div className="min-h-screen text-black mt-16 sm:mt-20">
      {/* Product Section */}
      <section className="py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 sm:gap-6 items-start">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative group">
                <div 
                  className="relative overflow-hidden"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <img
                    src={productData.images[currentIndex]}
                    alt={productData.name}
                    onClick={handleImageClick}
                    className="w-full h-[50vh] sm:h-[60vh] lg:h-[80vh] object-contain transition-all duration-500 hover:scale-105 cursor-pointer filter select-none"
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  <div
                    onClick={(e) => { e.stopPropagation(); openModal(productData.images[currentIndex]); }}
                    className="hidden sm:block absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    Click to zoom
                  </div>

                  {/* Navigation Buttons - Only show if multiple images */}
                  {hasMultipleImages && (
                    <>
                      <button
                        className="hidden sm:flex absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 items-center justify-center bg-white/90 text-black shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      >
                        ◀
                      </button>
                      <button
                        className="hidden sm:flex absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 items-center justify-center bg-white/90 text-black shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      >
                        ▶
                      </button>

                      {/* Mobile Image Counter - Only show if multiple images */}
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 text-xs backdrop-blur-sm sm:hidden">
                        {currentIndex + 1} / {productData.images.length}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnails - Only show if multiple images */}
              {hasMultipleImages && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto p-2 bg-gray-100 scrollbar-hide">
                  {productData.images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden cursor-pointer transition-all duration-300 ${currentIndex === index ? 'shadow-lg border-2 border-black' : 'shadow-md border border-gray-200 hover:border-gray-400'}`}
                    >
                      <img
                        src={img}
                        alt={`${productData.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white border border-gray-200 shadow-lg">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <h1 className="text-xl sm:text-2xl tracking-wide text-black font-light flex-1">{productData.name}</h1>
                  <div className="flex items-center gap-2 flex-shrink-0">
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

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-6 gap-2">
                  <div className="text-xl sm:text-2xl font-medium text-black">{currency}{productData.price}</div>
                  <div className="text-xs sm:text-sm text-gray-500 font-light">Prices include GST</div>
                </div>

                {/* Size Selector - Only show if product has sizes */}
                {productData.sizes?.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs uppercase tracking-wider text-gray-500 font-light">
                        Select Size
                      </label>
                      <button
                        onClick={() => setShowSizeChart(true)}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-black hover:text-gray-600 font-light transition-colors group"
                      >
                        <Ruler size={14} className="group-hover:scale-110 transition-transform" />
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
                          className={`py-2 sm:py-2.5 px-3 sm:px-4 transition-all duration-300 font-light text-sm sm:text-base ${size === s
                              ? 'bg-black text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-gray-500 font-light mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 w-fit">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-300 active:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-black"} />
                    </button>
                    <input
                      type="number"
                      className="w-14 sm:w-16 h-10 text-center focus:outline-none bg-white font-light text-sm sm:text-base"
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
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-300 active:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {!isAddedToCart ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={productData.sizes?.length > 0 && !size}
                      className={`w-full py-3 sm:py-4 font-light tracking-wide transition-all duration-300 text-sm sm:text-base ${
                        productData.sizes?.length > 0 && !size
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                      }`}
                    >
                      {productData.sizes?.length > 0 && !size
                        ? 'SELECT SIZE'
                        : 'ADD TO CART'}
                    </button>
                  ) : (
                    <button
                      onClick={handleViewCart}
                      className="w-full py-3 sm:py-4 bg-gray-900 text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-950 transition-all duration-300 text-sm sm:text-base"
                    >
                      VIEW CART
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/try-on', { state: { image: productData.images[currentIndex] } })}
                    className="w-full py-3 sm:py-4 flex justify-center items-center gap-2 border border-black bg-white text-black font-light hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 text-sm sm:text-base"
                  >
                    <Camera size={16} />
                    <span>TRY-ON</span>
                  </button>
                </div>
              </div>

              {/* Product Information Dropdowns */}
              <div>
                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('description')} className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 text-sm sm:text-base">
                    DESCRIPTION
                    {expandedSection === 'description' ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                  </button>
                  {expandedSection === 'description' && (
                    <div className="p-4 sm:p-6 pt-0 text-gray-600 font-light leading-relaxed text-sm sm:text-base">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <p>{productData.description}</p>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('artisan')} className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 text-sm sm:text-base">
                    ARTISAN STORY
                    {expandedSection === 'artisan' ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                  </button>
                  {expandedSection === 'artisan' && (
                    <div className="p-4 sm:p-6 pt-0 text-gray-600 font-light">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <div className="space-y-4 text-sm sm:text-base">
                        <div className="border-l-2 border-gray-200 pl-3 sm:pl-4">
                          <h4 className="font-medium text-black mb-2">Master Craftsman: Rajesh Kumar</h4>
                          <p className="text-sm leading-relaxed">With over 25 years of experience, Rajesh Kumar leads a team of skilled artisans in the historic textile region of Varanasi. His workshop has been creating exquisite handwoven pieces for three generations.</p>
                        </div>

                        <div className="border-l-2 border-gray-200 pl-3 sm:pl-4">
                          <h4 className="font-medium text-black mb-2">Origin & Technique</h4>
                          <p className="text-sm leading-relaxed">This piece originates from the vibrant looms of Uttar Pradesh, where time-honored weaving traditions meet contemporary design.</p>
                        </div>

                        <div className="border-l-2 border-gray-200 pl-3 sm:pl-4">
                          <h4 className="font-medium text-black mb-2">Community Impact</h4>
                          <p className="text-sm leading-relaxed italic">By choosing this piece, you're directly supporting a community of 12 artisan families.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wash Care - Only show for clothing items */}
                {shouldShowWashCare && (
                  <div className="border-b border-gray-200">
                    <button onClick={() => toggleSection('washcare')} className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 text-sm sm:text-base">
                      WASH CARE
                      {expandedSection === 'washcare' ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                    </button>
                    {expandedSection === 'washcare' && (
                      <div className="p-4 sm:p-6 pt-0 text-gray-600 font-light">
                        <div className="w-12 h-0.5 bg-black mb-4"></div>
                        <ul className="space-y-2 text-sm sm:text-base">
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
                )}

                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('delivery')} className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 text-sm sm:text-base">
                    DELIVERY TIMELINE
                    {expandedSection === 'delivery' ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                  </button>
                  {expandedSection === 'delivery' && (
                    <div className="p-4 sm:p-6 pt-0 text-gray-600 font-light text-sm sm:text-base">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <p className="mb-2">Standard delivery: 3-5 business days</p>
                      <p>Express delivery: 1-2 business days (additional charges apply)</p>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200">
                  <button onClick={() => toggleSection('manufacturing')} className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 text-sm sm:text-base">
                    MANUFACTURING DETAILS
                    {expandedSection === 'manufacturing' ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                  </button>
                  {expandedSection === 'manufacturing' && (
                    <div className="p-4 sm:p-6 pt-0 text-gray-600 font-light text-sm sm:text-base">
                      <div className="w-12 h-0.5 bg-black mb-4"></div>
                      <p className="mb-2">Handcrafted by skilled artisans</p>
                      <p className="mb-2">Made in certified workshops</p>
                      <p className="mb-2">Ethically sourced materials</p>
                      <p>Quality checked at multiple stages</p>
                    </div>
                  )}
                </div>

                <div>
                  <button onClick={() => toggleSection('returns')} className="w-full py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 text-sm sm:text-base">
                    RETURNS & EXCHANGES
                    {expandedSection === 'returns' ? <ChevronUp size={18} className="flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                  </button>
                  {expandedSection === 'returns' && (
                    <div className="p-4 sm:p-6 pt-0 text-gray-600 font-light text-sm sm:text-base">
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
        <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Product Detail View"
              className="max-w-full max-h-[85vh] sm:max-h-[95vh] object-contain transition-transform duration-200 shadow-2xl"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Modal Controls */}
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black/50 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-black/70 transition-colors z-10 text-lg"
            onClick={closeModal}
            aria-label="Close modal"
          >
            ✖
          </button>

          {/* Navigation buttons */}
          {hasMultipleImages && (
            <>
              <button
                className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white text-black p-2 sm:p-3 shadow-lg hover:bg-gray-100 transition-colors z-10 w-9 h-9 sm:w-auto sm:h-auto flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Previous image"
              >
                ◀
              </button>
              <button
                className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white text-black p-2 sm:p-3 shadow-lg hover:bg-gray-100 transition-colors z-10 w-9 h-9 sm:w-auto sm:h-auto flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
              >
                ▶
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-16 sm:bottom-10 right-4 sm:right-10 flex gap-2 z-10">
            <button
              className="bg-white text-black p-2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors font-bold text-lg sm:text-xl"
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              className="bg-white text-black p-2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors font-bold text-lg sm:text-xl"
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              aria-label="Zoom out"
            >
              -
            </button>
          </div>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-sm">
              {currentIndex + 1} / {productData.images.length}
            </div>
          )}
        </div>
      )}

      {/* Related Products */}
      <section className="px-4 sm:px-6 lg:px-20">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productId} />
      </section>

      {/* Recently Viewed */}
      <section className="px-4 sm:px-6 lg:px-20 mb-12 sm:mb-20">
        <RecentlyViewed />
      </section>
    </div>
  );
};

export default Product;