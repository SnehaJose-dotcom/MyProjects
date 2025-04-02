"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const categories = ["All", "Dairy", "Bakery", "Snacks", "Beverages"];

const ProductScreen = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10);
    const [loading, setLoading] = useState(true); // ✅ Loading state

    // Fetch data from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/products"); // ✅ Fetch from API
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    // Filter products based on category and price range
    const filteredProducts = products.filter(
        (product: any) =>
            (selectedCategory === "All" || product.category === selectedCategory) &&
            product.price >= minPrice &&
            product.price <= maxPrice
    );

    return (
        <div className="bg-white text-gray-900 p-6">
            <div className="container mx-auto flex flex-col md:flex-row gap-6">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-1/4 bg-[#f4e7d3] p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-[#6D4C41]">Filters</h2>
                    <div className="mt-4">
                        <label className="font-semibold">Category:</label>
                        <select
                            className="w-full p-2 mt-2 border rounded-md"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="font-semibold">Price Range:</label>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="number"
                                value={minPrice}
                                min="0"
                                className="w-1/2 p-2 border rounded-md"
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                min="0"
                                className="w-1/2 p-2 border rounded-md"
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-semibold text-[#6D4C41] text-center mb-6">Products</h2>

                    {/* ✅ Show loading message while data is being fetched */}
                    {loading ? (
                        <div className="text-center text-gray-500">Loading products...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center text-gray-500">No products found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product: any) => (
                                <div key={product._id} className="p-4 shadow-md rounded-lg bg-white text-center">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={150}
                                        height={150}
                                        className="object-cover mx-auto rounded-md"
                                    />
                                    <h3 className="mt-2 font-bold text-[#6D4C41]">{product.name}</h3>
                                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
                                    <div className="flex justify-center gap-1 mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={16} className={i < product.rating ? 'text-yellow-500' : 'text-gray-300'} />
                                        ))}
                                    </div>
                                    <Link href={`/product/${product._id}`}>
                                        <button className="mt-4 bg-[#D7A86E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;
