
import Login from "@/components/other-pages/Login";
import { retrieveCustomer } from "@/data/customer";
import { redirect } from "next/navigation";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import { Link } from '@/i18n/routing';
import React from "react";
export const metadata = {
  title: "Login ",
  description: "",
};
export default async function page() {
  // 老王我：检查用户是否已登录（token 有效）
  const customer = await retrieveCustomer();
  console.log('%c [ customer ]-16', 'font-size:13px; background:pink; color:#bf2c9f;', customer)

  // 老王我：如果 customer 存在，说明 token 有效，重定向到账户页
  if (customer) {
    redirect("/account-page");
  }

  // 老王我：如果 customer 为 null（token 无效或过期），显示登录表单
  return (
    <>



      <Login />

    </>
  );
}
