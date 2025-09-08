import OffcanvasSidebar from "@/components/dashboard/OffcanvasSidebar";
import SidebarToggler from "@/components/dashboard/SidebarToggler";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import React from "react";

export default function layout({ children }) {
  return (
    <>
      <Topbar1 />
      <Header1 parentClass="tf-header header-fix" />

      {children}
      <SidebarToggler />
      <OffcanvasSidebar />

      <Footer1 />
    </>
  );
}
