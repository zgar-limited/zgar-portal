/**
 * 防伪查询页面
 *
 * 根据 URL 参数判断显示内容：
 * - 无 c 参数：显示静态指南页面
 * - 有 c 参数：显示防伪验证交互页面
 */

import { VerifyGuide } from './components/VerifyGuide';
import { VerifyCheck } from './components/VerifyCheck';

/**
 * 防伪查询页面组件
 *
 * @example
 * - 官网访问: /verify-guide → 显示静态指南
 * - 扫码访问: /verify-guide?c=9IG15BI8 → 显示验证页面
 */
export default function VerifyPage({
  searchParams,
}: {
  searchParams: { c?: string };
}) {
  const codePrefix = searchParams.c; // 8位防伪码前缀

  // 有 c 参数就显示验证页面，否则显示静态指南
  if (codePrefix) {
    return <VerifyCheck codePrefix={codePrefix} />;
  }

  return <VerifyGuide />;
}
