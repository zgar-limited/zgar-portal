/**
 * 码信息展示卡片组件
 *
 * 展示防伪码的基本信息（序列号、查询次数、首次查询时间等）
 */

'use client';

import { useTranslations } from 'next-intl';
import { type CodeInfoData } from '@/data/anti-counterfeit';

// ============================================
// TypeScript 类型定义
// ============================================

interface CodeInfoCardProps {
  /** 防伪码基本信息 */
  codeInfo: CodeInfoData | null;
  /** 是否正在加载 */
  loading?: boolean;
  /** 自定义类名 */
  className?: string;
}

// ============================================
// 子组件：信息项
// ============================================

interface InfoItemProps {
  /** 图标 */
  icon: React.ReactNode;
  /** 标签 */
  label: string;
  /** 值 */
  value: string;
  /** 是否高亮显示 */
  highlight?: boolean;
}

function InfoItem({ icon, label, value, highlight = false }: InfoItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm ${
        highlight ? 'ring-2 ring-brand-pink/20' : ''
      }`}
    >
      {/* 图标 */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          highlight
            ? 'bg-brand-pink/10 text-brand-pink'
            : 'bg-brand-blue/10 text-brand-blue'
        }`}
      >
        {icon}
      </div>

      {/* 文字内容 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={`text-sm font-semibold truncate ${
            highlight ? 'text-brand-pink' : 'text-gray-900'
          }`}
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

// ============================================
// 组件实现
// ============================================

/**
 * 码信息展示卡片组件
 *
 * @example
 * ```tsx
 * <CodeInfoCard
 *   codeInfo={{
 *     IndexCode: 'ABC123456',
 *     QueryTimes: '1',
 *     FirstTime: '2025-02-05 10:30:00'
 *   }}
 * />
 * ```
 */
export function CodeInfoCard({
  codeInfo,
  loading = false,
  className,
}: CodeInfoCardProps) {
  const t = useTranslations('VerifyCodeInfo');

  if (loading) {
    return (
      <div className={`bg-gray-50 rounded-2xl p-6 space-y-4 ${className || ''}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!codeInfo) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {/* 标题 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
        <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* 信息项列表 */}
      <InfoItem
        icon={<HashtagIcon />}
        label={t('serialNumber')}
        value={codeInfo.IndexCode}
      />
      <InfoItem
        icon={<EyeIcon />}
        label={t('queryTimes')}
        value={`${codeInfo.QueryTimes} ${t('times')}`}
      />
      <InfoItem
        icon={<ClockIcon />}
        label={t('firstQueryTime')}
        value={codeInfo.FirstTime}
      />
    </div>
  );
}
