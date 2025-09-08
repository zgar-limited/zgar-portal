"use client";

import { useContextElement } from "@/context/Context";
import { useCallback, useMemo } from "react";

export default function WishlistButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  const { addToWishlist, isAddedtoWishlist } = useContextElement();

  const isWishlisted = useMemo(
    () => isAddedtoWishlist(product),
    [isAddedtoWishlist, product]
  );

  const handleClick = useCallback(() => {
    addToWishlist(product);
  }, [addToWishlist, product]);

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
