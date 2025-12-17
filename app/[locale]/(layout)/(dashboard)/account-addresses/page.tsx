import Link from "next/link";

import Addressess from "@/components/dashboard/Addressess";
import React from "react";

export const metadata = {
  title: "Account Addesses || Zgar - Most Popular Vaping ",
  description: "Zgar - Most Popular Vaping",
};
export default function page() {
  return (
    <>
      <Addressess />
    </>
  );
}
