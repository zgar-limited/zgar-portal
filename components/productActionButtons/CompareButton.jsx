"use client";

import { useContextElement } from "@/context/Context";
import { useCallback, useMemo } from "react";

export default function CompareButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  const { addToCompareItem, isAddedtoCompareItem } = useContextElement();

  const isCompared = useMemo(
    () => isAddedtoCompareItem(product),
    [isAddedtoCompareItem, product]
  );

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (!isCompared) addToCompareItem(product);
    },
    [addToCompareItem, product, isCompared]
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
