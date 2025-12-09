"use client";

import { useCallback, useMemo } from "react";

export default function CartButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  // Mock functions
  const addProductToCart = () => {};
  const isAddedToCartProducts = () => false;

  const isInCart = useMemo(
    () => false,
    []
  );

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      // Mock function - no action
    },
    []
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
