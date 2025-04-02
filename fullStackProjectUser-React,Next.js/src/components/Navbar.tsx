"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[#f4e7d3] p-4 flex justify-between items-center">
      <div className="text-xl font-bold">E-Commerce</div>
      <div className="space-x-6">
        <Link href="/" className="hover:text-gray-600">
          Home
        </Link>
        <Link href="/products" className="hover:text-gray-600">
          Products
        </Link>
        <Link href="/chatbot" className="hover:text-gray-600">
          Chatbot
        </Link>
        <Link href="/profile" className="hover:text-gray-600 font-semibold">
          Profile
        </Link>
      </div>
      <div className="space-x-4">
        <button className="border px-4 py-2 rounded-md">Sign Up</button>
        <button className="border px-4 py-2 rounded-md">Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
