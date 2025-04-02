"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useParams } from "next/navigation"; // Import useParams to get route parameters

const ProductDetailScreen = () => {
    const router = useRouter();
    const { id } = useParams(); // Get the dynamic route parameter 'id'
    const [product, setProduct] = useState<any>(null); // State to store the fetched product
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [quantity, setQuantity] = useState<number>(1); // State to manage quantity

    // Fetch product details when the component mounts
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (id) {
                setLoading(true);
                try {
                    const response = await fetch(`/api/products/${id}`); // Fetch product by id from API
                    if (response.ok) {
                        const data = await response.json();
                        setProduct(data);
                    } else {
                        setError("Product not found.");
                    }
                } catch (err) {
                    console.error("Error fetching product:", err);
                    setError("Failed to load product details.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProductDetails();
    }, [id]);

    // Handle loading state
    if (loading) {
        return <p>Loading...</p>;
    }

    // Handle error state
    if (error) {
        return <p>{error}</p>;
    }

    // If no product is found
    if (!product) {
        return <p>Product not found.</p>;
    }

    // Handle quantity change
    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: quantity,
                }),
            });
    
            if (response.status === 401) {
                // If the response is 401 Unauthorized, redirect to the sign-in page
                console.log('Unauthorized, redirecting to sign-in page...');
                router.push('/signin');
                return;
            }
    
            if (response.ok) {
                console.log(`Added ${quantity} ${product.name}(s) to the cart.`);
                router.push('/mycart'); // Redirect after successful addition
            } else {
                console.error('Failed to add product to cart.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };
    
    

    return (
        <div className="bg-white text-gray-900 p-6">
            <div className="container mx-auto">
                <div className="max-w-2xl mx-auto p-4 shadow-md rounded-lg bg-white">
                    <img
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-cover mx-auto rounded-md"
                    />
                    <h2 className="text-3xl font-semibold text-[#6D4C41] text-center mt-4">{product.name}</h2>
                    <p className="text-xl text-gray-600 text-center">${product.price.toFixed(2)}</p>
                    <p className="mt-4 text-gray-700">
                        <strong>Description:</strong> {product.description || "Description not available."}
                    </p>
                    <p className="mt-4 text-gray-700">
                        <strong>Category:</strong> {product.category || "Category not available."}
                    </p>
                    <p className="mt-4 text-gray-700">
                        <strong>Brand:</strong> {product.brand || "Brand not available."}
                    </p>
                    <p className="mt-4 text-gray-700">
                        <strong>Company:</strong> {product.company || "Company not available."}
                    </p>
                    <p className="mt-4 text-gray-700">
                        <strong>Year:</strong> {product.year || "Year not available."}
                    </p>
                    <p className="mt-4 text-gray-700">
                        <strong>Expiry Date:</strong> {product.expiry || "Expiry date not available."}
                    </p>

                    {/* Quantity control */}
                    <div className="flex items-center justify-center mt-6">
                        <button
                            onClick={handleDecrease}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-l-md"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="text-center border-t border-b border-gray-300 w-16 px-4 py-2 "
                        />
                        <button
                            onClick={handleIncrease}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-r-md"
                        >
                            +
                        </button>
                    </div>

                    {/* Add to cart button */}
                    <button
                        onClick={handleAddToCart}
                        className="mt-6 bg-[#D7A86E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition"
                    >
                        Add {quantity} to cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailScreen;
