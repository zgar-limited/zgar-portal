"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { StoreProduct } from "@medusajs/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/common/ToastProvider";
import { medusaSDK } from "@/utils/medusa";


interface ProductCardProps {
  product: any; // Using any for flexible mapping from Medusa/Internal types
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [adding, setAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Safe price calculation
  const price =
    typeof product.price === "number"
      ? product.price
      : product.variants?.[0]?.prices?.[0]?.amount || 0;

  const title = product.title || "Untitled Product";
  const imgSrc =
    product.thumbnail || product.imgSrc || "https://placehold.co/300x400"; // Fallback to placeholder if no image
  const imgHover = product.images?.[1]?.url || product.imageHover || imgSrc;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (adding || isAdded) return;

    // Check if variant exists
    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      console.warn("No variant found for product", product.id);
      showToast("Product variant not available", "danger");
      return;
    }

    setAdding(true);
    try {
      const cartId = localStorage.getItem("cart_id");
      if (!cartId) {
        throw new Error("No cart found");
      }

      await medusaSDK.store.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity: 50,
        metadata: product.variants?.[0]?.metadata
      });
      router.refresh();

      setIsAdded(true);
      showToast("Added to cart successfully", "success");

      // Reset "Added" state after delay
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart", err);
      showToast("Failed to add to cart. Please try again.", "danger");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="overflow-hidden transition-all bg-white shadow-sm group position-relative d-flex flex-column h-100 rounded-3 hover-shadow-md">
      {/* Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="overflow-hidden d-block position-relative bg-light"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Main Image */}
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="transition-transform duration-500 object-fit-cover group-hover-scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        {/* Hover Image (Opacity Transition) */}
        {imgHover !== imgSrc && (
          <Image
            src={imgHover}
            alt={title}
            fill
            className="absolute top-0 left-0 transition-opacity duration-300 opacity-0 object-fit-cover group-hover-opacity-100"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        )}

        {/* Quick Add Button - Appears on Hover */}
        <div className="bottom-0 p-2 transition-transform duration-300 position-absolute start-0 w-100 translate-y-100 group-hover-translate-y-0 d-none d-md-block">
          <button
            onClick={handleQuickAdd}
            disabled={adding || isAdded}
            className={`gap-2 shadow-sm btn w-100 btn-sm rounded-pill d-flex align-items-center justify-content-center ${
              isAdded ? "btn-success" : "btn-dark"
            }`}
          >
            {adding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isAdded ? (
              <Check size={14} />
            ) : (
              <ShoppingCart size={14} />
            )}
            <span>
              {adding ? "Adding..." : isAdded ? "Added" : "Quick Add"}
            </span>
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h3 className="mb-1 h6 text-truncate">
          <Link
            href={`/product-detail/${product.id}`}
            className="transition-colors text-dark text-decoration-none hover-text-primary"
          >
            {title}
          </Link>
        </h3>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <span className="fw-bold text-dark">${price.toFixed(2)}</span>
          {/* Mobile Cart Icon (Always visible on mobile) */}
          <button
            onClick={handleQuickAdd}
            disabled={adding || isAdded}
            className={`p-1 btn btn-sm rounded-circle d-md-none d-flex align-items-center justify-content-center ${
              isAdded ? "btn-success text-white" : "btn-outline-dark"
            }`}
            style={{ width: "32px", height: "32px" }}
          >
            {adding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isAdded ? (
              <Check size={14} />
            ) : (
              <ShoppingCart size={14} />
            )}
          </button>
        </div>
      </div>

      {/* CSS for custom hover effects if Tailwind utilities aren't enough/configured */}
      <style jsx>{`
        .group-hover-scale-105:hover {
          transform: scale(1.05);
        }
        .group-hover-opacity-100:hover {
          opacity: 1;
        }
        .group:hover .group-hover-translate-y-0 {
          transform: translateY(0);
        }
        .hover-text-primary:hover {
          color: var(--bs-primary) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .transition-transform {
          transition: transform 0.3s ease;
        }
        .transition-opacity {
          transition: opacity 0.3s ease;
        }
        .translate-y-100 {
          transform: translateY(100%);
        }
        .hover-shadow-md:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
