import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  try {
    const newProduct = await Product.create(data);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error('[ADD NEW PRODUCT ERROR]', err); 
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
