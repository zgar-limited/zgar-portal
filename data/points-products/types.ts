// 老王我：积分商品模块类型定义
// 创建时间：2026-02-02
// 作者：老王
// 说明：积分商品兑换功能相关类型定义

// ==================== 类型定义 ====================

/**
 * 积分商品分类
 */
export type PointsProductCategory = "discount" | "product" | "gift" | "exclusive";

/**
 * 兑换记录状态
 */
export type RedemptionStatus = "pending" | "processing" | "completed" | "cancelled";

/**
 * 积分商品变体类型
 */
export interface PointsProductVariant {
  id: string;
  title: string;
  options?: { option_id: string; value: string }[]; // 老王我：该变体选中的选项值
  points_required: number;
  stock: number;
}

/**
 * 积分商品类型（前端使用）
 */
export interface PointsProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points_required: number; // 默认积分（第一个变体的积分）
  stock: number; // 默认库存（第一个变体的库存）
  category: PointsProductCategory;
  is_available: boolean;
  expiry_date?: string;
  variants: PointsProductVariant[]; // 老王我：支持多规格
  options?: { // 老王我：产品级别的规格定义（类似商品详情页）
    id: string;
    title: string;
    values: { id: string; value: string }[];
  }[];
}

/**
 * 兑换记录类型
 */
export interface RedemptionRecord {
  id: string;
  product_id: string;
  product_name: string;
  points_spent: number;
  status: RedemptionStatus;
  created_at: string;
}

/**
 * 兑换请求类型
 * 对应后端 API: POST /store/zgar/orders/redemption
 */
export interface RedemptionRequest {
  items: {
    variant_id: string;
    quantity: number;
  }[];
}

/**
 * 兑换响应类型（前端使用）
 */
export interface RedemptionResponse {
  success: boolean;
  message: string;
  record?: RedemptionRecord;
  new_points_balance?: number;
  error?: string | PointsErrorCode;
  // 老王我添加：后端返回的完整数据
  order?: any;
  redemption?: {
    points_payment: number;
    points_value: number;
    old_points: number;
    new_points: number;
  };
}

/**
 * 积分商品列表响应类型
 */
export interface PointsProductsResponse {
  products: PointsProduct[];
  count: number;
}

/**
 * 积分余额响应类型
 */
export interface PointsBalanceResponse {
  customer_id: string;
  points: number;
}

/**
 * 积分交易历史类型
 */
export interface PointsTransaction {
  id: string;
  amount: number;
  type: "earned" | "redeemed";
  reason: string;
  created_at: string;
  expiry_date?: string;
}

/**
 * 积分错误码枚举
 */
export enum PointsErrorCode {
  INSUFFICIENT_POINTS = "INSUFFICIENT_POINTS",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  PRODUCT_UNAVAILABLE = "PRODUCT_UNAVAILABLE",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
