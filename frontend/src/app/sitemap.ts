import { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://studiozemya.com";

interface Product {
  id: number;
  updated_at?: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) {
      console.error("Failed to fetch products for sitemap");
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  // Static pages
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  // Product pages
  const productRoutes = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: product.updated_at
      ? new Date(product.updated_at)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...routes, ...productRoutes];
}
