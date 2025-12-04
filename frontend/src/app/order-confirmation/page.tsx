"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Поръчката е приета успешно!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Благодарим ви за поръчката. Ще получите потвърждение на посочения
            email адрес.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Номер на поръчка:</p>
              <p className="text-lg font-mono font-semibold text-gray-900">
                {orderId}
              </p>
            </div>
          )}

          <p className="text-gray-600 mb-8">
            Нашият екип ще обработи вашата поръчка възможно най-скоро и ще ви
            уведоми за статуса й.
          </p>

          <Button size="lg" onClick={() => router.push("/")}>
            Към началната страница
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-gray-600">Зареждане...</div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
