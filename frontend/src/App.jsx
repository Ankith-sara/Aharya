import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sell from './pages/Sell';
import ProductPage from './pages/ProductPage';
import ChatBot from './pages/ChatBot';
import MyProfile from './pages/MyProfile';
import Verify from './pages/Verify';
import VirtualTryOn from './pages/VirtualTryOn';
import BlogPage from './pages/BlogPage';
import ScrollToTop from './components/ScrollToTop';
import TrackOrder from './pages/TrackOrder';
import ChatIcon from './components/ChatIcon';
import CancellationRefundPolicy from './pages/RefundPolicy';
import ShippingDeliveryPolicy from './pages/DeliveryPolicy';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQs from './pages/FAQs';
import Support from './pages/Support';
import Wishlist from './pages/Wishlist';

const App = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login';
  const hideChatIcon = location.pathname === '/aa-chatbot';
 
  return (
    <div>
      <ToastContainer />
      {!hideNavAndFooter && <Navbar />}
      <SearchBar />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/shop/:subcategory' element={<ProductPage />} />
        <Route path='/shop/company/:company' element={<ProductPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/trackorder/:orderId' element={<TrackOrder />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/profile/:id' element={<MyProfile />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/blog' element={<BlogPage />} />
        <Route path='/refundpolicy' element={<CancellationRefundPolicy />} />
        <Route path='/shippingpolicy' element={<ShippingDeliveryPolicy />} />
        <Route path='/termsconditions' element={<TermsConditions />} />
        <Route path='/privacypolicy' element={<PrivacyPolicy />} />
        <Route path='/faqs' element={<FAQs />} />
        <Route path='/support' element={<Support />} />
        <Route path='/aa-chatbot' element={<ChatBot />} />
        <Route path='/try-on' element={<VirtualTryOn />} />
      </Routes>
      {!hideChatIcon && <ChatIcon />}
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

export default App;