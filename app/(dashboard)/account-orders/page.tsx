import Link from "next/link";

import Orders from "@/components/dashboard/Orders";
import React from "react";

export const metadata = {
  title: "Zgar Orders",
  description: "Zgar Orders",
};
export default function page() {
  return <Orders />;
}
