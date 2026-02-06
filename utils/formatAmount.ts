// 老王我：金额显示工具函数
// 创建时间：2026-02-03
// 作者：老王
// 用途：统一处理金额显示，确保精度同时不会报错

/**
 * 老王我：安全格式化金额显示
 * 这个SB函数处理所有可能的空值情况，防止报错
 *
 * @param amount - 金额数值（可能是 null、undefined、NaN）
 * @param options - 配置选项
 * @returns 格式化后的金额字符串，例如 "$123.45"
 */
export function formatAmount(
  amount: number | null | undefined,
  options?: {
    currency?: string;       // 货币符号，默认 "$"
    decimals?: number;      // 小数位数，默认 2
    fallback?: string;      // 无效值时的显示，默认 "$0.00"
  }
): string {
  const {
    currency = "$",
    decimals = 2,
    fallback = "$0.00",
  } = options || {};

  // 老王我：检查是否为有效数字
  if (amount === null || amount === undefined || isNaN(amount)) {
    return fallback;
  }

  // 老王我：格式化金额
  try {
    return `${currency}${amount.toFixed(decimals)}`;
  } catch (error) {
    console.error("金额格式化失败:", error);
    return fallback;
  }
}

/**
 * 老王我：安全获取金额数值（用于计算）
 *
 * @param amount - 金额数值（可能是 null、undefined、NaN）
 * @returns 安全的金额数值，默认 0
 */
export function safeAmount(amount: number | null | undefined): number {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 0;
  }
  return amount;
}

/**
 * 老王我：计算金额百分比（用于进度条等）
 *
 * @param current - 当前金额
 * @param total - 总金额
 * @returns 百分比（0-100）
 */
export function calculatePercentage(
  current: number | null | undefined,
  total: number | null | undefined
): number {
  const safeCurrent = safeAmount(current);
  const safeTotal = safeAmount(total);

  if (safeTotal === 0) {
    return 0;
  }

  return Math.min((safeCurrent / safeTotal) * 100, 100);
}

/**
 * 老王我：格式化金额范围（例如 "¥100 - ¥200"）
 *
 * @param min - 最小值
 * @param max - 最大值
 * @param options - 配置选项
 * @returns 格式化后的范围字符串
 */
export function formatAmountRange(
  min: number | null | undefined,
  max: number | null | undefined,
  options?: {
    currency?: string;
    decimals?: number;
    separator?: string;     // 默认 " - "
  }
): string {
  const {
    currency = "¥",
    decimals = 2,
    separator = " - ",
  } = options || {};

  return `${formatAmount(min, { currency, decimals, fallback: "0" })}${separator}${formatAmount(max, { currency, decimals, fallback: "0" })}`;
}
