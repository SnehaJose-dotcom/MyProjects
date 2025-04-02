"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const amount = searchParams.get("amount") || "0.00";

  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        const validItems = data.filter((item: any) => item.productId);
        setCartItems(validItems);
      } catch (err) {
        console.error("🛒 Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (!user || loading) {
    return <p className="text-center mt-10 text-lg">Loading user and cart...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = user?.userId;
    if (!userId) {
      console.error("No user ID found");
      setMessage("Please log in to place your order.");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    const total = cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    if (!items.length || !total) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      const response = await fetch("/api/save-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          items,
          total,
          status: "Paid",
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save order");
      }

      const data = await response.json();
      console.log("Order saved:", data);
      setMessage("Payment successful! Redirecting...");
      setTimeout(() => router.push("/order-history"), 2000);
    } catch (err) {
      console.error("Order submission failed:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
      <p>Amount to Pay: ${amount}</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-md bg-white p-6 shadow rounded"
      >
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Card Number</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name on Card</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 flex space-x-2">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Expiration</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">CVV</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!user}
          className="bg-[#D7A86E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c98d58] transition disabled:opacity-50"
        >
          Pay Now
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
