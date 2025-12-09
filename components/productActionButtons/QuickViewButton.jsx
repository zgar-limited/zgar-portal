"use client";

import { useCallback } from "react";

export default function QuickViewButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  // Mock functions
  const setQuickViewItem = () => {};

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      // Mock function - no action
    },
    []
  );

  return (
    <a
      href="#quickView"
      data-bs-toggle="modal"
      onClick={handleClick}
      className={`${parentClass} tooltip-${tooltipDirection}`}
    >
      <span className="icon icon-view" />
      <span className="tooltip">Quick view</span>
    </a>
  );
}
