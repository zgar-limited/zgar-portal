// 老王我：客户模块类型定义
// 创建时间：2026-02-02
// 作者：老王
// 说明：主要使用Medusa的HttpTypes，这里只导出需要的类型

import type { HttpTypes } from "@medusajs/types";

// 老王我：重新导出客户相关类型
export type StoreCustomer = HttpTypes.StoreCustomer;
export type StoreUpdateCustomer = HttpTypes.StoreUpdateCustomer;
export type StoreCustomerAddress = HttpTypes.StoreCustomerAddress;
export type StoreUpdateCustomerAddress = HttpTypes.StoreUpdateCustomerAddress;

// 老王我：自定义类型（如果有的话）
// 目前主要使用Medusa的类型，如有需要可以在这里添加
