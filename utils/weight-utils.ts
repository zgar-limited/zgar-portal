/**
 * 重量格式化工具函数
 *
 * 将 kg 单位的重量转换为合适的显示单位：
 * - >= 1 kg：显示 "X kg"
 * - < 1 kg：显示 "X g"（转换为克）
 * - 无数据/无效值：显示 "-"
 */

/**
 * 格式化重量显示（从 kg 转换为合适的单位）
 * @param weightInKg - 重量（kg 单位，来自 metadata）
 * @param locale - 语言环境（保留参数以便未来扩展）
 * @returns 格式化后的重量字符串（如 "1.5 kg", "500 g", "-"）
 *
 * @example
 * formatWeight("59.19")     // "59.19 kg"
 * formatWeight("1.5")       // "1.5 kg"
 * formatWeight("1")         // "1 kg"
 * formatWeight("0.8")       // "800 g"
 * formatWeight("0.05")      // "50 g"
 * formatWeight("0.005")     // "5 g"
 * formatWeight(null)        // "-"
 * formatWeight("0")         // "-"
 * formatWeight("")          // "-"
 */
export function formatWeight(
  weightInKg: string | number | null | undefined,
  locale?: string
): string {
  // 1. 处理空值
  if (weightInKg === null || weightInKg === undefined || weightInKg === '') {
    return '-';
  }

  // 2. 转换为数字
  const weight = typeof weightInKg === 'string' ? parseFloat(weightInKg) : weightInKg;

  if (isNaN(weight) || weight === 0) {
    return '-';
  }

  // 3. 单位转换逻辑
  if (weight >= 1) {
    // >= 1 kg：显示 kg，去除尾部的0
    const formatted = weight.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} kg`;
  } else {
    // < 1 kg：转换为克，显示整数
    const weightInG = Math.round(weight * 1000);
    return `${weightInG} g`;
  }
}

/**
 * 格式化总重量（通常较大，直接显示 kg）
 * @param weightInKg - 总重量（kg 单位）
 * @param locale - 语言环境（保留参数以便未来扩展）
 * @returns 格式化后的重量字符串
 *
 * @example
 * formatTotalWeight("59.19")  // "59.19 kg"
 * formatTotalWeight("1250.5") // "1250.5 kg"
 * formatTotalWeight("0")      // "0 kg"
 * formatTotalWeight(null)     // "0 kg"
 */
export function formatTotalWeight(
  weightInKg: string | number | null | undefined,
  locale?: string
): string {
  if (weightInKg === null || weightInKg === undefined || weightInKg === '') {
    return '0 kg';
  }

  const weight = typeof weightInKg === 'string' ? parseFloat(weightInKg) : weightInKg;

  if (isNaN(weight) || weight === 0) {
    return '0 kg';
  }

  // 总重量通常 > 1kg，直接显示 kg，保留2位小数
  const formatted = weight.toFixed(2).replace(/\.?0+$/, '');
  return `${formatted} kg`;
}
