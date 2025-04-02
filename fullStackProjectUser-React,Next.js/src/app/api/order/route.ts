import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Order from '@/models/order';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const newOrder = new Order(body);
  const savedOrder = await newOrder.save();

  return NextResponse.json(savedOrder);
}
