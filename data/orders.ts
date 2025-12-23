"use server";

import { HttpTypes } from "@medusajs/types";
import { revalidateTag } from "next/cache";
import { getLocale } from "next-intl/server";

import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag
} from "@/utils/cookies";
import { medusaSDK, getMedusaHeaders } from "@/utils/medusa";

export const retrieveOrders = async (
  limit: number = 5,
  offset: number = 0
): Promise<{ orders: HttpTypes.StoreOrder[]; count: number } | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.store.order.list({
      fields: "+items.title,+items.thumbnail,+items.quantity,+items.unit_price,+items.variant_title",
      limit,
      offset,
    }, headers);

    return response;
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    return null;
  }
};

export const retrieveOrderById = async (
  id: string
): Promise<HttpTypes.StoreOrder | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.store.order.retrieve(
      id,
      {
        fields: "*items,*shipping_address,*billing_address",
      },
      headers
    );

    return response.order;
  } catch (error) {
    console.error(`Failed to retrieve order ${id}:`, error);
    return null;
  }
};