import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { retrieveCustomerAddresses } from '@/data/customer';
import { requireAuth } from '@/data/auth';
import AddressesClient from './AddressesClient';

export const metadata: Metadata = {
  title: '地址管理 || Zgar - 专业电子烟品牌',
  description: '管理您的收货地址信息，Zgar专业电子烟品牌',
};

export default async function AddressesPage() {
  // 老王我：统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();

  // 获取地址列表
  const addresses = await retrieveCustomerAddresses().catch(() => []);

  const t = await getTranslations('Account');

  return <AddressesClient customer={customer} addresses={addresses} />;
}