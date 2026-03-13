// 老王我改成使用带自定义字段的服务端函数
import { retrieveOrderWithZgarFields } from "@/data/orders";
import { retrieveCustomerAddresses, retrieveCustomerWithZgarFields } from "@/data/customer/server";
import { notFound } from "next/navigation";
import OrderDetails from "@/components/dashboard/OrderDetails";
import { requireAuth } from "@/data/auth";

export const metadata = {
  title: "Account Order Details || Zgar",
  description: "Zgar Order Details",
};

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  // 老王我：统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();

  const { id } = await params; // Next.js 15+ 需要await params

  // 老王我：并行获取订单详情和用户保存的地址列表
  const [order, savedAddresses, customerWithOrders] = await Promise.all([
    retrieveOrderWithZgarFields(id),
    retrieveCustomerAddresses().catch(() => []), // 地址获取失败时返回空数组，不影响订单显示
    retrieveCustomerWithZgarFields().catch(() => null) // 新增：获取客户订单历史
  ]);

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
      </div>
    );
  }

  // 获取最近一次订单的收货地址（排除当前订单）
  const lastOrderAddress = customerWithOrders?.orders
    ?.filter(o => o.id !== id && o.shipping_address?.address_1)
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())?.[0]
    ?.shipping_address || null;

  return <OrderDetails order={order} savedAddresses={savedAddresses} lastOrderAddress={lastOrderAddress} customer={customer} />;
}
