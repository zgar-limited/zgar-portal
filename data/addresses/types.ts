// 老王我：地址管理模块类型定义
// 创建时间：2026-02-02
// 作者：老王
// 类型定义：参考 Medusa StoreCustomerAddress

/**
 * 地址类型（与 Medusa StoreCustomerAddress 一致）
 */
export interface Address {
  id?: string;
  first_name: string;
  last_name: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  company?: string;
  metadata?: Record<string, any>;
}

/**
 * 地址列表响应
 */
export interface AddressListResponse {
  addresses: Address[];
  count: number;
}

// 老王我：为了兼容性，导出类型别名
export type StoreCustomerAddress = Address;
