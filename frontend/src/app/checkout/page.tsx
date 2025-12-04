"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/lib/api";
import { Button } from "@/components/Button";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Моля въведете име (минимум 2 символа)"),
  customer_email: z.string().email("Моля въведете валиден email"),
  customer_phone: z.string().min(10, "Моля въведете валиден телефон"),
  delivery_address: z.string().min(5, "Моля въведете адрес"),
  delivery_city: z.string().min(2, "Моля въведете град"),
  delivery_postal_code: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-md mx-auto">
            <p className="text-xl text-gray-600 mb-6">
              Количката е празна
            </p>
            <Button onClick={() => router.push("/")}>
              Към началната страница
            </Button>
          </div>
        </div>
      </main>
    );
  }

  async function onSubmit(data: CheckoutFormData) {
    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        ...data,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(orderData);
      clearCart();
      toast.success("Поръчката е създадена успешно!");
      router.push(`/order-confirmation?id=${order.id}`);
    } catch (err: any) {
      const errorMsg = err.message || "Грешка при създаване на поръчката";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Завършване на поръчката
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:col-span-2 bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Данни за доставка
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Име и фамилия *
                </label>
                <input
                  type="text"
                  {...register("customer_name")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Иван Иванов"
                />
                {errors.customer_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.customer_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("customer_email")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="ivan@example.com"
                />
                {errors.customer_email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.customer_email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  {...register("customer_phone")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="0888123456"
                />
                {errors.customer_phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.customer_phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес за доставка *
                </label>
                <input
                  type="text"
                  {...register("delivery_address")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="ул. Васил Левски 123"
                />
                {errors.delivery_address && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.delivery_address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Град *
                  </label>
                  <input
                    type="text"
                    {...register("delivery_city")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="София"
                  />
                  {errors.delivery_city && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.delivery_city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пощенски код
                  </label>
                  <input
                    type="text"
                    {...register("delivery_postal_code")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Забележки към поръчката
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Допълнителна информация..."
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Обработване..." : "Завърши поръчката"}
              </Button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Вашата поръчка
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-700">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        2
                      )}{" "}
                      лв
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Общо:</span>
                  <span>{total.toFixed(2)} лв</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Доставката е безплатна
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
