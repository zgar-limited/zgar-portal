import { HttpTypes } from "@medusajs/types";

/**
 * 获取 option 的多语言翻译标题
 * @param product - 产品对象
 * @param option - option 对象
 * @param locale - 当前语言（如 "en-US", "zh-HK"）
 * @returns 翻译后的标题，如果没有翻译则返回原始标题
 */
export function getLocalizedOptionTitle(
  product: HttpTypes.StoreProduct | null | undefined,
  option: any,
  locale: string
): string {
  if (!product?.metadata || !option) {
    return option?.title || "";
  }

  // 老王我：将locale转为metadata key格式（en-US → en_us，zh-HK → zh_hk）
  const localeKey = locale.toLowerCase().replace('-', '_');

  // 老王我：获取option标题的多语言翻译
  // Key格式：option_title_{localeKey}_opt_{option.id}
  const optionTitleKey = `option_title_${localeKey}_opt_${option.id}`;

  return (product.metadata as any)?.[optionTitleKey] || option?.title || "";
}

/**
 * 获取 option 值的多语言翻译
 * @param product - 产品对象
 * @param optionValueId - option value 的 ID（如 "optval_12345"）
 * @param locale - 当前语言
 * @returns 翻译后的值，如果没有翻译则返回原始值
 */
export function getLocalizedOptionValue(
  product: HttpTypes.StoreProduct | null | undefined,
  optionValueId: string,
  locale: string
): string {
  if (!product?.metadata || !optionValueId) {
    return "";
  }

  // 老王我：将locale转为metadata key格式
  const localeKey = locale.toLowerCase().replace('-', '_');

  // 老王我：获取option值的多语言翻译
  // Key格式：option_value_{localeKey}_{optionValueId}
  // optionValueId 已经包含 optval_ 前缀，不需要再加
  const optionValueKey = `option_value_${localeKey}_${optionValueId}`;

  return (product.metadata as any)?.[optionValueKey] || "";
}

/**
 * 获取 variant options 的多语言翻译数组
 * @param product - 产品对象
 * @param variant - variant 对象
 * @param locale - 当前语言
 * @returns 翻译后的 options 数组
 */
export function getLocalizedVariantOptions(
  product: HttpTypes.StoreProduct | null | undefined,
  variant: any,
  locale: string
): Array<{ option_id: string; option_title: string; value: string; localized_value: string }> {
  if (!variant?.options) {
    return [];
  }

  return variant.options.map((option: any) => {
    const optionTitle = getLocalizedOptionTitle(product, { id: option.option_id }, locale);
    const localizedValue = getLocalizedOptionValue(product, option.value_id || option.id, locale);

    return {
      option_id: option.option_id,
      option_title: optionTitle,
      value: option.value,
      localized_value: localizedValue || option.value,
    };
  });
}
