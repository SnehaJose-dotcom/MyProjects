// File: src/app/api/chatbot/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req: Request) {
  const { message, userId } = await req.json();
  const text = message.toLowerCase();

  await connectDB();

  const ProductModel = mongoose.models.products || mongoose.model(
    "products",
    new mongoose.Schema({}, { strict: false }),
    "products"
  );

  const OrderModel = mongoose.models.orders || mongoose.model(
    "orders",
    new mongoose.Schema({}, { strict: false }),
    "carts"
  );

  let botResponse = "I'm here to help! Please ask your question.";
  let imageUrl: string | undefined = undefined;

  if (text.includes("tracking") || text.includes("order")) {
    botResponse = "To track or view your order, go to your profile and check 'Order History'.";
  } else if (text.includes("payment")) {
    botResponse = "For payment details or issues, visit your 'Payment' page or contact support.";
  } else if (text.includes("refund") || text.includes("return")) {
    if (!userId) {
      botResponse = "Please log in to view your refund-eligible items.";
    } else {
      const paidOrders = await OrderModel.find({ userId, paid: true });
      if (paidOrders.length > 0) {
        const random = paidOrders[Math.floor(Math.random() * paidOrders.length)];
        botResponse = `You can request a refund for: ${random.name} - $${random.price}`;
        imageUrl = random.image;
      } else {
        botResponse = "You don't have any paid orders eligible for refund.";
      }
    }
  } else if (text.includes("cancel")) {
    botResponse = "To cancel an order, go to Order History > Select Order > Cancel Order button.";
  } else if (text.includes("exchange")) {
    botResponse = "We offer exchange within 7 days. Please visit the product page or contact support.";
  } else if (text.includes("contact") || text.includes("email") || text.includes("support")) {
    botResponse = "You can reach us at support@ecommerce.com or use the live chat on the site.";
  } else if (text.includes("profile")) {
    botResponse = "To update your info, go to your profile settings and click 'Edit'.";
  } else if (text.includes("delivery")) {
    botResponse = "Delivery typically takes 2–3 business days after order confirmation.";
  } else if (text.includes("recommend") || text.includes("suggest")) {
    const products = await ProductModel.find({}).limit(1);
    const product = products[0];
    if (product) {
      botResponse = `You might like: ${product.name} - $${product.price}`;
      imageUrl = product.image;
    } else {
      botResponse = "Sorry, I couldn't find a product to recommend right now.";
    }
  } else if (text.includes("shop") || text.includes("buy") || text.includes("product")) {
    const products = await ProductModel.find({}).limit(3);
    if (products.length) {
      botResponse = "Here are some products you might like:";
      imageUrl = products[0].image;
    } else {
      botResponse = "Our shop is currently empty. Check back soon!";
    }
  } else if (text.includes("hello") || text.includes("hi")) {
    botResponse = "Hello! How can I assist you today? 😊";
  } else if (text.includes("bye")) {
    botResponse = "Goodbye! Have a great day! 👋";
  }

  return NextResponse.json({ response: botResponse, imageUrl });
}