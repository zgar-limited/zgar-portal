"use client";

import { useCallback, useMemo } from "react";

export default function CartButton4({
  parentClass = "tf-btn animate-btn",
  product,
}) {
  // Mock functions
  const addProductToCart = () => {};
  const isAddedToCartProducts = () => false;

  const isInCart = useMemo(
    () => false,
    []
  );

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      // Mock function - no action
    },
    []
  );

  return (
    <a
      href="#shoppingCart"
      onClick={handleClick}
      data-bs-toggle="offcanvas"
      className={parentClass}
    >
      {isInCart ? "Already Added" : "Add to cart"}
      <i className="icon icon-shopping-cart-simple" />
    </a>
  );
}
