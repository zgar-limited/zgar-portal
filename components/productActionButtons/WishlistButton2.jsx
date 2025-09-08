"use client";

import { useContextElement } from "@/context/Context";
import { useCallback, useMemo } from "react";

export default function WishlistButton2({ product }) {
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
      href="#"
      onClick={handleClick}
      className="tf-btn style-line btn-add-wishlist2"
    >
      <span className="text">
        {" "}
        {isWishlisted ? "Remome list" : "Add to list"}
      </span>
      {isWishlisted ? (
        <i className={`icon icon-trash`} />
      ) : (
        <span className={`icon icon-heart`} />
      )}
    </button>
  );
}
