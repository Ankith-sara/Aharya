import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  HeadphonesIcon,
  Send,
  CheckCircle,
  HelpCircle,
  Truck,
  RefreshCw,
  CreditCard,
  Package,
  Shield,
  User,
  MapPin
} from 'lucide-react';

// Title component (assuming it exists in your project)
const Title = ({ text1, text2 }) => (
  <h1 className="font-light text-black">
    <span>{text1} </span>
    <span className="font-medium">{text2}</span>
  </h1>
);

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Customer Support | Aharyas'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });
    }, 3000);
  };

  const supportCategories = [
    {
      icon: Truck,
      title: "Orders & Shipping",
      description: "Track orders, shipping updates, delivery issues",
      topics: ["Order status", "Tracking", "Delivery delays", "Shipping charges"]
    },
    {
      icon: RefreshCw,
      title: "Returns & Exchanges",
      description: "Return requests, refund status, exchange policies",
      topics: ["Return policy", "Refund status", "Exchange requests", "Return pickup"]
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      description: "Payment issues, billing queries, transaction problems",
      topics: ["Payment failed", "Refund queries", "Invoice requests", "Payment methods"]
    },
    {
      icon: HelpCircle,
      title: "General Support",
      description: "Account issues, technical problems, product queries",
      topics: ["Account access", "Technical issues", "Product information", "Website problems"]
    }
  ];

  return (
    <div className="min-h-screen text-black mt-20">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-8">
            <Title text1="CUSTOMER" text2="SUPPORT" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            We're here to help! Get in touch with our support team for assistance with orders, returns, or any questions about your handcrafted Aharyas experience.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <HeadphonesIcon size={32} className="text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light tracking-wider text-black mb-6">GET IN TOUCH</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Phone Support */}
            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Phone className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black">Phone Support</h3>
                  <p className="text-sm text-gray-600">Speak with our team</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700 font-light">
                <p className="text-lg font-medium text-black">+91 9063284008</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Mon-Sat: 9:00 AM - 6:00 PM IST</span>
                </div>
                <p className="text-sm italic">Direct assistance for urgent matters</p>
              </div>
            </div>

            {/* Email Support */}
            <div className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Mail className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black">Email Support</h3>
                  <p className="text-sm text-gray-600">Get detailed assistance</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700 font-light">
                <p className="text-lg font-medium text-black">aharyasofficial@gmail.com</p>
                <p className="text-sm text-gray-600">Response within 24 hours</p>
                <p className="text-sm italic">Perfect for detailed inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light tracking-wider text-black mb-6">SUPPORT CATEGORIES</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {supportCategories.map((category, index) => {
              const IconComponent = category.icon;
              
              return (
                <div key={index} className="bg-white shadow-lg p-8 border-l-4 border-black hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <IconComponent className="text-black" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black">{category.title}</h3>
                      <p className="text-sm">{category.description}</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-black mb-3">Common Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1 bg-white text-xs text-gray-700 rounded-full font-medium border border-gray-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-xl p-12 border-l-4 border-black">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light tracking-wider text-black mb-6">SEND US A MESSAGE</h2>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-black mb-4">Message Sent Successfully!</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 font-light"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 font-light"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 font-light"
                    >
                      <option value="">Select a category</option>
                      <option value="orders">Orders & Shipping</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="payment">Payment & Billing</option>
                      <option value="technical">Technical Support</option>
                      <option value="product">Product Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 font-light"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 font-light"
                    placeholder="Please provide as much detail as possible about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                  <Send size={20} className="mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-100 border-l-4 border-black p-12">
            <div className="text-center mb-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Quick Tips for Faster Support</h3>
              <div className="w-16 h-0.5 bg-gray-600 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">1</span>
                  </div>
                  <p className="text-sm font-light">Include your order number for order-related inquiries</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">2</span>
                  </div>
                  <p className="text-sm font-light">Provide screenshots for technical issues</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">3</span>
                  </div>
                  <p className="text-sm font-light">Check our FAQ page first - your question might already be answered</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">4</span>
                  </div>
                  <p className="text-sm font-light">Be as specific as possible about your issue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">PROFESSIONAL SUPPORT TEAM</h2>
          <p className="text-gray-700 font-light mb-8 max-w-2xl mx-auto">
            Our dedicated customer support team understands the value of handcrafted artistry and 
            is committed to ensuring your complete satisfaction with every Aharyas purchase.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 shadow-sm border-l-4 border-gray-400">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Phone size={16} />
                <h4 className="font-medium text-black">Phone Support</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
              <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-gray-400">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail size={16} />
                <h4 className="font-medium text-black">Email Support</h4>
              </div>
              <p className="text-lg text-gray-700 mb-1">aharyasofficial@gmail.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>

            <div className="bg-white p-6 shadow-sm border-l-4 border-gray-400">
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

          <div className="mt-12 bg-black text-white p-8 rounded-lg max-w-3xl mx-auto">
            <h3 className="font-light text-xl mb-4">Always Here to Help</h3>
            <p className="font-light leading-relaxed">
              Whether you have questions about our handcrafted collection, need help with an order, 
              or want to learn more about our artisan partners, we're committed to providing 
              exceptional customer service every step of the way.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;