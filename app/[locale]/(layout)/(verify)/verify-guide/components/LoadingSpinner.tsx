/**
 * 加载动画组件
 *
 * 显示查询中和验证中的加载状态
 */

'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// ============================================
// TypeScript 类型定义
// ============================================

interface LoadingSpinnerProps {
  /** 加载步骤 */
  step: 'querying' | 'verifying';
  /** 自定义类名 */
  className?: string;
}

// ============================================
// 组件实现
// ============================================

/**
 * 加载动画组件
 *
 * @example
 * ```tsx
 * <LoadingSpinner step="querying" />
 * ```
 */
export function LoadingSpinner({ step, className }: LoadingSpinnerProps) {
  const t = useTranslations('LoadingSpinner');

  // 颜色方案
  const colorClass =
    step === 'querying' ? 'border-brand-pink' : 'border-brand-blue';

  const text =
    step === 'querying' ? t('querying') : t('verifying');

  return (
    <div className={cn('min-h-screen bg-brand-gradient py-8 px-4', className)}>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          {/* 旋转动画 */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              {/* 背景圆环 */}
              <div
                className={cn(
                  'w-16 h-16 border-4 rounded-full',
                  step === 'querying'
                    ? 'border-brand-pink/20'
                    : 'border-brand-blue/20'
                )}
              />
              {/* 旋转圆环 */}
              <div
                className={cn(
                  'absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-t-transparent animate-spin',
                  colorClass
                )}
              />
            </div>

            {/* 加载文字 */}
            <p className="mt-6 text-gray-600 text-center">{text}</p>

            {/* 提示信息 */}
            <p className="mt-2 text-sm text-gray-400 text-center">
              {t('waiting')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
