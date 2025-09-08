import Link from "next/link";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";

import Products2 from "@/components/products/Products2";
import React from "react";

export const metadata = {
  title: "Shop || Ochaka - Multipurpose eCommerce React Nextjs Template",
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
            <h1 className="title-page">Shop Hover Style 07</h1>
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
                <h6 className="current-page fw-normal">Shop</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Products2 gridCardStyle={7} defaultActiveLayout={4} />

      <Footer1 />
    </>
  );
}
