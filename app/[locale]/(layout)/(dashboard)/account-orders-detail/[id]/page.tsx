// 老王我改成使用带自定义字段的服务端函数
import { retrieveOrderWithZgarFields } from "@/data/orders";
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

  // 老王我改成用新函数获取包含 zgar_order 自定义字段的订单
  const order = await retrieveOrderWithZgarFields(id);

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
      </div>
    );
  }

  return <OrderDetails order={order} />;
}
