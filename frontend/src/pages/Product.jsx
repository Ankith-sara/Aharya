import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
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

  const zoomIn = () => {
    if (zoomLevel < 1.5) setZoomLevel(zoomLevel + 0.1);
  };

  const zoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % productData.images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? productData.images.length - 1 : prev - 1));
  };

  const openModal = (img) => {
    setModalImage(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage('');
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
    <div className="bg-background text-text m-20 min-h-screen p-6">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="flex-1">
          <div className="relative rounded-lg shadow-md overflow-hidden">
            <img src={productData.images[currentIndex]} alt={productData.name} onClick={() => openModal(productData.images[currentIndex])} className="w-full h-[75vh] object-contain cursor-pointer hover:opacity-90" />
            <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-secondary text-white p-3 rounded-full" onClick={handlePrev} > ◀ </button>
            <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-secondary text-white p-3 rounded-full" onClick={handleNext} > ▶ </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-5 bg-primary p-2 rounded-md  justify-center overflow-x-auto">
            {productData.images.map((img, index) => (
              <img key={index} src={img} alt={`${productData.name} thumbnail`} onClick={() => setCurrentIndex(index)} className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${currentIndex === index ? 'border-2 border-secondary' : ''} hover:opacity-80`} />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-6 bg-primary rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-secondary mb-4">{productData.name}</h1>
          <p className="text-xl font-semibold mb-2">
            {currency}
            {productData.price}
          </p>
          <p className="text-sm text-gray-700 mb-4">Prices include GST</p>
          <p className="mb-6">{productData.description}</p>
          <div className="mb-6">
            <p className="font-semibold mb-2">Select Size</p>
            <div className="flex gap-3">
              {productData.sizes.map((s, index) => (
                <button key={index} onClick={() => setSize(s)} className={`py-2 px-4 border rounded-lg ${size === s ? 'bg-secondary text-white' : 'bg-gray-100'} hover:bg-secondary hover:text-white`} > {s} </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button className="py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Customize</button>
            <button onClick={() => addToCart(productData._id, size)} className="py-3 px-6 bg-secondary text-white rounded-lg hover:bg-[#432a12]" > Add to Cart </button>
            <button onClick={() => navigate('/aa-chatbot')} className='py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600'>Ask Aa</button>
          </div>
          <div className='text-md mt-5 flex flex-col gap-1'>
            <p>100% Original product</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      <div className="mt-20 bg-primary p-6 rounded-lg shadow-lg">
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

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img src={modalImage} alt="Modal View" className="max-w-[80vw] max-h-[80vh] object-contain" style={{ transform: `scale(${zoomLevel})` }} />
          </div>
          <button className="absolute top-4 right-4 bg-white text-black p-2 rounded-full" onClick={closeModal} > ✖ </button>
          <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-secondary text-white p-3 rounded-full" onClick={handlePrev} > ◀ </button>
          <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-secondary text-white p-3 rounded-full" onClick={handleNext} > ▶ </button>
          <button className="absolute bottom-10 right-16 bg-white text-black p-2 rounded-full" onClick={zoomIn} > + </button>
          <button className="absolute bottom-10 right-4 bg-white text-black p-2 rounded-full" onClick={zoomOut} > - </button>
        </div>
      )}
    </div>
  );
};

export default Product;