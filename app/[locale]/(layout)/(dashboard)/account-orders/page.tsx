import { HttpTypes } from "@medusajs/types";
import { retrieveOrders, retrieveOrderStats } from "@/data/orders";
import Orders from "@/components/dashboard/Orders";
import { requireAuth } from "@/data/auth";

export const metadata = {
  title: "Zgar Orders",
  description: "Zgar Orders",
};

interface OrdersPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function page({ searchParams }: OrdersPageProps) {
  // 老王我：统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();

  // 获取页码参数，默认第1页
  const currentPage = parseInt(searchParams.page || "1");
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // 老王我：并行获取订单数据和统计数据，提高性能
  const [ordersData, orderStats] = await Promise.all([
    retrieveOrders(limit, offset, "-created_at"),
    retrieveOrderStats()
  ]);

  // 计算总页数
  const totalPages = ordersData ? Math.ceil(ordersData.count / limit) : 1;

  return (
    <Orders
      customer={customer}
      orders={ordersData}
      orderStats={orderStats}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
