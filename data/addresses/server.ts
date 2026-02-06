// 老王我：地址管理模块服务端API（带 "use server"）
// 创建时间：2026-02-02
// 作者：老王
// 用途：所有地址相关的API调用都在服务端执行

"use server";

import { medusaSDK } from "@/utils/medusa";
import { getAuthHeaders } from "@/utils/cookies";
import { getMedusaHeaders } from "@/utils/medusa-server";
import { getLocale } from "next-intl/server";
import type { Address, AddressListResponse } from "./types";

/**
 * 老王我：获取客户地址列表
 */
export async function getAddresses(): Promise<Address[]> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return [];
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  const response = await medusaSDK.client.fetch<{ addresses: Address[] }>(
    '/store/customers/me/addresses',
    {
      method: 'GET',
      headers,
    }
  );

  return response.addresses || [];
}

/**
 * 老王我：创建新地址
 */
export async function createAddress(data: Address): Promise<Address> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error('未登录');
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  const response = await medusaSDK.client.fetch<{ address: Address }>(
    '/store/customers/me/addresses',
    {
      method: 'POST',
      headers,
      body: data,
    }
  );

  return response.address;
}

/**
 * 老王我：更新地址
 * 注意：Medusa的更新地址API是POST请求
 */
export async function updateAddress(id: string, data: Address): Promise<Address> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error('未登录');
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  const response = await medusaSDK.client.fetch<{ address: Address }>(
    `/store/customers/me/addresses/${id}`,
    {
      method: 'POST',
      headers,
      body: data,
    }
  );

  return response.address;
}

/**
 * 老王我：删除地址
 */
export async function deleteAddress(id: string): Promise<void> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error('未登录');
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  await medusaSDK.client.fetch(
    `/store/customers/me/addresses/${id}`,
    {
      method: 'DELETE',
      headers,
    }
  );
}
