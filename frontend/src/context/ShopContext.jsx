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
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [wishlist, setWishlist] = useState([]);

    // Add to cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Please select Product size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
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

    // Wishlist Functions
    const addToWishlist = async (productId) => {
        try {
            const product = products.find(p => p._id === productId);
            if (!product) {
                toast.error('Product not found');
                return;
            }

            let updatedWishlist;
            
            if (token) {
                // If user is logged in, sync with backend
                const response = await axios.post(
                    backendUrl + '/api/wishlist/add', 
                    { productId }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    updatedWishlist = [...wishlist, productId];
                    setWishlist(updatedWishlist);
                    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                    toast.success('Added to wishlist');
                } else {
                    toast.error('Failed to add to wishlist');
                }
            } else {
                // If user is not logged in, store in localStorage only
                updatedWishlist = [...wishlist, productId];
                setWishlist(updatedWishlist);
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                toast.success('Added to wishlist');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            let updatedWishlist;
            
            if (token) {
                // If user is logged in, sync with backend
                const response = await axios.post(
                    backendUrl + '/api/wishlist/remove', 
                    { productId }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    updatedWishlist = wishlist.filter(id => id !== productId);
                    setWishlist(updatedWishlist);
                    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                    toast.success('Removed from wishlist');
                } else {
                    toast.error('Failed to remove from wishlist');
                }
            } else {
                // If user is not logged in, remove from localStorage only
                updatedWishlist = wishlist.filter(id => id !== productId);
                setWishlist(updatedWishlist);
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                toast.success('Removed from wishlist');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    };

    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const getWishlistProducts = () => {
        return products.filter(product => wishlist.includes(product._id));
    };

    const getUserWishlist = async (token) => {
        try {
            const response = await axios.get(
                backendUrl + '/api/wishlist/get', 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setWishlist(response.data.wishlist || []);
                localStorage.setItem('wishlist', JSON.stringify(response.data.wishlist || []));
            }
        } catch (error) {
            console.log(error);
            // If backend request fails, load from localStorage
            const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            setWishlist(localWishlist);
        }
    };

    const getWishlistCount = () => {
        return wishlist.length;
    };

    const clearWishlist = async () => {
        try {
            if (token) {
                const response = await axios.delete(
                    backendUrl + '/api/wishlist/clear',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    setWishlist([]);
                    localStorage.removeItem('wishlist');
                    toast.success('Wishlist cleared');
                } else {
                    toast.error('Failed to clear wishlist');
                }
            } else {
                setWishlist([]);
                localStorage.removeItem('wishlist');
                toast.success('Wishlist cleared');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to clear wishlist');
        }
    };

    // Sync local wishlist with backend when user logs in
    const syncWishlistOnLogin = async (userToken) => {
        try {
            const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            
            if (localWishlist.length > 0) {
                // Sync local wishlist to backend
                const response = await axios.post(
                    backendUrl + '/api/wishlist/sync',
                    { wishlist: localWishlist },
                    { headers: { Authorization: `Bearer ${userToken}` } }
                );
                
                if (response.data.success) {
                    setWishlist(response.data.wishlist || []);
                    localStorage.setItem('wishlist', JSON.stringify(response.data.wishlist || []));
                }
            } else {
                // Load wishlist from backend
                await getUserWishlist(userToken);
            }
        } catch (error) {
            console.log(error);
            // If sync fails, keep local wishlist
            const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            setWishlist(localWishlist);
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
        // Load wishlist from localStorage on component mount
        const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(localWishlist);
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken);
            getUserCart(storedToken);
            syncWishlistOnLogin(storedToken);
        }
    }, [])

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems, getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, setToken, token, selectedSubCategory, setSelectedSubCategory,
        addProductToRecentlyViewed, getRecentlyViewed,
        wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist,
        getWishlistProducts, getWishlistCount, clearWishlist, syncWishlistOnLogin
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;