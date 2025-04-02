import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Product from "../../../../models/product"; // Ensure this is correct

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log("Params:", params); // Add logging to check params
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    await connectDB();
    const product = await Product.findById(id); // Fetch product by ID
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
