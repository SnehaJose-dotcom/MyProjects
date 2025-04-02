'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import these icons
import { useAuth } from "@/app/context/AuthContext";

// Categories data
const categories = [
    { src: "/img/categoryImages/clothing.png", alt: "Clothing" },
    { src: "/img/categoryImages/electronics.jpg", alt: "Electronics" },
    { src: "/img/categoryImages/home.jpg", alt: "Home Decor" },
    { src: "/img/categoryImages/footwear.jpeg", alt: "Foot Wear" },
    { src: "/img/categoryImages/makeup.jpeg", alt: "Makeup" },
    { src: "/img/categoryImages/stationary.jpeg", alt: "Stationary Items" },
];

// Number of visible cards at a time
const visibleCards = 3;

const Home = () => {
    const { user } = useAuth();
    const [startIndex, setStartIndex] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);

    // Fetch reviews from localStorage
    useEffect(() => {
        const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        // Sort reviews by timestamp (most recent first)  //This is not working for now
        const sortedReviews = storedReviews.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setReviews(sortedReviews);
    }, []);

    // Function to scroll left
    const scrollLeft = () => {
        if (startIndex > 0) {
            setStartIndex((prev) => prev - 1);
        }
    };

    // Function to scroll right
    const scrollRight = () => {
        if (startIndex < categories.length - visibleCards) {
            setStartIndex((prev) => prev + 1);
        }
    };

    return (
        <div className="bg-white text-gray-900">
            {/* main Section */}
            <div className="bg-[#6D4C41] text-white py-20 text-center shadow-md w-full mb-8">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold">Welcome to Our E-Commerce Store</h1>
                    <p className="text-lg mt-2">Find the latest trends at the best prices!</p>
                    <Link href="/product">
                        <button className="mt-4 bg-[#D7A86E] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition">
                            Shop Now
                        </button>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="p-8 text-center bg-[#F4E7D3] w-full mb-8">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold text-[#6D4C41] mb-8">Why Shop With Us?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="p-6 shadow-md rounded-lg bg-white">
                            <h3 className="font-bold text-[#6D4C41]">🚀 Fast Delivery</h3>
                            <p className="text-sm text-gray-600 mt-2">Get your orders quickly.</p>
                        </div>
                        <div className="p-6 shadow-md rounded-lg bg-white">
                            <h3 className="font-bold text-[#6D4C41]">💰 Best Prices</h3>
                            <p className="text-sm text-gray-600 mt-2">Great deals on top products.</p>
                        </div>
                        <div className="p-6 shadow-md rounded-lg bg-white">
                            <h3 className="font-bold text-[#6D4C41]">📞 24/7 Support</h3>
                            <p className="text-sm text-gray-600 mt-2">We’re here to help anytime.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Categories Section */}
            <div className="bg-white w-full relative mb-8">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold text-[#6D4C41] text-center mb-8">Shop by Category</h2>

                    {/* Left Arrow Button */}
                    <button
                        onClick={scrollLeft}
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-opacity duration-300 
                            ${startIndex > 0 ? "opacity-100" : "opacity-0 hover:opacity-100"}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Category Cards */}
                    <div className="flex justify-center gap-6">
                        {categories.slice(startIndex, startIndex + visibleCards).map((item, index) => (
                            <div key={index} className="p-6 shadow-md rounded-lg text-center w-[250px]">
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    width={200} // Increase width
                                    height={200} // Increase height
                                    className="object-cover w-full h-[200px] rounded-md" // Make the image clearer and fit well
                                />
                                <p className="text-[#6D4C41] mt-4 font-semibold">{item.alt}</p>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow Button */}
                    <button
                        onClick={scrollRight}
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-opacity duration-300 
                            ${startIndex < categories.length - visibleCards ? "opacity-100" : "opacity-0 hover:opacity-100"}`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="p-8 text-center bg-[#F4E7D3] w-full mb-8">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold text-[#6D4C41] mb-8">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Display only the top 2 reviews */}
                        {reviews.slice(0, 2).map((review, index) => (
                            <div key={index} className="p-6 shadow-md rounded-lg bg-white">
                                <p className="text-gray-600">{review.review}</p>
                                <h3 className="mt-2 font-bold text-[#6D4C41]">- {review.name}</h3>
                            </div>
                        ))}
                    </div>
                    {/* See More Reviews Link */}
                    <Link href="/review" className="text-[#6D4C41] font-semibold mt-4 inline-block hover:underline">
                        See More Reviews →
                    </Link>
                </div>
            </div>

            {/* Call to Action */}
            {!user && (
                <div className="bg-[#6D4C41] text-white py-10 text-center w-full mb-8">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold">Ready to Shop?</h2>
                        <p className="text-lg mt-2">Join thousands of happy customers today.</p>
                        <Link href="/signup">
                            <button className="mt-4 bg-[#D7A86E] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition">
                                Sign Up Now
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
