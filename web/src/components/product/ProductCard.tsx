"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useWishlist } from "@/lib/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price !== null;
  const { isWishlisted, toggleWishlist } = useWishlist();
  const liked = isWishlisted(product.id);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900"
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden">
        {product.images && product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-400 dark:bg-zinc-800">
            No Image
          </div>
        )}
      </div>

      {/* Badge */}
      {hasDiscount && (
        <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
          Sale
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute right-3 top-3 rounded-full bg-white/80 p-2 opacity-100 transition-all group-hover:opacity-100 dark:bg-black/80 md:opacity-0"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            liked ? "fill-red-500 text-red-500" : "text-zinc-600 dark:text-zinc-400"
          }`}
        />
      </button>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold">
            ${displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
