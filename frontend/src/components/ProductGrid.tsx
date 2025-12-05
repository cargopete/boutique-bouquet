"use client";

import toast from "react-hot-toast";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart(product: Product) {
    addItem(product, 1);
    toast.success(`${product.name} добавен в количката`);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Няма налични продукти в момента.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
