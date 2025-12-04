import { cookies } from "next/headers";
import { medusaSDK } from "@/utils/medusa";
import { StoreCartResponse } from "@medusajs/types";

export async function getCartId() {
  const cookieStore = await cookies();
  return cookieStore.get("cart_id")?.value;
}

export async function getCart() {
  const cartId = await getCartId();
  if (!cartId) return null;

  try {
    const { cart } = await medusaSDK.client.fetch<StoreCartResponse>(
      `/store/carts/${cartId}`,
      {
        method: "GET",
        query: {
          fields:
            "*items,*items.variant_option_values,*items.variant,*items.variant.options",
        },
        cache: "no-cache",
        next: {
          tags: ["cart"],
        },
      }
    );
    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}