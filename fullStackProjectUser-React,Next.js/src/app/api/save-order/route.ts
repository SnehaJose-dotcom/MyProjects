import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, items, total, status, cardNumber, nameOnCard, expiration, cvv } = body;

    if (!userId || !items || items.length === 0 || !total || !status) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const Order = mongoose.models.orders || mongoose.model(
      "orders",
      new mongoose.Schema({}, { strict: false }),
      "orders"
    );

    const newOrder = new Order({
      userId,
      items,
      total,
      status, 
      paid: true,
      date: new Date().toISOString(),
      paymentDetails: {
        cardNumber,
        nameOnCard,
        expiration,
        cvv,
      },
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json(savedOrder, { status: 201 });
  } catch (err: any) {
    console.error(" Failed to save order:", err);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}
