/**
 * Verify 页面 - 完全复刻 zgar.com 防伪验证页面
 *
 * 移动端专用页面，复刻原有设计
 * 接口使用我们现有的防伪验证 API
 */

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { isMobileDevice } from '@/utils/device';
import { VerificationForm } from './components/VerificationForm';

/**
 * Verify 页面组件
 *
 * @example
 * - 移动端访问 /verify?c=123123XX → 显示验证页面
 * - PC 端访问 /verify → 返回 404
 */
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  // 获取 User-Agent
  let userAgent = '';
  try {
    const headersList = await headers();
    userAgent = headersList.get('user-agent') || '';
  } catch (error) {
    console.error('[VerifyPage] 获取 User-Agent 失败:', error);
    userAgent = '';
  }

  // 设备检测：仅移动端可访问
  const isMobile = isMobileDevice(userAgent);
  if (!isMobile) {
    notFound();
  }

  // 获取 URL 参数
  const { c: codePrefix } = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      {/* 主内容区域 */}
      <main>
        {/* 验证表单区域 */}
        <VerificationForm codePrefix={codePrefix || ''} />
      </main>
    </div>
  );
}
