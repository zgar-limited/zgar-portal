# Medusajs 集成文档 (US-014)

## 概述

Zgar Portal 使用 Medusajs 作为后端电商系统，通过官方 `@medusajs/js-sdk` 进行集成。项目支持服务端和客户端两种调用模式。

## SDK 配置

```typescript
// utils/medusa.ts
import Medusa from "@medusajs/js-sdk";

export const medusaSDK = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY,
  globalHeaders: {
    "x-publishable-api-key": process.env.MEDUSA_PUBLISHABLE_KEY,
  },
  auth: {
    jwtTokenStorageKey: "token",
    type: "jwt",
  },
});
```

## 调用模式

### 1. 服务端调用 (Server Actions / Server Components)

服务端调用需要手动传递认证头和语言信息：

```typescript
import { getMedusaHeaders } from "@/utils/medusa-server";
import { medusaSDK } from "@/utils/medusa";
import { getLocale } from "next-intl/server";

export async function retrieveProduct(id: string) {
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  return medusaSDK.client.fetch(`/store/products/${id}`, {
    method: "GET",
    headers,
  });
}
```

### 2. 客户端调用 (Client Components)

客户端调用由 SDK 自动处理认证和语言：

```typescript
"use client";

import { medusaSDK } from "@/utils/medusa";

export function AddToCartButton({ variantId, quantity }) {
  const handleAddToCart = async () => {
    // SDK 自动从 localStorage 读取 token
    await medusaSDK.store.cart.addLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
  };

  return <button onClick={handleAddToCart}>添加到购物车</button>;
}
```

## 认证管理

### Token 存储

Token 存储在浏览器 `localStorage` 中，键名为 `token`：

```typescript
// utils/cookies.ts

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: false, // 客户端需要读取
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7天
  });
}

export async function getAuthHeaders(): Promise<Record<string, string> | null> {
  const token = await getAuthToken();
  return token ? { authorization: `Bearer ${token}` } : null;
}
```

### 用户注册

```typescript
// data/auth/server.ts

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string;
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  };

  // 1. 注册账户
  const token = await medusaSDK.auth.register("customer", "emailpass", {
    email: customerForm.email,
    password: password,
  });

  // 2. 创建客户信息
  await setAuthToken(token as string);
  await medusaSDK.store.customer.create(customerForm);

  // 3. 自动登录
  const loginToken = await medusaSDK.auth.login("customer", "emailpass", {
    email: customerForm.email,
    password,
  });

  await setAuthToken(loginToken as string);
}
```

### 用户登录

```typescript
export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const token = await medusaSDK.auth.login("customer", "emailpass", {
      email,
      password,
    });

    await setAuthToken(token as string);

    // 清除缓存
    const customerCacheTag = await getCacheTag("customers");
    revalidateTag(customerCacheTag, "max");
  } catch (error: any) {
    return { error: error.message || error.toString() };
  }

  redirect("/");
}
```

### 用户登出

```typescript
export async function signout() {
  await medusaSDK.auth.logout();
  await removeAuthToken();

  // 清除缓存
  const customerCacheTag = await getCacheTag("customers");
  updateTag(customerCacheTag);

  await removeCartId();

  const cartCacheTag = await getCacheTag("carts");
  updateTag(cartCacheTag);

  return { success: true };
}
```

## 服务端工具函数

服务端专用工具函数位于 `utils/medusa-server.ts`：

```typescript
/**
 * 获取服务端专用的 Medusa 请求头
 */
export function getMedusaHeaders(
  locale: string,
  authHeaders?: Record<string, string> | null
): HeadersInit

/**
 * 服务端 fetch 包装器
 */
export async function serverFetch<T>(
  endpoint: string,
  options?: {
    method?: string;
    body?: any;
    locale?: string;
  }
): Promise<T>

/**
 * 获取服务端专用的后端 URL
 */
export function getServerBackendUrl(): string

/**
 * 转换语言代码给 Medusa
 */
export function convertLocaleForMedusa(locale: string): string
```

## 自定义端点

项目使用多个 ZGAR 自定义端点：

| 端点 | 用途 |
|------|------|
| `/store/zgar/products` | 产品列表（可见性过滤） |
| `/store/zgar/products/:id` | 产品详情（可见性检查） |
| `/store/zgar/customers/me` | 客户信息（含 zgar_customer 字段） |
| `/store/zgar/orders/:id/transition` | 订单状态流转 |
| `/store/zgar/cart/complete` | 购物车结算 |
| `/store/zgar/cart/complete-with-balance` | 余额支付结算 |
| `/store/zgar/files` | 文件上传 |

## 缓存策略

### 使用缓存标签

```typescript
import { getCacheTag, revalidateTag, updateTag } from "@/utils/cookies";

// 获取缓存标签
const cartCacheTag = await getCacheTag("carts");

// 清除缓存（立即重新获取）
updateTag(cartCacheTag);

// 重新验证缓存（下次访问时重新获取）
revalidateTag(cartCacheTag, "max");
```

### 缓存配置

```typescript
import { getCacheOptions } from "@/utils/cookies";

const next = {
  ...(await getCacheOptions("carts")),
};

// 使用 next 配置
medusaSDK.client.fetch(url, {
  method: "GET",
  headers,
  next, // { tags: ["cart"], revalidate: 300 }
});
```

## 类型定义

所有 Medusajs 类型使用 `@medusajs/types` 包：

```typescript
import type {
  StoreProduct,
  StoreCart,
  StoreCustomer,
  StoreOrder,
  StoreCartLineItem,
} from "@medusajs/types";
```

## 最佳实践

1. **服务端函数必须传 headers**
   ```typescript
   // ✅ 正确
   const headers = getMedusaHeaders(locale, authHeaders);
   await medusaSDK.client.fetch(url, { headers });

   // ❌ 错误 - 服务端读不到 localStorage
   await medusaSDK.client.fetch(url);
   ```

2. **使用高级方法时注意**
   ```typescript
   // SDK 高级方法不支持 headers，必须用 client.fetch
   await medusaSDK.client.fetch(`/store/carts/${id}/line-items`, {
     method: "POST",
     headers,
     body: { variant_id, quantity },
   });
   ```

3. **缓存更新**
   ```typescript
   // 修改数据后立即更新缓存
   updateTag(await getCacheTag("carts"));
   ```

## 相关文档

- [数据模块 API 文档](./data-modules.md)
- [总体架构文档](../README.md)
- [验证模块文档](../modules/verify.md)
