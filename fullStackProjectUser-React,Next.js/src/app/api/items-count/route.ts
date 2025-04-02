import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Cart from '@/models/cart';
import { verifyAuth } from '@/app/lib/auth';

// ----------------- GET -----------------
export async function GET(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectDB();

        // Verify and decode JWT token
        const decoded = verifyAuth(req) as { userId: string };
        console.log("Decoded token on GET:", decoded);

        if (!decoded?.userId) {
            // Handle unauthorized access
            console.log("GET failed: No user ID found in token");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch cart items for the authenticated user and calculate item count
        const cartItems = await Cart.find({ userId: decoded.userId });
        
        // Calculate total item count (sum of quantities)
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

        console.log(`Cart item count for user ${decoded.userId}:`, itemCount);

        return NextResponse.json({ itemCount }, { status: 200 });
    } catch (error) {
        // Handle server errors
        console.error('Error fetching cart item count:', error);
        return NextResponse.json({ error: 'Failed to fetch cart item count.' }, { status: 500 });
    }
}
