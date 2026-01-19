import OffcanvasSidebar from "@/components/dashboard/OffcanvasSidebar";
import SidebarToggler from "@/components/dashboard/SidebarToggler";
import Sidebar from "@/components/dashboard/Sidebar";
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

      {/* 老王我添加：统一的布局结构，包含 Sidebar */}
      <div className="min-h-screen bg-white dark:bg-[#191818]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左侧 Sidebar - 所有页面共用，统一显示真实数据 */}
            <div className="lg:col-span-1">
              <Sidebar customer={customer} orders={orders} />
            </div>

            {/* 右侧主内容区 - 各页面的内容 */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>

      <SidebarToggler />
      <OffcanvasSidebar customer={customer} />

      {/* <Footer1 /> */}
    </MobileSidebarProvider>
  );
}
