"use client";

import React, { useState, useMemo, useCallback } from "react";



export default function VolumeDiscount() {
  const [activeId, setActiveId] = useState(1); // default active is first
  const { addProductToCart, isAddedToCartProducts } = useMockContextElement();

  const activeItem = useMemo(
    () => volumeDiscounts.find((v) => v.id === activeId),
    [activeId]
  );

  // Normalize product IDs for the active deal (supports multiple shapes)
  const idsToAdd = useMemo(() => {
    if (!activeItem) return [];
    if (Array.isArray(activeItem.productIds)) return activeItem.productIds;
    if (activeItem.productId) return [activeItem.productId];
    if (Array.isArray(activeItem.products))
      return activeItem.products.map((p) => (typeof p === "string" ? p : p.id));
    // Fallback: treat item's id as a product id
    return activeItem.id ? [activeItem.id] : [];
  }, [activeItem]);

  const allAdded = useMemo(
    () =>
      idsToAdd.length > 0 && idsToAdd.every((id) => isAddedToCartProducts(id)),
    [idsToAdd, isAddedToCartProducts]
  );

  const handleChoose = useCallback(
    (e) => {
      if (allAdded) {
        e.preventDefault(); // don't open cart if nothing will be added
        return;
      }
      idsToAdd.forEach((id) => {
        if (!isAddedToCartProducts(id)) addProductToCart(id);
      });
    },
    [idsToAdd, allAdded, addProductToCart, isAddedToCartProducts]
  );

  return (
    <div className="tf-product-volume-discount">
      <div className="product-badge_item flash-sale w-maxcontent heading">
        <i className="icon icon-thunder" />
        Best deal for you
      </div>

      <div className="flat-check-list list-volume-discount">
        {volumeDiscounts.map((item) => (
          <div
            key={item.id}
            className={
              "check-item volume-discount-item " +
              (activeId === item.id ? "active" : "")
            }
            onClick={() => setActiveId(item.id)}
          >
            <div className="content">
              <div className="check">
                <span />
              </div>
              <h5 className="name fw-6">{item.title}</h5>
              <div className="tags-save h6">{item.save}</div>
            </div>
            <h5 className="fw-4 text-end">
              Total price:
              <span className="fw-7 price-total">
                ${Number(item.price).toFixed(2)}
              </span>
            </h5>
          </div>
        ))}
      </div>

      <button
        type="button"
        data-bs-target="#shoppingCart"
        data-bs-toggle={allAdded ? undefined : "offcanvas"}
        onClick={handleChoose}
        disabled={allAdded}
        aria-disabled={allAdded}
        className={
          "tf-btn animate-btn btn-add-to-cart " +
          (allAdded
            ? "opacity-60 pointer-events-none"
            : "btn-primary primary-6")
        }
      >
        {allAdded ? "Already in cart" : `Choose this deal`}
      </button>
    </div>
  );
}
