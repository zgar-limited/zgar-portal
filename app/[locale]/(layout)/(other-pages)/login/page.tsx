
import Login from "@/components/other-pages/Login";
import { retrieveCustomer } from "@/data/customer";
import { redirect } from "next/navigation";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import { Link } from '@/i18n/routing';
import React from "react";
export const metadata = {
  title: "Login ",
  description: "",
};
export default async function page() {
  const customer = await retrieveCustomer();
  console.log('%c [ customer ]-16', 'font-size:13px; background:pink; color:#bf2c9f;', customer)
  if (customer) {
    redirect("/");
  }
  return (
    <>
      <HomeTips />
      <HomeHeader parentClass="tf-header header-fix" customer={customer} />

      <Login />
      <HomeFooter />
    </>
  );
}
