import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import { ChevronDown, ChevronUp, Package, Truck, RotateCcw, Shield, User, HelpCircle } from 'lucide-react';

const FAQs = () => {
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    document.title = 'Frequently Asked Questions | Aharyas';
  }, []);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    newOpenItems.has(index) ? newOpenItems.delete(index) : newOpenItems.add(index);
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "Orders & Shopping",
      icon: Package,
      faqs: [
        { question: "How do I place an order?", answer: "Browse our collection, add to cart, and checkout securely. You’ll need an account or guest checkout to complete your purchase." },
        { question: "Can I modify or cancel my order?", answer: "Yes, within 2 hours of placing it. After that, contact support — we’ll try our best before the order is processed." },
        { question: "What payment methods do you accept?", answer: "We accept cards, UPI, net banking, and major wallets — all secured with modern encryption." },
        { question: "Do you offer bulk or wholesale pricing?", answer: "Yes, for custom or bulk orders. Email us at aharyasofficial@gmail.com for a tailored quote." }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      faqs: [
        { question: "What are your shipping charges?", answer: "Free shipping on orders above ₹999. For smaller orders, minimal delivery charges apply based on your location." },
        { question: "How long does delivery take?", answer: "0–7 business days for domestic orders. Timelines may vary based on courier and destination." },
        { question: "Do you ship internationally?", answer: "Yes, worldwide shipping available through trusted courier partners with tracking and insurance." },
        { question: "Can I track my order?", answer: "Absolutely! You’ll receive a tracking link via email once your order ships." }
      ]
    },
    {
      title: "Returns & Refunds",
      icon: RotateCcw,
      faqs: [
        { question: "What is your return policy?", answer: "We accept returns within 15 days for unused items in original packaging. Personalized pieces may not qualify." },
        { question: "How do I initiate a return?", answer: "Email us at aharyasofficial@gmail.com with your order details and reason. We’ll guide you through it." },
        { question: "When will I receive my refund?", answer: "Within 5–7 business days after we receive and verify the return." },
        { question: "Do you offer exchanges?", answer: "Yes — for size, color, or variant swaps (subject to availability)." }
      ]
    },
    {
      title: "Products & Quality",
      icon: Shield,
      faqs: [
        { question: "Are your products authentic handcrafted items?", answer: "100%. Each piece is made by skilled artisans with authentic materials and craftsmanship." },
        { question: "How do you ensure product quality?", answer: "Every item undergoes strict quality checks before shipping — handcrafted doesn’t mean imperfect here." },
        { question: "Can I see more product images or details?", answer: "Yes! Check product pages or contact us for custom photos or artisan details." },
        { question: "Do you offer custom or personalized items?", answer: "Yes, custom handcrafted pieces are available upon request." }
      ]
    },
    {
      title: "Account & Support",
      icon: User,
      faqs: [
        { question: "How do I create an account?", answer: "Click ‘Sign Up’ on top of any page or create one during checkout — quick and easy." },
        { question: "I forgot my password. How do I reset it?", answer: "Click ‘Forgot Password’, enter your email, and follow the reset link we send you." },
        { question: "Is my personal information secure?", answer: "Yes. All data is encrypted and protected — we never share it without consent." },
        { question: "How can I contact customer support?", answer: "Email aharyasofficial@gmail.com or call +91 9063284008 (Mon–Sat, 9AM–6PM)." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black mt-20">

      {/* Hero Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <Title text1="FREQUENTLY" text2="ASKED QUESTIONS" />
          <p className="text-lg sm:text-xl text-gray-600 font-light mt-6">
            Everything you need to know about Aharyas — from orders to quality and beyond.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="pb-20 px-6 sm:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto space-y-20">
          {faqCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <div key={categoryIndex}>
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border border-black/10">
                    <IconComponent className="text-black" size={22} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-black uppercase">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemIndex = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems.has(itemIndex);
                    return (
                      <div
                        key={faqIndex}
                        className="bg-white border-l-4 border-black shadow-sm hover:shadow-md transition-all"
                      >
                        <button
                          className="w-full px-6 py-5 text-left flex justify-between items-center"
                          onClick={() => toggleItem(itemIndex)}
                        >
                          <span className="font-medium text-lg text-black pr-4">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 border-t border-gray-100">
                            <p className="text-gray-700 font-light leading-relaxed pt-3">
                              {faq.answer}
                            </p>
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

      {/* Still Have Questions */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border border-black/10">
              <HelpCircle className="text-black" size={24} />
            </div>
            <h2 className="text-2xl font-light tracking-wider text-black">NEED MORE HELP?</h2>
          </div>

          <p className="text-gray-700 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Couldn’t find your answer? Our support team is here to help you with any queries about our handcrafted collection.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-gray-50 p-6 border-l-4 border-black text-left shadow-sm">
              <h4 className="font-medium text-black mb-2">Email Support</h4>
              <p className="text-lg text-gray-700 mb-1">aharyasofficial@gmail.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
            <div className="bg-gray-50 p-6 border-l-4 border-black text-left shadow-sm">
              <h4 className="font-medium text-black mb-2">Helpdesk Phone</h4>
              <p className="text-lg text-gray-700 mb-1">+91 9063284008</p>
              <p className="text-sm text-gray-500">Mon–Sat: 9 AM – 6 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Support */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-wider text-black mb-8">QUICK SUPPORT</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: Package, title: "Order Issues", text: "Problems with placing or tracking orders" },
              { icon: Truck, title: "Shipping Questions", text: "Delivery times and shipping policies" },
              { icon: RotateCcw, title: "Returns & Refunds", text: "Return process and refund status" }]
              .map(({ icon: Icon, title, text }, i) => (
                <div key={i} className="bg-white p-6 border-l-4 border-black shadow-sm hover:shadow-md transition-all">
                  <Icon className="text-black mx-auto mb-3" size={24} />
                  <h4 className="font-medium text-black mb-2">{title}</h4>
                  <p className="text-sm text-gray-600 font-light">{text}</p>
                </div>
              ))}
          </div>

          <div className="mt-12 bg-black text-white p-8 rounded-lg max-w-3xl mx-auto">
            <h3 className="font-light text-xl mb-4">Professional Support Team</h3>
            <p className="font-light leading-relaxed">
              Our team understands the value of handcrafted artistry and ensures every Aharyas purchase brings satisfaction and pride.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
