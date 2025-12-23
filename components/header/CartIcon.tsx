"use client";
import React, { useState } from "react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { StoreCart } from "@medusajs/types";
import { useTranslations } from "next-intl";

export default function CartIcon({ cart }: { cart?: StoreCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations("CartIcon");

  const cartProducts = React.useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.map((item: any) => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.product_id,
      title: item.product_title,
      variantTitle: item.variant_title,
      price: item.unit_price,
      quantity: item.quantity,
      imgSrc: item.thumbnail || "https://picsum.photos/100/100",
      options: item.variant?.options || [],
      metadata: item.metadata || {},
      weight: item.variant?.weight || 0,
    }));
  }, [cart]);

  const totalPrice = React.useMemo(() => {
    return cartProducts.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );
  }, [cartProducts]);

  // Calculate total items (sum of quantities)
  const itemCount = cartProducts.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href="/view-cart"
        className="p-0 link relative text-gray-900 hover:text-gray-600 transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center font-medium">
            {itemCount}
          </span>
        )}
      </Link>

      {/* Mini Cart Dropdown */}
      {isHovered && (
        <div className="absolute right-0 top-8 w-80 p-3 bg-white border border-gray-100 rounded-xl shadow-xl z-50">
          {/* Arrow */}
          <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45" />

          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
            <h6 className="m-0 text-sm font-bold text-gray-900">
              {t("shoppingCart")} ({itemCount})
            </h6>
            <span className="text-sm text-gray-500 font-medium">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {cartProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              {t("emptyCart")}
            </div>
          ) : (
            <div className="flex flex-col gap-2 mb-3 max-h-[300px] overflow-y-auto">
              {cartProducts.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-2">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 shrink-0" style={{ width: "60px", height: "60px" }}>
                    <Image
                      src={item.imgSrc || "https://placehold.co/100x100"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="m-0 text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="m-0 text-xs text-gray-500 truncate">
                      {item.variantTitle}
                    </p>
                    <p className="m-0 text-sm text-gray-900 font-medium mt-1">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {cartProducts.length > 3 && (
                <p className="m-0 text-center text-xs text-gray-500">
                  {t("moreItems", { count: cartProducts.length - 3 })}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Link
              href="/view-cart"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
            >
              {t("viewCart")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
