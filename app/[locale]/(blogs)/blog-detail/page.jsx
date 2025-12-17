import BlogDetails from "@/components/blogs/BlogDetails";
import BlogDetailsBreadcumb from "@/components/blogs/BlogDetailsBreadcumb";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import React from "react";
export const metadata = {
  title:
    "Blog Details || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};

export default function page() {
  return (
    <>
      <HomeHeader />
      <BlogDetailsBreadcumb />
      <BlogDetails />
      <RelatedBlogs />
      <HomeFooter />
    </>
  );
}
