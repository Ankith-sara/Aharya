import React, { useEffect } from 'react';
import Title from '../components/Title';
import { Truck, Globe, Package, Clock, MapPin, Mail } from 'lucide-react';

const ShippingDeliveryPolicy = () => {
  useEffect(() => {
    document.title = 'Shipping & Delivery Policy | Aharyas'
  });

  return (
    <div className="min-h-screen text-black mt-20">
      <section className="py-20 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-8">
            <Title text1="SHIPPING &" text2="DELIVERY POLICY" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            We ensure your handcrafted Aharyas pieces reach you safely and promptly, whether you're in India or anywhere across the globe.
          </p>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light tracking-wider text-black mb-6">SHIPPING METHODS</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-medium text-black">International Shipping</h3>
              </div>

              <div className="space-y-4 text-gray-700 font-light">
                <p> For our global customers, we ship through registered international courier companies and international speed post services. </p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Available Services:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Registered International Courier Companies</li>
                    <li>• International Speed Post</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600 italic">
                  All international shipments include tracking and insurance for your peace of mind.
                </p>
              </div>
            </div>

            {/* Domestic Shipping */}
            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-medium text-black">Domestic Shipping</h3>
              </div>

              <div className="space-y-4 text-gray-700 font-light">
                <p> Within India, we ensure reliable delivery through registered domestic courier companies and speed post services. </p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Available Services:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Registered Domestic Courier Companies</li>
                    <li>• Speed Post</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600 italic">
                  Fast and secure delivery across all major cities and towns in India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processing & Delivery Timeline */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">PROCESSING TIME</h2>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-100 to-white p-12 border-l-4 border-black">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="text-4xl font-light mb-4">0-7 Days</div>
                <h3 className="text-xl font-medium text-black mb-4">Order Processing & Shipping</h3>
                <p className="text-gray-700 font-light leading-relaxed">
                  Orders are processed and shipped within 0-7 days from order confirmation, 
                  or as per the delivery date agreed at the time of order placement.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white p-6 shadow-sm rounded-lg">
                  <Package className="text-gray-600 mx-auto mb-3" size={24} />
                  <h4 className="font-medium text-black mb-2">Order Confirmation</h4>
                  <p className="text-sm text-gray-600">Within 24 hours of payment</p>
                </div>
                
                <div className="bg-white p-6 shadow-sm rounded-lg">
                  <Truck className="text-gray-600 mx-auto mb-3" size={24} />
                  <h4 className="font-medium text-black mb-2">Processing</h4>
                  <p className="text-sm text-gray-600">0-7 days preparation time</p>
                </div>
                
                <div className="bg-white p-6 shadow-sm rounded-lg">
                  <Globe className="text-gray-600 mx-auto mb-3" size={24} />
                  <h4 className="font-medium text-black mb-2">Shipment</h4>
                  <p className="text-sm text-gray-600">Handed to courier partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-xl border-l-4 border-black">
            <h2 className="text-2xl font-light tracking-wider text-black mb-8 text-center">IMPORTANT NOTICE</h2>
            
            <div className="space-y-6 text-gray-700 font-light leading-relaxed">
              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Clock size={16} />
                  Delivery Responsibility
                </h3>
                <p>
                  <strong>Aharyas is not liable for any delay in delivery by courier companies or postal authorities.</strong> 
                  We guarantee to hand over the consignment to the courier company or postal authorities within 
                  the specified timeframe from the date of order and payment.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  Delivery Address
                </h3>
                <p>
                  All orders will be delivered to the address provided by the buyer at the time of order placement. 
                  Please ensure your address is complete and accurate to avoid delivery delays.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Mail size={16} />
                  Delivery Confirmation
                </h3>
                <p>
                  Delivery confirmation will be sent to your registered email address. 
                  You'll receive tracking information once your order is dispatched.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">SHIPPING SUPPORT</h2>
          <p className="text-gray-700 font-light mb-8 max-w-2xl mx-auto">
            For any issues with your shipment or delivery, our customer support team is ready to assist you.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <h4 className="font-medium text-black mb-2">Helpdesk Phone</h4>
              <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
              <p className="text-lg text-gray-700 mb-1">+91 9121157804</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <h4 className="font-medium text-black mb-2">Email Support</h4>
              <p className="text-lg text-gray-700 mb-1">aharyasofficial@gmail.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
          </div>

          <div className="mt-12 bg-black text-white p-8 rounded-lg max-w-3xl mx-auto">
            <h3 className="font-light text-xl mb-4">Tracking Your Order</h3>
            <p className="font-light leading-relaxed">
              Once your order is shipped, you'll receive a tracking number via email. 
              Use this number to track your package's journey from our facility to your doorstep.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingDeliveryPolicy;