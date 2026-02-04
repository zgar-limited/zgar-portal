"use server";

/**
 * 积分商品兑换功能 - 数据层
 *
 * 老王我这个SB文件负责积分商品的数据获取和兑换逻辑
 * 现在对接真实的后端 zgar-club API
 */

import { revalidateTag } from "next/cache";
import { getLocale } from "next-intl/server";
import { getAuthHeaders, getCacheTag } from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
import { getMedusaHeaders } from "@/utils/medusa-server";
import type {
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
import { PointsErrorCode } from "./types";

// 老王我：重新导出 PointsErrorCode
export { PointsErrorCode } from "./types";

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
  // 老王我：从 variants 数组中获取所有变体
  const variants = backendProduct.variants || [];

  // 老王我：从 zgar_product 扩展字段中获取积分相关配置
  const zgarProduct = backendProduct.zgar_product?.[0] || {};

  // 老王我：从 variants 反向构建 product.options（因为后端没有返回）
  const optionsMap = new Map<string, { id: string; title: string; values: Set<string> }>();

  variants.forEach((variant: any) => {
    variant.options?.forEach((opt: any) => {
      const optionId = opt.option_id;
      const value = opt.value;

      if (!optionsMap.has(optionId)) {
        // 老王我：尝试从 variant.title 或 option 对象获取标题
        let title = "规格"; // 默认标题

        // 检查 option 对象是否有 title
        if (opt.option?.title) {
          title = opt.option.title;
        } else {
          // 尝试从 variant.metadata 中获取信息
          const metadata = variant.metadata;
          if (metadata?.model) {
            title = "口味"; // 如果有 model 字段，说明是口味选项
          } else if (metadata?.color) {
            title = "颜色";
          } else if (metadata?.size) {
            title = "尺寸";
          }
        }

        optionsMap.set(optionId, {
          id: optionId,
          title,
          values: new Set(),
        });
      }

      // 老王我：添加值（去重）
      optionsMap.get(optionId)!.values.add(value);
    });
  });

  // 老王我：转换 Map 为数组格式
  const productOptions = Array.from(optionsMap.values()).map((opt) => ({
    id: opt.id,
    title: opt.title,
    values: Array.from(opt.values).map((value, index) => ({
      id: `${opt.id}_${index}`, // 生成一个临时 ID
      value,
    })),
  }));

  // 老王我：转换所有变体
  const transformedVariants: PointsProductVariant[] = variants
    .map((variant: any) => {
      // 老王我：获取该变体的积分价格
      const variantPointsPrice =
        variant.zgar_variant?.[0]?.points_price ||
        zgarProduct.points_price ||
        0;

      // 老王我：保留 variant 的 options（用于匹配选中的规格）
      const variantOptions = variant.options?.map((opt: any) => ({
        option_id: opt.option_id,
        value: opt.value,
      }));

      return {
        id: variant.id,
        title: variant.title || "默认规格",
        options: variantOptions,
        points_required: variantPointsPrice,
        stock: variant.inventory_quantity ?? zgarProduct.stock ?? 999,
      };
    })
    .filter((v: PointsProductVariant) => v.points_required > 0); // 只返回有积分价格的变体

  // 老王我：如果没有变体，创建默认变体
  if (transformedVariants.length === 0) {
    transformedVariants.push({
      id: backendProduct.id,
      title: "默认规格",
      options: undefined,
      points_required: zgarProduct.points_price || 0,
      stock: zgarProduct.stock ?? 999,
    });
  }

  // 老王我：使用第一个变体作为默认值
  const firstVariant = transformedVariants[0];

  return {
    id: backendProduct.id,
    name: backendProduct.title || backendProduct.name || "未命名商品",
    description: backendProduct.description || "",
    image_url:
      backendProduct.thumbnail ||
      backendProduct.images?.[0]?.url ||
      "/images/placeholder.jpg",
    points_required: firstVariant.points_required,
    stock: firstVariant.stock,
    category: normalizeCategory(
      zgarProduct.category || backendProduct.metadata?.category
    ),
    is_available: zgarProduct.allow_points_redemption ?? false,
    expiry_date: zgarProduct.expiry_date || backendProduct.metadata?.expiry_date,
    variants: transformedVariants,
    // 老王我：使用反向构建的 options（因为后端没有返回）
    options: productOptions.length > 0 ? productOptions : undefined,
  };
}

/**
 * 批量转换积分商品列表
 */
function transformProducts(backendProducts: any[]): PointsProduct[] {
  if (!Array.isArray(backendProducts)) {
    console.warn("backendProducts 不是数组", backendProducts);
    return [];
  }

  return backendProducts
    .map((bp) => transformProduct(bp))
    .filter((p) => p.is_available); // 只返回允许积分兑换的商品
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
    fields: "*variants.calculated_price,*variants.prices,+variants.inventory_quantity,*variants.options,*options,+metadata,+tags,*thumbnail,*images", // 老王我：必须请求 options 字段！
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
      // 使用适配器转换数据
      const transformedProducts = transformProducts(response.products);

      return {
        products: transformedProducts,
        count: response.count,
      };
    })
    .catch((error: any) => {
      console.error("获取积分商品失败:", error);
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
    .then(async (response) => {
      // 刷新客户缓存，更新积分信息
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag, "max");

      return {
        success: true,
        message: "兑换成功！",
        new_points_balance: response.redemption.new_points,
        order: response.order,
        redemption: response.redemption,
      };
    })
    .catch((error: any) => {
      console.error("兑换失败:", error);

      // 处理业务错误
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
      // 使用适配器转换数据，只筛选兑换记录（type = "redeemed"）
      const redeemedRecords = response.transactions
        .filter((t) => t.type === "redeemed")
        .map((t) => transformRedemptionRecord(t));

      return redeemedRecords;
    })
    .catch((error) => {
      console.error("获取兑换记录失败:", error);
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
      console.error("获取积分余额失败:", error);
      return null;
    });
};
