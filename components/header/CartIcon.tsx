"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X } from "lucide-react";
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
      className="position-relative d-flex align-items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href="/view-cart"
        className="p-0 link position-relative text-dark"
      >
        <ShoppingCart />
        {itemCount > 0 && (
          <span
            className="top-0 position-absolute start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem" }}
          >
            {itemCount}
          </span>
        )}
      </Link>

      {/* Mini Cart Dropdown */}
      {isHovered && (
        <div
          className="p-3 bg-white border shadow-lg position-absolute end-0 rounded-3 dropdown-menu-custom"
          style={{ width: "320px", zIndex: 1000, top: "25px" }}
        >
          {/* Arrow/Triangle */}
          <div
            className="bg-white position-absolute border-top border-start"
            style={{
              width: "12px",
              height: "12px",
              top: "-7px",
              right: "10px",
              transform: "rotate(45deg)",
            }}
          ></div>

          <div className="pb-2 mb-3 d-flex justify-content-between align-items-center border-bottom">
            <h6 className="mb-0 fw-bold">{t("shoppingCart")} ({itemCount})</h6>
            <span className="text-muted small">${totalPrice.toFixed(2)}</span>
          </div>

          {cartProducts.length === 0 ? (
            <p className="py-3 text-center text-muted small">
              {t("emptyCart")}
            </p>
          ) : (
            <div
              className="gap-3 mb-3 d-flex flex-column"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {cartProducts.slice(0, 3).map((item) => (
                <div key={item.id} className="gap-2 d-flex">
                  <div
                    className="overflow-hidden rounded-sm shrink-0 position-relative bg-light"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <Image
                      src={item.imgSrc || "https://placehold.co/100x100"}
                      alt={item.title}
                      fill
                      className="object-fit-cover"
                    />
                  </div>
                  <div className="overflow-hidden grow">
                    <p className="mb-0 small fw-bold text-truncate">
                      {item.title}
                    </p>
                    <p className="mb-0 x-small text-muted text-truncate">
                      {item.variantTitle}
                    </p>
                    <p className="mb-0 small text-primary">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {cartProducts.length > 3 && (
                <p className="mb-0 text-center x-small text-muted">
                  {t("moreItems", { count: cartProducts.length - 3 })}
                </p>
              )}
            </div>
          )}

          <div className="gap-2 d-grid">
            <Link
              href="/view-cart"
              className="btn btn-dark btn-sm rounded-pill"
            >
              {t("viewCart")}
            </Link>
            {/* <Link href="/checkout" className="btn btn-outline-dark btn-sm rounded-pill">
                    Checkout
                </Link> */}
          </div>
        </div>
      )}
      <style jsx>{`
        .dropdown-menu-custom::before {
          content: "";
          position: absolute;
          top: -20px;
          left: 0;
          width: 100%;
          height: 20px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
