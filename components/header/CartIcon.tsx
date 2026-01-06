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
        className="p-2.5 -m-2.5 link relative text-gray-600 hover:text-brand-pink transition-colors rounded-xl hover:bg-gray-100 group/icon"
      >
        <ShoppingCart className="h-5 w-5 transition-transform group-hover/icon:scale-110" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center font-semibold shadow-sm">
            {itemCount}
          </span>
        )}
      </Link>

      {/* Mini Cart Dropdown - 简约白色 */}
      {isHovered && (
        <div className="absolute right-0 top-10 w-80 p-4 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
          {/* Arrow */}
          <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45" />

          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
            <h6 className="m-0 text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={16} className="text-brand-pink" />
              {t("shoppingCart")} ({itemCount})
            </h6>
            <span className="text-sm font-semibold text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {cartProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium">{t("emptyCart")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mb-3 max-h-[300px] overflow-y-auto">
              {cartProducts.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group/item">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 shrink-0" style={{ width: "60px", height: "60px" }}>
                    <Image
                      src={item.imgSrc || "https://placehold.co/100x100"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover/item:scale-110"
                    />
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="m-0 text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="m-0 text-xs text-gray-500 truncate">
                      {item.variantTitle}
                    </p>
                    <p className="m-0 text-sm font-semibold text-gray-900 mt-1">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {cartProducts.length > 3 && (
                <p className="m-0 text-center text-xs text-gray-500 bg-gray-100 rounded-lg py-2">
                  {t("moreItems", { count: cartProducts.length - 3 })}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Link
              href="/view-cart"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-pink to-brand-blue rounded-lg hover:shadow-md transition-all duration-200"
            >
              {t("viewCart")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
