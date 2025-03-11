import p_img1 from './p_img1.jpg'
import p_img2_1 from './p_img2_1.png'
import p_img2_2 from './p_img2_2.png'
import p_img2_3 from './p_img2_3.png'
import p_img2_4 from './p_img2_4.png'
import p_img3 from './p_img3.png'


import logo from './logo.png'
import logo_white from './logo_white.png'
import down_arrow from './down_arrow.png'
import hero_img from './hero_img.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import login_bg from './login_bg.webp'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import hero_vid from './hero.mp4'
import nav_1 from './nav_1.webp'
import nav_2 from './nav_2.webp'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.jpg'
import contact_img from './contact_img.jpg'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'
import seller_1 from './seller_1.jpg'
import seller_2 from './seller_2.jpg'
import instagram_icon from './instagram_icon.png'
import facebook_icon from './facebook_icon.png'
import pinterest_icon from './pinterest_icon.png'
import linkedin_icon from './linkedin_icon.png'

export const assets = {
    logo,
    logo_white,
    down_arrow,
    hero_img,
    hero_vid,
    nav_1,
    nav_2,
    cart_icon,
    dropdown_icon,
    login_bg,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon,
    seller_1,
    seller_2,
    instagram_icon,
    facebook_icon,
    pinterest_icon,
    linkedin_icon,
}

export const products = [
    {
        _id: "aaaaa",
        name: "Women Deep Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 1599,
        image: [p_img1],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        date: 1716634345448,
        bestseller: true
    },
    {
        _id: "aaaab",
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 2499,
        image: [p_img2_1, p_img2_2, p_img2_3, p_img2_4],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        date: 1716621345448,
        bestseller: true
    },
    {
        _id: "aaaac",
        name: "Girls Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 999,
        image: [p_img3],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "L", "XL"],
        date: 1716234545448,
        bestseller: true
    },
]