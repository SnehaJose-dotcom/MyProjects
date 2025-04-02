"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

const Header = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

   // Fetch cart item count when the component mounts or user logs in
   useEffect(() => {
    const fetchCartItemCount = async () => {
      if (user) {
        try {
          const response = await fetch('/api/items-count');
          if (response.ok) {
            const data = await response.json();
            setCartItemCount(data.itemCount); // Set the count of items
          } else {
            console.error('Failed to fetch cart item count');
          }
        } catch (error) {
          console.error('Error fetching cart item count:', error);
        }
      }
    };

    fetchCartItemCount();
  }, [user]); // Fetch on login (when user state changes)

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <header className="bg-[#f4e7d3] text-dark p-4 border-none shadow-none">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Web Name */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image src="/img/logo.png" alt="Website Logo" width={120} height={120} />
              <h1 className="text-2xl font-bold ml-3">E-Commerce</h1>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow flex justify-center">
          <ul className="flex space-x-6 font-medium">
            <li>
              <Link
                href="/"
                className={`px-3 py-2 rounded-md transition-all duration-200 ${
                  pathname === "/" ? "text-2xl font-bold text-black" : "text-xl hover:text-secondary"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/product"
                className={`px-3 py-2 rounded-md transition-all duration-200 ${
                  pathname === "/products" ? "text-2xl font-bold text-black" : "text-xl hover:text-secondary"
                }`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/chatbot"
                className={`px-3 py-2 rounded-md transition-all duration-200 ${
                  pathname === "/chatbot" ? "text-2xl font-bold text-black" : "text-xl hover:text-secondary"
                }`}
              >
                Chatbot
              </Link>
            </li>
          </ul>
        </nav>

         {user ? (
          <div className="relative">
            <button
              className="flex items-center p-2 rounded-full hover:bg-gray-200 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Image src="/img/user-icon.jpeg" alt="User Icon" width={40} height={40} className="rounded-full" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-xl z-50">
                <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/mycart" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  My Cart
                  {/* Display cart item count in a small red circle */}
                  {cartItemCount > 0 && (
                    <span className="absolute right-0 top-[52px] bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                     <Link href="/order-history" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Order History
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-3">
            <Link
              href="/signup"
              className={`text-xl px-4 py-2 rounded-full ${
                pathname === "/signup" ? "bg-[#E2B89B] text-white" : "bg-secondary text-secondary hover:bg-[#E2B89B]"
              }`}
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className={`text-xl border-2 px-4 py-2 rounded-full ${
                pathname === "/signin" ? "bg-[#E2B89B] text-white" : "bg-secondary text-secondary hover:bg-[#E2B89B]"
              }`}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
