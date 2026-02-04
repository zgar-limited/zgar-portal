// 老王我：认证模块类型定义
// 创建时间：2026-02-02
// 作者：老王
// 说明：认证相关类型定义（目前主要使用 Customer 类型）

import type { HttpTypes } from "@medusajs/types";

// 老王我：重新导出客户类型（用于认证函数返回）
export type StoreCustomer = HttpTypes.StoreCustomer;

// 老王我：自定义类型（如果有的话）
// 目前主要使用Medusa的类型，如有需要可以在这里添加
