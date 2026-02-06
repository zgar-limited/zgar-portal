# RSC架构全面重构设计文档

> **创建时间**：2026-02-02
> **作者**：老王
> **状态**：设计阶段
> **目标**：解决所有客户端组件直接调用API的问题，实现完整的RSC架构

---

## 📋 目录

1. [问题分析](#问题分析)
2. [架构设计](#架构设计)
3. [数据层重构](#数据层重构)
4. [组件层重构](#组件层重构)
5. [实施计划](#实施计划)

---

## 问题分析

### 当前问题

**发现的客户端API调用问题：**

| 组件 | 问题类型 | API端点 | 影响 |
|------|---------|---------|------|
| `Addressess.tsx` | 直接调用 `medusaSDK.client.fetch` | `/store/customers/me/addresses` | 请求在浏览器中暴露 |
| `Orders.tsx` | 客户端调用服务端函数 | `/store/customers/me/orders` | 架构错误 |
| `ShopCart.tsx` | 调用了删除 `use server` 的函数 | `/store/zgar/payment-providers` | 兼容性问题 |
| `OrderDetails.tsx` | ✅ 已修复 | - | 已使用React Query |

### 根本原因

1. **缺少统一的数据层架构**
2. **服务端和客户端代码混合**
3. **缺少Server Actions封装**
4. **没有使用React Query的RSC模式**

---

## 架构设计

### 核心原则

1. ✅ **所有API调用必须在Server Component或Server Action中完成**
2. ✅ **客户端组件只负责UI渲染和用户交互**
3. ✅ **数据通过props或React Query传递给客户端组件**
4. ✅ **用户操作通过Server Actions触发**

### 三层架构

```
┌─────────────────────────────────────────┐
│   Layer 1: Server Component (Page)      │
│   - 数据获取 (React Query prefetch)      │
│   - 传递数据给客户端组件                │
│   - 定义Server Actions                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Layer 2: Data Layer (Server Actions)  │
│   - API调用 (带 "use server")           │
│   - 数据验证                            │
│   - 错误处理                            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Layer 3: Client Component (UI)        │
│   - 接收props/React Query数据           │
│   - UI渲染                             │
│   - 调用Server Actions                  │
└─────────────────────────────────────────┘
```

---

## 数据层重构

### 目录结构

```
data/
├── payments/                 # 支付模块
│   ├── server.ts            # 服务端API (use server)
│   ├── actions.ts           # Server Actions (use server)
│   └── types.ts             # 类型定义
├── orders/                  # 订单模块
│   ├── server.ts            # 保留现有 (use server)
│   ├── actions.ts           # 新增 Server Actions
│   └── types.ts             # 类型定义
├── addresses/               # 地址管理模块（新增）
│   ├── server.ts            # 服务端API (use server)
│   ├── actions.ts           # Server Actions (use server)
│   └── types.ts             # 类型定义
├── customers/               # 客户模块
│   ├── server.ts            # 保留现有 (use server)
│   └── types.ts
└── index.ts                 # 统一导出
```

### 1. 支付模块重构

**data/payments/server.ts**
```typescript
"use server"

import { medusaSDK } from "@/utils/medusa";
import { getAuthHeaders } from "@/utils/cookies";

/**
 * 获取支付记录列表
 */
export async function getPaymentRecords(orderId: string) {
  const authHeaders = await getAuthHeaders();

  const response = await medusaSDK.client.fetch(
    `/admin/zgar/orders/${orderId}/payment-records`,
    {
      headers: authHeaders
    }
  );

  if (!response.ok) {
    throw new Error('获取支付记录失败');
  }

  return await response.json();
}

/**
 * 获取支付提供商列表
 */
export async function getPaymentProviders(type: "normal" | "redemption" = "normal") {
  const authHeaders = await getAuthHeaders();

  const response = await medusaSDK.client.fetch(
    `/store/zgar/payment-providers?type=${type}`,
    {
      headers: authHeaders
    }
  );

  return await response.json();
}
```

**data/payments/actions.ts**
```typescript
"use server"

import { createPayment as createPaymentAPI } from "./server";

export async function createPaymentAction(data: {
  orderId: string;
  amount: number;
  payment_method: "balance" | "manual";
  payment_description?: string;
  installment_number?: number;
}) {
  try {
    const result = await createPaymentAPI(data.orderId, {
      amount: data.amount,
      payment_method: data.payment_method,
      payment_description: data.payment_description,
      installment_number: data.installment_number
    });

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadPaymentVoucherAction(data: {
  orderId: string;
  payment_record_id: string;
  payment_voucher_url: string;
}) {
  // 类似实现
}
```

### 2. 订单模块重构

**data/orders/actions.ts**（新增）
```typescript
"use server"

import { retrieveOrders } from "./server";

export async function retrieveOrdersAction() {
  try {
    const orders = await retrieveOrders();
    return { success: true, data: orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

### 3. 地址管理模块（新增）

**data/addresses/server.ts**
```typescript
"use server"

import { medusaSDK } from "@/utils/medusa";
import { getAuthHeaders } from "@/utils/cookies";

export async function getAddresses() {
  const authHeaders = await getAuthHeaders();

  const response = await medusaSDK.client.fetch(
    '/store/customers/me/addresses',
    { headers: authHeaders }
  );

  return await response.json();
}

export async function createAddress(data: any) {
  const authHeaders = await getAuthHeaders();

  const response = await medusaSDK.client.fetch(
    '/store/customers/me/addresses',
    {
      method: 'POST',
      headers: authHeaders,
      body: data
    }
  );

  return await response.json();
}

export async function updateAddress(id: string, data: any) {
  const authHeaders = await getAuthHeaders();

  const response = await medusaSDK.client.fetch(
    `/store/customers/me/addresses/${id}`,
    {
      method: 'POST',
      headers: authHeaders,
      body: data
    }
  );

  return await response.json();
}

export async function deleteAddress(id: string) {
  const authHeaders = await getAuthHeaders();

  const response = await medusaSDK.client.fetch(
    `/store/customers/me/addresses/${id}`,
    {
      method: 'DELETE',
      headers: authHeaders
    }
  );

  return await response.json();
}
```

**data/addresses/actions.ts**
```typescript
"use server"

import * as server from "./server";

export async function getAddressesAction() {
  try {
    const addresses = await server.getAddresses();
    return { success: true, data: addresses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAddressAction(data: any) {
  try {
    const result = await server.createAddress(data);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAddressAction(id: string, data: any) {
  try {
    const result = await server.updateAddress(id, data);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAddressAction(id: string) {
  try {
    await server.deleteAddress(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

---

## 组件层重构

### 1. 创建React Query基础设施

**components/providers/QueryClientProvider.tsx**
```typescript
"use client"

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
```

**components/providers/HydrateClient.tsx**
```typescript
"use client"

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export default function HydrateClient({
  children,
  state
}: {
  children: React.ReactNode;
  state: unknown
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  // 手动hydrate（使用state作为初始数据）
  queryClient.setDefaultOptions({
    queries: {
      ...queryClient.getDefaultOptions().queries,
    },
  });

  return (
    <HydrationBoundary state={state}>
      {children}
    </HydrationBoundary>
  );
}
```

### 2. 重构页面组件

**app/[locale]/(layout)/(dashboard)/account/orders/page.tsx**
```typescript
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { retrieveOrders } from "@/data/orders/server";
import { getPaymentProviders } from "@/data/payments/server";
import HydrateClient from "@/components/providers/HydrateClient";
import Orders from "@/components/dashboard/Orders";

export default async function OrdersPage() {
  const queryClient = new QueryClient();

  // Prefetch数据
  await queryClient.prefetchQuery({
    queryKey: ['orders'],
    queryFn: () => retrieveOrders()
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <Orders />
    </HydrateClient>
  );
}
```

### 3. 重构客户端组件

**components/dashboard/Orders.tsx**
```typescript
"use client"

import { useQuery } from "@tanstack/react-query";
import { retrieveOrdersAction } from "@/data/orders/actions";

export default function Orders() {
  // 使用React Query获取数据
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => retrieveOrdersAction()
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  const orders = response?.data;

  return (
    <div>
      {/* 渲染订单列表 */}
    </div>
  );
}
```

**components/dashboard/Addressess.tsx**
```typescript
"use client"

import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAddressesAction,
  createAddressAction,
  updateAddressAction,
  deleteAddressAction
} from "@/data/addresses/actions";

export default function Addressess() {
  const queryClient = useQueryClient();

  // 获取地址列表
  const { data: response, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddressesAction()
  });

  // 创建地址mutation
  const createMutation = useMutation({
    mutationFn: createAddressAction,
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses']);
    }
  });

  // 更新地址mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAddressAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses']);
    }
  });

  // 删除地址mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAddressAction,
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses']);
    }
  });

  const addresses = response?.data;

  return (
    <div>
      {/* 渲染地址列表 */}
    </div>
  );
}
```

---

## 实施计划

### 第一步：创建React Query基础设施（30分钟）
- [ ] 创建 `components/providers/QueryClientProvider.tsx`
- [ ] 创建 `components/providers/HydrateClient.tsx`
- [ ] 在根布局中添加 QueryClientProvider

### 第二步：重构支付模块（1小时）
- [ ] 创建 `data/payments/server.ts`
- [ ] 创建 `data/payments/actions.ts`
- [ ] 创建 `data/payments/types.ts`
- [ ] 更新 ShopCart 组件使用 Server Actions

### 第三步：重构地址管理模块（1小时）
- [ ] 创建 `data/addresses/server.ts`
- [ ] 创建 `data/addresses/actions.ts`
- [ ] 创建 `data/addresses/types.ts`
- [ ] 重构 Addressess 组件使用 Server Actions

### 第四步：重构订单模块（1小时）
- [ ] 创建 `data/orders/actions.ts`
- [ ] 更新 Orders 页面组件 prefetch数据
- [ ] 更新 Orders 组件使用 React Query

### 第五步：测试和优化（1小时）
- [ ] 测试所有重构的功能
- [ ] 检查网络请求是否都在服务端发送
- [ ] 验证错误处理是否正常工作

**总计时间：约4.5小时**

---

## 验收标准

### 技术指标
- [ ] 所有客户端组件不再直接调用 API
- [ ] 所有 API 请求都在服务端发送（Chrome Network看不到API请求）
- [ ] 所有 Server Actions 带 `"use server"` 指令
- [ ] React Query prefetch 和 hydrate 正常工作

### 功能测试
- [ ] 地址管理功能正常（增删改查）
- [ ] 订单列表正常加载和分页
- [ ] 支付方式列表正常显示
- [ ] 错误处理和提示正常

---

*文档创建时间：2026-02-02*
*老王出品，必属精品！*
