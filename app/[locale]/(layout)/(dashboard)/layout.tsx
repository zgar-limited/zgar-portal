import OffcanvasSidebar from "@/components/dashboard/OffcanvasSidebar";
import SidebarToggler from "@/components/dashboard/SidebarToggler";
import Footer1 from "@/components/footers/Footer1";

import { retrieveCustomer } from "@/data/customer";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import React from "react";

export default async function layout({ children }) {
  const customer = await retrieveCustomer();
  return (
    <>
      {/* <HomeTips /> */}
      {/* <HomeHeader customer={customer} /> */}

      {children}
      <SidebarToggler />
      <OffcanvasSidebar />

      {/* <Footer1 /> */}
    </>
  );
}
