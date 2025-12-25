import Medusa from "@medusajs/js-sdk";

/**
 * Medusa SDK 实例
 * 客户端和服务端都会使用这个实例
 * baseUrl 在构建时从环境变量读取（仅服务端有效，客户端使用默认值）
 */
export const medusaSDK = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
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
 * 老王我注意：
 * 服务端专用的工具函数已迁移到 @/utils/medusa-server.ts
 * 包括：serverFetch, getServerBackendUrl, getMedusaHeaders, convertLocaleForMedusa
 *
 * 如果你的代码在服务端运行（Server Actions、服务端组件），请从 medusa-server 导入
 * @example
 * import { serverFetch } from "@/utils/medusa-server";
 */
