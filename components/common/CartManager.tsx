"use client";

import { useEffect } from "react";
import { medusaSDK } from "@/utils/medusa";
import { useRouter } from "next/navigation";

export default function CartManager() {
  const router = useRouter();

  useEffect(() => {
    const manageCart = async () => {
      const cartId = localStorage.getItem("cart_id");

      try {
        const { cart } = await medusaSDK.store.cart.create({
          // sales_channel_id: "sc_01K9KAK0MDCMSWCXRV0WH70EQK",
          region_id: process.env.REGION_ID,
          currency_code: "usd",
        });

        localStorage.setItem("cart_id", cart.id);
        router.refresh();
      } catch (error) {
        console.error("Error creating cart:", error);
      }
    };

    manageCart();
  }, [router]);

  return null;
}
