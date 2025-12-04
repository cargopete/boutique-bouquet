"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { getProduct } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/Button";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const productId = parseInt(params.id as string);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);
      const data = await getProduct(productId);
      setProduct(data);
    } catch (err) {
      setError("Продуктът не беше намерен");
      toast.error("Продуктът не беше намерен");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (product) {
      addItem(product, quantity);
      toast.success(`${quantity} x ${product.name} добавен в количката`);
      router.push("/cart");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Зареждане...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Назад към началото</Button>
        </div>
      </div>
    );
  }

  const imageUrl = product.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${product.image_url}`
    : "/placeholder-flower.jpg";

  const isExternalImage = imageUrl.startsWith("http");
  const price = parseFloat(product.price);
  const total = price * quantity;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          ← Назад
        </Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {isExternalImage ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-flower.jpg";
                  }}
                />
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="text-3xl font-bold text-rose-600 mb-6">
                {price.toFixed(2)} лв
              </p>

              {product.description && (
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <p className="text-green-600 font-medium">
                    ✓ Налично ({product.stock_quantity} бр.)
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">✗ Изчерпан</p>
                )}
              </div>

              {product.stock_quantity > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Количество:
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="text-xl font-medium w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stock_quantity, quantity + 1)
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-lg font-medium text-gray-900 mb-4">
                      Обща сума: {total.toFixed(2)} лв
                    </p>
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      className="w-full"
                    >
                      Добави в количката
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
