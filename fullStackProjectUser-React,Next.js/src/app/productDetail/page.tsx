"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

// Sample product data (Replace with actual API fetch)
const products = [
    { id: 1, name: "Milk", price: 2.99, category: "Dairy", rating: 4, image: "/img/products/milk.jpg", description: "Fresh milk from organic farms." },
    { id: 2, name: "Bread", price: 1.99, category: "Bakery", rating: 5, image: "/img/products/bread.png", description: "Soft and fresh whole wheat bread." },
    { id: 3, name: "Eggs", price: 3.49, category: "Dairy", rating: 4, image: "/img/products/eggs.jpg", description: "Farm fresh eggs with high protein." },
    { id: 4, name: "Instant Noodles", price: 0.99, category: "Snacks", rating: 4, image: "/img/products/noodles.jpeg", description: "Delicious and quick-to-make noodles." },
    { id: 5, name: "Soda", price: 1.49, category: "Beverages", rating: 5, image: "/img/products/soda.jpg", description: "Refreshing carbonated drink." },
];

const ProductDetail = () => {
    const params = useParams();
    const { id } = params;

    // Find product by ID
    const product = products.find((p) => p.id === Number(id));

    if (!product) {
        return <div className="text-center text-red-500">Product not found.</div>;
    }

    return (
        <div className="bg-white text-gray-900 p-6">
            <div className="container mx-auto max-w-2xl bg-[#f4e7d3] p-6 rounded-lg shadow-lg">
                <Image src={product.image} alt={product.name} width={300} height={300} className="mx-auto rounded-lg" />
                <h2 className="text-2xl font-bold text-[#6D4C41] text-center mt-4">{product.name}</h2>
                <p className="text-gray-600 text-center">${product.price.toFixed(2)}</p>
                <div className="flex justify-center gap-1 mt-2">
                    {[...Array(product.rating)].map((_, index) => (
                        <Star key={index} size={20} className="text-yellow-500" />
                    ))}
                </div>
                <p className="text-gray-700 mt-4 text-center">{product.description}</p>
                <Link href="/product">
                    <button className="mt-6 bg-[#D7A86E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition">
                        Back to Products
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ProductDetail;
