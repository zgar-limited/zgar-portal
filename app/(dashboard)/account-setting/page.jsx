import Link from "next/link";

import AccountSettings from "@/components/dashboard/AccountSettings";
import React from "react";

export const metadata = {
  title:
    "Account Settings || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <section className="s-page-title">
        <div className="container">
          <div className="content">
            <h1 className="title-page">My Account</h1>
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
                <h6 className="current-page fw-normal">My account</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <AccountSettings />
    </>
  );
}
