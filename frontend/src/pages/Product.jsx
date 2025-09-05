import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Camera, ChevronDown, ChevronUp, Sliders, Minus, Plus, Heart, Share2 } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import Title from '../components/Title';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate, addProductToRecentlyViewed } = useContext(ShopContext) || {};
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Dropdown state management
  const [expandedSection, setExpandedSection] = useState('description');

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Modal drag handling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.pageY - scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const y = e.pageY - startY;
    if (modalRef.current) {
      modalRef.current.scrollTop = y;
      setScrollTop(y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quantity handlers
  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
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
    setCurrentIndex((prev) => (prev + 1) % productData.images.length);
    if (isModalOpen) {
      setModalImage(productData.images[(currentIndex + 1) % productData.images.length]);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? productData.images.length - 1 : prev - 1));
    if (isModalOpen) {
      setModalImage(productData.images[currentIndex === 0 ? productData.images.length - 1 : currentIndex - 1]);
    }
  };

  const openModal = (img) => {
    setModalImage(img);
    setModalOpen(true);
    setScrollTop(0);
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage('');
    setZoomLevel(1);
  };

  useEffect(() => {
    const product = products?.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      addProductToRecentlyViewed(product);
    }
  }, [productId, products, addProductToRecentlyViewed]);

  useEffect(() => {
    if (productData?.name) {
      document.title = `${productData.name} | Aharyas`;
    }
  }, [productData?.name]);

  if (!productData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
          <p className="text-gray-600 font-light mt-4 tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      {/* Product Section */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-3xl mb-6">
              <Title text1="PRODUCT" text2="DETAILS" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            {/* Image Gallery - Compact Layout */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <div className="relative overflow-hidden shadow-xl">
                  <img
                    src={productData.images[currentIndex]}
                    alt={productData.name}
                    onClick={() => openModal(productData.images[currentIndex])}
                    className="w-full h-full object-cover cursor-pointer transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  {/* Navigation Buttons */}
                  <button 
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300" 
                    onClick={handlePrev}
                  > 
                    ◀ 
                  </button>
                  <button 
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300" 
                    onClick={handleNext}
                  > 
                    ▶ 
                  </button>
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l border-t border-black/20"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r border-b border-black/20"></div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto py-2">
                {productData.images.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden cursor-pointer transition-all duration-300 ${
                      currentIndex === index
                        ? 'shadow-lg border-2 border-black'
                        : 'shadow-md border border-gray-200 hover:border-gray-400'
                    }`}
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

            {/* Product Details - Right Side */}
            <div className="bg-white border border-gray-200 shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl tracking-wide text-black">{productData.name}</h1>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 border transition-all duration-300 ${
                        isWishlisted 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border-gray-300 hover:border-black'
                      }`}
                    >
                      <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
                    </button>
                    <button className="p-2 border border-gray-300 bg-white text-black hover:border-black transition-all duration-300">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-baseline justify-between mb-6">
                  <div className="text-xl font-medium text-black">{currency}{productData.price}</div>
                  <div className="text-sm text-gray-500 font-light">Prices include GST</div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-gray-500 font-light mb-3">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {productData.sizes.map((s, index) => (
                      <button 
                        key={index} 
                        onClick={() => setSize(s)}
                        className={`py-2 px-3 border transition-all duration-300 ${
                          size === s
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                      >
                        <span className="font-light">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-gray-500 font-light mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 w-fit">
                    <button 
                      onClick={() => handleQuantityChange('decrease')} 
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-300" 
                      disabled={quantity <= 1}
                    >
                      <Minus size={14} className={quantity <= 1 ? "text-gray-300" : "text-black"} />
                    </button>
                    <input 
                      type="number" 
                      className="w-12 h-8 text-center focus:outline-none bg-white font-light text-sm" 
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
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => addToCart(productData._id, size, quantity)} 
                    className="w-full py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
                  >
                    ADD TO CART
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 flex justify-center items-center gap-2 border border-black bg-white text-black font-light hover:bg-gray-50 transition-all duration-300">
                      <Sliders size={16} />
                      <span className="text-sm">CUSTOMIZE</span>
                    </button>
                    <button 
                      onClick={() => navigate('/try-on', { state: { image: productData.images[currentIndex] } })} 
                      className="py-2 flex justify-center items-center gap-2 border border-black bg-white text-black font-light hover:bg-gray-50 transition-all duration-300"
                    >
                      <Camera size={16} />
                      <span className="text-sm">TRY-ON</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Information Dropdowns */}
              <div>
                {/* Description */}
                <div className="border-b border-gray-200">
                  <button 
                    onClick={() => toggleSection('description')} 
                    className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50"
                  >
                    DESCRIPTION
                    {expandedSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'description' && (
                    <div className="p-6 pt-0 text-gray-600 font-light leading-relaxed">
                      <div className="w-8 h-0.5 bg-black mb-4"></div>
                      <p>{productData.description}</p>
                    </div>
                  )}
                </div>

                {/* Artisan Story */}
                <div className="border-b border-gray-200">
                  <button 
                    onClick={() => toggleSection('artisan')} 
                    className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50"
                  >
                    ARTISAN STORY
                    {expandedSection === 'artisan' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'artisan' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-8 h-0.5 bg-black mb-4"></div>
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

                {/* Wash Care */}
                <div className="border-b border-gray-200">
                  <button 
                    onClick={() => toggleSection('washcare')} 
                    className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50"
                  >
                    WASH CARE
                    {expandedSection === 'washcare' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'washcare' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-8 h-0.5 bg-black mb-4"></div>
                      <ul className="space-y-2">
                        <li>• Hand wash with mild detergent</li>
                        <li>• Do not bleach</li>
                        <li>• Dry in shade</li>
                        <li>• Warm iron</li>
                        <li>• Do not dry clean</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Delivery Timeline */}
                <div className="border-b border-gray-200">
                  <button 
                    onClick={() => toggleSection('delivery')} 
                    className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50"
                  >
                    DELIVERY TIMELINE
                    {expandedSection === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'delivery' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-8 h-0.5 bg-black mb-4"></div>
                      <p className="mb-2">Standard delivery: 3-5 business days</p>
                      <p>Express delivery: 1-2 business days (additional charges apply)</p>
                    </div>
                  )}
                </div>

                {/* Manufacturing Details */}
                <div className="border-b border-gray-200">
                  <button 
                    onClick={() => toggleSection('manufacturing')} 
                    className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50"
                  >
                    MANUFACTURING DETAILS
                    {expandedSection === 'manufacturing' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'manufacturing' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-8 h-0.5 bg-black mb-4"></div>
                      <p className="mb-2">Handcrafted by skilled artisans</p>
                      <p className="mb-2">Made in certified workshops</p>
                      <p className="mb-2">Ethically sourced materials</p>
                      <p>Quality checked at multiple stages</p>
                    </div>
                  )}
                </div>

                {/* Returns & Exchanges */}
                <div>
                  <button 
                    onClick={() => toggleSection('returns')} 
                    className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50"
                  >
                    RETURNS & EXCHANGES
                    {expandedSection === 'returns' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSection === 'returns' && (
                    <div className="p-6 pt-0 text-gray-600 font-light">
                      <div className="w-8 h-0.5 bg-black mb-4"></div>
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

      {/* Modal - Enhanced */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50" 
          onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove} 
          onMouseUp={handleMouseUp} 
          onMouseLeave={handleMouseUp}
        >
          <div 
            ref={modalRef} 
            className="relative max-h-screen overflow-y-auto scrollbar-hide" 
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <img
              src={modalImage}
              alt="Modal View"
              className="max-w-screen max-h-screen object-contain transition-transform duration-200 shadow-2xl"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
          
          {/* Modal Controls */}
          <button 
            className="absolute top-4 right-4 bg-black text-white p-3 rounded-full shadow-md" 
            onClick={closeModal}
          > 
            ✖ 
          </button>
          <button 
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md" 
            onClick={handlePrev}
          > 
            ◀ 
          </button>
          <button 
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md" 
            onClick={handleNext}
          > 
            ▶ 
          </button>
          <div className="absolute bottom-10 right-10 flex gap-2">
            <button 
              className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md" 
              onClick={zoomIn}
            > 
              + 
            </button>
            <button 
              className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md" 
              onClick={zoomOut}
            > 
              - 
            </button>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20">
        <RelatedProducts 
          category={productData.category} 
          subCategory={productData.subCategory} 
          currentProductId={productId} 
        />
      </section>

      {/* Recently Viewed Section */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 mb-20">
        <RecentlyViewed />
      </section>
    </div>
  );
};

export default Product;