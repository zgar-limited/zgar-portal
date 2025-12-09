"use client";

import { useCallback, useMemo } from "react";

export default function CompareButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  // Mock functions
  const addToCompareItem = () => {};
  const isAddedtoCompareItem = () => false;

  const isCompared = useMemo(
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
      href="#compare"
      data-bs-toggle="offcanvas"
      className={`${parentClass} tooltip-${tooltipDirection}`}
      onClick={handleClick}
    >
      <span className="icon icon-compare" />
      <span className="tooltip">{isCompared ? "Compared" : "Compare"}</span>
    </a>
  );
}
