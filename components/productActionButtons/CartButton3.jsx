"use client";

import { useCallback, useMemo } from "react";

export default function CartButton3({ product }) {
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
      className="tf-btn w-100 btn-blue type-small-4"
    >
      {isInCart ? "Already Added" : "Add to cart"}
    </a>
  );
}
