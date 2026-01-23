// 老王我：account-page 页面显示账户概览 + 导航卡片 + 任务列表
import AccountSummary from "@/components/dashboard/AccountSummary";
import Tasks from "@/components/dashboard/Tasks";
import AccountNavCards from "@/components/dashboard/AccountNavCards";
import { getTasks } from "@/data/tasks";
import { requireAuth } from "@/data/auth";
import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { retrieveOrders } from "@/data/orders";

export const metadata = {
  title: "Zgar Account",
  description: "Zgar Account",
};

export default async function page() {
  // 老王我：统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();

  // 老王我获取完整的 customer 数据（包含 zgar_customer 字段）
  const customerWithZgar = await retrieveCustomerWithZgarFields();

  // 老王我获取订单数据
  const ordersData = await retrieveOrders(5, 0);
  const orders = ordersData?.orders || [];

  // 老王我获取任务列表数据，确保不会是 undefined
  const tasksData = await getTasks();
  const tasks = Array.isArray(tasksData?.tasks) ? tasksData.tasks : [];

  return (
    <div className="space-y-6">
      {/* 老王我：账户概览 - Vibrant Blocks 粉色立体风格 */}
      <AccountSummary customer={customerWithZgar} orders={orders} />

      {/* 老王我：导航卡片 - 前往商城 + 积分兑换 */}
      <AccountNavCards />

      {/* 任务列表 */}
      <Tasks initialTasks={tasks} />
    </div>
  );
}
