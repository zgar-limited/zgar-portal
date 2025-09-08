import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";

import Register from "@/components/other-pages/Register";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Register || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header1 parentClass="tf-header header-fix" />
      <section className="s-page-title">
        <div className="container">
          <div className="content">
            <h1 className="title-page">Register</h1>
            <ul className="breadcrumbs-page">
              <li>
                <Link href={`/`} className="h6 link">
                  Home
                </Link>
              </li>
              <li className="d-flex">
                <i className="icon icon-caret-right" />
              </li>
              <li>
                <h6 className="current-page fw-normal">Register</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Register />
      <Footer1 />
    </>
  );
}
