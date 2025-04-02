'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    rating: number;
}

export default function AdminProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    /**
     * Fetches the list of products from the API
     * and updates the component state with the received data.
     */
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Failed to load products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-[#f0f2f5] text-gray-900 p-6 min-h-screen">
            <div className="container mx-auto ml-4">
                <h2 className="text-2xl font-semibold text-[#6D4C41] text-center mb-6">Admin Products</h2>

                {loading ? (
                    <div className="text-center text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500">No products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="p-4 shadow-md rounded-lg bg-white text-center border">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={150}
                                    height={150}
                                    className="object-cover mx-auto rounded-md"
                                />
                                <h3 className="mt-2 font-bold text-[#6D4C41]">{product.name}</h3>
                                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Category: {product.category}</p>

                                <div className="flex justify-center gap-1 mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={16} className={i < product.rating ? 'text-yellow-500' : 'text-gray-300'} />
                                    ))}
                                </div>


                                <Link href={`/admin/products/${product._id}`}>
                                    <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition">
                                        Edit Product
                                    </button>

                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
}
