import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import Login from "@/components/other-pages/Login";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Login || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <HomeTips />
      <HomeHeader parentClass="tf-header header-fix" />

      <Login />
      <HomeFooter />
    </>
  );
}
