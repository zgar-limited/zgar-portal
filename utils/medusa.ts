import Medusa from "@medusajs/js-sdk";

let MEDUSA_BACKEND_URL = "http://localhost:9000";

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL;
}

export const medusaSDK = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY,
  globalHeaders:{
    "x-publishable-api-key": process.env.MEDUSA_PUBLISHABLE_KEY
  },
  auth: {
    jwtTokenStorageKey: "token",
    type: "jwt",
  },
});

/**
 * 转换 locale 格式从 next-intl 格式到 Medusa 格式
 * 例如: en-us → en-US, zh-hk → zh-HK
 */
export function convertLocaleForMedusa(locale: string): string {
  const [lang, country] = locale.split('-');
  if (!country) return lang;

  return `${lang}-${country.toUpperCase()}`;
}

/**
 * 获取包含 locale 的 Medusa 请求头
 */
export function getMedusaHeaders(locale?: string, additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    ...additionalHeaders,
  };

  if (locale) {
    headers['x-medusa-locale'] = convertLocaleForMedusa(locale);
  }

  return headers;
}
