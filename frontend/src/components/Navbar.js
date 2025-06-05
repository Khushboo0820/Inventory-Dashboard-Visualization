"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <h4 className="text-xl font-bold text-gray-800">InventoryApp</h4>
        </Link>
        <div className="space-x-6 flex flex-wrap">
          <Link href="/">
            <h4 className={`text-gray-600 hover:text-gray-900 px-2 ${isActive('/') ? 'border-b-2 border-blue-600' : ''}`}>Home</h4>
          </Link>
          <Link href="/category">
            <h4 className={`text-gray-600 hover:text-gray-900 px-2 ${isActive('/q1-category') ? 'border-b-2 border-blue-600' : ''}`}>Q1</h4>
          </Link>
          <Link href="/stock-msl">
            <h4 className={`text-gray-600 hover:text-gray-900 px-2 ${isActive('/q2-stock-msl') ? 'border-b-2 border-blue-600' : ''}`}>Q2</h4>
          </Link>
          <Link href="/consumption">
            <h4 className={`text-gray-600 hover:text-gray-900 px-2 ${isActive('/q3-consumption') ? 'border-b-2 border-blue-600' : ''}`}>Q3</h4>
          </Link>
          <Link href="/itr">
            <h4 className={`text-gray-600 hover:text-gray-900 px-2 ${isActive('/q4-itr') ? 'border-b-2 border-blue-600' : ''}`}>Q4</h4>
          </Link>
          <Link href="/inventoryData">
            <h4 className={`text-gray-600 hover:text-gray-900 px-2 ${isActive('/inventory-list') ? 'border-b-2 border-blue-600' : ''}`}>All Inventory</h4>
          </Link>
        </div>
      </div>
    </nav>
  );
}
