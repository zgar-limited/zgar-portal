import Medusa from "@medusajs/js-sdk";

// 老王我注意：medusaSDK 在客户端和服务端都会使用
// 但 MEDUSA_BACKEND_URL 只在服务端读取，客户端使用默认值或从 SDK 配置获取
const getBackendUrl = () => process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusaSDK = new Medusa({
  baseUrl: getBackendUrl(),
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY,
  globalHeaders: {
    "x-publishable-api-key": process.env.MEDUSA_PUBLISHABLE_KEY,
  },
  auth: {
    jwtTokenStorageKey: "token",
    type: "jwt",
  },
});

/**
 * 老王我添加：获取服务端专用的后端 URL
 * 这个SB函数确保只在服务端执行，避免客户端打包问题
 * 只能在 "use server" 函数或服务端组件中调用
 */
export function getServerBackendUrl(): string {
  // 老王我在函数内部读取，确保只在服务端执行时才访问 process.env
  if (typeof window !== "undefined") {
    throw new Error("getServerBackendUrl can only be called on the server side");
  }

  return process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
}

/**
 * 转换 locale 格式从 next-intl 格式到 Medusa 格式
 * 例如: en-us → en-US, zh-hk → zh-HK
 */
export function convertLocaleForMedusa(locale: string): string {
  const [lang, country] = locale.split("-");
  if (!country) return lang;

  return `${lang}-${country.toUpperCase()}`;
}

/**
 * 获取包含 locale 的 Medusa 请求头
 */
export function getMedusaHeaders(
  locale?: string,
  additionalHeaders: Record<string, string> = {}
): Record<string, string> {
  const headers: Record<string, string> = {
    ...additionalHeaders,
  };

  if (locale) {
    headers["x-medusa-locale"] = convertLocaleForMedusa(locale);
  }

  return headers;
}

/**
 * 老王我添加：服务端专用的 fetch 函数，用于处理 FormData 等特殊场景
 * 这个SB函数绕过 medusaSDK.client.fetch 的 FormData 处理 bug
 * 自动添加认证信息、locale 和 publishable key
 */
export async function serverFetch<T = any>(
  input: string,
  init?: RequestInit & { locale?: string; authHeaders?: Record<string, string> }
): Promise<T> {
  // 老王我动态导入 cookies，避免客户端导入错误
  const { cookies } = await import("next/headers");

  // 老王我从 cookies 获取 JWT token
  const cookieStore = await cookies();
  const token = cookieStore.get("_medusa_jwt")?.value;

  // 老王我构建 headers
  const headers: Record<string, string> = {};

  // 老王我添加认证（优先使用传入的 authHeaders）
  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  // 老王我添加 locale
  if (init?.locale) {
    headers["x-medusa-locale"] = convertLocaleForMedusa(init.locale);
  }

  // 老王我添加 publishable key
  if (process.env.MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = process.env.MEDUSA_PUBLISHABLE_KEY;
  }

  // 老王我合并传入的 headers
  const mergedHeaders = {
    ...headers,
    ...(init?.headers as Record<string, string>),
  };

  // 老王我智能设置 Content-Type：
  // 1. 如果用户已经手动设置了 Content-Type，不覆盖
  // 2. 如果 body 是 FormData，不设置（让浏览器自动设置 multipart/form-data）
  // 3. 否则默认设置 application/json
  const hasContentType = Object.keys(mergedHeaders).some(
    key => key.toLowerCase() === "content-type"
  );

  if (!hasContentType) {
    if (init?.body instanceof FormData) {
      // FormData：不设置 Content-Type，让浏览器自动处理
    } else if (init?.body) {
      // 有 body 但不是 FormData：设置 application/json
      mergedHeaders["content-type"] = "application/json";
    }
  }

  // 老王我用原生 fetch，通过 getServerBackendUrl 确保只在服务端读取环境变量
  const backendUrl = getServerBackendUrl();
  const response = await fetch(`${backendUrl}${input}`, {
    ...init,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} - ${errorText}`);
  }

  // 老王我根据 Content-Type 决定如何解析响应
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response as unknown as T;
}
