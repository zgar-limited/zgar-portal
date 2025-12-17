import Link from "next/link";

import BlogGrid from "@/components/blogs/BlogGrid";

import React from "react";

export const metadata = {
  title: "Blog Grid || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      
      <section
        className="s-page-title parallaxie has-bg"
        style={{ backgroundImage: 'url("/images/section/blog.jpg")' }}
      >
        <div className="container position-relative z-5">
          <div className="content">
            <h1 className="text-white title-page">Blog Grid</h1>
            <ul className="breadcrumbs-page">
              <li>
                <Link href={`/`} className="text-white h6 link">
                  Home
                </Link>
              </li>
              <li className="d-flex">
                <i className="text-white icon icon-caret-right" />
              </li>
              <li>
                <h6 className="text-white current-page fw-normal">Blog Grid</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <BlogGrid />

    </>
  );
}
