import { createContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

// Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
});

// Constants
const CURRENCY = "₹";
const DELIVERY_FEE = 50;
const MAX_RECENTLY_VIEWED = 6;
const GUEST_CART_KEY = "guestCart";
const RECENTLY_VIEWED_KEY = "recentlyViewed";
const SUBCATEGORY_KEY = "selectedSubCategory";

// Safe JSON helpers 
const safeRead = (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
};
const safeWrite = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { }
};
const safeRemove = (key) => {
    try {
        localStorage.removeItem(key);
    } catch { }
};

const userMessage = (error, fallback) => {
    const server = error?.response?.data?.message;
    if (server && !server.toLowerCase().includes("internal")) return server;
    return fallback;
};

const ShopContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState([]);
    const [token, setTokenState] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const setToken = useCallback((t) => {
        setTokenState(t);
        if (t) {
            api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
            localStorage.setItem("token", t);
        } else {
            delete api.defaults.headers.common["Authorization"];
            safeRemove("token");
        }
    }, []);

    // Auto-refresh on 401
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (res) => res,
            (error) => {
                if (error.response?.status === 401 && token) {
                    setToken("");
                    safeRemove("userId");
                    setCartItems({});
                    setWishlistItems([]);
                    setUserProfile(null);
                    toast.error("Your session has expired. Please sign in again.");
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );
        return () => api.interceptors.response.eject(interceptor);
    }, [token, navigate, setToken]);

    // COUPON
    const getAppliedCoupon = useCallback(() => safeRead("appliedCoupon"), []);
    const clearCoupon = useCallback(() => safeRemove("appliedCoupon"), []);

    const applyCoupon = useCallback((coupon) => {
        safeWrite("appliedCoupon", coupon);
    }, []);

    // CART 
    const syncCartToServer = useCallback(async (operation, payload) => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        try {
            await api.post(`/api/cart/${operation}`, { userId, ...payload });
        } catch { }
    }, []);

    const addToCart = useCallback(async (itemId, size, quantity = 1) => {
        const productId = String(itemId);
        const productSize = size ? String(size) : "N/A";

        // Optimistic update
        setCartItems((prev) => {
            const next = structuredClone(prev);
            if (!next[productId]) next[productId] = {};
            next[productId][productSize] = (next[productId][productSize] || 0) + quantity;
            if (!token) safeWrite(GUEST_CART_KEY, next);
            return next;
        });

        toast.success("Added to cart");

        if (token) syncCartToServer("add", { itemId: productId, size: productSize, quantity });
        return true;
    }, [token, syncCartToServer]);

    const updateQuantity = useCallback((itemId, size, quantity) => {
        if (quantity < 0) return;

        const productId = String(itemId);
        const productSize = String(size);

        setCartItems((prev) => {
            const next = structuredClone(prev);
            if (quantity === 0) {
                delete next[productId]?.[productSize];
                if (next[productId] && Object.keys(next[productId]).length === 0) delete next[productId];
            } else {
                if (!next[productId]) next[productId] = {};
                next[productId][productSize] = quantity;
            }
            if (!token) safeWrite(GUEST_CART_KEY, next);
            return next;
        });

        if (token) syncCartToServer("update", { itemId: productId, size: productSize, quantity });
    }, [token, syncCartToServer]);

    const removeFromCart = useCallback((itemId, size) => {
        const productId = String(itemId);
        const productSize = String(size);

        setCartItems((prev) => {
            const next = structuredClone(prev);
            delete next[productId]?.[productSize];
            if (next[productId] && Object.keys(next[productId]).length === 0) delete next[productId];
            if (!token) safeWrite(GUEST_CART_KEY, next);
            return next;
        });

        toast.success("Item removed from cart");

        if (token) syncCartToServer("remove", { itemId: productId, size: productSize });
    }, [token, syncCartToServer]);

    const clearCart = useCallback(() => {
        setCartItems({});
        clearCoupon();
        if (!token) safeRemove(GUEST_CART_KEY);
        if (token) syncCartToServer("clear", {});
    }, [token, clearCoupon, syncCartToServer]);

    // Cart derived values
    const getCartCount = useCallback(() =>
        Object.values(cartItems).reduce(
            (total, sizes) => total + Object.values(sizes).reduce((s, qty) => s + (qty > 0 ? qty : 0), 0),
            0
        ), [cartItems]);

    const getCartAmount = useCallback(() => {
        if (!products.length) return 0;
        return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const product = products.find((p) => p._id === itemId);
            if (!product) return total;
            return total + Object.entries(sizes).reduce(
                (s, [, qty]) => s + (qty > 0 ? product.price * qty : 0), 0
            );
        }, 0);
    }, [cartItems, products]);

    const getCartItems = useCallback(() =>
        Object.entries(cartItems).flatMap(([itemId, sizes]) => {
            const product = products.find((p) => p._id === itemId);
            if (!product) return [];
            return Object.entries(sizes)
                .filter(([, qty]) => qty > 0)
                .map(([size, quantity]) => ({ ...product, size, quantity }));
        }), [cartItems, products]);

    // Fetch & merge cart (login)
    const getUserCart = useCallback(async (userToken) => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            const { data } = await api.post(
                "/api/cart/get",
                { userId },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (!data.success || !isMounted.current) return;

            const serverCart = data.cartData || {};
            const guestCart = safeRead(GUEST_CART_KEY, {});
            const hasGuest = Object.keys(guestCart).length > 0;

            if (hasGuest) {
                const merged = structuredClone(serverCart);
                const syncOps = [];

                for (const [itemId, sizes] of Object.entries(guestCart)) {
                    if (!merged[itemId]) merged[itemId] = {};
                    for (const [size, qty] of Object.entries(sizes)) {
                        merged[itemId][size] = (merged[itemId][size] || 0) + qty;
                        syncOps.push(api.post(
                            "/api/cart/add",
                            { userId, itemId, size, quantity: qty },
                            { headers: { Authorization: `Bearer ${userToken}` } }
                        ));
                    }
                }

                await Promise.allSettled(syncOps);
                safeRemove(GUEST_CART_KEY);
                if (isMounted.current) setCartItems(merged);
            } else {
                if (isMounted.current) setCartItems(serverCart);
            }
        } catch { }
    }, []);

    // WISHLIST
    const addToWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error("Please sign in to save items to your wishlist");
            navigate("/login");
            return false;
        }
        try {
            const { data } = await api.post("/api/wishlist/add", { itemId });
            if (data.success) {
                setWishlistItems(data.wishlist);
                toast.success("Saved to wishlist");
                return true;
            }
        } catch (error) {
            const msg = error?.response?.data?.message;
            if (msg === "Item already in wishlist") {
                toast.info("Already in your wishlist");
            } else {
                toast.error("Could not update wishlist. Please try again.");
            }
        }
        return false;
    }, [token, navigate]);

    const removeFromWishlist = useCallback(async (itemId) => {
        if (!token) return false;
        try {
            const { data } = await api.post("/api/wishlist/remove", { itemId });
            if (data.success) {
                setWishlistItems(data.wishlist);
                toast.success("Removed from wishlist");
                return true;
            }
        } catch {
            toast.error("Could not update wishlist. Please try again.");
        }
        return false;
    }, [token]);

    const toggleWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error("Please sign in to save items to your wishlist");
            navigate("/login");
            return false;
        }
        try {
            const { data } = await api.post("/api/wishlist/toggle", { itemId });
            if (data.success) {
                setWishlistItems(data.wishlist);
                toast.success(data.isAdded ? "Saved to wishlist" : "Removed from wishlist");
                return data.isAdded;
            }
        } catch {
            toast.error("Could not update wishlist. Please try again.");
        }
        return false;
    }, [token, navigate]);

    const isInWishlist = useCallback((id) => wishlistItems.includes(id), [wishlistItems]);
    const getWishlistCount = useCallback(() => wishlistItems.length, [wishlistItems]);
    const getWishlistProducts = useCallback(() =>
        products.filter((p) => wishlistItems.includes(p._id)), [products, wishlistItems]);

    const getUserWishlist = useCallback(async (userToken) => {
        try {
            const { data } = await api.post(
                "/api/wishlist/get", {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            if (data.success && isMounted.current) setWishlistItems(data.wishlist);
        } catch { }
    }, []);

    // PRODUCTS
    const getProductsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get("/api/product/all");
            if (data.success && isMounted.current) setProducts(data.products);
            else if (!data.success) toast.error("Unable to load products. Please refresh.");
        } catch {
            toast.error("Unable to load products. Please check your connection.");
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, []);

    const getProductById = useCallback((id) => products.find((p) => p._id === id), [products]);

    const searchProducts = useCallback((query) => {
        if (!query?.trim()) return products;
        const q = query.toLowerCase();
        return products.filter((p) =>
            p.name?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.subCategory?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        );
    }, [products]);

    const filterProducts = useCallback((filters = {}) => {
        let result = [...products];
        if (filters.category?.length) result = result.filter((p) => filters.category.includes(p.category));
        if (filters.subCategory?.length) result = result.filter((p) => filters.subCategory.includes(p.subCategory));
        if (filters.priceRange) result = result.filter((p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max);
        if (filters.inStock) result = result.filter((p) => p.inStock);
        return result;
    }, [products]);

    // RECENTLY VIEWED
    const addProductToRecentlyViewed = useCallback((product) => {
        let viewed = safeRead(RECENTLY_VIEWED_KEY, []);
        viewed = viewed.filter((p) => p._id !== product._id);
        viewed.unshift({
            _id: product._id, name: product.name, price: product.price,
            images: product.images, category: product.category,
            subCategory: product.subCategory, viewedAt: new Date().toISOString()
        });
        safeWrite(RECENTLY_VIEWED_KEY, viewed.slice(0, MAX_RECENTLY_VIEWED));
    }, []);

    const getRecentlyViewed = useCallback((allProducts = []) => {
        let viewed = safeRead(RECENTLY_VIEWED_KEY, []);
        if (allProducts.length) {
            viewed = viewed
                .map((vp) => {
                    const live = allProducts.find((p) => p._id === vp._id);
                    return live ? { ...live, viewedAt: vp.viewedAt } : vp;
                })
                .filter((vp) => allProducts.some((p) => p._id === vp._id));
            safeWrite(RECENTLY_VIEWED_KEY, viewed);
        }
        return viewed;
    }, []);

    const clearRecentlyViewed = useCallback(() => safeRemove(RECENTLY_VIEWED_KEY), []);

    // AUTH
    const getUserProfile = useCallback(async (userToken) => {
        try {
            const { data } = await api.get("/api/user/profile", {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            if (data.success && isMounted.current) setUserProfile(data.user);
        } catch { }
    }, []);

    const logout = useCallback(() => {
        setToken("");
        safeRemove("userId");
        setCartItems({});
        setWishlistItems([]);
        setUserProfile(null);
        clearCoupon();
        toast.success("You have been signed out");
        navigate("/login");
    }, [setToken, clearCoupon, navigate]);

    // CATEGORY
    const setCategory = useCallback((category) => {
        setSelectedSubCategory(category);
        safeWrite(SUBCATEGORY_KEY, category);
    }, []);

    // INIT
    useEffect(() => {
        const stored = safeRead(SUBCATEGORY_KEY, "");
        if (stored) setSelectedSubCategory(stored);
    }, []);

    useEffect(() => { getProductsData(); }, [getProductsData]);

    useEffect(() => {
        if (!token) {
            const guestCart = safeRead(GUEST_CART_KEY, {});
            setCartItems(guestCart);
        }
    }, [token]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!token && storedToken) {
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            setTokenState(storedToken);
            getUserCart(storedToken);
            getUserWishlist(storedToken);
            getUserProfile(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            getUserCart(token);
            getUserWishlist(token);
            getUserProfile(token);
        } else {
            setWishlistItems([]);
            setUserProfile(null);
        }
    }, [token, getUserCart, getUserWishlist, getUserProfile]);

    // CONTEXT VALUE
    const value = useMemo(() => ({
        currency: CURRENCY,
        delivery_fee: DELIVERY_FEE,
        products, cartItems, wishlistItems, token, userProfile,
        search, showSearch, selectedSubCategory, isLoading,
        setSearch, setShowSearch, setCartItems, setToken,
        setSelectedSubCategory: setCategory,
        addToCart, updateQuantity, removeFromCart, clearCart,
        getCartCount, getCartAmount, getCartItems,
        getAppliedCoupon, applyCoupon, clearCoupon,
        addToWishlist, removeFromWishlist, toggleWishlist,
        isInWishlist, getWishlistCount, getWishlistProducts,
        getProductById, searchProducts, filterProducts,
        addProductToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed,
        logout, navigate, backendUrl: import.meta.env.VITE_BACKEND_URL,
    }), [
        products, cartItems, wishlistItems, token, userProfile,
        search, showSearch, selectedSubCategory, isLoading,
        setCategory, addToCart, updateQuantity, removeFromCart, clearCart,
        getCartCount, getCartAmount, getCartItems,
        getAppliedCoupon, applyCoupon, clearCoupon,
        addToWishlist, removeFromWishlist, toggleWishlist,
        isInWishlist, getWishlistCount, getWishlistProducts,
        getProductById, searchProducts, filterProducts,
        addProductToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed,
        logout, navigate, setToken,
    ]);

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;