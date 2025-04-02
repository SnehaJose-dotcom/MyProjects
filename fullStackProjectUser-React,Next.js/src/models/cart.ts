import mongoose, { Document, Schema } from 'mongoose';

interface ICart extends Document {
    userId: string;
    productId: mongoose.Types.ObjectId; 
    quantity: number;
}

const CartSchema: Schema = new Schema({
    userId: { type: String, required: true },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Reference to the 'Product' model
        required: true 
    },
    quantity: { type: Number, required: true }
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
