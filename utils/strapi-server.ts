import "server-only";

/**
 * 老王我添加：服务端专用的 Strapi 工具函数
 * 这个SB文件标记为 server-only，编译时会检测客户端误用
 * 如果客户端代码尝试导入这个文件，构建时会直接报错
 */

/**
 * 老王我：next-intl locale 到 Strapi locale 的映射表
 * 将前端的 en-us/zh-hk 映射到 Strapi 的 en/zh
 */
const LOCALE_MAP: Record<string, string> = {
  "en-us": "en",
  "zh-hk": "zh",
};

/**
 * 老王我：获取 Strapi locale
 * @param locale - next-intl locale (如 'en-us', 'zh-hk')
 * @returns Strapi locale (如 'en', 'zh')
 *
 * @example
 * const strapiLocale = getStrapiLocale("en-us"); // 返回 "en"
 */
export function getStrapiLocale(locale: string): string {
  return LOCALE_MAP[locale] || locale;
}

/**
 * 老王我：获取服务端专用的 Strapi URL
 * 这个SB函数确保只在服务端读取环境变量
 * 只能在 "use server" 函数或服务端组件中调用
 */
export function getServerStrapiUrl(): string {
  return process.env.STRAPI_URL || "http://localhost:1337";
}
