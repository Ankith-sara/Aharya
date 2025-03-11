import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sell from './pages/Sell';
import ProductPage from './pages/ProductPage';
import ChatBot from './pages/ChatBot';
import MyProfile from './pages/MyProfile';
import Verify from './pages/Verify';
import VirtualTryOn from './pages/VirtualTryon';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path="/shop/:subcategory" element={<ProductPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/profile' element={<MyProfile />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/aa-chatbot' element={<ChatBot />} />
        <Route path='/try-on' element={<VirtualTryOn />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;