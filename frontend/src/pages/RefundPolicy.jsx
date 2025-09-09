import React, { useEffect } from 'react';
import Title from '../components/Title';
import { RotateCcw, Shield, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const CancellationRefundPolicy = () => {
  useEffect(() => {
    document.title = 'Cancellation & Refund Policy | Aharyas'
  });

  return (
    <div className="min-h-screen text-black mt-20">
      <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-8">
            <Title text1="CANCELLATION &" text2="REFUND POLICY" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            At Aharyas, we believe in helping our customers as far as possible. Our liberal cancellation and refund policy reflects our commitment to your satisfaction.
          </p>
        </div>
      </section>

      {/* Cancellation Policy */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <RotateCcw className="text-red-600" size={24} />
                </div>
                <h2 className="text-2xl font-light tracking-wider text-black">CANCELLATION POLICY</h2>
              </div>
              <div className="w-16 h-0.5 bg-black mb-8"></div>
              
              <div className="space-y-6 text-gray-700 font-light leading-relaxed">
                <p className="first-letter:text-4xl first-letter:font-light first-letter:text-black first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                  We understand that plans change. Our cancellation policy is designed to be fair and transparent while respecting the artisans and partners who craft each piece.
                </p>
                
                <div className="bg-white p-6 border-l-4 border-red-500 shadow-sm">
                  <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    Time Limit for Cancellations
                  </h4>
                  <p>Cancellation requests will be considered only if made within <strong>2 days of placing the order</strong>.</p>
                </div>

                <div className="bg-white p-6 border-l-4 border-amber-500 shadow-sm">
                  <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Processing Limitations
                  </h4>
                  <p>Cancellation requests may not be entertained if orders have been communicated to vendors/merchants and they have initiated the shipping process.</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg p-8 border-l-4 border-black">
              <h3 className="text-xl font-medium text-black mb-6">Cancellation Restrictions</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black">Perishable Items</p>
                    <p className="text-sm text-gray-600">We do not accept cancellation requests for perishable items like flowers, eatables, etc.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black">Quality Issues</p>
                    <p className="text-sm text-gray-600">Refund/replacement available if you can establish that the product quality is not satisfactory.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policy */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">REFUND POLICY</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-black">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500" size={20} />
                <h3 className="font-medium text-black">Damaged/Defective Items</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Report damaged or defective items to our Customer Service team within <strong>2 days of receipt</strong>. 
                We'll process your request after merchant verification.
              </p>
            </div>

            <div className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-black">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="text-amber-500" size={20} />
                <h3 className="font-medium text-black">Product Expectations</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                If the product doesn't match the website description or your expectations, 
                contact us within <strong>2 days</strong>. Our team will review and decide accordingly.
              </p>
            </div>

            <div className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-black">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-blue-500" size={20} />
                <h3 className="font-medium text-black">Warranty Items</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                For products with manufacturer warranty, 
                please refer warranty-related issues directly to the respective manufacturers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Processing */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-xl border-l-4 border-black">
            <div className="flex items-center justify-center gap-4 mb-6">
              <CheckCircle className="text-green-600" size={32} />
              <h2 className="text-2xl font-light tracking-wider text-black">REFUND PROCESSING TIME</h2>
            </div>
            
            <div className="text-gray-700 font-light leading-relaxed">
              <p className="text-lg mb-4">
                Once your refund is approved by Aharyas, it will take
              </p>
              <div className="text-3xl font-medium text-green-600 mb-4">6-8 Days</div>
              <p>
                for the refund to be processed to your account. Processing time may vary depending on your bank or payment method.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">Need Help?</h2>
          <p className="text-gray-700 font-light mb-8 max-w-2xl mx-auto">
            Our customer service team is here to assist you with any cancellation or refund queries. 
            We're committed to resolving your concerns promptly and fairly.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <h4 className="font-medium text-black mb-2">Phone Support</h4>
              <p className="text-gray-700">+91 9063284008</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <h4 className="font-medium text-black mb-2">Email Support</h4>
              <p className="text-gray-700">aharyasofficial@gmail.com</p>
              <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationRefundPolicy;