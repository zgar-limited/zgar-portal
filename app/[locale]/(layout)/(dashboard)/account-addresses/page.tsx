import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { retrieveCustomer } from '@/data/customer';
import { retrieveCustomerAddresses } from '@/data/customer';
import { notFound } from 'next/navigation';
import AddressesClient from './AddressesClient';

export const metadata: Metadata = {
  title: '地址管理 || Zgar - 专业电子烟品牌',
  description: '管理您的收货地址信息，Zgar专业电子烟品牌',
};

export default async function AddressesPage() {
  const [customer, addresses] = await Promise.all([
    retrieveCustomer(),
    retrieveCustomerAddresses().catch(() => []),
  ]);

  if (!customer) {
    notFound();
  }

  const t = await getTranslations('Account');

  return <AddressesClient customer={customer} addresses={addresses} />;
}