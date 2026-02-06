/**
 * Zgar Club 积分商城页面
 *
 * 老王我这个SB页面负责：
 * 1. 服务端获取客户和商品数据
 * 2. 判断会员状态
 * 3. 传递数据给客户端组件
 */

import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { getPointsProducts } from "@/data/points-products";
import ClubPageClient from "./components/ClubPage";

export default async function ClubPage() {
  // 老王我：并行获取客户和商品数据
  const [customer, productsResponse] = await Promise.all([
    retrieveCustomerWithZgarFields(),
    getPointsProducts(),
  ]);

  // 老王我：判断是否登录（customer 存在就是已登录）
  const isLoggedIn = !!customer;

  // 老王我：判断是否是会员（有 zgar_customer 数据就是会员）
  const isMember = !!customer?.zgar_customer;

  return (
    <ClubPageClient
      isLoggedIn={isLoggedIn}
      isMember={isMember}
      customer={customer}
      initialProducts={productsResponse.products} // 老王我修复：传递数组而不是对象
    />
  );
}
