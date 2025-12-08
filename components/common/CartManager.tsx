"use client";

import { useEffect } from "react";
import { medusaSDK } from "@/utils/medusa";
import { useRouter } from "next/navigation";

export default function CartManager() {
  const router = useRouter();

  useEffect(() => {
    const manageCart = async () => {
      const cartId = localStorage.getItem("cart_id");

      if (cartId) {
        // Sync with cookie if needed (simple check, could be more robust)
        if (!document.cookie.includes(`cart_id=${cartId}`)) {
          document.cookie = `cart_id=${cartId}; path=/; max-age=31536000`; // 1 year
          router.refresh();
        }
      } else {
        // Create new cart
        try {
          const { cart } = await medusaSDK.store.cart.create({
            sales_channel_id: "sc_01K9KAK0MDCMSWCXRV0WH70EQK",
            region_id: "reg_01K9M1A9NHMN4MXBACKAS5F4V1",
            currency_code: "usd",
          });

          localStorage.setItem("cart_id", cart.id);
          router.refresh();
        } catch (error) {
          console.error("Error creating cart:", error);
        }
      }
    };

    manageCart();
  }, [router]);

  return null;
}
