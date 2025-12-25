import { retrieveCustomer } from "@/data/customer";
// 老王我改成使用带自定义字段的服务端函数
import { retrieveOrderWithZgarFields } from "@/data/orders";
import { notFound } from "next/navigation";
import OrderDetails from "@/components/dashboard/OrderDetails";

export const metadata = {
  title: "Account Order Details || Zgar",
  description: "Zgar Order Details",
};

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Next.js 15+ 需要await params

  const [customer, order] = await Promise.all([
    retrieveCustomer(),
    // 老王我改成用新函数获取包含 zgar_order 自定义字段的订单
    retrieveOrderWithZgarFields(id),
  ]);

  if (!customer) {
    notFound();
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
      </div>
    );
  }

  return <OrderDetails order={order} />;
}
