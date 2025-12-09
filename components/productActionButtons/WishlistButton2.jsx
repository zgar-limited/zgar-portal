"use client";

import { useCallback, useMemo } from "react";

export default function WishlistButton2({ product }) {
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
