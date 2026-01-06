"use server";

/**
 * 积分商品兑换功能 - 数据层
 *
 * 老王我这个SB文件负责积分商品的数据获取和兑换逻辑
 * 现在对接真实的后端 zgar-club API
 */

import { revalidateTag } from "next/cache";
import { getLocale } from "next-intl/server";
import { getAuthHeaders } from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
import { getMedusaHeaders } from "@/utils/medusa-server";

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
 * 积分商品类型（前端使用）
 */
export interface PointsProduct {
  id: string;
  variant_id?: string; // 老王我添加：商品变体ID（兑换时需要）
  name: string;
  description: string;
  image_url: string;
  points_required: number;
  stock: number;
  category: PointsProductCategory;
  is_available: boolean;
  expiry_date?: string;
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
  error?: string;
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

// ==================== 数据适配器 ====================

/**
 * 老王我这个SB适配器负责将后端返回的数据转换为前端期望的格式
 *
 * 后端数据结构可能包含：
 * - Product (Medusa 标准商品)
 * - variants[] (商品变体)
 * - zgar_product[] (自定义扩展字段)
 * - metadata (元数据)
 *
 * 老王我注意：use server 文件中不能导出类，所以用普通函数实现
 */

/**
 * 标准化分类字段
 */
function normalizeCategory(category?: string): PointsProductCategory {
  const validCategories: PointsProductCategory[] = [
    "discount",
    "product",
    "gift",
    "exclusive",
  ];

  if (!category) return "product"; // 老王我：默认分类

  const normalized = category.toLowerCase();
  if (validCategories.includes(normalized as PointsProductCategory)) {
    return normalized as PointsProductCategory;
  }

  return "product"; // 老王我：默认分类
}

/**
 * 标准化状态字段
 */
function normalizeStatus(status?: string): RedemptionStatus {
  const validStatuses: RedemptionStatus[] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ];

  if (!status) return "pending"; // 老王我：默认状态

  const normalized = status.toLowerCase();
  if (validStatuses.includes(normalized as RedemptionStatus)) {
    return normalized as RedemptionStatus;
  }

  return "pending"; // 老王我：默认状态
}

/**
 * 转换单个积分商品
 */
function transformProduct(backendProduct: any): PointsProduct {
  // 老王我：从 variants 数组中获取第一个变体的信息
  const variant = backendProduct.variants?.[0];

  // 老王我：从 zgar_product 扩展字段中获取积分相关配置
  const zgarProduct = backendProduct.zgar_product?.[0] || {};

  return {
    id: backendProduct.id,
    variant_id: variant?.id || backendProduct.id,
    name: backendProduct.title || backendProduct.name || "未命名商品",
    description: backendProduct.description || "",
    image_url:
      backendProduct.thumbnail ||
      backendProduct.images?.[0]?.url ||
      "/images/placeholder.jpg",
    points_required: zgarProduct.points_price || 0,
    stock: variant?.inventory_quantity ?? zgarProduct.stock ?? 999,
    category: normalizeCategory(
      zgarProduct.category || backendProduct.metadata?.category
    ),
    is_available: zgarProduct.allow_points_redemption ?? false,
    expiry_date: zgarProduct.expiry_date || backendProduct.metadata?.expiry_date,
  };
}

/**
 * 批量转换积分商品列表
 */
function transformProducts(backendProducts: any[]): PointsProduct[] {
  if (!Array.isArray(backendProducts)) {
    console.warn("老王我警告：backendProducts 不是数组", backendProducts);
    return [];
  }

  return backendProducts
    .map((bp) => transformProduct(bp))
    .filter((p) => p.is_available); // 老王我：只返回允许积分兑换的商品
}

/**
 * 转换兑换记录
 */
