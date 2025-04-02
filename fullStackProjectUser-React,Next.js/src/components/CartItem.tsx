
"use client";
import Image from "next/image";

interface CartItemProps {
  item: {
    _id: string;
    productId?: {
      _id: string;
      name: string;
      description: string;
      price: number;
      image: string;
    };
    quantity: number;
  };
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItem = ({ item, onQuantityChange, onRemoveItem }: CartItemProps) => {

  // Handle quantity increase
  const handleIncrease = () => {
    if (!product) return;
    onQuantityChange(product._id, item.quantity + 1); // Increment quantity
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    if (!product) return;
  
      onQuantityChange(product._id, item.quantity - 1); // Decrement quantity
    
  };

  // Handle remove item
  const handleRemove = () => {
    onRemoveItem(item._id); // Remove item from cart
  };

  const product = item.productId;

  if (!product) return null;

  return (
    <li className="flex justify-between items-center p-4 mb-4 border-b">
      <div className="flex items-center space-x-6 w-1/3">
        <Image
          src={product.image}
          alt={product.name}
          width={100}
          height={100}
          className="rounded-md object-cover w-24 h-24"
        />
        <div>
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleDecrease}
          className="px-3 py-1 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="text-lg">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="px-3 py-1 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition"
        >
          +
        </button>
        <p className="text-lg font-semibold">
          ${((product.price || 0) * item.quantity).toFixed(2)}
        </p>
      </div>

      <button onClick={handleRemove} className="text-red-600 hover:underline">
        Remove
      </button>
    </li>
  );
};

export default CartItem;
