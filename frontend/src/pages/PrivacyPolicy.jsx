import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Cookie, Users, Mail, Phone, MapPin, Database, Settings, AlertCircle } from 'lucide-react';
import Title from '../components/Title';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Aharyas'
  });

  return (
    <div className="min-h-screen text-black mt-20">
      <section className="py-20 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-8">
            <Title text1="PRIVACY" text2="POLICY" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you visit our website or purchase our products.
          </p>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg p-12 border-l-4 border-black">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">OUR COMMITMENT TO PRIVACY</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4 text-gray-700 font-light">
                <p> TATHASTA WEAVES LLP is committed to ensuring that your privacy is protected. When you provide information that identifies you on our website, you can be assured it will only be used in accordance with this privacy statement. </p>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-medium text-black mb-3">About This Policy</h4>
                  <p className="text-sm">
                    This privacy policy sets out how TATHASTA WEAVES LLP uses and protects any information 
                    you provide when you visit our website and/or agree to purchase from us.
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Policy Updates
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We may change this policy from time to time by updating this page. 
                  You should check this page periodically to ensure that you adhere to these changes. 
                  Your continued use of our services after any modifications constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Database size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">INFORMATION WE COLLECT</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Users size={16} />
                  Personal Information
                </h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>We may collect the following information:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Name</strong> - For order processing and communication</li>
                    <li>• <strong>Contact Information</strong> - Including email address</li>
                    <li>• <strong>Demographic Information</strong> - Such as postcode, preferences, and interests</li>
                    <li>• <strong>Survey Information</strong> - Relevant to customer surveys and/or offers</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Eye size={16} />
                  When We Collect Information
                </h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• When you create an account on our website</li>
                    <li>• During the purchase process</li>
                    <li>• When you subscribe to our newsletter</li>
                    <li>• When you participate in surveys or feedback</li>
                    <li>• When you contact our customer support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Settings size={16} />
                  How We Use Your Information
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  We require this information to understand your needs and provide you with better service, particularly for:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Internal record keeping</li>
                    <li>• Improving our products and services</li>
                    <li>• Sending promotional emails about new products and offers</li>
                    <li>• Market research purposes</li>
                    <li>• Customizing the website according to your interests</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white shadow-lg p-6 border-l-4 border-black hover:shadow-xl transition-shadow">
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                  <Lock size={16} />
                  Information Security
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We are committed to ensuring that your information is secure. To prevent unauthorized access 
                  or disclosure, we have implemented suitable physical, electronic, and managerial procedures 
                  to safeguard and secure the information we collect online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Policy */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Cookie size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">HOW WE USE COOKIES</h2>
            </div>
          </div>

          <div className="bg-white shadow-lg p-12 border-l-4 border-black">
            <div className="space-y-6">
              <p className="text-gray-700 font-light leading-relaxed first-letter:text-4xl first-letter:font-light first-letter:text-black first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                A cookie is a small file which asks permission to be placed on your computer's hard drive. 
                Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site.
              </p>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-medium text-black mb-3">What Cookies Do</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Allow web applications to respond to you as an individual</li>
                    <li>• Tailor operations to your needs, likes, and dislikes</li>
                    <li>• Gather and remember information about your preferences</li>
                    <li>• Help us analyze webpage traffic and improve our website</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-medium text-black mb-3">Traffic Log Cookies</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    We use traffic log cookies to identify which pages are being used. This helps us analyze 
                    data about webpage traffic and improve our website to tailor it to customer needs. 
                    We only use this information for statistical analysis purposes and then the data is removed from the system.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-200">
                <h4 className="font-medium text-black mb-3">Your Cookie Choices</h4>
                <p className="text-sm leading-relaxed">
                  You can choose to accept or decline cookies. Most web browsers automatically accept cookies, 
                  but you can usually modify your browser setting to decline cookies if you prefer. 
                  This may prevent you from taking full advantage of the website. A cookie in no way gives us 
                  access to your computer or any information about you, other than the data you choose to share with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controlling Your Information */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Settings size={24} />
              </div>
              <h2 className="text-2xl font-light tracking-wider text-black">CONTROLLING YOUR PERSONAL INFORMATION</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <h3 className="font-medium text-black mb-6">Your Rights & Choices</h3>
              
              <div className="space-y-4 text-gray-700 font-light">
                <p> You may choose to restrict the collection or use of your personal information in the following ways: </p>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-medium text-black mb-3">Restricting Data Collection</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Look for opt-out boxes when filling forms on our website</li>
                    <li>• Indicate if you don't want information used for direct marketing</li>
                    <li>• Change your mind at any time by contacting us</li>
                    <li>• Update your preferences through your account settings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <h3 className="font-medium text-black mb-6">Third-Party Information Sharing</h3>
              
              <div className="space-y-4 text-gray-700 font-light">
                <div className="p-6 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-black mb-3">Our Promise</h4>
                  <p className="text-sm leading-relaxed">
                    <strong>We will not sell, distribute, or lease your personal information to third parties</strong> 
                    unless we have your permission or are required by law to do so. We may use your personal 
                    information to send you promotional information about third parties which we think you may 
                    find interesting if you tell us that you wish this to happen.
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-black mb-3">Data Accuracy</h4>
                  <p className="text-sm leading-relaxed">
                    If you believe that any information we are holding about you is incorrect or incomplete, 
                    please contact us as soon as possible. We will promptly correct any information found to be incorrect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Communications */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gradient-to-r from-gray-100 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-xl border-l-4 border-black">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light tracking-wider text-black">MARKETING COMMUNICATIONS</h2>
            </div>
            
            <div className="space-y-6 text-gray-700 font-light leading-relaxed">
              <p className="text-center">
                We may periodically send promotional emails about new products, special offers, or other information 
                which we think you may find interesting using the email address you have provided.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3">Communication Methods</h3>
                  <p className="text-sm mb-3">
                    From time to time, we may also use your information to contact you for market research purposes. 
                    We may contact you by:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Email</li>
                    <li>• Phone</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3">Opt-Out Options</h3>
                  <p className="text-sm">
                    If you have previously agreed to us using your personal information for direct marketing purposes, 
                    you may change your mind at any time by writing to or emailing us at 
                    <strong> aharyasofficial@gmail.com</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">CONTACT US ABOUT PRIVACY</h2>
          <p className="text-gray-700 font-light mb-8 max-w-2xl mx-auto">
            If you believe that any information we are holding about you is incorrect or incomplete, 
            or if you have questions about our privacy practices, please contact us immediately.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Phone size={16} />
                <h4 className="font-medium text-black">Phone</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
              <p className="text-lg text-gray-700 mb-1">+91 9121157804</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail size={16} />
                <h4 className="font-medium text-black">Email</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">aharyasofficial@gmail.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>

            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MapPin size={16} />
                <h4 className="font-medium text-black">Address</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                J J Nagar, Near Ganesh Temple,<br />
                Sainikpuri, Malkajgiri,<br />
                Hyderabad, Telangana 500094
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;