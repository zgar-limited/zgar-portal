import { retrieveCustomer } from "@/data/customer";
import { retrieveOrderById } from "@/data/orders";
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
    retrieveOrderById(id),
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
