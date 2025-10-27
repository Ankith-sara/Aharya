import { createContext, useEffect, useState } from "react";
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
    const [token, setToken] = useState('')
    const navigate = useNavigate();
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    // Add to cart
    const addToCart = async (itemId, size, quantity = 1) => {
        if (!size) {
            toast.error('Please select Product size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += quantity;
            } else {
                cartData[itemId][size] = quantity;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = quantity;
        }

        setCartItems(cartData);
        toast.success('Item added to cart');

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { Authorization: `Bearer ${token}` } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    };

    // Wishlist Functions
    const addToWishlist = async (itemId) => {
        if (!token) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        try {
            const response = await axios.post(
                backendUrl + '/api/wishlist/add',
                { itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Item added to wishlist');
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message === "Item already in wishlist") {
                toast.info('Item already in wishlist');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add to wishlist');
            }
        }
    };

    const removeFromWishlist = async (itemId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            return;
        }

        try {
            const response = await axios.post(
                backendUrl + '/api/wishlist/remove',
                { itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success('Item removed from wishlist');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    };

    const toggleWishlist = async (itemId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            return;
        }

        try {
            const response = await axios.post(
                backendUrl + '/api/wishlist/toggle',
                { itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
                toast.success(response.data.message);
                return response.data.isAdded;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
            return false;
        }
    };

    const isInWishlist = (itemId) => {
        return wishlistItems.includes(itemId);
    };

    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    const getUserWishlist = async (token) => {
        try {
            const response = await axios.post(
                backendUrl + '/api/wishlist/get',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Get cart count
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    // Handle error silently
                }
            }
        }
        return totalCount;
    };

    // Update cart quantity
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { Authorization: `Bearer ${token}` } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    };

    // Get cart amount
    const getCartAmount = () => {
        if (products.length === 0) {
            return 0;
        }

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
    };

    // Fetch products data
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/all');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error('Failed to load products');
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { Authorization: `Bearer ${token}` } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error("token expired, Login Again")
        }
    }

    // RecentlyViewed Products
    const addProductToRecentlyViewed = (product) => {
        let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        viewedProducts = viewedProducts.filter(p => p._id !== product._id);
        viewedProducts.unshift({
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
        });

        viewedProducts = viewedProducts.slice(0, 5);
        localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
    };

    const getRecentlyViewed = (allProducts = []) => {
        try {
            let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

            if (allProducts.length > 0) {
                viewedProducts = viewedProducts.map(vp => {
                    const updated = allProducts.find(p => p._id === vp._id);
                    return updated ? {
                        _id: updated._id,
                        name: updated.name,
                        price: updated.price,
                        images: updated.images,
                    } : vp;
                });
            }
            return viewedProducts;
        } catch (error) {
            console.error('Failed to parse recently viewed products:', error);
            return [];
        }
    };

    useEffect(() => {
        const storedSubCategory = localStorage.getItem("selectedSubCategory");
        if (storedSubCategory) {
            setSelectedSubCategory(storedSubCategory);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedSubCategory", selectedSubCategory);
    }, [selectedSubCategory]);

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
            getUserWishlist(localStorage.getItem('token'));
        }
    }, [])

    // Load wishlist when token is available
    useEffect(() => {
        if (token) {
            getUserWishlist(token);
        } else {
            setWishlistItems([]);
        }
    }, [token]);

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems, getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, setToken, token, selectedSubCategory, setSelectedSubCategory,
        addProductToRecentlyViewed, getRecentlyViewed,
        // Wishlist functions
        wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, getWishlistCount
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;