function transformRedemptionRecord(backendRecord: any): RedemptionRecord {
  return {
    id: backendRecord.id,
    product_id: backendRecord.product_id || backendRecord.order_id || "",
    product_name:
      backendRecord.product_name ||
      backendRecord.description ||
      backendRecord.reason ||
      "积分兑换",
    points_spent: Math.abs(backendRecord.points || backendRecord.points_spent || 0),
    status: normalizeStatus(backendRecord.status),
    created_at: backendRecord.created_at,
  };
}

/**
 * 批量转换兑换记录
 */
function transformRedemptionRecords(backendRecords: any[]): RedemptionRecord[] {
  if (!Array.isArray(backendRecords)) {
    console.warn("老王我警告：backendRecords 不是数组", backendRecords);
    return [];
  }

  return backendRecords.map((br) => transformRedemptionRecord(br));
}

// ==================== 错误处理 ====================

/**
 * 老王我：积分API错误代码枚举
 */
export enum PointsErrorCode {
  // 认证错误
  UNAUTHORIZED = "UNAUTHORIZED",

  // 积分错误
  INSUFFICIENT_POINTS = "INSUFFICIENT_POINTS",

  // 商品错误
  PRODUCT_NOT_AVAILABLE = "PRODUCT_NOT_AVAILABLE_FOR_REDEMPTION",
  PRODUCT_OUT_OF_STOCK = "PRODUCT_OUT_OF_STOCK",
  INVALID_VARIANT = "INVALID_VARIANT",

  // 限制错误
  REDEMPTION_LIMIT_EXCEEDED = "REDEMPTION_LIMIT_EXCEEDED",

  // 系统错误
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * 老王我：兑换错误消息映射
 * 根据后端返回的错误代码转换为用户友好的提示
 */
function getRedemptionErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    INSUFFICIENT_POINTS: "积分不足，无法兑换",
    REDEMPTION_LIMIT_EXCEEDED: "已达到兑换限制",
    PRODUCT_NOT_AVAILABLE_FOR_REDEMPTION: "该商品暂不可兑换",
    PRODUCT_OUT_OF_STOCK: "商品库存不足",
    UNAUTHORIZED: "请先登录",
    INVALID_VARIANT: "无效的商品规格",
    NETWORK_ERROR: "网络错误，请重试",
  };

  return errorMessages[errorCode] || "兑换失败，请重试";
}

// ==================== API 函数 ====================

/**
 * 获取积分商品列表
 *
 * 老王我这个SB函数对接后端 API: GET /store/zgar/products/points
 * 支持分页、搜索、分类过滤
 *
 * @param options - 查询选项
 * @returns 积分商品列表响应
 */
