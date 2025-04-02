import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Product from "@/models/product";

const OrderModel = mongoose.models.orders || mongoose.model(
  "orders",
  new mongoose.Schema({}, { strict: false }),
  "orders"
);

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const rawOrders = await OrderModel.find({ userId, status: "Paid" }).lean();

    const populatedOrders = await Promise.all(
      rawOrders.map(async (order) => {
        const enrichedItems = await Promise.all(
          (order.items || []).map(async (item: { productId: string; quantity: number }) => {
            try {
              const product = await Product.findById(item.productId).lean();
              return {
                ...item,
                productId: product || {
                  name: "Unknown Product",
                  price: 0,
                  description: "No description available.",
                  image: "/placeholder.png",
                },
              };
            } catch (err) {
              console.error("Failed to fetch product:", item.productId);
              return {
                ...item,
                productId: {
                  name: "Unknown Product",
                  price: 0,
                  description: "Failed to load product info.",
                  image: "/placeholder.png",
                },
              };
            }
          })
        );

        return {
          ...order,
          items: enrichedItems,
        };
      })
    );

    return NextResponse.json(populatedOrders);
  } catch (error) {
    console.error(" MongoDB fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
