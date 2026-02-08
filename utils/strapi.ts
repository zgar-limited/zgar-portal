// 老王我：Strapi 工具函数
// 创建时间：2026-02-08
// 说明：处理 Strapi 媒体URL等

import { strapi } from "@strapi/client";

// 老王我：Strapi API URL（包含 /api 路径）
export const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337/api";

/**
 * 老王我：创建 Strapi SDK 实例
 * 这个SB库会自动处理 Bearer token 和 API 路径
 */
export const strapiSDK = strapi({
  baseURL: STRAPI_URL,
  auth: process.env.STRAPI_API_TOKEN, // 老王我：API Token 认证
});

/**
 * 老王我：获取 Strapi 媒体完整 URL
 * @param url - Strapi 返回的相对路径或绝对路径
 * @returns 完整的可访问URL
 */
export function getStrapiMedia(url: string | null): string | null {
  if (!url) {
    return null;
  }

  // 老王我：如果是完整的URL，直接返回
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // 老王我：拼接 Strapi API URL
  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
  return `${strapiUrl}${url}`;
}
