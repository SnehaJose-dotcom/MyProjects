import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Order from '@/models/order';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const updatedOrder = await Order.findByIdAndUpdate(params.id, body, { new: true });

  return NextResponse.json(updatedOrder);
}
