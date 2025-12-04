"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">💐</span>
            <span className="text-xl font-bold text-gray-900">
              Boutique Bouquet
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-rose-600 transition-colors"
            >
              Начало
            </Link>

            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-rose-600 transition-colors"
            >
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
