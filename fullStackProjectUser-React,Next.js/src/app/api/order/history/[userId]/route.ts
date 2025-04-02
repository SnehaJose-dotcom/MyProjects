import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Order from '@/models/order';

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
    await connectDB();
    const orders = await Order.find({ userId: params.userId }).sort({ createdAt: -1 });
  
    return NextResponse.json(orders);
  }
  