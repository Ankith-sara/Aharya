import React, { useRef, useState, useEffect } from "react";
import Title from "./Title";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

function WhatWeDo() {
    const scrollRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [playingVideo, setPlayingVideo] = useState({});
    const [videosPerPage, setVideosPerPage] = useState(3);

    const videos = [
        { video: "https://res.cloudinary.com/dfzhqsfp7/video/upload/v1751704393/IMG_2973_f9oiwa.mov", image: "https://res.cloudinary.com/dfzhqsfp7/image/upload/v1752148793/IMG_2973_exported_1350_nwvpgm.jpg" },
        { video: "https://res.cloudinary.com/dfzhqsfp7/video/upload/v1751704388/IMG_2975_gjpdz9.mov", image: "https://res.cloudinary.com/dfzhqsfp7/image/upload/v1752148793/IMG_2975_exported_0_hojskt.jpg" },
        { video: "https://res.cloudinary.com/dfzhqsfp7/video/upload/v1751704385/IMG_2974_nje89b.mov", image: "https://res.cloudinary.com/dfzhqsfp7/image/upload/v1752148793/IMG_2974_exported_1600_lfcasj.jpg" },
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
                setVideosPerPage(3);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = container.offsetWidth;
        const newIndex = direction === "left"
            ? Math.max(scrollIndex - 1, 0)
            : Math.min(scrollIndex + 1, totalPages - 1);

        container.scrollTo({
            left: scrollAmount * newIndex,
            behavior: "smooth",
        });

        setScrollIndex(newIndex);
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = container.offsetWidth;
        container.scrollTo({
            left: scrollIndex * scrollAmount,
            behavior: "smooth",
        });
    }, [scrollIndex]);

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
        <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <Title text1="WHAT" text2="WE DO" />
                    <p className="mt-2 max-w-2xl mx-auto text-gray-600 text-sm md:text-base">
                        Empowering communities with creativity, craftsmanship, and innovation.
                    </p>
                </div>

                {/* Video Carousel */}
                <div className="relative mt-5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Featured Stories</h3>
                        <div className="flex gap-2">
                            <button className={`w-10 h-10 flex items-center justify-center rounded-md border border-black transition-all ${scrollIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-black hover:text-white"}`} onClick={() => scroll("left")} disabled={scrollIndex === 0} aria-label="Previous">
                                <ChevronLeft size={18} />
                            </button>
                            <button className={`w-10 h-10 flex items-center justify-center rounded-md border border-black transition-all ${scrollIndex === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-black hover:text-white"}`} onClick={() => scroll("right")} disabled={scrollIndex === totalPages - 1} aria-label="Next">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar">
                            {videos.map((item, index) => (
                                <div key={index} className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div className="relative aspect-[3/4] overflow-hidden shadow-md group">
                                        {!playingVideo[index] ? (
                                            <>
                                                <img src={item.image} alt={`Story ${index + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer" onClick={() => playVideo(index)}>
                                                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                                                        <Play size={24} fill="black" className="ml-1" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <video src={item.video} controls autoPlay className="w-full h-full object-cover"></video>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination dots */}
                    <div className="flex justify-center mt-8 gap-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button key={index} className={`w-2 h-2 rounded-full transition-all ${scrollIndex === index ? "w-6 bg-black" : "bg-gray-300"}`} onClick={() => setScrollIndex(index)} aria-label={`Go to page ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhatWeDo;