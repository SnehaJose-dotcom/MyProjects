import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Product from "../../../models/product"; // Ensure you create this model

// Fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
