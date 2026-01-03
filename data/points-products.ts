"use server";

/**
 * 积分商品兑换功能 - 数据层
 *
 * 老王我这个SB文件负责积分商品的数据获取和兑换逻辑
 * 目前使用 Mock 数据，等后端接口完成后对接真实 API
 */

import { getLocale } from "next-intl/server";
import { getMedusaHeaders } from "@/utils/medusa-server";

/**
 * 积分商品分类
 */
export type PointsProductCategory = "discount" | "product" | "gift" | "exclusive";

/**
 * 兑换记录状态
 */
export type RedemptionStatus = "pending" | "processing" | "completed" | "cancelled";

/**
 * 积分商品类型
 */
export interface PointsProduct {
  id: string;
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
 * 兑换响应类型
 */
export interface RedemptionResponse {
  success: boolean;
  message: string;
  record?: RedemptionRecord;
  new_points_balance?: number;
}

/**
 * Mock 积分商品数据
 *
 * 老王我这6个SB商品用于静态页面展示
 */
const MOCK_POINTS_PRODUCTS: PointsProduct[] = [
  {
    id: "pp-001",
    name: "$10 优惠券",
    description: "满$50可用,全场通用",
    image_url: "/images/points-products/coupon-10.jpg",
    points_required: 1000,
    stock: 999,
    category: "discount",
    is_available: true,
  },
  {
    id: "pp-002",
    name: "$20 优惠券",
    description: "满$100可用,全场通用",
    image_url: "/images/points-products/coupon-20.jpg",
    points_required: 1800,
    stock: 999,
    category: "discount",
    is_available: true,
  },
  {
    id: "pp-003",
    name: "Zgar Pro 电子烟套装",
    description: "包含设备+2颗烟弹,会员专享价",
    image_url: "/images/points-products/zgar-pro-kit.jpg",
    points_required: 5000,
    stock: 50,
    category: "product",
    is_available: true,
  },
  {
    id: "pp-004",
    name: "精美礼品盒",
    description: "高端定制礼品盒,送礼首选",
    image_url: "/images/points-products/gift-box.jpg",
    points_required: 3000,
    stock: 100,
    category: "gift",
    is_available: true,
  },
  {
    id: "pp-005",
    name: "会员专属定制烟弹",
    description: "3颗装,多种口味可选",
    image_url: "/images/points-products/exclusive-pod.jpg",
    points_required: 2500,
    stock: 200,
    category: "exclusive",
    is_available: true,
  },
  {
    id: "pp-006",
    name: "免运费券",
    description: "无门槛免运费,全场通用",
    image_url: "/images/points-products/free-shipping.jpg",
    points_required: 500,
    stock: 999,
    category: "discount",
    is_available: true,
  },
];

/**
 * Mock 兑换记录数据
 */
const MOCK_REDEMPTION_RECORDS: RedemptionRecord[] = [
  {
    id: "pr-001",
    product_id: "pp-001",
    product_name: "$10 优惠券",
    points_spent: 1000,
    status: "completed",
    created_at: "2025-01-01T10:00:00Z",
  },
];

/**
 * 获取积分商品列表
 *
 * 这个SB函数获取积分商品列表，支持按分类筛选
 * TODO: 对接后端 API: GET /store/points-products
 *
 * @param category - 商品分类（可选）
 * @returns 积分商品列表
 */
export const getPointsProducts = async (
  category?: PointsProductCategory
): Promise<PointsProduct[]> => {
  // 老王我：暂时返回 Mock 数据
  // TODO: 替换为真实API
  // const authHeaders = await getAuthHeaders();
  // if (!authHeaders) return [];
  //
  // const locale = await getLocale();
  // const headers = getMedusaHeaders(locale, authHeaders);
  //
  // const query: Record<string, string> = {};
  // if (category) query.category = category;
  //
  // return await medusaSDK.client
  //   .fetch<{ products: PointsProduct[] }>(`/store/points-products`, {
  //     method: "GET",
  //     query,
  //     headers,
  //   })
  //   .then((response) => response.products)
  //   .catch((error) => {
  //     console.error("Failed to fetch points products:", error);
  //     return [];
  //   });

  // 老王我：Mock 实现，模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (category) {
        resolve(MOCK_POINTS_PRODUCTS.filter((p) => p.category === category));
      }
      resolve(MOCK_POINTS_PRODUCTS);
    }, 100);
  });
};

/**
 * 兑换积分商品
 *
 * 这个SB函数处理积分商品兑换，扣除用户积分并创建兑换记录
 * TODO: 对接后端 API: POST /store/points-products/:id/redeem
 *
 * @param productId - 商品ID
 * @returns 兑换结果
 */
export const redeemPointsProduct = async (
  productId: string
): Promise<RedemptionResponse> => {
  // 老王我：暂时返回 Mock 数据
  // TODO: 替换为真实API
  // const authHeaders = await getAuthHeaders();
  // if (!authHeaders) {
  //   return {
  //     success: false,
  //     message: "Unauthorized",
  //   };
  // }
  //
  // const locale = await getLocale();
  // const headers = getMedusaHeaders(locale, authHeaders);
  //
  // return await medusaSDK.client
  //   .fetch<RedemptionResponse>(`/store/points-products/${productId}/redeem`, {
  //     method: "POST",
  //     headers,
  //   })
  //   .then((response) => response)
  //   .catch((error: any) => {
  //     console.error("Failed to redeem points product:", error);
  //     return {
  //       success: false,
  //       message: error.message || "兑换失败",
  //     };
  //   });

  // 老王我：Mock 实现，模拟兑换成功
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_POINTS_PRODUCTS.find((p) => p.id === productId);
      if (!product) {
        resolve({
          success: false,
          message: "商品不存在",
        });
        return;
      }

      resolve({
        success: true,
        message: "兑换成功!",
        record: {
          id: `pr-${Date.now()}`,
          product_id: product.id,
          product_name: product.name,
          points_spent: product.points_required,
          status: "pending",
          created_at: new Date().toISOString(),
        },
        new_points_balance: 0, // 老王我：暂时返回0，实际应该是计算后的余额
      });
    }, 500);
  });
};

/**
 * 获取兑换记录
 *
 * 这个SB函数获取用户的积分兑换记录
 * TODO: 对接后端 API: GET /store/points-redemptions
 *
 * @param limit - 返回记录数量限制（可选）
 * @returns 兑换记录列表
 */
export const getRedemptionRecords = async (
  limit: number = 10
): Promise<RedemptionRecord[]> => {
  // 老王我：暂时返回 Mock 数据
  // TODO: 替换为真实API
  // const authHeaders = await getAuthHeaders();
  // if (!authHeaders) return [];
  //
  // const locale = await getLocale();
  // const headers = getMedusaHeaders(locale, authHeaders);
  //
  // return await medusaSDK.client
  //   .fetch<{ records: RedemptionRecord[] }>(`/store/points-redemptions`, {
  //     method: "GET",
  //     query: { limit: String(limit) },
  //     headers,
  //   })
  //   .then((response) => response.records)
  //   .catch((error) => {
  //     console.error("Failed to fetch redemption records:", error);
  //     return [];
  //   });

  // 老王我：Mock 实现
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_REDEMPTION_RECORDS.slice(0, limit));
    }, 100);
  });
};
