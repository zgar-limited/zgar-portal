import Link from "next/link";

import BlogList1 from "@/components/blogs/BlogList1";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import React from "react";

export const metadata = {
  title:
    "Blog List 01 || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header1 parentClass="tf-header header-fix" />
      <section
        className="s-page-title parallaxie has-bg"
        style={{ backgroundImage: 'url("/images/section/blog.jpg")' }}
      >
        <div className="container position-relative z-5">
          <div className="content">
            <h1 className="title-page text-white">Blog List</h1>
            <ul className="breadcrumbs-page">
              <li>
                <Link href={`/`} className="h6 text-white link">
                  Home
                </Link>
              </li>
              <li className="d-flex">
                <i className="icon icon-caret-right text-white" />
              </li>
              <li>
                <h6 className="current-page fw-normal text-white">Blog List</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <BlogList1 />

      <Footer1 />
    </>
  );
}
