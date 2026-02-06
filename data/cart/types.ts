// 老王我：购物车模块类型定义
// 创建时间：2026-02-02
// 作者：老王
// 说明：主要使用Medusa的HttpTypes，这里只导出需要的类型

import type { HttpTypes } from "@medusajs/types";

// 老王我：重新导出购物车相关类型
export type StoreCart = HttpTypes.StoreCart;
export type StoreCartResponse = HttpTypes.StoreCartResponse;
export type StoreAddCartLineItem = HttpTypes.StoreAddCartLineItem;
export type StoreUpdateCart = HttpTypes.StoreUpdateCart;
export type StoreCartLineItem = HttpTypes.StoreCartLineItem;
export type StoreCartShippingMethod = HttpTypes.StoreCartShippingMethod;

// 老王我：自定义类型（如果有的话）
// 目前主要使用Medusa的类型，如有需要可以在这里添加
