"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  date: string;
}

const getUserOrders = async (userId: string): Promise<Order[]> => {
  const res = await fetch(`/api/get-orders?userId=${userId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      console.error("Order fetch error:", errorData);
    } else {
      console.error("Order fetch error: Non-JSON response", await res.text());
    }
    throw new Error("Failed to fetch user orders");
  }

  return await res.json();
};

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchOrders = async () => {
      try {
        const orderData = await getUserOrders(user.userId);
        setOrders(orderData);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <main className="min-h-screen bg-[#f4e7d3] p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
      <div className="w-full max-w-3xl space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No paid orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white shadow p-5 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>

              <ul className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-4 flex gap-4 items-center">
                    <img
                      src={item.productId?.image || "/placeholder.png"}
                      alt={item.productId?.name || "Product"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.productId?.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.productId?.description || "-"}
                      </p>
                      <p className="text-sm text-gray-700">
                        ₹{item.productId?.price?.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 text-right font-bold">
                Total: ₹{order.total.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default OrderHistoryPage;
