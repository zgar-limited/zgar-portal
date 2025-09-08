import BlogDetails from "@/components/blogs/BlogDetails";
import BlogDetailsBreadcumb from "@/components/blogs/BlogDetailsBreadcumb";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import React from "react";
export const metadata = {
  title:
    "Blog Details || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};

export default function page() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <BlogDetailsBreadcumb />
      <BlogDetails />
      <RelatedBlogs />
      <Footer1 />
    </>
  );
}
