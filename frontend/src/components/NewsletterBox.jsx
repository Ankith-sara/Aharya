import React, { useContext, useState } from "react";
import { Mail, X, Check } from "lucide-react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { backendUrl } = useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/newsletter/subscribe`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: response.data.message || "Check your inbox for the WhatsApp join link!",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to subscribe. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-50 via-white to-stone-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full mx-auto">
        <div className="bg-white p-6 sm:p-8 md:p-12 lg:p-16 shadow-lg border border-stone-100">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black flex items-center justify-center">
              <Mail size={24} className="sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.15em] sm:tracking-[0.2em] text-black mb-3 sm:mb-4 text-center px-2">
            JOIN THE <span className="font-medium">AHARYAS</span> COMMUNITY
          </h1>
          <div className="w-16 sm:w-24 h-0.5 bg-black mx-auto mb-6 sm:mb-8"></div>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto text-center px-2">
            Be the first to explore handcrafted collections, exclusive artisan
            stories, and meaningful initiatives. Join a community that celebrates
            heritage, sustainability, and conscious fashion.
          </p>
          <form onSubmit={onSubmitHandler} className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Mail
                    size={18}
                    className="sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-black transition-colors duration-300"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-11 sm:pl-14 pr-3 sm:pr-4 py-3.5 sm:py-4 md:py-5 bg-white border-b-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 font-light text-base sm:text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>
            
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 bg-black text-white text-xs sm:text-sm uppercase font-light tracking-widest hover:bg-gray-900 active:bg-gray-950 transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span className="hidden sm:inline">Subscribing...</span>
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>

            {message.text && (
              <div
                className={`mt-4 sm:mt-6 p-4 sm:p-5 text-center border-l-4 animate-slideIn ${
                  message.type === "success"
                    ? "bg-green-50 text-green-900 border-green-600"
                    : "bg-red-50 text-red-900 border-red-600"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {message.type === "success" ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 flex items-center justify-center">
                          <Check size={14} className="sm:w-4 sm:h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 flex items-center justify-center">
                          <X size={14} className="sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-xs sm:text-sm md:text-base text-left flex-1 break-words">
                      {message.text}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMessage({ type: "", text: "" })}
                    className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Dismiss message"
                  >
                    <X size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="space-y-2 sm:space-y-3 text-center px-2">
            <p className="text-gray-600 font-light text-xs sm:text-sm md:text-base">
              By subscribing, you agree to our{" "}
              <button
                type="button"
                className="text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-0.5 whitespace-nowrap"
              >
                Privacy Policy
              </button>
            </p>
            <p className="text-xs text-gray-500 font-light">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NewsletterBox;