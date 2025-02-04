import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/frontend_assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: '',
  });

  // Handles input changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // Handles form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Prepare order items
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
          if (responseStripe.data.success) {
            const {session_url} = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case 'razorpay':
          toast.info('Razorpay integration not yet implemented.');
          break;

        default:
          toast.error('Invalid payment method selected.');
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row bg-primary border-2 rounded-lg border-secondary justify-between gap-4 p-10 sm:pt-14 min-h-[80vh] border-t m-20" >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl text-secondary my-3" >
          <Title text1="Delivery" text2="Information" />
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" required />
          <input onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" required />
        </div>
        <input onChange={onChangeHandler} name="email" value={formData.email} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email address" required />
        <input onChange={onChangeHandler} name="street" value={formData.street} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" required />
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name="city" value={formData.city} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" required />
          <input onChange={onChangeHandler} name="state" value={formData.state} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" required />
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} name="pincode" value={formData.pincode} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="number" placeholder="Pincode" required />
          <input onChange={onChangeHandler} name="country" value={formData.country} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" required />
        </div>
        <input onChange={onChangeHandler} name="phone" value={formData.phone} className="border bg-primary text-text border-secondary rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone number" required />
      </div>

      <div className="bg-background p-10 rounded-md b mt-8">
        <CartTotal />
        <div className="mt-12">
          <Title text1="Payment" text2="Method" style={{ color: "#543a14" }} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <PaymentOption method={method} setMethod={setMethod} type="stripe" logo={assets.stripe_logo} />
            <PaymentOption method={method} setMethod={setMethod} type="razorpay" logo={assets.razorpay_logo} />
            <PaymentOption method={method} setMethod={setMethod} type="cod" />
          </div>
          <div className="w-full text-end mt-8">
            <button type="submit" className="px-16 py-3 bg-secondary text-primary text-sm" >
              Place order
            </button>
          </div>
        </div>
      </div>
    </form>

  );
};

const PaymentOption = ({ method, setMethod, type, logo }) => (
  <div onClick={() => setMethod(type)} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === type ? 'bg-green-400' : ''}`}></p>
    {logo ? <img className='h-5 mx-4' src={logo} alt='' /> : <p className='text-gray-700 text-sm mx-4'>Cash on delivery</p>}
  </div>
);

export default PlaceOrder;