"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "@/lib/api";
import { Button } from "@/components/Button";
import type { Product, CreateProductRequest, UpdateProductRequest } from "@/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const { token, isAuthenticated, clearAuth } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
      return;
    }
    loadProducts();
  }, [isAuthenticated, router]);

  async function loadProducts() {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getAdminProducts(token);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: CreateProductRequest, imageFile?: File) {
    if (!token) return;
    try {
      const product = await createProduct(token, data);

      // If image provided, upload it
      if (imageFile) {
        await uploadProductImage(token, product.id, imageFile);
      }

      await loadProducts();
      setShowCreateForm(false);
      toast.success("Продуктът е създаден успешно!");
    } catch (err) {
      console.error(err);
      toast.error("Грешка при създаване на продукт");
    }
  }

  async function handleUpdate(id: number, data: UpdateProductRequest, imageFile?: File) {
    if (!token) return;
    try {
      await updateProduct(token, id, data);

      // If image provided, upload it
      if (imageFile) {
        await uploadProductImage(token, id, imageFile);
      }

      await loadProducts();
      setEditingProduct(null);
      toast.success("Продуктът е актуализиран успешно!");
    } catch (err) {
      console.error(err);
      toast.error("Грешка при актуализиране на продукт");
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!confirm("Сигурни ли сте, че искате да изтриете този продукт?"))
      return;

    try {
      await deleteProduct(token, id);
      await loadProducts();
      toast.success("Продуктът е изтрит успешно!");
    } catch (err) {
      console.error(err);
      toast.error("Грешка при изтриване на продукт");
    }
  }

  function handleLogout() {
    clearAuth();
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Управление на продукти
          </h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/admin/orders")}>
              Поръчки
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Изход
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Button onClick={() => setShowCreateForm(true)}>
            + Нов продукт
          </Button>
        </div>

        {showCreateForm && (
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

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
                    Име
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Наличност
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Активен
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.price} лв
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.is_active ? "Да" : "Не"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Редактирай
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Изтрий
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Редактиране на продукт</h2>
              <ProductForm
                product={editingProduct}
                onSubmit={(data, imageFile) => handleUpdate(editingProduct.id, data, imageFile)}
                onCancel={() => setEditingProduct(null)}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ProductForm({
  product,
  onSubmit,
  onCancel,
}: {
  product?: Product;
  onSubmit: (data: any, imageFile?: File) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock_quantity: product?.stock_quantity || 0,
    is_active: product?.is_active ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData, imageFile || undefined);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Име
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Снимка на продукта
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          {!imagePreview && product?.image_url && (
            <div className="mt-2">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${product.image_url}`}
                alt="Current"
                className="w-32 h-32 object-cover rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Текуща снимка</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Цена (лв)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Наличност
          </label>
          <input
            type="number"
            value={formData.stock_quantity}
            onChange={(e) =>
              setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {product && (
          <div className="col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Активен продукт
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit">{product ? "Запази" : "Създай"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отказ
        </Button>
      </div>
    </form>
  );
}
