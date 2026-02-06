/**
 * 防伪验证 API Server Actions
 *
 * 使用 Next.js Server Actions 在服务端调用防伪验证 API
 * 自动获取客户端 IP，避免跨域问题
 *
 * 接口文档：
 * 1.2 查询防伪码信息: http://weika.fwdby.com/api/AppWebApi/QueryCodeInfoFunc
 * 1.1 防伪验证: http://weika.fwdby.com/api/AppWebApi/AntiCodeQueryFunc
 */

'use server';

import { headers } from 'next/headers';
import { getClientIPFromHeaders } from '@/utils/client-ip';
import type { QueryCodeInfoResponse, VerifyCodeResponse } from './types';

// ============================================
// 常量配置
// ============================================

const API_BASE_URL = 'http://weika.fwdby.com/api/AppWebApi';
const CLIENT_KEY = '56d5b0e8c79e3bb3';

// ============================================
// Server Actions
// ============================================

/**
 * Server Action: 查询防伪码基本信息（接口 1.2）
 *
 * 在服务端调用防伪验证 API，自动获取客户端 IP
 *
 * @param code - 8位防伪码前缀
 * @returns Promise<QueryCodeInfoResponse>
 *
 * @example
 * ```ts
 * // 在客户端组件中直接调用
 * import { queryCodeInfo } from '@/data/anti-counterfeit';
 * const result = await queryCodeInfo('9IG15BI8');
 * ```
 */
export async function queryCodeInfo(
  code: string
): Promise<QueryCodeInfoResponse> {
  try {
    // 获取客户端 IP（在服务端读取请求头）
    const headersList = await headers();
    let clientIP = getClientIPFromHeaders(headersList);

    // 调试：开发环境下打印客户端 IP
    if (clientIP === '0.0.0.0' || clientIP === '::1' || clientIP === '127.0.0.1') {
      console.log('[防伪验证] 本地开发环境，使用测试 IP 地址');
      // 本地开发环境使用测试 IP（避免使用 0.0.0.0，因为 API 可能不接受）
      clientIP = '8.8.8.8';
    }

    // 构建请求 URL
    const url = new URL(`${API_BASE_URL}/QueryCodeInfoFunc`);
    url.searchParams.append('Code', code);
    url.searchParams.append('IP', clientIP);

    // 调用外部 API
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
    console.error('[Server Action] 查询防伪码信息失败:', error);
    throw new Error('网络连接失败，请检查网络后重试');
  }
}

/**
 * Server Action: 验证防伪码真伪（接口 1.1）
 *
 * 在服务端调用防伪验证 API，自动获取客户端 IP
 *
 * @param code - 14位完整防伪码（8位前缀 + 6位验证码）
 * @returns Promise<VerifyCodeResponse>
 *
 * @example
 * ```ts
 * // 在客户端组件中直接调用
 * import { verifyCode } from '@/data/anti-counterfeit';
 * const result = await verifyCode('9IG15BI8123456');
 * ```
 */
export async function verifyCode(
  code: string
): Promise<VerifyCodeResponse> {
  try {
    // 获取客户端 IP（在服务端读取请求头）
    const headersList = await headers();
    let clientIP = getClientIPFromHeaders(headersList);

    // 调试：开发环境下打印客户端 IP
    if (clientIP === '0.0.0.0' || clientIP === '::1' || clientIP === '127.0.0.1') {
      console.log('[防伪验证] 本地开发环境，使用测试 IP 地址');
      // 本地开发环境使用测试 IP
      clientIP = '8.8.8.8';
    }

    // 构建请求 URL
    const url = new URL(`${API_BASE_URL}/AntiCodeQueryFunc`);
    url.searchParams.append('Code', code);
    url.searchParams.append('IP', clientIP);
    url.searchParams.append('Key', CLIENT_KEY);

    // 调用外部 API
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
    console.error('[Server Action] 验证防伪码失败:', error);
    throw new Error('网络连接失败，请检查网络后重试');
  }
}
