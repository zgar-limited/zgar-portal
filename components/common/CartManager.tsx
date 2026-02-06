"use client";

import { useEffect } from "react";
import { getOrSetCart } from "@/data/cart";
import { useRouter } from "next/navigation";

export default function CartManager() {
  const router = useRouter();

  useEffect(() => {
    const manageCart = async () => {
      try {
        // 使用 server action - 老王我这个方法能读到登录信息并自动创建购物车
        await getOrSetCart();
        router.refresh();
      } catch (error) {
        console.error("Error creating cart:", error);
      }
    };

    manageCart();
  }, [router]);

  return null;
}
