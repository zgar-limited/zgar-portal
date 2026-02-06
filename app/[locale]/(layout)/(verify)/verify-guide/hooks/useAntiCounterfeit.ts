/**
 * 防伪验证 Hook
 *
 * 管理防伪验证的状态和逻辑
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  queryCodeInfo,
  verifyCode,
  type CodeInfoData,
  type VerifyResultData,
} from '@/data/anti-counterfeit';

// ============================================
// TypeScript 类型定义
// ============================================

/**
 * 验证步骤
 */
export type VerifyStep =
  | 'idle'        // 初始状态
  | 'querying'    // 查询码信息中
  | 'inputting'   // 等待用户输入验证码
  | 'verifying'   // 验证中
  | 'success'     // 验证成功
  | 'error';      // 验证失败

/**
 * 验证状态
 */
interface VerifyState {
  step: VerifyStep;
  codeInfo: CodeInfoData | null;
  verifyResult: VerifyResultData | null;
  error: string | null;
}

/**
 * Hook 参数
 */
interface UseAntiCounterfeitProps {
  codePrefix: string; // 8位前缀（从URL参数c获取）
}

/**
 * Hook 返回值
 */
interface UseAntiCounterfeitReturn {
  state: VerifyState;
  queryInfo: () => Promise<void>;
  verify: (suffix: string) => Promise<void>;
  reset: () => void;
}

// ============================================
// Hook 实现
// ============================================

/**
 * 防伪验证 Hook
 *
 * @param props - Hook 参数
 * @returns 验证状态和操作函数
 *
 * @example
 * ```tsx
 * const { state, queryInfo, verify, reset } = useAntiCounterfeit({
 *   codePrefix: '9IG15BI8'
 * });
 *
 * useEffect(() => {
 *   queryInfo(); // 页面加载时自动查询码信息
 * }, []);
 * ```
 */
export function useAntiCounterfeit({
  codePrefix,
}: UseAntiCounterfeitProps): UseAntiCounterfeitReturn {
  const [state, setState] = useState<VerifyState>({
    step: 'idle',
    codeInfo: null,
    verifyResult: null,
    error: null,
  });

  /**
   * 第一步：查询防伪码基本信息
   *
   * 页面加载时自动调用，获取序列号、查询次数、首次查询时间等信息
   */
  const queryInfo = useCallback(async () => {
    setState((prev) => ({ ...prev, step: 'querying', error: null }));

    try {
      // 获取客户端 IP
      const ipResponse = await fetch('/api/client-ip');
      const ipData = await ipResponse.json();
      const ip = ipData.ip || '0.0.0.0';

      // 调用接口 1.2 查询码信息
      const response = await queryCodeInfo({
        Code: codePrefix,
        IP: ip,
      });

      if (response.code === '0') {
        setState((prev) => ({
          ...prev,
          step: 'inputting',
          codeInfo: response.data,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          step: 'inputting', // 即使查询失败，也允许用户尝试输入验证码
          codeInfo: null,
          error: response.msg || '无法获取防伪码信息',
        }));
      }
    } catch (error) {
      console.error('[防伪验证] 查询码信息失败:', error);
      setState((prev) => ({
        ...prev,
        step: 'inputting', // 即使查询失败，也允许用户尝试输入验证码
        codeInfo: null,
        error: '无法获取防伪码信息，请检查网络后重试',
      }));
    }
  }, [codePrefix]);

  /**
   * 第二步：验证防伪码
   *
   * 用户输入6位验证码后调用，验证防伪码真伪
   *
   * @param suffix - 6位验证码后缀
   */
  const verify = useCallback(async (suffix: string) => {
    setState((prev) => ({ ...prev, step: 'verifying', error: null }));

    try {
      // 获取客户端 IP
      const ipResponse = await fetch('/api/client-ip');
      const ipData = await ipResponse.json();
      const ip = ipData.ip || '0.0.0.0';

      // 拼接完整防伪码（8位前缀 + 6位验证码）
      const fullCode = codePrefix + suffix;

      // 调用接口 1.1 验证防伪码
      const response = await verifyCode({
        Code: fullCode,
        IP: ip,
        Key: '56d5b0e8c79e3bb3',
      });

      if (response.code === '0') {
        setState((prev) => ({
          ...prev,
          step: 'success',
          verifyResult: response.data,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          step: 'error',
          error: response.msg || '验证失败',
        }));
      }
    } catch (error) {
      console.error('[防伪验证] 验证失败:', error);
      setState((prev) => ({
        ...prev,
        step: 'error',
        error: '网络连接失败，请检查网络后重试',
      }));
    }
  }, [codePrefix]);

  /**
   * 重置验证状态
   *
   * 保留码信息，清空验证结果和错误，允许用户重新输入验证码
   */
  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: 'inputting',
      verifyResult: null,
      error: null,
    }));
  }, []);

  return {
    state,
    queryInfo,
    verify,
    reset,
  };
}
