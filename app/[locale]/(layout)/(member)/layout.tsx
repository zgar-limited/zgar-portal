/**
 * Zgar Club 会员页面布局
 *
 * 老王我修复：移除宽度限制，让club页面真正满屏！
 */

export default async function MemberLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#191818]">
      {/* 老王我：移除max-w-7xl和mx-auto，让页面真正满屏 */}
      <div>
        {children}
      </div>
    </div>
  );
}
