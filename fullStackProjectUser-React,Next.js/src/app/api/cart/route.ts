import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Cart from '@/models/cart';
import mongoose from 'mongoose';
import { verifyAuth } from '@/app/lib/auth';


interface CartItem {
    userId: string;
    productId: string;
    quantity: number;
}

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

        // Fetch cart items for the authenticated user
        const cartItems = await Cart.find({ userId: decoded.userId }).populate({
            path: 'productId',
            select: 'name description price image'
        });

        //   // Get the total count of items in the cart
        //   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

        console.log(`Cart items fetched for user ${decoded.userId}:`, cartItems);

        return NextResponse.json(cartItems, { status: 200 });
    } catch (error) {
        // Handle server errors
        console.error('Error fetching cart data:', error);
        return NextResponse.json({ error: 'Failed to fetch cart data.' }, { status: 500 });
    }
}


// ----------------- POST -----------------
export async function POST(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectDB();

        // Verify and decode JWT token
        const decoded = verifyAuth(req) as { userId: string };
        console.log("Decoded token on POST:", decoded);

        if (!decoded?.userId) {
            // Handle unauthorized access
            console.log("POST failed: No user ID found in token");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body: CartItem = await req.json();
        const { productId, quantity } = body;

        console.log("POST body:", body);

        if (!productId || !quantity) {
            // Validate required fields
            console.log("POST failed: Missing productId or quantity");
            return NextResponse.json({ error: 'Product ID and quantity are required.' }, { status: 400 });
        }

        // Check if the item already exists in the cart
        const existingCartItem = await Cart.findOne({ userId: decoded.userId, productId });

        if (existingCartItem) {
            // Update quantity if item exists
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            console.log("Updated existing cart item:", existingCartItem);
        } else {
            // Create new cart item
            const newCartItem = new Cart({ userId: decoded.userId, productId, quantity });
            await newCartItem.save();
            console.log("Created new cart item:", newCartItem);
        }

        return NextResponse.json({ message: 'Product added to cart successfully.' }, { status: 200 });
    } catch (error) {
        // Handle server errors
        console.error('Error adding product to cart:', error);
        return NextResponse.json({ error: 'Failed to add product to cart.' }, { status: 500 });
    }
}

// ----------------- PUT -----------------
export async function PUT(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectDB();

        // Verify and decode JWT token
        const decoded = verifyAuth(req) as { userId: string };
        console.log("Decoded token on PUT:", decoded);

        if (!decoded?.userId) {
            // Handle unauthorized access
            console.log("PUT failed: No user ID found in token");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body: CartItem = await req.json();
        const { productId, quantity } = body;
         console.log("Product ID:", productId); // Logs the productId value
        console.log("Quantity:", quantity);

        
        console.log("PUT body:", body);

        if (!productId || !quantity) {
            // Validate required fields
            console.log("PUT failed: Missing productId or quantity");
            return NextResponse.json({ error: 'Product ID and quantity are required.' }, { status: 400 });
        }

        // Find the cart item
      
        const cartItem = await Cart.findOne({ 
            userId: decoded.userId, 
            productId:  new mongoose.Types.ObjectId(productId) 
        });

        if (!cartItem) {
            // Handle if the item does not exist in the cart
            console.log("PUT failed: Cart item not found");
            return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
        }

        // Update the quantity of the cart item
        cartItem.quantity = quantity;
        await cartItem.save();
        console.log("Updated cart item:", cartItem);

        return NextResponse.json({ message: 'Cart item updated successfully.' }, { status: 200 });
    } catch (error) {
        // Handle server errors
        console.error('Error updating cart item:', error);
        return NextResponse.json({ error: 'Failed to update cart item.' }, { status: 500 });
    }
}


// ----------------- DELETE -----------------
export async function DELETE(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectDB();

        // Verify and decode JWT token
        const decoded = verifyAuth(req) as { userId: string };
        console.log("Decoded token on DELETE:", decoded);

        if (!decoded?.userId) {
            // Handle unauthorized access
            console.log("DELETE failed: No user ID found in token");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get cart item ID from URL query
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            // Validate ID format
            console.log("DELETE failed: Invalid or missing cart item ID");
            return NextResponse.json({ error: 'Invalid or missing cart item ID.' }, { status: 400 });
        }

        // Delete the cart item only if it belongs to the user
        const deletedItem = await Cart.findOneAndDelete({ _id: id, userId: decoded.userId });

        if (!deletedItem) {
            // Handle item not found or unauthorized
            console.log("DELETE failed: Cart item not found or unauthorized");
            return NextResponse.json({ error: 'Cart item not found or unauthorized.' }, { status: 404 });
        }

        console.log(`Deleted cart item for user ${decoded.userId}:`, deletedItem);

        return NextResponse.json({ message: 'Cart item removed successfully.' }, { status: 200 });
    } catch (error) {
        // Handle server errors
        console.error('Error removing cart item:', error);
        return NextResponse.json({ error: 'Failed to remove cart item.' }, { status: 500 });
    }
}
