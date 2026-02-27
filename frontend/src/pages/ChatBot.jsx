import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Send, Image, X, BotMessageSquare, ShoppingBag, Heart, Truck,
  RefreshCw, HelpCircle, Package, MapPin, Star, ChevronRight,
  Sparkles, Search, User, ArrowRight, ExternalLink, Plus, Minus,
  CheckCircle, Clock, AlertCircle, Home, Tag
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

// ─── Gemini API ───────────────────────────────────────────────────────────────
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAilTtlY7OBBuqOxTkTHUIcNI4uf8QPsKo";

// ─── Intent detection ─────────────────────────────────────────────────────────
const detectIntent = (text) => {
  const t = text.toLowerCase();
  if (/\b(my order|order status|track|where is my|order id|order number|order [\w\d]+)\b/.test(t)) return "track_order";
  if (/\b(my orders|past orders|order history|previous orders|all orders)\b/.test(t)) return "order_history";
  if (/\b(my cart|cart|what's in|whats in|show cart|view cart)\b/.test(t)) return "view_cart";
  if (/\b(my wishlist|saved items|wishlist|favorites)\b/.test(t)) return "view_wishlist";
  if (/\b(search|find|looking for|show me|i want|do you have|any|products?)\b/.test(t)) return "search_products";
  if (/\b(return|refund|exchange|cancel)\b/.test(t)) return "policy_return";
  if (/\b(shipping|delivery|ship|deliver)\b/.test(t)) return "policy_shipping";
  if (/\b(payment|pay|cod|razorpay|online payment)\b/.test(t)) return "policy_payment";
  if (/\b(size|sizing|fit|measurements?|chart)\b/.test(t)) return "size_guide";
  if (/\b(care|wash|maintain|instructions|fabric)\b/.test(t)) return "care_guide";
  if (/\b(contact|support|help|complaint|feedback|email|phone)\b/.test(t)) return "support";
  if (/\b(about|aharyas|brand|who are|story|mission|artisan|handloom|ikkat|kalamkari)\b/.test(t)) return "about";
  return "ai_general";
};

// ─── Structured response builders ────────────────────────────────────────────
const buildSystemPrompt = (userMsg, contextData = {}) => {
  const { products = [], orders = [], cartItems = [], wishlist = [] } = contextData;

  const productSummary = products.slice(0, 30).map(p =>
    `- ${p.name} | ₹${p.price} | ${p.category} > ${p.subCategory} | id:${p._id}`
  ).join("\n");

  const orderSummary = orders.slice(0, 10).map(o =>
    `- Order #${o._id.slice(-6).toUpperCase()} | ₹${o.amount} | Status: ${o.status} | ${new Date(o.date).toLocaleDateString('en-IN')}`
  ).join("\n");

  return `You are "Aharyas AI Assistant" — the smart, warm, and deeply knowledgeable AI shopping assistant for Aharyas, India's first conscious luxury fashion brand.

## YOUR IDENTITY
You are NOT a generic chatbot. You are Aharyas' brand assistant. You speak in a warm, concise, and culturally rich voice. You are an expert in:
- Indian heritage textiles: Ikkat (Pochampally), Kalamkari (Pedana), hand block printing, traditional embroideries
- Fashion styling, outfit coordination, color theory for Indian wear
- Aharyas platform: products, orders, cart, policies, artisan stories
- Customer support: returns, shipping, sizing, care instructions

## LIVE DATA AVAILABLE TO YOU

### Products on Platform (sample):
${productSummary || "Products loading..."}

### User's Recent Orders:
${orderSummary || "No orders yet."}

### Cart Items Count: ${cartItems.length}
### Wishlist Count: ${wishlist.length}

## RESPONSE RULES
1. Be CONCISE and structured — use short paragraphs or numbered lists
2. When mentioning products, include their NAME and PRICE
3. For order queries, reference actual order IDs from the data above
4. For navigation, mention exact page paths: /shop/collection, /cart, /orders, /wishlist, etc.
5. NEVER start with "Namaste!" or "As your Aharyas advisor..."
6. Keep responses under 150 words unless detailed explanation is needed
7. End with ONE helpful follow-up suggestion max

## AHARYAS POLICIES (ALWAYS ACCURATE)
- Returns: 7-day return window, items must be unworn with tags
- Shipping: Free above ₹999, ₹50 flat fee below; 3-7 business days
- Payments: COD and Razorpay (UPI, cards, netbanking)
- Sizes: XS to XXL, size chart available on every product page

User says: "${userMsg}"

Respond helpfully. Be direct. Celebrate Indian craftsmanship when relevant.`;
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAddToCart, currency = "₹" }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product.sizes?.length > 1) return; // redirect to product page
    onAddToCart(product._id, product.sizes?.[0] || "N/A");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="border border-gray-200 bg-white hover:border-gray-400 transition-all duration-200 overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.bestseller && (
            <div className="absolute top-1.5 left-1.5 bg-black text-white text-[10px] px-1.5 py-0.5 tracking-wider">
              BESTSELLER
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-xs font-medium text-black leading-tight truncate">{product.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{product.subCategory}</p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-semibold text-black">{currency}{product.price.toLocaleString('en-IN')}</span>
            <button
              onClick={(e) => { e.preventDefault(); handleAdd(); }}
              className={`text-[10px] px-2 py-1 border transition-all ${added ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'}`}
            >
              {added ? "✓ Added" : product.sizes?.length > 1 ? "VIEW" : "+ CART"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ─── Order Status Card ────────────────────────────────────────────────────────
const statusConfig = {
  "Order placed":  { color: "text-blue-600",  bg: "bg-blue-50",  icon: CheckCircle, bar: 25 },
  "Packing":       { color: "text-amber-600", bg: "bg-amber-50", icon: Package,     bar: 50 },
  "Shipping":      { color: "text-purple-600",bg: "bg-purple-50",icon: Truck,       bar: 75 },
  "Out for delivery":{ color: "text-orange-600",bg:"bg-orange-50",icon: MapPin,     bar: 88 },
  "Delivered":     { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle, bar: 100},
};

const OrderCard = ({ order }) => {
  const cfg = statusConfig[order.status] || statusConfig["Order placed"];
  const Icon = cfg.icon;
  return (
    <Link to={`/trackorder/${order._id}`} className="block group">
      <div className="border border-gray-200 hover:border-gray-400 transition-colors p-3 bg-white">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-semibold text-black">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {new Date(order.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
            </p>
          </div>
          <div className={`flex items-center gap-1 ${cfg.bg} ${cfg.color} px-2 py-0.5 text-[10px] font-medium`}>
            <Icon size={10} />
            <span>{order.status}</span>
          </div>
        </div>
        <div className="mb-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${cfg.color.replace('text-','bg-')} transition-all duration-500`}
              style={{ width: `${cfg.bar}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-600">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
          <p className="text-xs font-semibold text-black">₹{order.amount.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </Link>
  );
};

// ─── Quick Action Pills ───────────────────────────────────────────────────────
const quickActions = [
  { icon: Package,    label: "My Orders",    q: "Show my recent orders" },
  { icon: ShoppingBag,label: "My Cart",      q: "What's in my cart?" },
  { icon: Heart,      label: "Wishlist",     q: "Show my wishlist" },
  { icon: Truck,      label: "Track Order",  q: "Track my latest order" },
  { icon: RefreshCw,  label: "Returns",      q: "What is the return policy?" },
  { icon: Tag,        label: "New Arrivals", q: "Show me latest collections" },
  { icon: Sparkles,   label: "Heritage",     q: "Tell me about Ikkat weaving" },
  { icon: HelpCircle, label: "Support",      q: "I need help with an issue" },
];

// ─── Message renderer ─────────────────────────────────────────────────────────
const MessageBubble = ({ entry, currency }) => {
  const isUser = entry.sender === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"} animate-slideIn`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
          <BotMessageSquare size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? "" : "flex-1"}`}>
        {/* Text bubble */}
        {(entry.text || entry.image) && (
          <div className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-black text-white ml-auto"
              : "bg-gray-50 border border-gray-200 text-gray-800"
          }`}>
            {entry.image && (
              <img src={entry.image.preview} alt="upload" className="mb-2 max-h-40 object-cover w-full" />
            )}
            {entry.text && (
              <p className="whitespace-pre-wrap font-light">{entry.text}</p>
            )}
          </div>
        )}

        {/* Product results */}
        {entry.products?.length > 0 && (
          <div className="mt-2">
            <p className="text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
              {entry.products.length} result{entry.products.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {entry.products.slice(0, 6).map(p => (
                <ProductCard key={p._id} product={p} onAddToCart={() => {}} currency={currency} />
              ))}
            </div>
            {entry.products.length > 6 && (
              <Link
                to="/shop/collection"
                className="flex items-center gap-1 text-xs text-black border border-gray-300 hover:border-black px-3 py-2 mt-2 transition-colors w-fit"
              >
                View all {entry.products.length} results <ChevronRight size={12} />
              </Link>
            )}
          </div>
        )}

        {/* Order results */}
        {entry.orders?.length > 0 && (
          <div className="mt-2 space-y-2">
            {entry.orders.map(o => <OrderCard key={o._id} order={o} />)}
            <Link
              to="/orders"
              className="flex items-center gap-1 text-xs text-black border border-gray-300 hover:border-black px-3 py-1.5 transition-colors w-fit"
            >
              View all orders <ChevronRight size={12} />
            </Link>
          </div>
        )}

        {/* Cart summary */}
        {entry.cartData && (
          <div className="mt-2 border border-gray-200 bg-white p-3">
            <div className="space-y-2 mb-3">
              {entry.cartData.items.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <img src={item.images?.[0]} alt={item.name} className="w-10 h-10 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-black truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-black flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">{entry.cartData.count} item{entry.cartData.count !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-black">₹{entry.cartData.total.toLocaleString('en-IN')}</span>
                <Link
                  to="/cart"
                  className="text-[11px] bg-black text-white px-3 py-1.5 hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist summary */}
        {entry.wishlistData?.length > 0 && (
          <div className="mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {entry.wishlistData.slice(0, 6).map(p => (
                <ProductCard key={p._id} product={p} onAddToCart={() => {}} currency={currency} />
              ))}
            </div>
            <Link
              to="/wishlist"
              className="flex items-center gap-1 text-xs text-black border border-gray-300 hover:border-black px-3 py-2 mt-2 transition-colors w-fit"
            >
              View full wishlist <ChevronRight size={12} />
            </Link>
          </div>
        )}

        {/* Quick nav links */}
        {entry.links?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {entry.links.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="flex items-center gap-1 text-[11px] border border-gray-300 hover:border-black hover:bg-gray-50 px-2.5 py-1.5 text-black transition-colors"
              >
                {link.label} <ExternalLink size={9} />
              </Link>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {entry.typing && (
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 flex items-center gap-1.5">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-1">aa is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main ChatBot Component ───────────────────────────────────────────────────
const ChatBot = () => {
  const {
    products, cartItems, getCartItems, getCartAmount, getCartCount,
    getWishlistProducts, token, navigate, currency, backendUrl, addToCart,
    searchProducts
  } = useContext(ShopContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const fileRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ── Fetch user orders ───────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (!token || ordersLoaded) return;
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const storedToken = localStorage.getItem("token");
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      if (res.data.success) {
        setOrders(res.data.orders.sort((a, b) => b.date - a.date));
        setOrdersLoaded(true);
      }
    } catch { }
  }, [token, backendUrl, ordersLoaded]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Welcome message ─────────────────────────────────────────────────────────
  useEffect(() => {
    const greet = token
      ? "Hi! I'm the Aharyas AI Assistant. I can check your orders, help you find products, track shipments, or answer any question about our heritage collections. How can I help?"
      : "Hi! I'm the Aharyas AI Assistant. I can help you discover handcrafted heritage wear, get styling tips, understand our policies, and more. How can I help?";

    setMessages([{
      id: Date.now(),
      sender: "bot",
      text: greet,
      links: token
        ? [
            { label: "My Orders", path: "/orders" },
            { label: "My Cart",   path: "/cart" },
            { label: "Wishlist",  path: "/wishlist" },
            { label: "Collection",path: "/shop/collection" },
          ]
        : [
            { label: "Shop Now",    path: "/shop/collection" },
            { label: "Shipping Policy", path: "/shippingpolicy" },
            { label: "Returns",     path: "/refundpolicy" },
            { label: "Contact",     path: "/contact" },
          ]
    }]);
  }, [token]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handle send ─────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed && !image) return;

    const userMsg = { id: Date.now(), sender: "user", text: trimmed, image };
    const typingMsg = { id: Date.now() + 1, sender: "bot", typing: true };

    setMessages(prev => [...prev, userMsg, typingMsg]);
    setInput("");
    setImage(null);
    setIsLoading(true);

    const intent = detectIntent(trimmed);

    // ── Intent: order history ─────────────────────────────────────────────────
    if (intent === "order_history") {
      if (!token) {
        setMessages(prev => prev.slice(0,-1).concat([{
          id: Date.now(), sender: "bot",
          text: "Please sign in to view your orders.",
          links: [{ label: "Sign In", path: "/login" }]
        }]));
        setIsLoading(false);
        return;
      }
      await fetchOrders();
      const botMsg = {
        id: Date.now(), sender: "bot",
        text: orders.length
          ? `Here are your ${orders.length} order${orders.length !== 1 ? 's' : ''}:`
          : "You haven't placed any orders yet. Start exploring our heritage collections!",
        orders: orders.slice(0, 5),
        links: orders.length ? [] : [{ label: "Shop Now", path: "/shop/collection" }]
      };
      setMessages(prev => prev.slice(0,-1).concat([botMsg]));
      setIsLoading(false);
      return;
    }

    // ── Intent: view cart ─────────────────────────────────────────────────────
    if (intent === "view_cart") {
      const cartList = getCartItems();
      const count = getCartCount();
      const total = getCartAmount();
      const botMsg = count > 0
        ? { id: Date.now(), sender: "bot",
            text: `Your cart has ${count} item${count !== 1 ? 's' : ''}:`,
            cartData: { items: cartList, count, total }
          }
        : { id: Date.now(), sender: "bot",
            text: "Your cart is empty. Browse our handcrafted collections to find something beautiful!",
            links: [{ label: "Shop Collection", path: "/shop/collection" }]
          };
      setMessages(prev => prev.slice(0,-1).concat([botMsg]));
      setIsLoading(false);
      return;
    }

    // ── Intent: view wishlist ─────────────────────────────────────────────────
    if (intent === "view_wishlist") {
      if (!token) {
        setMessages(prev => prev.slice(0,-1).concat([{
          id: Date.now(), sender: "bot",
          text: "Sign in to view your saved wishlist items.",
          links: [{ label: "Sign In", path: "/login" }]
        }]));
        setIsLoading(false);
        return;
      }
      const wishlistProducts = getWishlistProducts();
      const botMsg = wishlistProducts.length > 0
        ? { id: Date.now(), sender: "bot",
            text: `You have ${wishlistProducts.length} saved item${wishlistProducts.length !== 1 ? 's' : ''}:`,
            wishlistData: wishlistProducts
          }
        : { id: Date.now(), sender: "bot",
            text: "Your wishlist is empty. Heart items you love to save them here.",
            links: [{ label: "Browse Collection", path: "/shop/collection" }]
          };
      setMessages(prev => prev.slice(0,-1).concat([botMsg]));
      setIsLoading(false);
      return;
    }

    // ── Intent: track order ───────────────────────────────────────────────────
    if (intent === "track_order") {
      if (!token) {
        setMessages(prev => prev.slice(0,-1).concat([{
          id: Date.now(), sender: "bot",
          text: "Please sign in to track your orders.",
          links: [{ label: "Sign In", path: "/login" }]
        }]));
        setIsLoading(false);
        return;
      }
      await fetchOrders();

      // Try to extract order ID from text
      const idMatch = trimmed.match(/[a-f0-9]{8,24}/i);
      if (idMatch) {
        const found = orders.find(o => o._id.includes(idMatch[0]) || o._id.endsWith(idMatch[0]));
        if (found) {
          setMessages(prev => prev.slice(0,-1).concat([{
            id: Date.now(), sender: "bot",
            text: `Found your order:`,
            orders: [found],
          }]));
          setIsLoading(false);
          return;
        }
      }

      // Show latest order
      const latest = orders[0];
      if (latest) {
        setMessages(prev => prev.slice(0,-1).concat([{
          id: Date.now(), sender: "bot",
          text: "Here's your most recent order:",
          orders: [latest],
        }]));
      } else {
        setMessages(prev => prev.slice(0,-1).concat([{
          id: Date.now(), sender: "bot",
          text: "No orders found yet.",
          links: [{ label: "Shop Now", path: "/shop/collection" }]
        }]));
      }
      setIsLoading(false);
      return;
    }

    // ── Intent: product search ────────────────────────────────────────────────
    if (intent === "search_products" && !image) {
      const results = searchProducts(trimmed);
      if (results.length > 0) {
        setMessages(prev => prev.slice(0,-1).concat([{
          id: Date.now(), sender: "bot",
          text: `Found ${results.length} product${results.length !== 1 ? 's' : ''} matching "${trimmed}":`,
          products: results,
        }]));
        setIsLoading(false);
        return;
      }
    }

    // ── Intent: quick policy responses ───────────────────────────────────────
    const policyResponses = {
      policy_return: {
        text: "Return Policy:\n• 7-day return window from delivery date\n• Items must be unworn with original tags attached\n• Handloom & custom items: non-returnable\n• Refunds processed within 5-7 business days\n• Contact support@aharyas.com to initiate a return",
        links: [{ label: "Return Policy", path: "/refundpolicy" }, { label: "Contact Support", path: "/contact" }]
      },
      policy_shipping: {
        text: "Shipping Policy:\n• Free shipping on orders above ₹999\n• ₹50 flat fee for orders below ₹999\n• Delivery: 3-7 business days (metro cities), 5-10 days elsewhere\n• Order tracking available via your Orders page",
        links: [{ label: "Shipping Policy", path: "/shippingpolicy" }, { label: "Track Order", path: "/orders" }]
      },
      policy_payment: {
        text: "Payment Options:\n• Cash on Delivery (COD) — available across India\n• Razorpay — UPI, credit/debit cards, net banking, wallets\n• All transactions are encrypted & secure",
        links: [{ label: "Place Order", path: "/place-order" }]
      },
      size_guide: {
        text: "Sizing Guide:\n• We offer XS, S, M, L, XL, XXL across most styles\n• Detailed size charts are on every product page\n• For handloom sarees: one size fits all\n• For kurtas & dresses: measure bust, waist & hip\n• When in doubt, size up for handloom garments",
        links: [{ label: "Shop Collection", path: "/shop/collection" }]
      },
      care_guide: {
        text: "Fabric Care:\n• Handloom cotton: Cold water, gentle cycle, shade dry\n• Silk: Dry clean recommended, hand wash with mild soap if needed\n• Ikkat & Kalamkari: Wash separately first, colours may bleed\n• Never tumble dry handcrafted textiles\n• Iron on reverse at medium heat",
        links: [{ label: "FAQs", path: "/faqs" }]
      },
      support: {
        text: "Need help? Here's how to reach us:\n• Email: support@aharyas.com\n• Support page: Fill in your query with order details\n• Response time: within 24 hours on business days",
        links: [{ label: "Support Page", path: "/support" }, { label: "FAQs", path: "/faqs" }, { label: "Contact", path: "/contact" }]
      },
      about: {
        text: "Aharyas is India's first conscious luxury fashion brand where heritage meets high design.\n\n• 300+ artisans onboarded across India\n• Specialties: Pochampally Ikkat, Pedana Kalamkari, hand block printing\n• Three pillars: authentic handmade crafts, sustainable daily wear, luxury Indian fashion\n• Mission: Fashion that is timeless, ethical, and soulfully elegant",
        links: [{ label: "About Us", path: "/about" }, { label: "Blog", path: "/blog" }]
      },
    };

    if (policyResponses[intent] && !image) {
      const { text, links } = policyResponses[intent];
      setMessages(prev => prev.slice(0,-1).concat([{
        id: Date.now(), sender: "bot", text, links
      }]));
      setIsLoading(false);
      return;
    }

    // ── Fallback: Gemini AI ───────────────────────────────────────────────────
    try {
      const contextData = {
        products,
        orders,
        cartItems: getCartItems(),
        wishlist: getWishlistProducts(),
      };

      const prompt = buildSystemPrompt(trimmed, contextData);

      const body = {
        contents: [{
          parts: [
            { text: prompt },
            ...(image ? [{ inline_data: { mime_type: image.type, data: image.base64 } }] : [])
          ]
        }]
      };

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      let reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/\*\*(.*?)\*\*/g, "$1")
        ?.trim()
        || "I'm having trouble responding right now. Please try again or contact our support team.";

      // Strip any AI preamble
      reply = reply.replace(/^(Hi!? |Hello!? |Sure!? |Of course!? )/, "").trim();

      setMessages(prev => prev.slice(0,-1).concat([{
        id: Date.now(), sender: "bot", text: reply,
        links: intent === "ai_general" ? [
          { label: "Shop Collection", path: "/shop/collection" },
          { label: "Contact Us", path: "/contact" },
        ] : undefined
      }]));
    } catch {
      setMessages(prev => prev.slice(0,-1).concat([{
        id: Date.now(), sender: "bot",
        text: "I'm experiencing a connection issue. Please try again or visit our support page.",
        links: [{ label: "Support", path: "/support" }]
      }]));
    }

    setIsLoading(false);
  }, [input, image, token, orders, products, cartItems, getCartItems, getCartAmount,
      getCartCount, getWishlistProducts, fetchOrders, searchProducts]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage({
      preview: reader.result,
      type: file.type,
      base64: reader.result.split(",")[1],
      name: file.name
    });
    reader.readAsDataURL(file);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white flex flex-col" style={{ height: "100dvh", paddingTop: "clamp(64px, 5vw, 80px)" }}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <BotMessageSquare size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-black tracking-wide">Aharyas AI Assistant</h1>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 font-medium">ONLINE</span>
            </div>
            <p className="text-xs text-gray-500 font-light">Ask me about orders, products & more</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate("/shop/collection")}
              className="hidden sm:flex items-center gap-1.5 text-xs border border-gray-300 hover:border-black text-black px-3 py-1.5 transition-colors"
            >
              <ShoppingBag size={12} />
              Shop
            </button>
            {token && (
              <button
                onClick={() => navigate("/orders")}
                className="hidden sm:flex items-center gap-1.5 text-xs border border-gray-300 hover:border-black text-black px-3 py-1.5 transition-colors"
              >
                <Package size={12} />
                Orders
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {quickActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(a.q)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 hover:text-black border border-gray-200 hover:border-gray-400 bg-white px-3 py-1.5 whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-40"
                >
                  <Icon size={11} />
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Messages — this is the ONLY scrolling region */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} entry={msg} currency={currency} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area — pinned to bottom */}
      <div className="border-t border-gray-200 bg-white flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Image preview */}
          {image && (
            <div className="flex items-center gap-3 mb-2 p-2 bg-gray-50 border border-gray-200">
              <img src={image.preview} alt="preview" className="w-10 h-10 object-cover" />
              <p className="text-xs text-gray-600 flex-1 truncate">{image.name}</p>
              <button onClick={() => setImage(null)} className="text-gray-400 hover:text-black">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Input row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center border border-gray-300 hover:border-gray-400 focus-within:border-black transition-colors bg-white">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about orders, products, returns, or anything..."
                className="flex-1 px-4 py-3 text-sm font-light focus:outline-none bg-transparent placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={() => fileRef.current.click()}
                className="px-3 py-3 text-gray-400 hover:text-black transition-colors"
                title="Upload image"
              >
                <Image size={16} />
              </button>
              <input type="file" accept="image/*" ref={fileRef} onChange={handleImageUpload} className="hidden" />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !image)}
              className="bg-black text-white p-3 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-2">
            Aharyas AI Assistant can access your orders, cart & wishlist when signed in
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn { animation: slideIn 0.2s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ChatBot;