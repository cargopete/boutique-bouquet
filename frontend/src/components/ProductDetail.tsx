"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/Button";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart() {
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.name} добавен в количката`);
    router.push("/cart");
  }

  const imageUrl = product.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${product.image_url}`
    : "/placeholder-clay.svg";

  const isExternalImage = imageUrl.startsWith("http");
  const price = parseFloat(product.price);
  const total = price * quantity;

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          ← Назад
        </Button>

        <div className="bg-card rounded-lg shadow-warm-lg overflow-hidden border border-border/50">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative h-96 bg-cream rounded-lg overflow-hidden">
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
                    target.src = "/placeholder-clay.svg";
                  }}
                />
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-4xl font-bold text-clay-brown mb-4">
                {product.name}
              </h1>

              <p className="text-3xl font-bold text-terracotta mb-6">
                {price.toFixed(2)} лв
              </p>

              {product.description && (
                <p className="text-warm-gray mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <p className="text-sage font-medium flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Налично ({product.stock_quantity} бр.)
                  </p>
                ) : (
                  <p className="text-destructive font-medium flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Изчерпан
                  </p>
                )}
              </div>

              {product.stock_quantity > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-clay-brown mb-2">
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
                      <span className="text-xl font-medium w-12 text-center text-clay-brown">
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
                    <p className="text-lg font-medium text-clay-brown mb-4">
                      Обща сума:{" "}
                      <span className="text-terracotta">
                        {total.toFixed(2)} лв
                      </span>
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
