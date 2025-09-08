"use client";

import { useContextElement } from "@/context/Context";
import { useCallback, useMemo } from "react";

export default function CartButton3({ product }) {
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  const isInCart = useMemo(
    () => isAddedToCartProducts(product.id),
    [isAddedToCartProducts, product.id]
  );

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (!isInCart) addProductToCart(product.id);
    },
    [addProductToCart, product.id, isInCart]
  );

  return (
    <a
      href="#shoppingCart"
      onClick={handleClick}
      data-bs-toggle="offcanvas"
      className="tf-btn w-100 btn-blue type-small-4"
    >
      {isInCart ? "Already Added" : "Add to cart"}
    </a>
  );
}
