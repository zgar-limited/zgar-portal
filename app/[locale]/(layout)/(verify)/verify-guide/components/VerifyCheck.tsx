/**
 * 防伪验证主组件
 *
 * 整合所有子组件，实现完整的验证流程控制和状态管理
 */

'use client';

import { useEffect } from 'react';
import { useAntiCounterfeit, type VerifyStep } from '../hooks/useAntiCounterfeit';
import { CodeInput } from './CodeInput';
import { CodeInfoCard } from './CodeInfoCard';
import { VerifyResult } from './VerifyResult';
import { LoadingSpinner } from './LoadingSpinner';

// ============================================
// TypeScript 类型定义
// ============================================

interface VerifyCheckProps {
  /** 8位防伪码前缀（从URL参数c获取） */
  codePrefix: string;
}

// ============================================
// 组件实现
// ============================================

/**
 * 防伪验证主组件
 *
 * @example
 * ```tsx
 * <VerifyCheck codePrefix="9IG15BI8" />
 * ```
 */
export function VerifyCheck({ codePrefix }: VerifyCheckProps) {
  const { state, queryInfo, verify, reset } = useAntiCounterfeit({ codePrefix });

  // 页面加载时自动查询码信息
  useEffect(() => {
    queryInfo();
  }, [queryInfo]);

  // ==================== 加载状态 ====================
  if (state.step === 'querying' || state.step === 'verifying') {
    return <LoadingSpinner step={state.step} />;
  }

  // ==================== 结果状态 ====================
  if (state.step === 'success' || state.step === 'error') {
    return (
      <div className="min-h-screen bg-brand-gradient py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {/* 码信息卡片 */}
            {state.codeInfo && <CodeInfoCard codeInfo={state.codeInfo} />}

            {/* 验证结果 */}
            <VerifyResult
              result={state.verifyResult}
              error={state.error}
              success={state.step === 'success'}
            />

            {/* 重新验证按钮 */}
            <button
              onClick={reset}
              className="mt-6 w-full py-4 px-6 border-2 border-brand-blue text-brand-blue rounded-xl font-semibold hover:bg-brand-blue hover:text-white transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              重新验证
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 输入状态 ====================
  return (
    <div className="min-h-screen bg-brand-gradient py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* 码信息卡片 */}
          {state.codeInfo ? (
            <CodeInfoCard codeInfo={state.codeInfo} />
          ) : (
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                防伪验证
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                请输入防伪标签上的验证码
              </p>
            </div>
          )}

          {/* 错误提示（如果有） */}
          {state.error && state.step === 'inputting' && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-yellow-700">提示</p>
                  <p className="mt-1 text-sm text-yellow-600">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 验证码输入区 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              请输入验证码
            </h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              请输入防伪标签上的6位验证码
            </p>
            <CodeInput
              onComplete={(code) => verify(code)}
              disabled={state.step === 'verifying'}
            />
          </div>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-brand-pink/10 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              💡 提示：验证码是防伪标签上的6位数字
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
