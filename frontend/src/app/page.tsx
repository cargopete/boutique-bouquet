"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Грешка при зареждане на продуктите");
      toast.error("Грешка при зареждане на продуктите");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart(product: Product) {
    addItem(product, 1);
    toast.success(`${product.name} добавен в количката`);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-100 to-pink-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Добре дошли в Boutique Bouquet 💐
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Висококачествени изкуствени цветя и букети за всеки повод.
            Красота, която трае завинаги.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Нашите Продукти
        </h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Зареждане...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Няма налични продукти в момента.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
