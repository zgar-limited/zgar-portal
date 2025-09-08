"use client";

import { useContextElement } from "@/context/Context";
import { useCallback, useMemo } from "react";

export default function CartButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  const isInCart = useMemo(
    () => isAddedToCartProducts(product.id),
    [product.id, isAddedToCartProducts]
  );

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      if (!isInCart) addProductToCart(product.id);
    },
    [addProductToCart, product.id, isInCart]
  );

  return (
    <a
      href="#shoppingCart"
      data-bs-toggle="offcanvas"
      className={`${parentClass} tooltip-${tooltipDirection}`}
      onClick={handleAddToCart}
    >
      <span className="icon icon-shopping-cart-simple" />
      <span className="tooltip">
        {isInCart ? "Already Added" : "Add to cart"}
      </span>
    </a>
  );
}
