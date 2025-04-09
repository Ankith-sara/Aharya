import React, { useRef, useState, useEffect } from "react";
import Title from "./Title";

function WhatWeDo() {
    const scrollRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [playingVideo, setPlayingVideo] = useState({});
    const [videosPerPage, setVideosPerPage] = useState(3);

    const videos = [
        { video: "https://cdn.shopify.com/videos/c/o/v/fd1d3228b14a46a8ab9cf98d7644de90.mp4", image: "https://okhai.org/cdn/shop/files/abcd_99d512d1-7752-4dca-bd6c-e71e0d98139c.jpg?v=1717139293" },
        { video: "https://cdn.shopify.com/videos/c/o/v/e5c75f1cccfe461bbbaf1596ed6f6e93.mp4", image: "https://okhai.org/cdn/shop/files/Website_video_cover_9.jpg?v=1717074392" },
        { video: "https://cdn.shopify.com/videos/c/o/v/3d53794e362a4a48935236d8417b7b7a.mp4", image: "https://okhai.org/cdn/shop/files/11_fb19558a-2cbc-43a6-9ece-5a8167327e41.jpg?v=1717074505" },
        { video: "https://cdn.shopify.com/videos/c/o/v/5b5ac6ebace54f98b6b182bf010a0d8e.mp4", image: "https://okhai.org/cdn/shop/files/6_30d3ac88-1ebc-4266-b286-09e49e8657ca.jpg?v=1717074927" },
        { video: "https://cdn.shopify.com/videos/c/o/v/815f45ef2a194964915d7cbf3c0fd917.mp4", image: "https://okhai.org/cdn/shop/files/4_4c3d5560-9929-4aa3-98ea-7308400648d3.jpg?v=1717074607" },
        { video: "https://cdn.shopify.com/videos/c/o/v/96b5ebb5133d4d2e8e9234c29028da5a.mp4", image: "https://okhai.org/cdn/shop/files/9_b65e0850-ad23-4ddd-9134-1c6e4978ad3a.jpg?v=1717074727" },
        { video: "https://cdn.shopify.com/videos/c/o/v/5b5ac6ebace54f98b6b182bf010a0d8e.mp4", image: "https://okhai.org/cdn/shop/files/6_30d3ac88-1ebc-4266-b286-09e49e8657ca.jpg?v=1717074927" },
        { video: "https://cdn.shopify.com/videos/c/o/v/1cf28b97a88c4bd8b7b2d22b310cbb9b.mp4", image: "https://okhai.org/cdn/shop/files/10_cf6822f4-6768-447a-ad7e-ce55ba28b7c8.jpg?v=1717074830" }
    ];

    const totalPages = Math.ceil(videos.length / videosPerPage);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVideosPerPage(1);
            } else if (window.innerWidth < 1024) {
                setVideosPerPage(2);
            } else {
                setVideosPerPage(4);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const scroll = (direction) => {
        setScrollIndex((prev) => {
            if (direction === "left") return Math.max(prev - 1, 0);
            return Math.min(prev + 1, totalPages - 1);
        });
    };

    const playVideo = (index) => {
        setPlayingVideo((prevState) => ({
            ...Object.keys(prevState).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {}),
            [index]: true,
        }));
    };

    return (
        <div className="bg-primary py-5 px-4 md:px-10">
            <div className="text-center text-text text-3xl mt-16 mb-4">
                <Title text1="What" text2="We Do?" />
                <p className="w-full sm:w-3/4 m-auto text-sm md:text-base text-text-light">
                    Empowering communities with creativity, craftsmanship, and innovation.
                </p>
            </div>

            {/* Video Section */}
            <div className="relative flex items-center justify-center">
                <button className={`absolute left-0 bg-secondary text-white p-3 rounded-full shadow-md transition-opacity ${scrollIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-80"}`} onClick={() => scroll("left")} disabled={scrollIndex === 0}
                >
                    ❮
                </button>
                <div ref={scrollRef} className="flex space-x-6 overflow-hidden w-[90%]">
                    {videos.slice(scrollIndex * videosPerPage, (scrollIndex + 1) * videosPerPage).map((item, index) => {
                        const actualIndex = scrollIndex * videosPerPage + index;
                        return (
                            <div key={actualIndex} className="relative w-[320px] h-[420px] rounded-lg shadow-lg hover:scale-105 transition-transform">
                                {!playingVideo[actualIndex] ? (
                                    <img src={item.image} alt={`Preview ${actualIndex + 1}`} className="w-full h-full object-cover cursor-pointer" onClick={() => playVideo(actualIndex)} />
                                ) : (
                                    <video src={item.video} controls autoPlay className="w-full h-full"></video>
                                )}
                            </div>
                        );
                    })}
                </div>
                <button className={`absolute right-0 bg-secondary text-white p-3 rounded-full shadow-md transition-opacity ${scrollIndex === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-80"}`} onClick={() => scroll("right")} disabled={scrollIndex === totalPages - 1}>
                    ❯
                </button>
            </div>
        </div>
    );
}

export default WhatWeDo;