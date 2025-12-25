// 老王我简化：布局和 Sidebar 都在 layout 层处理了
// 这里只需要返回页面内容组件即可
import MyAccount from "@/components/dashboard/MyAccount";
import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { retrieveOrders } from "@/data/orders";

export const metadata = {
  title: "Zgar Account",
  description: "Zgar Account",
};

export default async function page() {
  // 老王我说明：虽然 layout 已经获取了数据用于 Sidebar
  // 但 MyAccount 组件也需要数据来显示右侧内容
  // 所以这里需要再次获取（Next.js 会缓存，性能影响不大）
  const [customer, ordersData] = await Promise.all([
    retrieveCustomerWithZgarFields(),
    retrieveOrders(5, 0)
  ]);

  const orders = ordersData?.orders || [];

  return <MyAccount customer={customer} orders={orders} />;
}
