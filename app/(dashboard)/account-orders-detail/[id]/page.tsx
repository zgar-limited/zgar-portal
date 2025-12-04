import Link from "next/link";

import OrderDetails from "@/components/dashboard/OrderDetails";
import React from "react";

export const metadata = {
  title:
    "Account Order Details || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <OrderDetails />
    </>
  );
}
