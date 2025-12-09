"use client";
import Link from "next/link";
import React, { useState } from "react";
import QuantitySelect from "../common/QuantitySelect";
import { useContextElement } from "@/context/Context";
import CompareButton from "../productActionButtons/CompareButton";
import WishlistButton from "../productActionButtons/WishlistButton";

export default function ProductActionPanel({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addProductToCart, isAddedToCartProducts } = useMockContextElement();
  return (
    <div className="tf-product-total-quantity">
      <div className="group-btn">
        <QuantitySelect quantity={quantity} setQuantity={setQuantity} />
        <a
          href="#shoppingCart"
          data-bs-toggle="offcanvas"
          className="tf-btn animate-btn btn-add-to-cart"
          onClick={() => addProductToCart(product.id, quantity)}
        >
          {isAddedToCartProducts(product.id) ? "ALREADY ADDED" : "ADD TO CART"}
          <i className="icon icon-shopping-cart-simple" />
        </a>
        <WishlistButton
          tooltipDirection="top"
          parentClass="hover-tooltip box-icon btn-add-wishlist flex-sm-shrink-0"
          product={product}
        />
        <CompareButton
          parentClass="hover-tooltip tooltip-top box-icon flex-sm-shrink-0"
          tooltipDirection="top"
          product={product}
        />
      </div>
      <Link href={`/checkout`} className="tf-btn btn-primary w-100">
        BUY IT NOW
      </Link>
    </div>
  );
}
