import UpdatePassword from "@/components/other-pages/UpdatePassword";
import { retrieveCustomer } from "@/data/customer";
import { redirect } from "next/navigation";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import React, { Suspense } from "react";

export const metadata = {
  title: "Update Password",
  description: "Update your password",
};

export default async function page() {
  const customer = await retrieveCustomer();
  
  if (customer) {
    redirect("/");
  }

  return (
    <>
      
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatePassword />
      </Suspense>

    </>
  );
}