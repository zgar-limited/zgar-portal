"use client";

import { useContextElement } from "@/context/Context";
import { useCallback } from "react";

export default function QuickViewButton({
  tooltipDirection = "left",
  product,
  parentClass = "hover-tooltip box-icon",
}) {
  const { setQuickViewItem } = useContextElement();

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();

      setQuickViewItem(product); // For displaying full modal data
    },
    [product, setQuickViewItem]
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
