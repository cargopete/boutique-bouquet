import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { Button } from "./Button";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const imageUrl = product.image_url
    ? product.image_url.startsWith("http")
      ? product.image_url
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${product.image_url}`
    : "/placeholder-clay.svg";

  const isExternalImage = imageUrl.startsWith("http");

  return (
    <div className="bg-card rounded-lg shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-300 border border-border/50 group">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 bg-cream">
          {isExternalImage ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-clay.svg";
              }}
            />
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-clay-brown mb-2 hover:text-terracotta transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-warm-gray mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-terracotta">
            {parseFloat(product.price).toFixed(2)} лв
          </span>

          {product.stock_quantity > 0 ? (
            <Button size="sm" onClick={() => onAddToCart?.(product)}>
              Добави
            </Button>
          ) : (
            <span className="text-sm text-warm-gray">Изчерпан</span>
          )}
        </div>

        {product.stock_quantity > 0 && product.stock_quantity < 5 && (
          <p className="text-xs text-ochre-dark mt-2 font-medium">
            Остават само {product.stock_quantity} бр.
          </p>
        )}
      </div>
    </div>
  );
}
