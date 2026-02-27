import React, { useState, useEffect, useRef } from "react";
import { Send, Image, X, BotMessageSquare, ShoppingBag, Heart, User, Truck, RefreshCw, HelpCircle } from "lucide-react";
import Title from "../components/Title";

const ChatBot = () => {
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [image, setImage] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAilTtlY7OBBuqOxTkTHUIcNI4uf8QPsKo";

  // Function to check if the question is fashion/Aharyas related
  const isRelevantQuery = (text, hasImage) => {
    if (hasImage) return true;

    const lowerText = text.toLowerCase();

    // Fashion-related keywords
    const fashionKeywords = [
      'fashion', 'style', 'outfit', 'clothing', 'dress', 'shirt', 'pants', 'shoes', 'accessories',
      'trend', 'color', 'fabric', 'design', 'wear', 'look', 'attire', 'garment', 'wardrobe',
      'casual', 'formal', 'party', 'wedding', 'ethnic', 'western', 'traditional', 'modern',
      'size', 'fit', 'material', 'cotton', 'silk', 'denim', 'leather', 'polyester',
      'brand', 'designer', 'collection', 'season', 'summer', 'winter', 'monsoon',
      'coordinate', 'match', 'combine', 'styling', 'layering', 'accessorize',
      'ikkat', 'kalamkari', 'handloom', 'handmade', 'craft', 'artisan', 'weave', 'embroidery',
      'block print', 'traditional wear', 'indian wear', 'saree', 'kurta', 'ethnic wear'
    ];

    // Aharyas company related keywords
    const companyKeywords = [
      'aharyas', 'company', 'policy', 'policies', 'return', 'exchange', 'refund',
      'shipping', 'delivery', 'order', 'purchase', 'payment', 'customer service', 'support',
      'contact', 'help', 'assistance', 'complaint', 'feedback', 'store', 'branch', 'location',
      'hours', 'timing', 'discount', 'offer', 'sale', 'price', 'cost', 'warranty', 'guarantee',
      'quality', 'size chart', 'guide', 'care instructions', 'washing', 'maintenance',
      'heritage', 'luxury', 'conscious', 'sustainable', 'ethical', 'navigation', 'website',
      'page', 'product', 'cart', 'profile', 'track', 'login'
    ];

    const allKeywords = [...fashionKeywords, ...companyKeywords];

    return allKeywords.some(keyword => lowerText.includes(keyword));
  };

  const generateAnswer = async () => {
    if (!question.trim() && !image) return;

    const isRelevant = isRelevantQuery(question, !!image);

    setShowChat(true);
    const newUserMessage = { sender: "user", text: question, image };
    setChatLog((prevLog) => [...prevLog, newUserMessage]);

    // If query is not relevant, provide a polite redirect message
    if (!isRelevant) {
      const redirectMessage = "I'm your Aharyas Fashion Advisor, specialized in helping with fashion, style advice, and Aharyas services. I can assist you with:\n\n• Fashion trends and styling recommendations\n• Indian heritage crafts like Ikkat, Kalamkari, and handloom\n• Outfit coordination and color matching\n• Clothing care and fabric guidance\n• Aharyas policies, returns, and customer support\n• Our artisan stories and craft heritage\n• Website navigation and product information\n\nHow can I help you explore conscious luxury fashion or Aharyas services today?";

      setChatLog((prevLog) => [...prevLog, { sender: "bot", text: redirectMessage }]);
      setQuestion("");
      setImage(null);
      return;
    }

    setChatLog((prevLog) => [...prevLog, { sender: "bot", text: "Typing..." }]);

    try {
      const imageData = image ? {
        inline_data: {
          mime_type: image.type,
          data: image.base64
        }
      } : null;

      // Enhanced prompt for specialized responses
      const specializedPrompt = `You are Aharyas Fashion Advisor, a specialized assistant for India's conscious luxury fashion brand and customer support. 

About Aharyas:
- India's first luxury clothing brand where heritage meets high design
- Focused on handcrafted narratives, preserving dying crafts, and uplifting artisan voices
- Three categories: authentic handmade crafts, sustainable daily wear, and luxury Indian fashion
- Over 300 artisans onboarded, specializing in Ikkat, Kalamkari, hand block printing, and traditional embroideries
- Mission: Create fashion that feels timeless, ethical, and soulfully elegant

Website Navigation Available:
- Shop Collection (/shop/collection)
- Product Categories (/shop/[category])
- Individual Products (/product/[id])
- About Us (/about)
- Contact (/contact)
- Cart (/cart)
- Orders & Tracking (/orders, /trackorder/[id])
- User Profile (/profile/[id])
- Policies (/refundpolicy, /shippingpolicy, /termsconditions, /privacypolicy)
- Support (/support)
- FAQs (/faqs)
- Blog (/blog)
- Virtual Try-On (/try-on)

IMPORTANT: Start your responses directly without any greeting phrases like "Namaste! As your Aharyas Fashion Advisor, I'm delighted to..." - jump straight into the helpful information.

ONLY respond to queries about:
1. Fashion, styling, outfit recommendations, color coordination, trends (especially Indian heritage fashion)
2. Traditional crafts: Ikkat from Pochampally, Kalamkari from Pedana, hand block printing, traditional embroideries
3. Clothing care, fabric advice, sizing guidance for handloom and traditional wear
4. Aharyas company policies, returns, exchanges, customer service
5. Artisan stories, craft heritage, and sustainable fashion practices
6. Website navigation, product suggestions, and user guidance

For fashion queries: Provide detailed styling advice with focus on Indian heritage, traditional crafts, and conscious luxury.
For company queries: Assist with policies, artisan stories, and brand heritage information.
For navigation queries: Guide users to relevant pages and suggest appropriate products or sections.

User's question: ${question}

Respond in a warm, knowledgeable tone, celebrating Indian heritage and conscious luxury while being direct and helpful.`;

      const formData = {
        contents: [{
          parts: [
            { text: specializedPrompt },
            ...(imageData ? [imageData] : [])
          ]
        }]
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim() ||
        "Sorry, I couldn't generate an answer. Try again.";

      // Add a signature to responses
      aiResponse += "\n\n— Aharyas Fashion Advisor";

      setChatLog((prevLog) => [...prevLog.slice(0, -1), { sender: "bot", text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setChatLog((prevLog) => [
        ...prevLog.slice(0, -1),
        { sender: "bot", text: "I'm experiencing technical difficulties. Please try again later or contact Aharyas customer support for immediate assistance." }
      ]);
    }

    setQuestion("");
    setImage(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      generateAnswer();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64string = reader.result.split(",")[1];
        setImage({
          preview: reader.result,
          type: file.type,
          base64: base64string,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  // Enhanced quick suggestions with navigation awareness
  const quickSuggestions = [
    {
      icon: ShoppingBag,
      text: "Show me handloom Dresses collection",
      category: "products"
    },
    {
      icon: Heart,
      text: "What is Ikkat weaving from Pochampally?",
      category: "heritage"
    },
    {
      icon: User,
      text: "How to style traditional Indian wear?",
      category: "styling"
    },
    {
      icon: Truck,
      text: "Aharyas return and exchange policy",
      category: "support"
    },
    {
      icon: RefreshCw,
      text: "Care instructions for handloom fabrics",
      category: "guidance"
    },
    {
      icon: HelpCircle,
      text: "Tell me about Aharyas artisan stories",
      category: "heritage"
    }
  ];

  const handleSuggestionClick = (suggestion) => {
    setQuestion(typeof suggestion === 'string' ? suggestion : suggestion.text);
    setShowChat(true);
  };

  return (
    <div className="min-h-screen text-black bg-white">
      {showChat ? (
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-20 py-10 mt-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BotMessageSquare className="w-8 h-8 text-black" />
              <h1 className="text-3xl font-light tracking-[0.15em] text-black">
                AHARYAS <span className="font-medium">FASHION ADVISOR</span>
              </h1>
            </div>
            <div className="w-16 h-0.5 bg-black mx-auto"></div>
          </div>

          {/* Chat Log Container */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto border border-gray-200 shadow-xl mb-8 space-y-6 p-8 bg-white" style={{ minHeight: '500px', maxHeight: '60vh' }}>
            {chatLog.map((entry, index) => (
              <div key={index} className={`flex ${entry.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-6 max-w-2xl shadow-sm border-l-4 ${entry.sender === "user" ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-300"}`}>
                  {entry.image && (
                    <div className="mb-4">
                      <img src={entry.image.preview} alt="Uploaded" className="w-full rounded object-cover shadow-sm" />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap font-light leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ))}
            {chatLog.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-16">
                <BotMessageSquare className="w-16 h-16 mb-6 opacity-30" />
                <p className="text-center text-lg font-light mb-8 max-w-md">
                  Welcome to Aharyas Fashion Advisor. Ask me about conscious luxury fashion, traditional crafts, website navigation, or our heritage collections.
                </p>

                {/* Quick Suggestions in Chat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {quickSuggestions.slice(0, 4).map((suggestion, idx) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm text-black bg-stone-50 hover:bg-stone-100 px-4 py-3 transition-colors border border-stone-200 font-light tracking-wide flex items-center gap-2 text-left"
                      >
                        <IconComponent size={16} className="flex-shrink-0" />
                        <span>{suggestion.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            {image && (
              <div className="mb-6 flex items-center gap-4 p-4 bg-stone-50 border-l-4 border-black">
                <div className="relative w-20 h-20">
                  <img src={image.preview} alt="Selected" className="w-full h-full object-cover shadow-sm" />
                  <button onClick={removeImage} className="absolute -top-2 -right-2 bg-black text-white p-1 shadow-sm hover:bg-gray-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-light tracking-wide">{image.name}</p>
                </div>
              </div>
            )}

            {/* Search Input Section */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about heritage fashion, traditional crafts, or Aharyas services..."
                className="w-full px-6 py-4 pr-24 border border-gray-300 focus:outline-none focus:border-black transition-all font-light tracking-wide"
              />
              <div className="absolute right-3 flex items-center space-x-2">
                <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-stone-100 transition">
                  <Image className="w-5 h-5 text-gray-600" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                <button onClick={generateAnswer} className="p-2 bg-black text-white hover:bg-gray-800 transition">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-10 lg:px-20 py-32">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-16">
              <div>
                <Title text1="AHARYAS" text2="FASHION ADVISOR" />
              </div>
            </div>

            {/* Image Upload Section */}
            {image && (
              <div className="mb-8 flex items-center gap-6 justify-center p-6 bg-stone-50 border-l-4 border-black shadow-sm">
                <div className="relative w-24 h-24">
                  <img src={image.preview} alt="Selected" className="w-full h-full object-cover shadow-sm" />
                  <button onClick={removeImage} className="absolute -top-2 -right-2 bg-black text-white p-1 shadow-sm hover:bg-gray-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 max-w-xs">
                  <p className="text-sm text-gray-600 font-light tracking-wide">{image.name}</p>
                </div>
              </div>
            )}

            {/* Search Input Section */}
            <div className="relative max-w-3xl mx-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about heritage fashion, traditional crafts, or Aharyas services..."
                className="w-full px-8 py-6 pr-28 border border-gray-300 focus:outline-none focus:border-black transition-all font-light tracking-wide shadow-lg text-lg"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                <button onClick={() => fileInputRef.current.click()} className="p-3 hover:bg-stone-100 transition">
                  <Image className="w-6 h-6 text-gray-600" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                <button onClick={generateAnswer} className="p-3 bg-black text-white hover:bg-gray-800 transition">
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="my-12">
              <h3 className="text-center text-lg font-light text-gray-800 mb-6 tracking-wide">
                Popular Questions & Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickSuggestions.slice(0, 9).map((suggestion, idx) => {
                  const IconComponent = suggestion.icon;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-sm text-black bg-white hover:bg-gray-50 px-3 py-2 transition-all duration-200 border-2 border-gray-300 shadow-sm font-light tracking-wide text-left hover:shadow-lg flex items-center gap-3 group"
                    >
                      <IconComponent
                        size={18}
                        className="flex-shrink-0 text-gray-500 group-hover:text-black transition-colors"
                      />
                      <div className="flex-1">
                        <span className="group-hover:text-black transition-colors">
                          {suggestion.text}
                        </span>
                        <div className="text-xs text-gray-400 mt-1 capitalize">
                          {suggestion.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;