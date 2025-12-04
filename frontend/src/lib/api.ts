import type {
  Product,
  Order,
  OrderItemResponse,
  CreateOrderRequest,
  LoginRequest,
  LoginResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new ApiError(response.status, error.error || "Request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// Public API

export async function getProducts(): Promise<Product[]> {
  return fetchApi<Product[]>("/api/products");
}

export async function getProduct(id: number): Promise<Product> {
  return fetchApi<Product>(`/api/products/${id}`);
}

export async function createOrder(order: CreateOrderRequest): Promise<Order> {
  return fetchApi<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

// Admin API

export async function adminLogin(
  credentials: LoginRequest
): Promise<LoginResponse> {
  return fetchApi<LoginResponse>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getAdminProducts(token: string): Promise<Product[]> {
  return fetchApi<Product[]>("/api/admin/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createProduct(
  token: string,
  product: CreateProductRequest
): Promise<Product> {
  return fetchApi<Product>("/api/admin/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
}

export async function updateProduct(
  token: string,
  id: number,
  updates: UpdateProductRequest
): Promise<Product> {
  return fetchApi<Product>(`/api/admin/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
}

export async function deleteProduct(token: string, id: number): Promise<void> {
  return fetchApi<void>(`/api/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function uploadProductImage(
  token: string,
  id: number,
  file: File
): Promise<Product> {
  const formData = new FormData();
  formData.append("image", file);

  const url = `${API_URL}/api/admin/products/${id}/image`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new ApiError(response.status, error.error || "Upload failed");
  }

  return response.json();
}

export async function getAdminOrders(token: string): Promise<Order[]> {
  return fetchApi<Order[]>("/api/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAdminOrder(
  token: string,
  id: string
): Promise<[Order, OrderItemResponse[]]> {
  return fetchApi<[Order, OrderItemResponse[]]>(`/api/admin/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateOrderStatus(
  token: string,
  id: string,
  status: string
): Promise<Order> {
  return fetchApi<Order>(`/api/admin/orders/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}

export { ApiError };
