import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import { ChevronDown, ChevronUp, Package, Truck, RotateCcw, Shield, User, HelpCircle } from 'lucide-react';

const FAQs = () => {
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    document.title = 'Frequently Asked Questions | Aharyas'
  });

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "Orders & Shopping",
      icon: Package,
      iconColor: "blue",
      faqs: [
        {
          question: "How do I place an order?",
          answer: "Simply browse our collection, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping details, and complete payment to place your order."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "Orders can be modified or cancelled within 2 hours of placement. After this window, please contact our support team immediately and we'll do our best to accommodate your request if the order hasn't been processed."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI payments, net banking, and popular digital wallets. All transactions are secured with industry-standard encryption."
        },
        {
          question: "Do you offer bulk or wholesale pricing?",
          answer: "Yes, we offer special pricing for bulk orders and wholesale inquiries. Please contact us at aharyasofficial@gmail.com with your requirements for a custom quote."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      iconColor: "green",
      faqs: [
        {
          question: "What are your shipping charges?",
          answer: "We offer free shipping on orders above ₹999. For orders below this amount, shipping charges vary based on location and weight. Exact charges will be displayed at checkout."
        },
        {
          question: "How long does delivery take?",
          answer: "Orders are processed and shipped within 0-7 days from order confirmation. Delivery timelines depend on your location and the courier service used."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes! We ship globally through registered international courier companies and international speed post services. All international shipments include tracking and insurance."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order is shipped, you'll receive a tracking number via email. You can track your order status using the tracking link provided."
        }
      ]
    },
    {
      title: "Returns & Refunds",
      icon: RotateCcw,
      iconColor: "orange",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 15-day return policy for most items. Products must be unused, in original packaging, and in the same condition as received. Some items like personalized products may not be eligible for return."
        },
        {
          question: "How do I initiate a return?",
          answer: "Contact our support team at aharyasofficial@gmail.com with your order details and reason for return. We'll guide you through the return process and provide instructions."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method."
        },
        {
          question: "Do you offer exchanges?",
          answer: "Yes, we offer exchanges for size, color, or other variants of the same product, subject to availability. Exchanges follow the same timeline as returns."
        }
      ]
    },
    {
      title: "Products & Quality",
      icon: Shield,
      iconColor: "purple",
      faqs: [
        {
          question: "Are your products authentic handcrafted items?",
          answer: "Absolutely! We guarantee 100% authentic handcrafted products. All Aharyas pieces are carefully crafted by skilled artisans, ensuring quality and authenticity in every item."
        },
        {
          question: "How do you ensure product quality?",
          answer: "Our quality team inspects every handcrafted product before shipping. We work directly with skilled artisans and conduct regular quality checks to maintain our high standards."
        },
        {
          question: "Can I see more product images or details?",
          answer: "Our product pages include multiple high-resolution images and detailed descriptions. If you need additional information, feel free to contact our support team at aharyasofficial@gmail.com."
        },
        {
          question: "Do you offer custom or personalized items?",
          answer: "Yes, we offer custom handcrafted pieces. Please contact us with your requirements, and our artisans will work with you to create something unique and special."
        }
      ]
    },
    {
      title: "Account & Support",
      icon: User,
      iconColor: "indigo",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' at the top of any page, enter your email and create a password. You can also sign up during checkout for a seamless shopping experience."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without consent. Read our Privacy Policy for complete details."
        },
        {
          question: "How can I contact customer support?",
          answer: "You can reach us at aharyasofficial@gmail.com or call +91 9063284008 (Mon-Sat: 9 AM - 6 PM). We respond to emails within 24 hours."
        }
      ]
    }
  ];

  const getIconColorClasses = (color) => {
    const colors = {
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      green: { bg: "bg-green-100", text: "text-green-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-600" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen text-black mt-20">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl text-center mb-8">
            <Title text1="FREQUENTLY" text2="ASKED QUESTIONS" />
          </div>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            Find answers to common questions about our handcrafted Aharyas collection, shipping, returns, and more.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="pb-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-16">
          {faqCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            const iconColors = getIconColorClasses(category.iconColor);
            
            return (
              <div key={categoryIndex}>
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className={`w-12 h-12 ${iconColors.bg} rounded-xl flex items-center justify-center`}>
                      <IconComponent className={iconColors.text} size={24} />
                    </div>
                    <h2 className="text-2xl font-light tracking-wider text-black">{category.title.toUpperCase()}</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemIndex = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems.has(itemIndex);
                    
                    return (
                      <div key={faqIndex} className="bg-white shadow-lg border-l-4 border-black hover:shadow-xl transition-shadow">
                        <button
                          className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                          onClick={() => toggleItem(itemIndex)}
                        >
                          <span className="font-medium text-black pr-4 text-lg">{faq.question}</span>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp size={20} className="text-gray-500" />
                            ) : (
                              <ChevronDown size={20} className="text-gray-500" />
                            )}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-8 pb-6 border-t border-gray-100">
                            <div className="pt-4">
                              <p className="text-gray-700 font-light leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-xl border-l-4 border-black">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <HelpCircle className="text-gray-600" size={24} />
                </div>
                <h2 className="text-2xl font-light tracking-wider text-black">NEED MORE HELP?</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-center">
              <p className="text-gray-700 font-light leading-relaxed max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our customer support team is ready to assist you 
                with any questions about our handcrafted collection or services.
              </p>

              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mt-8">
                <div className="bg-gray-50 p-6 border-l-4 border-gray-400">
                  <h4 className="font-medium text-black mb-2">Email Support</h4>
                  <p className="text-lg text-gray-700 mb-1">aharyasofficial@gmail.com</p>
                  <p className="text-sm text-gray-500">Response within 24 hours</p>
                </div>
                
                <div className="bg-gray-50 p-6 border-l-4 border-gray-400">
                  <h4 className="font-medium text-black mb-2">Helpdesk Phone</h4>
                  <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
                  <p className="text-sm text-gray-500">Mon-Sat: 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Support Section */}
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">QUICK SUPPORT</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <Package className="text-gray-600 mx-auto mb-3" size={24} />
              <h4 className="font-medium text-black mb-2">Order Issues</h4>
              <p className="text-sm text-gray-600 font-light">Problems with placing or tracking orders</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <Truck className="text-gray-600 mx-auto mb-3" size={24} />
              <h4 className="font-medium text-black mb-2">Shipping Questions</h4>
              <p className="text-sm text-gray-600 font-light">Delivery times and shipping policies</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm border-l-4 border-black">
              <RotateCcw className="text-gray-600 mx-auto mb-3" size={24} />
              <h4 className="font-medium text-black mb-2">Returns & Refunds</h4>
              <p className="text-sm text-gray-600 font-light">Return process and refund status</p>
            </div>
          </div>

          <div className="mt-12 bg-black text-white p-8 rounded-lg max-w-3xl mx-auto">
            <h3 className="font-light text-xl mb-4">Professional Support Team</h3>
            <p className="font-light leading-relaxed">
              Our dedicated customer support team understands the value of handcrafted artistry and 
              is committed to ensuring your complete satisfaction with every Aharyas purchase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;