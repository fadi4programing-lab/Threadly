"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ChevronLeft, Star, WifiOff } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { Button, Skeleton } from "@/components/ui";
import { Product, Review } from "@/lib/types";
import { cacheProduct, getCachedProduct } from "@/lib/offline/db";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const isOnline = useOnlineStatus();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);

    if (isOnline) {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (data.data) {
          setProduct(data.data);
          setIsFromCache(false);
          await cacheProduct(data.data);
        }
      } catch {
        const cached = await getCachedProduct(params.id as string);
        setProduct(cached as Product | null);
        setIsFromCache(true);
      }
    } else {
      const cached = await getCachedProduct(params.id as string);
      setProduct(cached as Product | null);
      setIsFromCache(true);
    }

    setLoading(false);
  }, [params.id, isOnline]);

  const fetchReviews = useCallback(async () => {
    if (!isOnline) return;
    try {
      const res = await fetch(`/api/reviews?product_id=${params.id}`);
      const data = await res.json();
      setReviews(data.data || []);
    } catch {
      // Silently fail for reviews when offline
    }
  }, [params.id, isOnline]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes?.length) return;
    if (!selectedColor && product.colors?.length) return;

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      size: selectedSize || "One Size",
      color: selectedColor || "Default",
      image: product.images?.[0] || "",
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-zinc-500">Product not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const displayPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price !== null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Offline Banner */}
      {isFromCache && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <WifiOff className="h-4 w-4" />
          You&apos;re offline. Viewing cached product data.
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            {product.images?.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                No Image
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    selectedImage === i
                      ? "border-black dark:border-white"
                      : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="pb-24 md:pb-0">
          <h1 className="text-xl sm:text-2xl font-bold">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-zinc-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-zinc-500">
              ({reviews.length} reviews)
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-6 text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selectedSize === size
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selectedColor === color
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <p className="mt-4 text-sm text-zinc-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {/* Desktop Add to Cart */}
          <div className="mt-6 hidden md:flex items-center gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addedToCart}
              size="lg"
              className="flex-1"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {addedToCart ? "Added!" : "Add to Cart"}
            </Button>
          </div>

          {/* Offline notice */}
          {!isOnline && (
            <p className="mt-4 text-xs text-amber-600 bg-amber-50 rounded-lg p-3 dark:bg-amber-900/20">
              You&apos;re offline. You can browse and add to cart, but checkout requires an internet connection.
            </p>
          )}
        </div>
      </div>

      {/* Sticky mobile Add to Cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-zinc-500">Total</p>
            <p className="text-lg font-bold">${displayPrice.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addedToCart}
            className="flex-1"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addedToCart ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-zinc-500">
            {isOnline ? "No reviews yet" : "Reviews unavailable offline"}
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-zinc-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
