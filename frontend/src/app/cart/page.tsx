"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/Button";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const total = getTotalPrice();

  function handleUpdateQuantity(
    productId: number,
    productName: string,
    newQuantity: number
  ) {
    updateQuantity(productId, newQuantity);
    toast.success("Количеството е актуализирано");
  }

  function handleRemoveItem(productId: number, productName: string) {
    removeItem(productId);
    toast.success(`${productName} премахнат от количката`);
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-clay-brown mb-8">
            Количка за пазаруване
          </h1>
          <div className="bg-card rounded-lg shadow-warm-md p-12 text-center border border-border/50">
            <p className="text-xl text-warm-gray mb-6">
              Вашата количка е празна
            </p>
            <Button onClick={() => router.push("/")}>
              Продължи с пазаруването
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-clay-brown mb-8">
          Количка за пазаруване
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const imageUrl = item.product.image_url
                ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${item.product.image_url}`
                : "/placeholder-clay.svg";

              const price = parseFloat(item.product.price);
              const subtotal = price * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-card rounded-lg shadow-warm p-6 flex gap-4 border border-border/50"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 bg-cream rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-clay-brown mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-terracotta font-medium mb-2">
                      {price.toFixed(2)} лв
                    </p>

                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.product.name,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="font-medium w-8 text-center text-clay-brown">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.product.name,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.product.stock_quantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-clay-brown mb-2">
                      {subtotal.toFixed(2)} лв
                    </p>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        handleRemoveItem(item.product.id, item.product.name)
                      }
                    >
                      Премахни
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-warm-md p-6 sticky top-24 border border-border/50">
              <h2 className="text-xl font-bold text-clay-brown mb-4">
                Обобщение
              </h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-warm-gray">
                  <span>Продукти ({items.length}):</span>
                  <span>{total.toFixed(2)} лв</span>
                </div>
                <div className="flex justify-between text-warm-gray">
                  <span>Доставка:</span>
                  <span>Безплатна</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-xl font-bold text-clay-brown">
                  <span>Общо:</span>
                  <span className="text-terracotta">{total.toFixed(2)} лв</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => router.push("/checkout")}
                className="w-full"
              >
                Към поръчката
              </Button>

              <Button
                size="md"
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full mt-3"
              >
                Продължи с пазаруването
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
