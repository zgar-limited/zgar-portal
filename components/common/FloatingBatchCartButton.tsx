"use client";

import React, { useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import FloatingCartButton from "./FloatingCartButton";

interface FloatingBatchCartButtonProps {
  // 保留 props 以兼容现有调用，但不再需要
  cart?: any;
  products?: any;
}

const FloatingBatchCartButton: React.FC<FloatingBatchCartButtonProps> = () => {
  const router = useRouter();

  // 点击跳转到购物车页面并自动打开批量添加弹框
  const handleClick = useCallback(() => {
    router.push("/view-cart?batch=add");
  }, [router]);

  return <FloatingCartButton onClick={handleClick} />;
};

export default FloatingBatchCartButton;
