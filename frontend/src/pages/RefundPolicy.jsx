import React, { useEffect } from 'react';
import Title from '../components/Title';
import { RotateCcw, Shield, Clock, AlertCircle, CheckCircle, PackageCheck, XCircle, Info, Mail, Phone, Package } from 'lucide-react';

const CancellationRefundPolicy = () => {
  useEffect(() => {
    document.title = 'Return & Exchange Policy | Aharyas'
  });

  return (
    <div className="min-h-screen text-black mt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-8">
            <Title text1="RETURN &" text2="EXCHANGE POLICY" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            At Aharyas, we take pride in curating authentic, handcrafted products from artisans and brands across India. Each piece is made with care, and slight variations in color, weave, or texture are a natural part of its charm—not a defect.
          </p>
        </div>
      </section>

      {/* Policy Commitment */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg p-12 border-l-4 border-black">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">POLICY OVERVIEW</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4 text-gray-700 font-light">
                <p className="leading-relaxed">
                  At Aharyas, we celebrate the art of handcrafted products. Each item tells a story of skilled artisans and traditional craftsmanship. This policy outlines our commitment to quality while respecting the unique nature of handmade goods.
                </p>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-medium text-black mb-3">Important Notice</h4>
                  <p className="text-sm">
                    Please read this policy carefully before making a purchase. By placing an order, you acknowledge and accept these terms. Minor variations in handcrafted items are normal and reflect authenticity.
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Info size={16} />
                  Key Policy Points
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>No Refunds:</strong> We offer replacements or exchanges only</li>
                  <li>• <strong>Quick Cancellation:</strong> Cancel within 6 hours of order placement</li>
                  <li>• <strong>Report Issues Fast:</strong> Contact us within 2 working days</li>
                  <li>• <strong>Final Deadline:</strong> All concerns must be raised within 7 days of delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Policy Points */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <PackageCheck size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">OUR RETURN & EXCHANGE POLICY</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Policy Point 1 & 2 */}
            <div className="space-y-6">
              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Order Cancellation Window
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Orders may be cancelled within <strong>6 hours of placement</strong> by emailing <strong>support@aharyas.com</strong>. 
                      After this window, orders are processed and cannot be cancelled.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <XCircle size={16} />
                      No Refunds Policy
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Refunds are <strong>not offered</strong> under any circumstances. We provide replacements or exchanges for eligible cases only. 
                      This policy supports our artisan partners and their handcrafted work.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <Shield size={16} />
                      Handcrafted Nature
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Minor irregularities in color, print, or weave reflect the handcrafted nature of our products. 
                      These variations are characteristics of authentic handmade items, not defects.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Report Damage Immediately
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Any damage or defect must be reported within <strong>2 working days</strong> of receiving the order. 
                      Include clear photos and your order number when contacting us.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    5
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <Package size={16} />
                      Return Conditions
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Items must be <strong>unused, unwashed</strong>, and in <strong>original packaging with tags intact</strong> for exchange. 
                      Any alterations or signs of use will void exchange eligibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Point 6-10 */}
            <div className="space-y-6">
              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    6
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2">Non-Returnable Items</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      The following items are <strong>not eligible</strong> for return or exchange:
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Custom-made or personalized items</li>
                        <li>• Items purchased during sale periods</li>
                        <li>• Altered or tailored products</li>
                        <li>• Items without tags or packaging</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    7
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <RotateCcw size={16} />
                      Size Exchanges
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Size exchanges are accepted <strong>only if the incorrect size was delivered</strong>. 
                      If you ordered the wrong size, exchanges are subject to availability and approval.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    8
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <CheckCircle size={16} />
                      Replacement Process
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Verified defective or damaged items will be <strong>replaced at the earliest</strong>. 
                      Our team will verify the issue and process replacement within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    9
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Do Not Self-Ship
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Please <strong>do not self-ship returns</strong> without confirmation from our support team. 
                      Unauthorized returns will not be processed, and shipping costs will not be reimbursed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    10
                  </div>
                  <div>
                    <h3 className="font-medium text-black mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Contact Deadline
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      For all order-related concerns, contact us at <strong>support@aharyas.com</strong> within <strong>7 days of delivery</strong>. 
                      After this period, we cannot process any return or exchange requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Process */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <RotateCcw size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">HOW TO REQUEST AN EXCHANGE</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-medium">
                  1
                </div>
                <h3 className="font-medium text-black">Contact Support</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Email <strong>support@aharyas.com</strong> within 2 working days of receiving your order. 
                Include your order number, photos of the issue, and a detailed description.
              </p>
            </div>

            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-medium">
                  2
                </div>
                <h3 className="font-medium text-black">Verification</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Our team will review your case and verify the issue. Keep the item unused and in original packaging 
                with all tags attached during this process.
              </p>
            </div>

            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-medium">
                  3
                </div>
                <h3 className="font-medium text-black">Resolution</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Once approved, we'll arrange pickup and send a replacement. The entire process typically 
                takes 5-7 business days from verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Accept */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gradient-to-r from-gray-100 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-xl border-l-4 border-black">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light tracking-wider text-black flex items-center justify-center gap-3">
                <XCircle size={24} />
                ITEMS WE CANNOT EXCHANGE
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black mb-1">Change of Mind</p>
                    <p className="text-sm text-gray-600">Returns due to personal preference or change of mind are not accepted.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black mb-1">Used or Washed Items</p>
                    <p className="text-sm text-gray-600">Items that have been worn, washed, or altered cannot be exchanged.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black mb-1">Missing Tags or Packaging</p>
                    <p className="text-sm text-gray-600">Items without original tags and packaging are not eligible for exchange.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black mb-1">Custom or Sale Items</p>
                    <p className="text-sm text-gray-600">Custom-made items and products purchased during sales are final sale.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black mb-1">Minor Variations</p>
                    <p className="text-sm text-gray-600">Natural variations in handcrafted items are not grounds for return or exchange.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-black mb-1">Late Requests</p>
                    <p className="text-sm text-gray-600">Requests made after 7 days of delivery cannot be processed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">NEED HELP WITH YOUR ORDER?</h2>
          <p className="text-gray-700 font-light mb-8 max-w-2xl mx-auto">
            Our customer service team is here to assist you with any return or exchange queries. 
            We're committed to resolving your concerns promptly and fairly.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Phone size={16} />
                <h4 className="font-medium text-black">Phone</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
              <p className="text-lg text-gray-700 mb-1">+91 9121157804</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 6 PM IST</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail size={16} />
                <h4 className="font-medium text-black">Email</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">support@aharyas.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
              <p className="text-xs text-gray-500 mt-1">Include order number in subject</p>
            </div>

            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertCircle size={16} />
                <h4 className="font-medium text-black">Deadline</h4>
              </div>
              <p className="text-lg text-gray-700 font-medium mb-1">7 Days</p>
              <p className="text-sm text-gray-500">From delivery date</p>
              <p className="text-xs text-gray-500 mt-1">All concerns must be raised before deadline</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationRefundPolicy;