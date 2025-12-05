import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { ProductDetail } from "@/components/ProductDetail";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://boutiquet-bouquet.vercel.app";

interface PageProps {
  params: {
    id: string;
  };
}

async function fetchProduct(id: number) {
  try {
    return await getProduct(id);
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const productId = parseInt(params.id);
  const product = await fetchProduct(productId);

  if (!product) {
    return {
      title: "Продукт не е намерен",
    };
  }

  const price = parseFloat(product.price);
  const imageUrl = product.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${product.image_url}`
    : `${SITE_URL}/placeholder-flower.jpg`;

  return {
    title: product.name,
    description:
      product.description ||
      `Купете ${product.name} - висококачествени изкуствени цветя от Boutique Bouquet. Цена: ${price.toFixed(2)} лв. ${product.stock_quantity > 0 ? "В наличност." : ""}`,
    openGraph: {
      title: product.name,
      description:
        product.description ||
        `Купете ${product.name} за ${price.toFixed(2)} лв`,
      type: "website",
      url: `${SITE_URL}/products/${product.id}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description ||
        `Купете ${product.name} за ${price.toFixed(2)} лв`,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const productId = parseInt(params.id);
  const product = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetail product={product} />
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description || product.name,
            image: product.image_url
              ? product.image_url.startsWith("http")
                ? product.image_url
                : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${product.image_url}`
              : `${SITE_URL}/placeholder-flower.jpg`,
            offers: {
              "@type": "Offer",
              price: parseFloat(product.price),
              priceCurrency: "BGN",
              availability:
                product.stock_quantity > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `${SITE_URL}/products/${product.id}`,
            },
          }),
        }}
      />
    </>
  );
}
