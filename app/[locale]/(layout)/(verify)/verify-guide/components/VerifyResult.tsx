/**
 * 验证结果展示组件
 *
 * 展示防伪验证成功/失败状态和详细信息
 */

'use client';

import { useTranslations } from 'next-intl';
import { type VerifyResultData } from '@/data/anti-counterfeit';
import { cn } from '@/lib/utils';

// ============================================
// TypeScript 类型定义
// ============================================

interface VerifyResultProps {
  /** 验证结果数据 */
  result: VerifyResultData | null;
  /** 错误信息 */
  error: string | null;
  /** 是否验证成功 */
  success: boolean;
  /** 自定义类名 */
  className?: string;
}

// ============================================
// 子组件：信息项
// ============================================

interface ResultInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

function ResultInfoItem({
  icon,
  label,
  value,
  highlight = false,
}: ResultInfoItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm',
        highlight && 'ring-2 ring-brand-pink/20'
      )}
    >
      {/* 图标 */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          highlight
            ? 'bg-brand-pink/10 text-brand-pink'
            : 'bg-brand-blue/10 text-brand-blue'
        )}
      >
        {icon}
      </div>

      {/* 文字内容 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={cn(
            'text-sm font-semibold truncate',
            highlight ? 'text-brand-pink' : 'text-gray-900'
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ============================================
// SVG 图标组件
// ============================================

function HashtagIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

// ============================================
// 状态图标组件
// ============================================

function SuccessIcon() {
  return (
    <div className="relative">
      {/* 圆圈背景 */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
        {/* 成功勾号 */}
        <svg
          className="w-14 h-14 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      {/* 脉冲动画 */}
      <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
      <svg
        className="w-14 h-14 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

// ============================================
// 组件实现
// ============================================

/**
 * 验证结果展示组件
 *
 * @example
 * ```tsx
 * <VerifyResult
 *   result={{
 *     IndexCode: 'ABC123456',
 *     QueryTimes: '1',
 *     FirstTime: '2025-02-05 10:30:00',
 *     RecentTime: '2025-02-05 10:30:00',
 *     TypeStr: 'A类'
 *   }}
 *   error={null}
 *   success={true}
 * />
 * ```
 */
export function VerifyResult({
  result,
  error,
  success,
  className,
}: VerifyResultProps) {
  const t = useTranslations('VerifyResult');

  // 验证失败状态
  if (!success) {
    return (
      <div
        className={cn(
          'mt-6 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl',
          className
        )}
      >
        {/* 失败图标 */}
        <div className="flex flex-col items-center">
          <ErrorIcon />
          <h3 className="mt-4 text-2xl font-bold text-red-600">{t('failed')}</h3>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="mt-4 p-4 bg-white rounded-xl">
            <p className="text-center text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // 验证成功状态
  if (!result) {
    return null;
  }

  return (
    <div
      className={cn(
        'mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl',
        className
      )}
    >
      {/* 成功图标 */}
      <div className="flex flex-col items-center">
        <SuccessIcon />
        <h3 className="mt-4 text-2xl font-bold text-green-600">{t('success')}</h3>
        <p className="mt-2 text-sm text-gray-600">{t('genuine')}</p>
      </div>

      {/* 详细信息 */}
      <div className="mt-6 space-y-3">
        <ResultInfoItem
          icon={<HashtagIcon />}
          label={t('serialNumber')}
          value={result.IndexCode}
        />
        <ResultInfoItem
          icon={<ShieldCheckIcon />}
          label={t('codeType')}
          value={result.TypeStr}
          highlight
        />
        <ResultInfoItem
          icon={<EyeIcon />}
          label={t('queryTimes')}
          value={`${result.QueryTimes} ${t('times')}`}
        />
        <ResultInfoItem
          icon={<ClockIcon />}
          label={t('firstQueryTime')}
          value={result.FirstTime}
        />
        <ResultInfoItem
          icon={<CalendarIcon />}
          label={t('lastQueryTime')}
          value={result.RecentTime}
        />
      </div>
    </div>
  );
}
