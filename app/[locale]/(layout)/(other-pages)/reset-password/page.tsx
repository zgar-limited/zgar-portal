import ResetPassword from "@/components/other-pages/ResetPassword";
import { retrieveCustomer } from "@/data/customer";
import { redirect } from "next/navigation";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import React from "react";

export const metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

export default async function page() {
  const customer = await retrieveCustomer();
  
  if (customer) {
    redirect("/");
  }

  return (
    <>


      <ResetPassword />

    </>
  );
}