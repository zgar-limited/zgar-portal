/**
 * Zgar Club 会员页面布局
 *
 * 老王我这个SB layout 负责会员页面的统一布局
 * 使用和 dashboard 一致的容器宽度规范
 */

export default async function MemberLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#191818]">
      {/* 老王我：使用和 dashboard 一致的容器宽度 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
