// 老王我：交易记录页面 - 显示余额和积分交易流水
import { requireAuth } from "@/data/auth";
import TransactionTabs from "@/components/dashboard/transactions/TransactionTabs";

export const metadata = {
  title: "交易记录 - Zgar Account",
  description: "查看您的余额和积分变动记录",
};

export default async function AccountTransactionsPage() {
  // 老王我：统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();

  return (
    <div className="space-y-6">
      {/* 老王我：页面标题 - Vibrant Blocks 粉色立体风格 */}
      <div className="relative overflow-hidden p-6 rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-gradient-to-r from-[#FF71CE] to-[#FF9671]">
        {/* 装饰性几何元素 */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-black opacity-20 rounded-full"></div>
        <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-white opacity-30" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", transform: "rotate(-30deg)" }}></div>

        {/* 标题内容 */}
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
            交易记录
          </h1>
          <p className="text-sm md:text-base font-semibold text-white/90">
            查看您的余额和积分变动记录
          </p>
        </div>
      </div>

      {/* 老王我：交易记录 Tabs - 余额/积分切换 */}
      <TransactionTabs customerId={customer.id} />
    </div>
  );
}
