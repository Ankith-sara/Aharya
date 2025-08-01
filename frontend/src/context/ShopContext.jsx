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
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
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
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
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
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error("token expired, Login Again")
        }
    }

    const addProductToRecentlyViewed = (product) => {
        let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

        // If the latest viewed product (index 0) is the same as current, do nothing
        if (viewedProducts.length > 0 && viewedProducts[0]._id === product._id) {
            return;
        }

        // Remove if already exists elsewhere
        viewedProducts = viewedProducts.filter(p => p._id !== product._id);

        // Add to the start
        viewedProducts.unshift({
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
        });

        // Keep only 5
        if (viewedProducts.length > 5) {
            viewedProducts = viewedProducts.slice(1, 6);
        }

        localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
    };

    const getRecentlyViewed = () => {
        try {
            const viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
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
            getUserCart(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems, getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, setToken, token, selectedSubCategory, setSelectedSubCategory,
        addProductToRecentlyViewed, getRecentlyViewed
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;