import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Camera, ChevronDown, ChevronUp, MessageCircle, MessageCircleCodeIcon, Sliders } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, navigate } = useContext(ShopContext) || {};
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState('');
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
    }
  }, [productId, products]);


  if (!productData) {
    return <div className="flex justify-center items-center text-lg m-20 font-semibold p-10">Loading...</div>;
  }

  return (
    <div className="bg-background text-text p-4 sm:p-6 lg:p-20 mt-16 lg:mt-0 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="flex-1">
          <div className="relative">
            <img
              src={productData.images[currentIndex]}
              alt={productData.name}
              onClick={() => openModal(productData.images[currentIndex])}
              className="w-full h-auto max-h-[85vh] object-contain cursor-pointer hover:opacity-90 p-2"
            />
            {/* Navigation Buttons */}
            <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-secondary text-white p-2 rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity" onClick={handlePrev}>
              ◀
            </button>
            <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-secondary text-white p-2 rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity" onClick={handleNext}>
              ▶
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mt-5 bg-primary p-3 justify-center overflow-x-auto shadow-md">
            {productData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${productData.name} thumbnail`}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-300 ${currentIndex === index
                  ? 'border-2 border-secondary shadow-md scale-105'
                  : 'opacity-80'
                  } hover:opacity-100`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 p-6 bg-primary shadow-lg">
          {/* Product Title and Price */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">{productData.name}</h1>
            <div className="flex justify-between items-center">
              <p className="text-xl sm:text-2xl text-text font-medium">
                {currency}
                {productData.price}
              </p>
              <p className="text-sm text-gray-700">Prices include GST</p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Select Size</p>
            <div className="flex gap-3 flex-wrap">
              {productData.sizes.map((s, index) => (
                <button
                  key={index}
                  onClick={() => setSize(s)}
                  className={`py-2 px-4 border rounded-lg transition-all duration-300 ${size === s
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-gray-100 text-text border-gray-300'
                    } hover:bg-secondary hover:text-white hover:border-secondary`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Button Group */}
          <div className="flex gap-4 flex-wrap mb-8">
            <button onClick={() => addToCart(productData._id, size)} className="w-full py-3 px-8 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center font-medium shadow-sm">
              Add to Cart
            </button>
            <button className="py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
              <Sliders size={20} /> Customize
            </button>
            <button onClick={() => navigate('/try-on', { state: { image: productData.images[currentIndex] } })} className="py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
              <Camera size={20} /> Virtual Try-On
            </button>
            <button onClick={() => navigate('/aa-chatbot')} className="py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
              <MessageCircle size={20} /> Ask Aa
            </button>
          </div>

          {/* Product Information Dropdowns */}
          <div className="border-t border-gray-200 pt-4">
            {/* Description Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('description')} className="w-full py-3 flex justify-between items-center text-left font-medium text-secondary">
                Description
                {expandedSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'description' && (
                <div className="pb-4 pt-2 text-text">
                  <p>
                    {productData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Wash Care Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('washcare')} className="w-full py-3 flex justify-between items-center text-left font-medium text-secondary">
                Wash Care
                {expandedSection === 'washcare' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'washcare' && (
                <div className="pb-4 pt-2 text-text">
                  <ul className="list-disc pl-5">
                    <li>Hand wash with mild detergent</li>
                    <li>Do not bleach</li>
                    <li>Dry in shade</li>
                    <li>Warm iron</li>
                    <li>Do not dry clean</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Delivery Timeline Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('delivery')} className="w-full py-3 flex justify-between items-center text-left font-medium text-secondary">
                Delivery Timeline
                {expandedSection === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'delivery' && (
                <div className="pb-4 pt-2 text-text">
                  <p>Standard delivery: 3-5 business days</p>
                  <p>Express delivery: 1-2 business days (additional charges apply)</p>
                </div>
              )}
            </div>

            {/* Manufacturing Details Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('manufacturing')} className="w-full py-3 flex justify-between items-center text-left font-medium text-secondary">
                Manufacturing Details
                {expandedSection === 'manufacturing' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'manufacturing' && (
                <div className="pb-4 pt-2 text-text">
                  <p>Handcrafted by skilled artisans</p>
                  <p>Made in certified workshops</p>
                  <p>Ethically sourced materials</p>
                  <p>Quality checked at multiple stages</p>
                </div>
              )}
            </div>

            {/* Returns & Exchanges Dropdown */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection('returns')} className="w-full py-3 flex justify-between items-center text-left font-medium text-secondary">
                Returns & Exchanges
                {expandedSection === 'returns' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'returns' && (
                <div className="pb-4 pt-2 text-text">
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
        <div
          className="fixed inset-0 bg-background bg-opacity-95 flex items-center justify-center z-50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={modalRef}
            className="relative max-h-[90vh] overflow-y-auto scrollbar-hide"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <img
              src={modalImage}
              alt="Modal View"
              className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
          <button className="absolute top-4 right-4 bg-white text-black p-2 rounded-full" onClick={closeModal}>
            ✖
          </button>
          <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-secondary text-white p-3 rounded-full" onClick={handlePrev}>
            ◀
          </button>
          <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-secondary text-white p-3 rounded-full" onClick={handleNext}>
            ▶
          </button>
          <div className="absolute bottom-10 right-10 flex gap-2">
            <button className="bg-white text-black p-2 rounded-full w-10 h-10 flex items-center justify-center" onClick={zoomIn}>
              +
            </button>
            <button className="bg-white text-black p-2 rounded-full w-10 h-10 flex items-center justify-center" onClick={zoomOut}>
              -
            </button>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10 bg-primary p-6 shadow-lg">
        <div className="flex justify-start space-x-4 mb-6">
          <b className="px-5 py-3 text-sm text-secondary bg-background rounded-md hover:shadow-md hover:bg-secondary hover:text-background">
            Description
          </b>
          <p className="px-5 py-3 text-sm text-secondary bg-primary rounded-md hover:shadow-md hover:bg-background">
            Reviews (9)
          </p>
        </div>
        <div className="flex flex-col gap-4 p-6 border border-secondary rounded-md bg-primary shadow-sm">
          <p className="text-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet nam fugiat
            nobis alias ratione? Delectus odio maxime minus aliquid, error ex
            voluptatem recusandae est quidem! Culpa magnam dolore corporis accusantium.
          </p>
          <p className="text-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet nam fugiat
            nobis alias ratione? Delectus odio maxime minus aliquid, error ex
            voluptatem recusandae est quidem! Culpa magnam dolore corporis accusantium.
          </p>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productId} />
    </div>
  );
};

export default Product;