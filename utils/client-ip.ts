/**
 * 客户端 IP 地址获取工具
 *
 * 提供客户端 IP 地址获取功能，用于防伪验证接口
 */

// ============================================
// 方案 A: 服务端获取（推荐）
// ============================================

/**
 * 从请求头中获取客户端真实 IP
 *
 * 这个函数应该在服务端调用（API Route 或 getServerSideProps）
 * 读取请求头中的 IP 地址
 *
 * @param requestHeaders - 请求头对象
 * @returns 客户端 IP 地址
 *
 * @example
 * ```ts
 * // 在 API Route 中使用
 * import { headers } from 'next/headers';
 *
 * export async function GET() {
 *   const headersList = headers();
 *   const ip = getClientIPFromHeaders(headersList);
 *   return Response.json({ ip });
 * }
 * ```
 */
export function getClientIPFromHeaders(
  requestHeaders: Headers
): string {
  // 尝试从各种可能的请求头中获取 IP
  const ipHeaders = [
    'x-forwarded-for',      // 代理/负载均衡器
    'x-real-ip',            // Nginx
    'cf-connecting-ip',     // Cloudflare
    'x-client-ip',          // 某些代理
    'true-client-ip',       // Akamai and Cloudflare
    'x-cluster-client-ip',  // 部署环境
  ];

  for (const header of ipHeaders) {
    const ip = requestHeaders.get(header);
    if (ip && ip !== 'unknown') {
      // x-forwarded-for 可能包含多个 IP，取第一个
      if (header === 'x-forwarded-for') {
        return ip.split(',')[0].trim();
      }
      return ip;
    }
  }

  // 如果都获取不到，返回默认值
  return '0.0.0.0';
}

// ============================================
// 方案 B: 客户端通过第三方 API 获取
// ============================================

/**
 * 通过第三方 API 获取客户端公网 IP
 *
 * 这个函数在客户端调用，但需要额外的网络请求
 * 可能存在跨域问题
 *
 * @returns Promise<string> 客户端公网 IP
 *
 * @example
 * ```ts
 * // 在客户端组件中使用
 * const ip = await getClientIPFromBrowser();
 * ```
 */
export async function getClientIPFromBrowser(): Promise<string> {
  try {
    // 方案 1: ipify（推荐，免费，无跨域限制）
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;

    // 方案 2: ipapi（备用，提供更多信息）
    // const response = await fetch('https://ipapi.co/json/');
    // const data = await response.json();
    // return data.ip;

    // 方案 3: ip-api（备用，但有限制）
    // const response = await fetch('http://ip-api.com/json/');
    // const data = await response.json();
    // return data.query;
  } catch (error) {
    console.error('[IP获取] 无法获取客户端IP:', error);
    return '0.0.0.0';
  }
}

// ============================================
// 统一接口（自动选择方案）
// ============================================

/**
 * 获取客户端 IP 地址（自动选择方案）
 *
 * 在服务端使用服务端方案，在客户端使用浏览器方案
 *
 * @returns Promise<string> 客户端 IP 地址
 */
export async function getClientIP(): Promise<string> {
  // 检查是否在服务端环境
  if (typeof window === 'undefined') {
    // 服务端：需要在调用处传入 requestHeaders
    // 这里返回默认值，实际使用时应该用 getClientIPFromHeaders
    return '0.0.0.0';
  }

  // 客户端：使用第三方 API
  return getClientIPFromBrowser();
}

// ============================================
// Next.js API Route 辅助函数
// ============================================

/**
 * Next.js API Route 获取客户端 IP 的辅助函数
 *
 * 创建一个 API Route 来暴露服务端获取的 IP
 *
 * 文件: app/api/client-ip/route.ts
 *
 * @example
 * ```ts
 * // app/api/client-ip/route.ts
 * import { headers } from 'next/headers';
 * import { NextResponse } from 'next/server';
 * import { getClientIPFromHeaders } from '@/utils/client-ip';
 *
 * export async function GET() {
 *   const headersList = headers();
 *   const ip = getClientIPFromHeaders(headersList);
 *   return NextResponse.json({ ip });
 * }
 *
 * // 在客户端调用
 * const response = await fetch('/api/client-ip');
 * const data = await response.json();
 * const ip = data.ip;
 * ```
 */
export function createClientIPAPIRoute() {
  // 这个函数只是文档说明，实际使用时请参考上面的示例创建 API Route
  console.warn(
    '[IP获取] 请参考文档创建 app/api/client-ip/route.ts 文件'
  );
}
