"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="bg-white shadow-warm sticky top-0 z-50 border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl transition-transform group-hover:scale-110">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-terracotta"
              >
                <path
                  d="M12 2C8.5 2 6 4.5 6 7.5C6 10.5 8 13 8 15C8 17 7 19 7 19H17C17 19 16 17 16 15C16 13 18 10.5 18 7.5C18 4.5 15.5 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="hsl(var(--terracotta-light))"
                />
                <path
                  d="M9 22H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 2V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-xl font-bold text-clay-brown tracking-tight">
              Studio Zemya
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-warm-gray hover:text-terracotta transition-colors font-medium"
            >
              Начало
            </Link>

            <Link
              href="/cart"
              className="relative text-warm-gray hover:text-terracotta transition-colors"
            >
              <span className="text-2xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
