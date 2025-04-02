'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminEditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`/api/admin/products/${id}`);
            const data = await res.json();
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });

        if (res.ok) {
            alert('Product updated successfully');
            router.push('/admin/products');
        } else {
            alert('Failed to update');
        }
    };

    if (!product) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="bg-[#f0f2f5] min-h-screen flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-3xl">
                <h1 className="text-2xl font-bold text-center text-[#6D4C41] mb-8">Edit Product</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        'name', 'price', 'category', 'rating',
                        'brand', 'company', 'year', 'expiry'
                    ].map((field) => (
                        <div key={field}>
                            <label className="text-sm font-semibold text-[#6D4C41] capitalize block mb-1">{field}</label>
                            <input
                                type={field === 'price' || field === 'rating' || field === 'year' ? 'number' : 'text'}
                                name={field}
                                value={product[field]}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-[#6D4C41] block mb-1">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={product.image}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-[#6D4C41] block mb-1">Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            rows={3}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-8 w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-gray-700 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