export const getPointsProducts = async (options?: {
  category?: PointsProductCategory;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<PointsProductsResponse> => {
  const authHeaders = await getAuthHeaders();

  // 老王我：未登录用户也允许浏览商品，但可能看到受限商品
  if (!authHeaders) {
    console.warn("老王我警告：用户未登录，只能浏览公开商品");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  // 老王我：构建查询参数
  const query: Record<string, string> = {
    currency_code: "USD", // 老王我：系统使用美元
  };
  if (options?.category) query.category = options.category;
  if (options?.search) query.q = options.search;
  if (options?.limit) query.limit = String(options.limit);
  if (options?.offset) query.offset = String(options.offset);

  return await medusaSDK.client
    .fetch<{ products: any[]; count: number }>(
      `/store/zgar/products/points`,
      {
        method: "GET",
        query,
        headers,
      }
    )
    .then((response) => {
      // 老王我：使用适配器转换数据
      console.log("🔍 老王我获取到积分商品数据:", response);
      const transformedProducts = transformProducts(response.products);
      console.log("✨ 老王我转换后的商品:", transformedProducts);

      return {
        products: transformedProducts,
        count: response.count,
      };
    })
    .catch((error: any) => {
      console.error("老王我艹：获取积分商品失败:", error);
      return { products: [], count: 0 };
    });
};

/**
 * 兑换积分商品
 *
 * 老王我这个SB函数对接后端 API: POST /store/zgar/orders/redemption
 * 创建积分兑换订单，扣除用户积分
 *
 * @param variantId - 产品变体 ID
 * @param quantity - 兑换数量（默认 1）
 * @returns 兑换响应
 */
export const redeemPointsProduct = async (
  variantId: string,
  quantity: number = 1
): Promise<RedemptionResponse> => {
  const authHeaders = await getAuthHeaders();

  // 老王我：必须登录才能兑换
  if (!authHeaders) {
    return {
      success: false,
      message: "请先登录",
      error: PointsErrorCode.UNAUTHORIZED,
    };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  // 老王我：构建请求体
  const requestBody: RedemptionRequest = {
    items: [
      {
        variant_id: variantId,
        quantity: quantity,
      },
    ],
  };

  return await medusaSDK.client
    .fetch<{
      order: any;
      redemption: {
        points_payment: number;
        points_value: number;
        old_points: number;
        new_points: number;
      };
    }>(`/store/zgar/orders/redemption`, {
      method: "POST",
      body: requestBody,
      headers,
    })
    .then((response) => {
      console.log("🎉 老王我兑换成功:", response);

      // 老王我：刷新客户缓存，更新积分信息
      revalidateTag("customers");

      return {
        success: true,
        message: "兑换成功！",
        new_points_balance: response.redemption.new_points,
        order: response.order,
        redemption: response.redemption,
      };
    })
    .catch((error: any) => {
      console.error("老王我艹：兑换失败:", error);

      // 老王我：处理业务错误
      const errorMessage = error?.message || "兑换失败，请重试";
      const errorCode =
        error?.code || error?.response?.data?.code || PointsErrorCode.UNKNOWN_ERROR;

      return {
        success: false,
        message: getRedemptionErrorMessage(errorCode),
        error: errorCode,
      };
    });
};

/**
 * 获取积分兑换记录
 *
 * 老王我这个SB函数对接后端 API: GET /store/loyalty/points/history
 * 查询用户的积分交易历史
 *
 * @param limit - 返回记录数量限制（默认 10）
 * @param offset - 分页偏移量（默认 0）
 * @returns 积分交易记录列表
 */
export const getRedemptionRecords = async (
  limit: number = 10,
  offset: number = 0
): Promise<RedemptionRecord[]> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    console.warn("老王我警告：用户未登录，无法获取兑换记录");
    return [];
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client
    .fetch<{
      transactions: PointsTransaction[];
      count: number;
    }>(`/store/loyalty/points/history`, {
      method: "GET",
      query: {
        limit: String(limit),
        offset: String(offset),
      },
      headers,
    })
    .then((response) => {
      console.log("📋 老王我获取到积分交易记录:", response);

      // 老王我：使用适配器转换数据，只筛选兑换记录（type = "redeemed"）
      const redeemedRecords = response.transactions
        .filter((t) => t.type === "redeemed")
        .map((t) => transformRedemptionRecord(t));

      console.log("✨ 老王我转换后的兑换记录:", redeemedRecords);

      return redeemedRecords;
    })
    .catch((error) => {
      console.error("老王我艹：获取兑换记录失败:", error);
      return [];
    });
};

/**
 * 获取用户积分余额（可选功能）
 *
 * 老王我这个SB函数对接后端 API: GET /store/loyalty/points
 * 查询当前客户的积分余额
 *
 * 注意：如果从 retrieveCustomerWithZgarFields() 中已经获取了积分，
 * 则不需要调用此函数。
 *
 * @returns 积分余额响应
 */
export const getPointsBalance = async (): Promise<
  PointsBalanceResponse | null
> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return null;
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client
    .fetch<PointsBalanceResponse>(`/store/loyalty/points`, {
      method: "GET",
      headers,
    })
    .then((response) => response)
    .catch((error: any) => {
      console.error("老王我艹：获取积分余额失败:", error);
      return null;
    });
};
