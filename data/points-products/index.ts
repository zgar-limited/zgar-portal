// 老王我：积分商品模块统一导出
// 创建时间：2026-02-02
// 作者：老王
//
// 艹，Turbopack 这个憨批不支持 "use server" 文件的 export *
// 必须显式导出所有内容，不然构建时报错说"没有导出"
//
// 另外，"use server" 文件里只能导出异步函数，不能导出类型/枚举！

// Server Actions - 显式导出（Turbopack 要求）
export {
  getPointsProducts,
  redeemPointsProduct,
  getRedemptionRecords,
  getPointsBalance,
} from "./server";

// 类型和枚举导出（从 types.ts 导出，因为 server.ts 是 "use server" 文件）
export type {
  PointsProduct,
  PointsProductCategory,
  PointsProductVariant,
  PointsProductsResponse,
  PointsBalanceResponse,
  PointsTransaction,
  RedemptionRecord,
  RedemptionRequest,
  RedemptionResponse,
  RedemptionStatus,
} from "./types";

export { PointsErrorCode } from "./types";
