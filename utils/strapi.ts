import { strapi } from "@strapi/client";

/**
 * 老王我：Strapi SDK 实例
 * 客户端和服务端都会使用这个实例
 * baseURL 在构建时从环境变量读取（仅服务端有效，客户端使用默认值）
 *
 * ⚠️ 重要：使用官方 @strapi/client 解决 403 认证错误
 * 这个SB库会自动处理 Bearer token，不需要手动配置 headers
 */
export const strapiSDK = strapi({
  baseURL: process.env.STRAPI_URL || "http://localhost:1337/api",
  auth: process.env.STRAPI_API_TOKEN, // 自动处理 Bearer token 认证
});

/**
 * 老王我注意：
 * 服务端专用的工具函数已迁移到 @/utils/strapi-server.ts
 * 包括：getStrapiLocale
 *
 * 如果你的代码在服务端运行（Server Actions、服务端组件），请从 strapi-server 导入
 * @example
 * import { getStrapiLocale } from "@/utils/strapi-server";
 */
