import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Camera, ChevronDown, ChevronUp, MessageCircle, Sliders, Minus, Plus } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import Title from '../components/Title';
import { Link } from 'react-router-dom';

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

  // Existing handlers
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
    return <div className="flex justify-center items-center text-lg min-h-screen font-semibold p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="text-3xl text-center mb-6">
        <Title text1="PRODUCT" text2="DETAILS" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 md:gap-6 lg:gap-8">
        {/* Image Section */}
        <div className="space-y-6">
          <div className="relative border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img
              src={productData.images[currentIndex]}
              alt={productData.name}
              onClick={() => openModal(productData.images[currentIndex])}
              className="w-full h-screen object-contain cursor-pointer hover:opacity-90 p-2"
            />
            {/* Navigation Buttons */}
            <button className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity" onClick={handlePrev}> ◀ </button>
            <button className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity" onClick={handleNext}> ▶ </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto py-2">
            {productData.images.map((img, index) => (
              <div key={index} onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-24 h-24 border ${currentIndex === index
                  ? 'border-black shadow-md'
                  : 'border-gray-200'} 
                  rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-gray-500`}
              >
                <img
                  src={img}
                  alt={`${productData.name} thumbnail`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="h-fit bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-medium mb-2">{productData.name}</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-medium">{currency}{productData.price}</div>
              <div className="text-sm text-gray-600">Prices include GST</div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <span className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Select Size</span>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((s, index) => (
                  <button key={index} onClick={() => setSize(s)}
                    className={`py-2 px-4 border ${size === s
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300'
                      } hover:bg-black hover:text-white hover:border-black transition-colors`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <span className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Quantity</span>
              <div className="flex items-center">
                <button onClick={() => handleQuantityChange('decrease')} className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100" disabled={quantity <= 1}
                >
                  <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-black"} />
                </button>
                <input type="number" className="w-12 h-8 border-t border-b border-gray-300 text-center focus:outline-none" value={quantity} min="1"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value !== "" && value !== "0") {
                      setQuantity(Number(value));
                    }
                  }}
                />
                <button onClick={() => handleQuantityChange('increase')} className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button onClick={() => addToCart(productData._id, size, quantity)} className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                ADD TO CART
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                <button className="py-3 flex justify-center items-center gap-2 border border-black bg-white text-black hover:bg-gray-100 transition-colors">
                  <Sliders size={18} /> CUSTOMIZE
                </button>
                <button onClick={() => navigate('/try-on', { state: { image: productData.images[currentIndex] } })} className="py-3 flex justify-center items-center gap-2 border border-black bg-white text-black hover:bg-gray-100 transition-colors">
                  <Camera size={18} /> VIRTUAL TRY-ON
                </button>
                <button onClick={() => navigate('/aa-chatbot')} className="py-3 flex justify-center items-center gap-2 border border-black bg-white text-black hover:bg-gray-100 transition-colors">
                  <MessageCircle size={18} /> ASK AA
                </button>
              </div>
            </div>
          </div>

          {/* Product Information Dropdowns */}
          <div>
            {/* Description Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('description')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                DESCRIPTION
                {expandedSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'description' && (
                <div className="p-6 pt-0 text-gray-600">
                  <p>{productData.description}</p>
                </div>
              )}
            </div>

            {/* Wash Care Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('washcare')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                WASH CARE
                {expandedSection === 'washcare' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'washcare' && (
                <div className="p-6 pt-0 text-gray-600">
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

            {/* Delivery Timeline Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('delivery')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                DELIVERY TIMELINE
                {expandedSection === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'delivery' && (
                <div className="p-6 pt-0 text-gray-600">
                  <p className="mb-2">Standard delivery: 3-5 business days</p>
                  <p>Express delivery: 1-2 business days (additional charges apply)</p>
                </div>
              )}
            </div>

            {/* Manufacturing Details Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('manufacturing')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                MANUFACTURING DETAILS
                {expandedSection === 'manufacturing' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'manufacturing' && (
                <div className="p-6 pt-0 text-gray-600">
                  <p className="mb-2">Handcrafted by skilled artisans</p>
                  <p className="mb-2">Made in certified workshops</p>
                  <p className="mb-2">Ethically sourced materials</p>
                  <p>Quality checked at multiple stages</p>
                </div>
              )}
            </div>

            {/* Returns & Exchanges Dropdown */}
            <div>
              <button onClick={() => toggleSection('returns')} className="w-full py-4 px-6 flex justify-between items-center text-left font-medium transition-colors hover:bg-gray-50">
                RETURNS & EXCHANGES
                {expandedSection === 'returns' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'returns' && (
                <div className="p-6 pt-0 text-gray-600">
                  <p className="mb-2">Easy return and exchange policy within 7 days of delivery</p>
                  <p className="mb-2">Items must be unused, unwashed and in original packaging</p>
                  <p>Refunds will be processed within 5-7 business days after receiving the returned item</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <div ref={modalRef} className="relative max-h-screen overflow-y-auto scrollbar-hide" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
            <img
              src={modalImage}
              alt="Modal View"
              className="max-w-screen max-h-screen object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
          <button className="absolute top-4 right-4 bg-black text-white p-3 rounded-full shadow-md" onClick={closeModal}> ✖ </button>
          <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md" onClick={handlePrev}> ◀ </button>
          <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md" onClick={handleNext}> ▶ </button>
          <div className="absolute bottom-10 right-10 flex gap-2">
            <button className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md" onClick={zoomIn}> + </button>
            <button className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md" onClick={zoomOut}> - </button>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productId} />

      {/* Recently Viewed Section */}
      <RecentlyViewed />
    </div>
  );
};

export default Product;