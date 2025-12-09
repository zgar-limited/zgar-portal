"use client";

import { useCallback, useMemo } from "react";

export default function WishlistButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  // Mock functions
  const addToWishlist = () => {};
  const isAddedtoWishlist = () => false;

  const isWishlisted = useMemo(
    () => false,
    []
  );

  const handleClick = useCallback(() => {
    // Mock function - no action
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${parentClass} tooltip-${tooltipDirection}`}
    >
      {isWishlisted ? (
        <i className={`icon icon-trash`} />
      ) : (
        <span className={`icon icon-heart`} />
      )}
      <span className="tooltip">
        {isWishlisted ? "Remome Wishlist" : "Add to Wishlist"}
      </span>
    </button>
  );
}
