import { HttpTypes } from "@medusajs/types";
import { retrieveCustomer } from "@/data/customer";
import { retrieveOrders } from "@/data/orders";
import Orders from "@/components/dashboard/Orders";
import { notFound } from "next/navigation";

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
  // 获取页码参数，默认第1页
  const currentPage = parseInt(searchParams.page || "1");
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // 并行获取用户和订单数据
  const [customer, ordersData] = await Promise.all([
    retrieveCustomer(),
    retrieveOrders(limit, offset, "-created_at") // 老王我添加：显式传入倒序排序参数
  ]);

  // 检查用户是否已登录
  if (!customer) {
    notFound();
  }

  // 计算总页数
  const totalPages = ordersData ? Math.ceil(ordersData.count / limit) : 1;

  return (
    <Orders
      customer={customer}
      orders={ordersData}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
