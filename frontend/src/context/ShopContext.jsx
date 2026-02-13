import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 50;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    const navigate = useNavigate();

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // ============= COUPON FUNCTIONS =============
    const getAppliedCoupon = useCallback(() => {
        try {
            const savedCoupon = localStorage.getItem('appliedCoupon');
            return savedCoupon ? JSON.parse(savedCoupon) : null;
        } catch (error) {
            console.error('Error getting applied coupon:', error);
            return null;
        }
    }, []);

    const clearCoupon = useCallback(() => {
        localStorage.removeItem('appliedCoupon');
    }, []);

    // ============= CART FUNCTIONS =============
    const addToCart = useCallback(async (itemId, size, quantity = 1) => {
        try {
            const productId = String(itemId);
            const productSize = size ? String(size) : 'N/A';

            let cartData = structuredClone(cartItems);

            if (cartData[productId]) {
                cartData[productId][productSize] = (cartData[productId][productSize] || 0) + quantity;
            } else {
                cartData[productId] = { [productSize]: quantity };
            }

            setCartItems(cartData);
            
            if (!token) {
                localStorage.setItem('guestCart', JSON.stringify(cartData));
            }
            
            toast.success('Added to cart successfully');

            if (token) {
                const userId = localStorage.getItem('userId');
                await axios.post(`${backendUrl}/api/cart/add`, {
                    userId,
                    itemId: productId,
                    size: productSize,
                    quantity
                });
            }

            return true;
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error(error.response?.data?.message || 'Failed to add to cart');
            return false;
        }
    }, [cartItems, token, backendUrl]);

    const updateQuantity = useCallback(async (itemId, size, quantity) => {
        if (quantity < 0) return;

        try {
            const productId = String(itemId);
            const productSize = String(size);

            let cartData = structuredClone(cartItems);

            if (quantity === 0) {
                if (cartData[productId]) {
                    delete cartData[productId][productSize];
                    if (Object.keys(cartData[productId]).length === 0) {
                        delete cartData[productId];
                    }
                }
            } else {
                if (!cartData[productId]) {
                    cartData[productId] = {};
                }
                cartData[productId][productSize] = quantity;
            }

            setCartItems(cartData);
            
            if (!token) {
                localStorage.setItem('guestCart', JSON.stringify(cartData));
            }

            if (token) {
                const userId = localStorage.getItem('userId');
                await axios.post(`${backendUrl}/api/cart/update`, {
                    userId,
                    itemId: productId,
                    size: productSize,
                    quantity
                });
            }
        } catch (error) {
            console.error('Update quantity error:', error);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        }
    }, [cartItems, token, backendUrl]);

    const removeFromCart = useCallback(async (itemId, size) => {
        try {
            const productId = String(itemId);
            const productSize = String(size);

            let cartData = structuredClone(cartItems);

            if (cartData[productId]) {
                delete cartData[productId][productSize];
                if (Object.keys(cartData[productId]).length === 0) {
                    delete cartData[productId];
                }
            }

            setCartItems(cartData);
            
            if (!token) {
                localStorage.setItem('guestCart', JSON.stringify(cartData));
            }
            
            toast.success('Item removed from cart');

            if (token) {
                const userId = localStorage.getItem('userId');
                await axios.post(`${backendUrl}/api/cart/remove`, {
                    userId,
                    itemId: productId,
                    size: productSize
                });
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove item');
        }
    }, [cartItems, token, backendUrl]);

    const clearCart = useCallback(async () => {
        try {
            setCartItems({});
            
            if (!token) {
                localStorage.removeItem('guestCart');
            }
            
            clearCoupon();

            if (token) {
                const userId = localStorage.getItem('userId');
                await axios.post(`${backendUrl}/api/cart/clear`, { userId });
            }

            toast.success('Cart cleared');
        } catch (error) {
            console.error('Clear cart error:', error);
            toast.error('Failed to clear cart');
        }
    }, [token, backendUrl, clearCoupon]);

    const getCartCount = useCallback(() => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.error('Cart count error:', error);
                }
            }
        }
        return totalCount;
    }, [cartItems]);

    const getCartAmount = useCallback(() => {
        if (products.length === 0) return 0;

        let totalAmount = 0;

        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);

            if (itemInfo) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
            }
        }
        return totalAmount;
    }, [cartItems, products]);

    const getCartItems = useCallback(() => {
        const items = [];
        for (const itemId in cartItems) {
            const product = products.find(p => p._id === itemId);
            if (product) {
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        items.push({
                            ...product,
                            size,
                            quantity: cartItems[itemId][size]
                        });
                    }
                }
            }
        }
        return items;
    }, [cartItems, products]);

    const getUserCart = useCallback(async (userToken) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.log('No userId found in localStorage');
                return;
            }

            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                { userId },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                const serverCart = response.data.cartData || {};
                
                const guestCartStr = localStorage.getItem('guestCart');
                if (guestCartStr) {
                    try {
                        const guestCart = JSON.parse(guestCartStr);
                        
                        const mergedCart = { ...serverCart };
                        
                        for (const itemId in guestCart) {
                            if (!mergedCart[itemId]) {
                                mergedCart[itemId] = guestCart[itemId];
                            } else {
                                for (const size in guestCart[itemId]) {
                                    mergedCart[itemId][size] = (mergedCart[itemId][size] || 0) + guestCart[itemId][size];
                                }
                            }
                        }
                        
                        for (const itemId in guestCart) {
                            for (const size in guestCart[itemId]) {
                                await axios.post(
                                    `${backendUrl}/api/cart/add`,
                                    {
                                        userId,
                                        itemId,
                                        size,
                                        quantity: guestCart[itemId][size]
                                    },
                                    { headers: { Authorization: `Bearer ${userToken}` } }
                                );
                            }
                        }
                        
                        localStorage.removeItem('guestCart');
                        setCartItems(mergedCart);
                    } catch (error) {
                        console.error('Error merging guest cart:', error);
                        setCartItems(serverCart);
                    }
                } else {
                    setCartItems(serverCart);
                }
            }
        } catch (error) {
            console.error('Get user cart error:', error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again");
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setToken('');
            }
        }
    }, [backendUrl]);

    // ============= WISHLIST FUNCTIONS =============
    const addToWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to add items to wishlist');
            navigate('/login');
            return false;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/add`,
                { itemId }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Added to wishlist');
                return true;
            }
        } catch (error) {
            console.error('Add to wishlist error:', error);
            if (error.response?.data?.message === "Item already in wishlist") {
                toast.info('Item already in wishlist');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add to wishlist');
            }
            return false;
        }
    }, [token, backendUrl, navigate]);

    const removeFromWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            return false;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/remove`,
                { itemId }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Removed from wishlist');
                return true;
            }
        } catch (error) {
            console.error('Remove from wishlist error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
            return false;
        }
    }, [token, backendUrl]);

    const toggleWishlist = useCallback(async (itemId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            navigate('/login');
            return false;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/toggle`,
                { itemId }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success(response.data.message);
                return response.data.isAdded;
            }
        } catch (error) {
            console.error('Toggle wishlist error:', error);
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
            return false;
        }
    }, [token, backendUrl, navigate]);

    const isInWishlist = useCallback((itemId) => {
        return wishlistItems.includes(itemId);
    }, [wishlistItems]);

    const getWishlistCount = useCallback(() => {
        return wishlistItems.length;
    }, [wishlistItems]);

    const getWishlistProducts = useCallback(() => {
        return products.filter(product => wishlistItems.includes(product._id));
    }, [products, wishlistItems]);

    const getUserWishlist = useCallback(async (userToken) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/wishlist/get`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
            }
        } catch (error) {
            console.error('Get user wishlist error:', error);
        }
    }, [backendUrl]);

    // ============= PRODUCT FUNCTIONS =============
    const getProductsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/all`);

            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error('Failed to load products');
            }
        } catch (error) {
            console.error('Get products error:', error);
            toast.error(error.response?.data?.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    const getProductById = useCallback((productId) => {
        return products.find(product => product._id === productId);
    }, [products]);

    const searchProducts = useCallback((query) => {
        if (!query.trim()) return products;

        const lowercaseQuery = query.toLowerCase();
        return products.filter(product =>
            product.name?.toLowerCase().includes(lowercaseQuery) ||
            product.category?.toLowerCase().includes(lowercaseQuery) ||
            product.subCategory?.toLowerCase().includes(lowercaseQuery) ||
            product.description?.toLowerCase().includes(lowercaseQuery)
        );
    }, [products]);

    const filterProducts = useCallback((filters) => {
        let filtered = [...products];

        if (filters.category && filters.category.length > 0) {
            filtered = filtered.filter(product =>
                filters.category.includes(product.category)
            );
        }

        if (filters.subCategory && filters.subCategory.length > 0) {
            filtered = filtered.filter(product =>
                filters.subCategory.includes(product.subCategory)
            );
        }

        if (filters.priceRange) {
            filtered = filtered.filter(product =>
                product.price >= filters.priceRange.min &&
                product.price <= filters.priceRange.max
            );
        }

        if (filters.inStock) {
            filtered = filtered.filter(product => product.inStock);
        }

        return filtered;
    }, [products]);

    // ============= RECENTLY VIEWED =============
    const addProductToRecentlyViewed = useCallback((product) => {
        try {
            let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

            viewedProducts = viewedProducts.filter(p => p._id !== product._id);

            viewedProducts.unshift({
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                category: product.category,
                subCategory: product.subCategory,
                viewedAt: new Date().toISOString()
            });

            viewedProducts = viewedProducts.slice(0, 5);
            localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
        } catch (error) {
            console.error('Add to recently viewed error:', error);
        }
    }, []);

    const getRecentlyViewed = useCallback((allProducts = []) => {
        try {
            let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

            if (allProducts.length > 0) {
                viewedProducts = viewedProducts
                    .map(vp => {
                        const updated = allProducts.find(p => p._id === vp._id);
                        return updated ? {
                            _id: updated._id,
                            name: updated.name,
                            price: updated.price,
                            images: updated.images,
                            category: updated.category,
                            subCategory: updated.subCategory,
                            viewedAt: vp.viewedAt
                        } : vp;
                    })
                    .filter(vp => allProducts.some(p => p._id === vp._id));

                localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
            }

            return viewedProducts;
        } catch (error) {
            console.error('Get recently viewed error:', error);
            return [];
        }
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        try {
            localStorage.removeItem('recentlyViewed');
            toast.success('Recently viewed cleared');
        } catch (error) {
            console.error('Clear recently viewed error:', error);
        }
    }, []);

    // ============= AUTH & USER FUNCTIONS =============
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken('');
        setCartItems({});
        setWishlistItems([]);
        setUserProfile(null);
        clearCoupon();
        toast.success('Logged out successfully');
        navigate('/login');
    }, [navigate, clearCoupon]);

    const getUserProfile = useCallback(async (userToken) => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/user/profile`,
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data.success) {
                setUserProfile(response.data.user);
            }
        } catch (error) {
            console.error('Get user profile error:', error);
        }
    }, [backendUrl]);

    // ============= CATEGORY MANAGEMENT =============
    const setCategory = useCallback((category) => {
        setSelectedSubCategory(category);
        localStorage.setItem("selectedSubCategory", category);
    }, []);

    // ============= INITIALIZATION =============
    useEffect(() => {
        if (!token) {
            const guestCartStr = localStorage.getItem('guestCart');
            if (guestCartStr) {
                try {
                    const guestCart = JSON.parse(guestCartStr);
                    setCartItems(guestCart);
                } catch (error) {
                    console.error('Error loading guest cart:', error);
                    localStorage.removeItem('guestCart');
                }
            }
        }
    }, []);

    useEffect(() => {
        const storedSubCategory = localStorage.getItem("selectedSubCategory");
        if (storedSubCategory) {
            setSelectedSubCategory(storedSubCategory);
        }
    }, []);

    useEffect(() => {
        getProductsData();
    }, [getProductsData]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
            getUserWishlist(storedToken);
            getUserProfile(storedToken);
        }
    }, [token, getUserCart, getUserWishlist, getUserProfile]);

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

    // ============= MEMOIZED VALUES =============
    const contextValue = useMemo(() => ({
        products, currency, delivery_fee, search, showSearch, cartItems,
        wishlistItems, token, selectedSubCategory, isLoading, userProfile,
        setSearch, setShowSearch, setCartItems,
        setToken, setSelectedSubCategory: setCategory,
        addToCart, updateQuantity, removeFromCart, clearCart,
        getCartCount, getCartAmount, getCartItems,
        getAppliedCoupon, clearCoupon,
        addToWishlist, removeFromWishlist, toggleWishlist,
        isInWishlist, getWishlistCount, getWishlistProducts,
        getProductById, searchProducts, filterProducts,
        addProductToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed,
        logout, navigate, backendUrl
    }), [
        products, currency, delivery_fee, search, showSearch, cartItems,
        wishlistItems, token, selectedSubCategory, isLoading, userProfile,
        addToCart, updateQuantity, removeFromCart, clearCart, getCartCount,
        getCartAmount, getCartItems, getAppliedCoupon, clearCoupon,
        addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, 
        getWishlistCount, getWishlistProducts, getProductById, searchProducts, 
        filterProducts, addProductToRecentlyViewed, getRecentlyViewed, 
        clearRecentlyViewed, logout, navigate, backendUrl, setCategory
    ]);

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;