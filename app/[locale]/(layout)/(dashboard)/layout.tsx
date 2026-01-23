import OffcanvasSidebar from "@/components/dashboard/OffcanvasSidebar";
import SidebarToggler from "@/components/dashboard/SidebarToggler";
import Sidebar from "@/components/dashboard/Sidebar";
// 老王我移除：AccountSummary 不再在 Layout 层显示，移到 account-page 专用
// import AccountSummary from "@/components/dashboard/AccountSummary";
import Footer1 from "@/components/footers/Footer1";
import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { retrieveOrders } from "@/data/orders";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import React from "react";
import { MobileSidebarProvider } from "@/hooks/useMobileSidebar";

export default async function DashboardLayout({ children, params }) {
  // 老王我：await params（Next.js 15+ params 是 Promise）
  const { locale } = await params;

  // 老王我在 layout 层获取数据，供所有页面的 Sidebar 使用
  // 注意：认证检查由各个页面自己通过 requireAuth() 处理
  const [customer, ordersData] = await Promise.all([
    retrieveCustomerWithZgarFields(),
    retrieveOrders(5, 0)
  ]);

  const orders = ordersData?.orders || [];

  return (
    <MobileSidebarProvider>
      {/* <HomeTips /> */}
      {/* <HomeHeader customer={customer} /> */}

      {/* 老王我：左侧菜单布局 - Vibrant Blocks 粉色立体风格 */}
      <div className="min-h-screen bg-gray-50 dark:bg-[#191818]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex">
            {/* 左侧菜单 - 固定宽度 */}
            <aside className="hidden lg:block w-72 flex-shrink-0 p-6">
              <Sidebar customer={customer} orders={orders} />
            </aside>

            {/* 右侧主内容区 */}
            <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
              {/* 老王我移除：AccountSummary 不再在 Layout 层显示，移到 account-page 专用 */}

              {/* 页面特定内容 */}
              {children}
            </main>
          </div>
        </div>
      </div>

      <SidebarToggler />
      <OffcanvasSidebar customer={customer} orders={orders} />

      {/* <Footer1 /> */}
    </MobileSidebarProvider>
  );
}
