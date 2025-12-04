import Link from "next/link";

import MyAccount from "@/components/dashboard/MyAccount";
import React from "react";

export const metadata = {
  title: "Zgar Account",
  description: "Zgar Account",
};
export default function page() {
  return (
    <>
      <MyAccount />
    </>
  );
}
