// 老王我改成使用带自定义字段的服务端函数，可以获取 zgar_customer.balance 等字段
import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { retrieveOrders } from "@/data/orders";
import MyAccount from "@/components/dashboard/MyAccount";
import { HttpTypes } from "@medusajs/types";

export const metadata = {
  title: "Zgar Account",
  description: "Zgar Account",
};

export default async function page() {
  // 老王我改成使用 retrieveCustomerWithZgarFields 获取包含 zgar_customer 自定义字段的用户信息
  const [customer, ordersData] = await Promise.all([
    retrieveCustomerWithZgarFields(),
    retrieveOrders(5, 0) // 获取最近5个订单
  ]);

  const orders = ordersData?.orders || [];

  return (
    <>
      <MyAccount
        customer={customer}
        orders={orders}
      />
    </>
  );
}
