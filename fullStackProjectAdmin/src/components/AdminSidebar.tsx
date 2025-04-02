'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useState } from 'react';

const navItems = [
  { name: 'Products', path: '/admin/products' },
  { name: 'Add New Product', path: '/admin/addnewproduct' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className={`${isOpen ? 'w-64' : 'w-16'} shrink-0 transition-all duration-300`} />

      <div
        className={`fixed top-0 left-0 h-screen ${isOpen ? 'w-64' : 'w-16'
          } bg-gray-800 text-white flex flex-col justify-between z-50 transition-all duration-300`}
      >
        <div className="p-4 space-y-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white mb-4 focus:outline-none hover:text-gray-300 text-2xl"
          >
            ☰
          </button>

          {isOpen && (
            <Link href="/admin" className="text-xl font-bold block hover:text-gray-300">
              Admin Panel
            </Link>
          )}

          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block px-3 py-2 rounded hover:bg-gray-700 ${pathname === item.path ? 'bg-gray-700' : ''
                    }`}
                >
                  {isOpen ? item.name : ''}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            {isOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </div>
    </>
  );
}
