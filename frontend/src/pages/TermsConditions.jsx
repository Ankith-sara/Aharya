import React, { useEffect } from 'react';
import { Scale, FileText, AlertTriangle, Shield, Link, CreditCard, User, ShoppingCart, Gavel, Mail, Phone } from 'lucide-react';
import Title from '../components/Title';

const TermsConditions = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions | Aharyas'
  });

  return (
    <div className="min-h-screen text-black mt-20">
      <section className="py-20 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-8">
            <Title text1="TERMS &" text2="CONDITIONS" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            These terms and conditions govern your use of our website and purchase of our handcrafted products. Please read them carefully.
          </p>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg p-12 border-l-4 border-black">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">COMPANY INFORMATION</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4 text-gray-700 font-light">
                <p className="first-letter:text-4xl first-letter:font-light first-letter:text-black first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                  These terms and conditions apply to TATHASTA WEAVES LLP and all users of our website and services.
                </p>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-medium text-black mb-3">Legal Entity</h4>
                  <p><strong>TATHASTA WEAVES LLP</strong></p>
                  <p className="text-sm mt-2">
                    Registered/Operational Office:<br />
                    J J Nagar, Near Ganesh Temple,<br />
                    Sainikpuri, Malkajgiri,<br />
                    Hyderabad, Telangana 500094
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-black mb-4">Definitions</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong>"We", "Us", "Our"</strong></p>
                    <p className="text-gray-600">Refers to TATHASTA WEAVES LLP</p>
                  </div>
                  <div>
                    <p><strong>"You", "Your", "User", "Visitor"</strong></p>
                    <p className="text-gray-600">Any natural or legal person visiting our website and/or purchasing from us</p>
                  </div>
                  <div>
                    <p><strong>"Services"</strong></p>
                    <p className="text-gray-600">Our website, products, and customer support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Usage Terms */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">WEBSITE USAGE TERMS</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white shadow-lg p-6 border-l-4 border-gr hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <FileText size={16} />
                  Content Changes
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The content of our website pages is subject to change without notice. 
                  We reserve the right to modify information, prices, and product availability at any time.
                </p>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Information Accuracy
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  While we strive for accuracy, neither we nor third parties provide any warranty regarding 
                  the accuracy, timeliness, or completeness of information on our website. 
                  Use of any information is entirely at your own risk.
                </p>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <User size={16} />
                  User Responsibilities
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  You are responsible for ensuring the confidentiality of your account information and 
                  for all activities under your account. Please notify us immediately of any unauthorized use.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Shield size={16} />
                  Prohibited Uses
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  You may not use our site for any unlawful purpose or to solicit others to perform unlawful acts.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Harassment or abuse of other users</li>
                  <li>• Transmission of viruses or malicious code</li>
                  <li>• Unauthorized data collection</li>
                </ul>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Link size={16} />
                  Third-Party Links
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Our website may contain links to third-party sites. We are not responsible for 
                  the content or privacy practices of these external sites.
                </p>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Gavel size={16} />
                  Governing Law
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  These terms are governed by and construed in accordance with the laws of India, 
                  and you submit to the jurisdiction of the courts in Hyderabad, Telangana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Terms */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ShoppingCart size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">PURCHASE TERMS</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="space-y-4 text-gray-700 font-light">
                <p> By placing an order with us, you agree to provide current, complete, and accurate purchase information. </p>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-medium text-black mb-3">Order Process</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Order confirmation sent within 24 hours</li>
                    <li>• Payment processing and verification</li>
                    <li>• Product preparation (0-7 days)</li>
                    <li>• Shipping and delivery tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-xl font-medium text-black">Payment Terms</h3>
              </div>

              <div className="space-y-4 text-gray-700 font-light">
                <p className="text-sm leading-relaxed">
                  We reserve the right to refuse or cancel your order if fraud or unauthorized purchase is suspected.
                </p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Accepted Payment Methods:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Credit/Debit Cards</li>
                    <li>• Digital Wallets</li>
                    <li>• Bank Transfers</li>
                    <li>• UPI Payments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liability & Disclaimer */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-xl border-l-4 border-black">
            <h2 className="text-2xl font-light tracking-wider text-black mb-8 text-center">LIABILITY & DISCLAIMER</h2>
            
            <div className="space-y-6 text-gray-700 font-light leading-relaxed">
              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Limitation of Liability
                </h3>
                <p className="text-sm">
                  <strong>In no case shall TATHASTA WEAVES LLP be liable for any direct, indirect, punitive, 
                  incidental, special, consequential damages</strong> that result from the use of, or inability to use, 
                  this website or the purchase of products from us. This includes, without limitation, 
                  reliance by a user on any information obtained via the website.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Shield size={16} />
                  Product Quality
                </h3>
                <p className="text-sm">
                  While we take great care in crafting our products, we acknowledge that handmade items may have 
                  natural variations. We provide detailed product descriptions and images to help you make informed decisions.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Scale size={16} />
                  Force Majeure
                </h3>
                <p className="text-sm">
                  We shall not be liable for any failure to perform our obligations where such failure results 
                  from acts of nature, war, terrorism, labor disputes, or other causes beyond our reasonable control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Data Protection */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">PRIVACY & DATA PROTECTION</h2>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-100 to-white p-12 border-l-4 border-black">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 font-light leading-relaxed mb-8 text-center">
                Your privacy is important to us. We are committed to protecting your personal information 
                and being transparent about how we collect, use, and share your data.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 shadow-sm rounded-lg border-l-2 border-gray-500">
                  <h4 className="font-medium text-black mb-3">Information We Collect</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Contact information (name, email, phone)</li>
                    <li>• Billing and shipping addresses</li>
                    <li>• Payment information (processed securely)</li>
                    <li>• Order history and preferences</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 shadow-sm rounded-lg border-l-2 border-gray-500">
                  <h4 className="font-medium text-black mb-3">How We Use Your Data</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Processing and fulfilling orders</li>
                    <li>• Customer support and communication</li>
                    <li>• Improving our products and services</li>
                    <li>• Marketing (with your consent)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">QUESTIONS ABOUT THESE TERMS?</h2>
          <p className="text-gray-700 font-light mb-8 max-w-2xl mx-auto">
            If you have any questions about these Terms & Conditions, please don't hesitate to contact us.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Phone size={16} />
                <h4 className="font-medium text-black">Phone Support</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
              <p className="text-lg text-gray-700 mb-1">+91 9121157804</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail size={16} />
                <h4 className="font-medium text-black">Email Support</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">aharyasofficial@gmail.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
          </div>

          <div className="mt-12 bg-black text-white p-8 rounded-lg max-w-3xl mx-auto">
            <h3 className="font-light text-xl mb-4">Agreement to Terms</h3>
            <p className="font-light leading-relaxed">
              By using our website and services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms & Conditions. These terms may be updated 
              periodically, and your continued use constitutes acceptance of any changes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;