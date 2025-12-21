import { retrieveCustomer } from "@/data/customer";
import { retrieveOrders } from "@/data/orders";
import MyAccount from "@/components/dashboard/MyAccount";
import { HttpTypes } from "@medusajs/types";

export const metadata = {
  title: "Zgar Account",
  description: "Zgar Account",
};

export default async function page() {
  // 在RSC层并行获取数据
  const [customer, ordersData] = await Promise.all([
    retrieveCustomer(),
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
