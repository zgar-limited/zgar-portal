import { Link } from '@/i18n/routing';

import Footer1 from "@/components/footers/Footer1";


import TrackOrder from "@/components/other-pages/TrackOrder";
import React from "react";

export const metadata = {
  title: "Order Track || Ochaka - Multipurpose eCommerce React Nextjs Template",
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
            <h1 className="title-page">Order Tracking</h1>
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
                <h6 className="current-page fw-normal">Order Tracking</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <TrackOrder />
      <Footer1 />
    </>
  );
}
