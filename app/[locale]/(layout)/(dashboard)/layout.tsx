import OffcanvasSidebar from "@/components/dashboard/OffcanvasSidebar";
import SidebarToggler from "@/components/dashboard/SidebarToggler";
import Sidebar from "@/components/dashboard/Sidebar";
import Footer1 from "@/components/footers/Footer1";
import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { retrieveOrders } from "@/data/orders";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import React from "react";

export default async function DashboardLayout({ children, params }) {
  // 老王我：获取当前 locale
  const locale = params?.locale || "en-us";

  // 老王我：获取当前页面路径（用于登录后返回）
  const headersList = await headers();
  const url = headersList.get('x-url') || headersList.get('x-current-url') || '';
  // 从 URL 中提取 pathname（去掉 query string）
  const pathname = url ? url.split('?')[0].split('#')[0] : '';

  // 老王我在 layout 层获取数据，供所有页面的 Sidebar 使用
  const [customer, ordersData] = await Promise.all([
    retrieveCustomerWithZgarFields(),
    retrieveOrders(5, 0)
  ]);

  const orders = ordersData?.orders || [];

  // 老王我：检查 token 是否过期
  // 如果有 _medusa_jwt cookie 但 customer 为 null，说明 token 过期了
  const cookieStore = await cookies();
  const hasToken = cookieStore.get("_medusa_jwt");

  if (hasToken && customer === null) {
    console.warn("🔒 Token 已过期，重定向到登录页");

    // 老王我：构建返回 URL
    let returnUrl = pathname;

    // 如果无法从 header 获取，尝试从 referer 获取
    if (!returnUrl) {
      const referer = headersList.get('referer') || '';
      try {
        const refererUrl = new URL(referer);
        returnUrl = refererUrl.pathname + refererUrl.search;
      } catch {
        returnUrl = `/${locale}/account-page`;
      }
    }

    // 确保 returnUrl 以 / 开头
    if (!returnUrl.startsWith('/')) {
      returnUrl = `/${locale}/account-page`;
    }

    const redirectUrl = `/${locale}/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    console.log("重定向到:", redirectUrl);
    redirect(redirectUrl);
  }

  return (
    <>
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
      <OffcanvasSidebar />

      {/* <Footer1 /> */}
    </>
  );
}
