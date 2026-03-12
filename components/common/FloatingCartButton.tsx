"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface FloatingCartButtonProps {
  onClick?: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 md:bottom-28 md:right-8 cursor-pointer"
      style={{ zIndex: 9999, width: 80, height: 80, background: "transparent", border: "none", padding: 0 }}
      aria-label="批量添加商品到购物车"
    >
      <DotLottieReact
        src="/lottie/add-to-cart.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </button>
  );
};

export default FloatingCartButton;
