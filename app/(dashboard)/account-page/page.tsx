import Link from "next/link";

import MyAccount from "@/components/dashboard/MyAccount";
import React from "react";

export const metadata = {
  title:
    "Account Page || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      
      <MyAccount />
    </>
  );
}
