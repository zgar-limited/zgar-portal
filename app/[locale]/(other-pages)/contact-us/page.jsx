import Link from "next/link";
import Image from "next/image";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import Contact1 from "@/components/other-pages/contact/Contact1";
import React from "react";
export const metadata = {
  title: "Contact Us || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <section className="s-page-title">
        <div className="container">
          <div className="content">
            <h1 className="title-page">Contact Us</h1>
            <ul className="breadcrumbs-page">
              <li>
                <Link href={`/index`} className="h6 link">
                  Home
                </Link>
              </li>
              <li className="d-flex">
                <i className="icon icon-caret-right" />
              </li>
              <li>
                <h6 className="current-page fw-normal">Contact Us</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Contact1 />
      <Footer1 />
    </>
  );
}
