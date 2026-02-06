/**
 * 防伪验证 API 类型定义
 *
 * 接口文档：
 * 1.2 查询防伪码信息: http://weika.fwdby.com/api/AppWebApi/QueryCodeInfoFunc
 * 1.1 防伪验证: http://weika.fwdby.com/api/AppWebApi/AntiCodeQueryFunc
 */

// ============================================
// 接口1.2：查询防伪码信息
// ============================================

/**
 * 接口1.2返回数据 - 防伪码基本信息
 */
export interface CodeInfoData {
  IndexCode: string;  // 序列号
  QueryTimes: string; // 查询次数
  FirstTime: string;  // 第一次查询时间
}

/**
 * 接口1.2响应格式
 */
export interface QueryCodeInfoResponse {
  code: string;  // "0":成功, "1":失败
  msg: string;   // 返回信息描述
  data: CodeInfoData;
  count?: number;
}

// ============================================
// 接口1.1：验证防伪码真伪
// ============================================

/**
 * 接口1.1返回数据 - 防伪验证结果
 */
export interface VerifyResultData {
  IndexCode: string;  // 序列号
  QueryTimes: string; // 查询次数
  FirstTime: string;  // 第一次查询时间
  RecentTime: string; // 最近一次查询时间
  TypeStr: string;    // 防伪码类型（"A类", "B类", "C类"）
}

/**
 * 接口1.1响应格式
 */
export interface VerifyCodeResponse {
  code: string;  // "0":成功, "1":失败
  msg: string;   // 返回信息描述
  data: VerifyResultData;
  count?: number;
}

// ============================================
// 辅助类型
// ============================================

/**
 * 检查防伪码前缀是否有效（8位）
 */
export function isValidCodePrefix(prefix: string | null): boolean {
  if (!prefix) return false;
  return /^[A-Z0-9]{8}$/.test(prefix);
}

/**
 * 检查验证码是否有效（6位数字）
 */
export function isValidVerifyCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * 拼接完整防伪码（8位前缀 + 6位验证码）
 */
export function buildFullCode(prefix: string, suffix: string): string {
  return prefix + suffix;
}
