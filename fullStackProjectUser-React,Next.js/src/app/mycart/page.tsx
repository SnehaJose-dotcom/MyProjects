"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CartItem from "@/components/CartItem";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51R2giIBeE7SWX6XYZputwtNw8aLpqHPztOlEJrcojWTHJ4ofBcOheqG95GggKegcgZUceo2gqK22869Cb9XrX1yB00Yq5ksONL");


interface CartItem {
  _id: string;
  productId?: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  quantity: number;
}

const MyCartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  

  // Fetch cart data from API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch("/api/cart");
        if (!response.ok) throw new Error("Failed to fetch cart data.");
        const data = await response.json();

        // Filter valid items (i.e., those with productId)
        const validData = data.filter((item: CartItem) => item.productId);
        setCartItems(validData);
        console.log("Cart Items:", validData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Update quantity on the backend and local state
  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent going below 1
  
    // Optimistically update the UI with the new quantity
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  
    try {
      // Update the quantity on the backend
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: newQuantity }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update quantity.");
      }
  
      // Fetch updated cart data from the backend to ensure consistency
      const updatedCartData = await fetch('/api/cart');
      const data = await updatedCartData.json();
      
      // Filter valid items and update the state with the fetched data
      const validData = data.filter((item: CartItem) => item.productId);
      setCartItems(validData);
  
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  

  const handleRemoveItem = async (id: string) => {
    try {
      // Send DELETE request with the item's ID in the URL query parameter
      const response = await fetch(`/api/cart?id=${id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove item.");
      }
  
      // Remove item from local state after successful deletion
      setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCouponApply = () => {
    // Simple check for a hard-coded coupon
    if (couponCode === "DISCOUNT10") {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  // Apply discount
  const discountedPrice = totalPrice - (totalPrice * discount) / 100;

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <ul>
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </ul>

          {/* Coupon code section */}
          <div className="mt-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="p-2 border rounded"
              placeholder="Enter coupon code"
            />
            <button
              onClick={handleCouponApply}
              className="mt-6 bg-[#D7A86E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition"
            >
              Apply Coupon
            </button>
          </div>
          {discount > 0 && (
            <p className="mt-2 text-lg font-semibold">
              Discount Applied: {discount}% (Total after discount: $
              {discountedPrice.toFixed(2)})
            </p>
          )}

          {/* Total + Proceed to Payment */}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Total: $
              {discount > 0
                ? discountedPrice.toFixed(2)
                : totalPrice.toFixed(2)}
            </h2>

            {/* Link to the /payment page with query params */}
            <Link
              href={{
                pathname: "/payment",
                query: {
                  amount:
                    discount > 0
                      ? discountedPrice.toFixed(2)
                      : totalPrice.toFixed(2),
                },
              }}
            >
              <button className="bg-[#D7A86E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition">
                Proceed to Payment
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link href="/product">
          <button className="mt-6 bg-[#D7A86E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition">
            Back to Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MyCartPage;
