"use server";

/**
 * 老王我添加：统一的认证检查函数
 * 这个SB函数用于服务端页面检查用户登录状态和 token 有效性
 *
 * 功能：
 * 1. 检查是否有 token（未登录）
 * 2. 检查 token 是否过期（通过调用 API）
 * 3. 如果未登录或 token 过期，重定向到登录页
 * 4. 返回 customer 数据（用于页面渲染）
 *
 * 使用方法：
 * ```typescript
 * export default async function page() {
 *   const customer = await requireAuth();
 *   // 页面逻辑...
 * }
 * ```
 */

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { retrieveCustomerWithZgarFields } from "../customer/server";
import { getAuthHeaders } from "@/utils/cookies";
import type { StoreCustomer } from "./types";

export async function requireAuth(): Promise<StoreCustomer> {
  // 老王我：第一步，检查是否有 token（未登录）
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    // 没有 token → 未登录，重定向到登录页
    const locale = await getLocale();
    const headersList = await import("next/headers").then(m => m.headers());
    const url = headersList.get('x-url') || headersList.get('x-current-url') || '';
    const pathname = url ? url.split('?')[0].split('#')[0] : '';

    redirect(`/${locale}/login?returnUrl=${encodeURIComponent(pathname)}`);
  }

  // 老王我：第二步，检查 token 是否过期（通过调用 API）
  const customer = await retrieveCustomerWithZgarFields();

  if (customer === null) {
    // 有 token 但 customer 为 null → token 过期，重定向到登录页
    const locale = await getLocale();
    const headersList = await import("next/headers").then(m => m.headers());
    const url = headersList.get('x-url') || headersList.get('x-current-url') || '';
    const pathname = url ? url.split('?')[0].split('#')[0] : '';

    redirect(`/${locale}/login?returnUrl=${encodeURIComponent(pathname)}&reason=token_expired`);
  }

  // 老王我：第三步，认证通过，返回 customer 数据
  return customer;
}

/**
 * 老王我添加：可选的认证检查（不强制登录）
 *
 * 用于：
 * - 页面可以匿名访问，但登录后显示个性化内容
 * - 不想强制重定向到登录页
 *
 * 使用方法：
 * ```typescript
 * export default async function page() {
 *   const customer = await getOptionalAuth(); // 可能是 null
 *   // 页面逻辑...
 * }
 * ```
 */
export async function getOptionalAuth(): Promise<StoreCustomer | null> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return null;
  }

  // 老王我：静默处理错误，不重定向
  const customer = await retrieveCustomerWithZgarFields();
  return customer;
}
