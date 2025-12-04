"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { getAdminOrders, getAdminOrder, updateOrderStatus } from "@/lib/api";
import { Button } from "@/components/Button";
import type { Order, OrderItemResponse } from "@/types";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token, isAuthenticated, clearAuth } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<{
    order: Order;
    items: OrderItemResponse[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    loadOrders();
  }, [isAuthenticated, router]);

  async function loadOrders() {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getAdminOrders(token);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function viewOrderDetails(orderId: string) {
    if (!token) return;
    try {
      const [order, items] = await getAdminOrder(token, orderId);
      setSelectedOrder({ order, items });
    } catch (err) {
      console.error(err);
      toast.error("Грешка при зареждане на детайли");
    }
  }

  async function handleUpdateStatus(orderId: string, status: string) {
    if (!token) return;
    try {
      await updateOrderStatus(token, orderId, status);
      await loadOrders();
      if (selectedOrder) {
        const [order, items] = await getAdminOrder(token, orderId);
        setSelectedOrder({ order, items });
      }
      toast.success("Статусът е актуализиран успешно!");
    } catch (err) {
      console.error(err);
      toast.error("Грешка при актуализиране на статус");
    }
  }

  function handleLogout() {
    clearAuth();
    router.push("/admin");
  }

  const statusLabels: Record<string, string> = {
    pending: "Изчакваща",
    processing: "Обработва се",
    shipped: "Изпратена",
    delivered: "Доставена",
    cancelled: "Анулирана",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Управление на поръчки
          </h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/admin/products")}>
              Продукти
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Изход
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-gray-600">Зареждане...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Общо
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {order.total_amount} лв
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("bg-BG")}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => viewOrderDetails(order.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Детайли
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Детайли на поръчката</h2>
                  <p className="text-sm text-gray-600 font-mono">
                    {selectedOrder.order.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Информация за клиента</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-600">Име:</span>{" "}
                      {selectedOrder.order.customer_name}
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span>{" "}
                      {selectedOrder.order.customer_email}
                    </p>
                    <p>
                      <span className="text-gray-600">Телефон:</span>{" "}
                      {selectedOrder.order.customer_phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Адрес за доставка</h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.order.delivery_address}</p>
                    <p>
                      {selectedOrder.order.delivery_city}
                      {selectedOrder.order.delivery_postal_code &&
                        `, ${selectedOrder.order.delivery_postal_code}`}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.order.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Забележки</h3>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.order.notes}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Продукти</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Продукт
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Цена
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Бр.
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Сума
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-2 text-sm">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            {item.product_price} лв
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium">
                            {item.subtotal} лв
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-2 text-right font-semibold"
                        >
                          Общо:
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-lg">
                          {selectedOrder.order.total_amount} лв
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Статус на поръчката</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusLabels).map(([status, label]) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.order.id, status)
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedOrder.order.status === status
                          ? statusColors[status]
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
