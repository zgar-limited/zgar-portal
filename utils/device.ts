/**
 * 设备检测工具
 *
 * 使用 ua-parser-js 在服务端检测设备类型
 */

import { UAParser } from 'ua-parser-js';

/**
 * 检测是否为移动设备
 *
 * @param userAgent - User-Agent 字符串
 * @returns 是否为移动设备（mobile 或 tablet）
 *
 * @example
 * ```ts
 * const headersList = headers();
 * const userAgent = headersList.get('user-agent') || '';
 * const isMobile = isMobileDevice(userAgent);
 * ```
 */
export function isMobileDevice(userAgent: string): boolean {
  if (!userAgent) {
    return false;
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();

  // device.type 可能的值: 'mobile', 'tablet', 'desktop', 'wearable', 'console', undefined
  return device.type === 'mobile' || device.type === 'tablet';
}

/**
 * 获取设备类型
 *
 * @param userAgent - User-Agent 字符串
 * @returns 设备类型
 */
export function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!userAgent) {
    return 'unknown';
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();

  if (device.type === 'mobile') return 'mobile';
  if (device.type === 'tablet') return 'tablet';
  if (device.type === 'desktop' || !device.type) return 'desktop';

  return 'unknown';
}

/**
 * 获取浏览器信息
 *
 * @param userAgent - User-Agent 字符串
 * @returns 浏览器名称和版本
 */
export function getBrowserInfo(userAgent: string): { name: string; version: string } {
  if (!userAgent) {
    return { name: 'unknown', version: 'unknown' };
  }

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();

  return {
    name: browser.name || 'unknown',
    version: browser.version || 'unknown',
  };
}
