/**
 * 防伪验证 API 接口封装
 *
 * 提供防伪码查询和验证功能
 * 接口文档：
 * 1.2 查询防伪码信息: http://weika.fwdby.com/api/AppWebApi/QueryCodeInfoFunc
 * 1.1 防伪验证: http://weika.fwdby.com/api/AppWebApi/AntiCodeQueryFunc
 */

// ============================================
// TypeScript 类型定义
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

/**
 * 接口1.2请求参数
 */
export interface QueryCodeInfoParams {
  Code: string;  // 防伪密码前8位
  IP: string;    // 客户端IP地址
}

/**
 * 接口1.1请求参数
 */
export interface VerifyCodeParams {
  Code: string;  // 14位完整防伪码（8位前缀 + 6位验证码）
  IP: string;    // 客户端IP地址
  Key: string;   // 客户秘钥（固定值：56d5b0e8c79e3bb3）
}

// ============================================
// 常量配置
// ============================================

const API_BASE_URL = 'http://weika.fwdby.com/api/AppWebApi';
const CLIENT_KEY = '56d5b0e8c79e3bb3';

// ============================================
// API 接口函数
// ============================================

/**
 * 接口1.2: 查询防伪码基本信息
 *
 * 在调用防伪验证接口前，通过这个接口查询码的基本信息
 *
 * @param params - 查询参数
 * @returns Promise<QueryCodeInfoResponse>
 *
 * @example
 * ```ts
 * const result = await queryCodeInfo({
 *   Code: '9IG15BI8',
 *   IP: '127.0.0.1'
 * });
 * ```
 */
export async function queryCodeInfo(
  params: QueryCodeInfoParams
): Promise<QueryCodeInfoResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/QueryCodeInfoFunc`);
    url.searchParams.append('Code', params.Code);
    url.searchParams.append('IP', params.IP);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: QueryCodeInfoResponse = await response.json();

    return data;
  } catch (error) {
    console.error('[防伪验证] 查询码信息失败:', error);
    throw new Error('网络连接失败，请检查网络后重试');
  }
}

/**
 * 接口1.1: 防伪验证
 *
 * 验证防伪码真伪
 *
 * @param params - 验证参数
 * @returns Promise<VerifyCodeResponse>
 *
 * @example
 * ```ts
 * const result = await verifyCode({
 *   Code: '9IG15BI8123456',  // 14位完整码
 *   IP: '127.0.0.1',
 *   Key: '56d5b0e8c79e3bb3'
 * });
 * ```
 */
export async function verifyCode(
  params: VerifyCodeParams
): Promise<VerifyCodeResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/AntiCodeQueryFunc`);
    url.searchParams.append('Code', params.Code);
    url.searchParams.append('IP', params.IP);
    url.searchParams.append('Key', params.Key);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: VerifyCodeResponse = await response.json();

    return data;
  } catch (error) {
    console.error('[防伪验证] 验证失败:', error);
    throw new Error('网络连接失败，请检查网络后重试');
  }
}

// ============================================
// 辅助函数
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
