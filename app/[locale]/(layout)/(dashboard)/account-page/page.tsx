// 老王我简化：布局和 Sidebar 都在 layout 层处理了
// 这里只需要返回页面内容组件即可
import MyAccount from "@/components/dashboard/MyAccount";
import Tasks from "@/components/dashboard/Tasks";
import { retrieveOrders } from "@/data/orders";
import { getTasks } from "@/data/tasks";
import { requireAuth } from "@/data/auth";

export const metadata = {
  title: "Zgar Account",
  description: "Zgar Account",
};

export default async function page() {
  // 老王我：统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();

  // 老王我说明：虽然 requireAuth 已经获取了 customer
  // 但这里需要再次获取 orders 和 tasks（Next.js 会缓存，性能影响不大）
  const [ordersData, tasksData] = await Promise.all([
    retrieveOrders(5, 0, "-created_at"), // 老王我添加：最近5条订单，倒序排列
    getTasks() // 老王我获取任务列表数据
  ]);

  const orders = ordersData?.orders || [];
  const tasks = tasksData?.tasks || [];

  return <MyAccount customer={customer} orders={orders} tasks={tasks} />;
}
