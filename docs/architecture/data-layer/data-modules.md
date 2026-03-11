# 数据模块 API 文档 (US-015)

## 概述

数据层 (`data/`) 提供与 Medusajs 后端交互的 Server Actions 和类型定义。所有数据操作都通过 Next.js Server Actions 在服务端执行。

## 模块结构

```
data/
├── products/          # 产品模块
├── cart/              # 购物车模块
├── orders/            # 订单模块
├── customer/          # 客户模块
├── auth/              # 认证模块
├── payments/          # 支付模块
├── addresses/         # 地址模块
├── anti-counterfeit/  # 防伪验证模块
├── points-products/   # 积分产品模块
├── tasks/             # 任务模块
├── transactions/      # 交易模块
├── banners/           # Banner 模块
├── articles/          # 文章模块
├── blogs.ts           # 博客数据
├── features.ts        # 功能特性
├── instagramPosts.ts  # Instagram 帖子
├── singleProductSlides.ts  # 单品幻灯片
└── index.ts           # 统一导出
```

## Products 模块 (`data/products/`)

### API 列表

```typescript
// 获取产品列表（支持分页和筛选）
export async function fetchProducts({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}): Promise<{
  response: { products: StoreProduct[]; count: number };
  nextPage: number | null;
}>

// 获取单个产品详情
export async function fetchProduct(id: string): Promise<StoreProduct>
```

### 使用示例

```typescript
import { fetchProducts, fetchProduct } from '@/data/products';

// 获取产品列表
const { response, nextPage } = await fetchProducts({
  pageParam: 1,
  queryParams: {
    limit: 20,
    category_id: ['cat_123'],
  },
});

// 获取产品详情
const product = await fetchProduct('prod_01J3R2K');
```

## Cart 模块 (`data/cart/`)

### API 列表

```typescript
// 获取购物车（自动创建）
export async function getOrSetCart(): Promise<StoreCart>

// 获取购物车（指定ID）
export async function retrieveCart(cartId?: string): Promise<StoreCart | null>

// 更新购物车
export async function updateCart(data: StoreUpdateCart): Promise<StoreCart>

// 添加商品到购物车
export async function addToCart(item: StoreAddCartLineItem): Promise<void>

// 更新商品数量
export async function updateLineItem({
  lineId,
  quantity,
}): Promise<void>

// 删除商品
export async function deleteLineItem(lineId: string): Promise<void>

// 设置配送方式
export async function setShippingMethod({
  cartId,
  shippingMethodId,
}): Promise<void>

// 应用促销码
export async function applyPromotions(codes: string[]): Promise<void>

// 提交订单
export async function placeOrder(cartId?: string): Promise<StoreCart | undefined>

// ZGAR 专用：购物车结算
export async function completeZgarCartCheckout(
  items: StoreAddCartLineItem[]
): Promise<any>

// ZGAR 专用：统一下单接口
export async function submitOrder(
  items: StoreAddCartLineItem[],
  provider_id?: string
): Promise<{ order: StoreOrder; message?: string }>

// ZGAR 专用：余额支付结算
export async function completeZgarCartCheckoutWithBalance(
  items: StoreAddCartLineItem[]
): Promise<CompleteCartWithBalanceResponse>

// 批量删除购物车商品
export async function batchDeleteCartItems(
  cartId: string,
  itemIds: string[]
): Promise<void>

// 批量添加商品到购物车
export async function batchAddCartItems(
  cartId: string,
  items: Array<{ variant_id: string; quantity: number; metadata?: any }>
): Promise<void>

// 批量更新购物车商品数量
export async function batchUpdateCartItems(
  cartId: string,
  items: Array<{ variant_id: string; quantity: number; metadata?: any }>
): Promise<void>
```

### 使用示例

```typescript
import {
  addToCart,
  updateLineItem,
  getOrSetCart,
  submitOrder
} from '@/data/cart';

// 添加商品
await addToCart({
  variant_id: 'variant_123',
  quantity: 2,
});

// 更新数量
await updateLineItem({
  lineId: 'line_123',
  quantity: 5,
});

// 获取购物车
const cart = await getOrSetCart();

// 提交订单
const { order } = await submitOrder(cart.items);
```

## Orders 模块 (`data/orders/`)

### API 列表

```typescript
// 获取订单列表
export async function retrieveOrders(
  limit?: number,
  offset?: number,
  order?: string
): Promise<{ orders: StoreOrder[]; count: number } | null>

// 获取订单详情
export async function retrieveOrderById(id: string): Promise<StoreOrder | null>

// 上传支付凭证
export async function uploadPaymentVoucherFiles(
  formData: FormData
): Promise<string[]>

// 提交支付凭证
export async function submitPaymentVoucher(
  orderId: string,
  voucherUrls: string[]
): Promise<void>

// 获取含自定义字段的订单
export async function retrieveOrderWithZgarFields(
  orderId: string
): Promise<(StoreOrder & { zgar_order?: any }) | null>

// 上传打包要求文件
export async function uploadPackingRequirementFiles(
  formData: FormData
): Promise<string[]>

// 提交打包要求
export async function submitPackingRequirement(
  orderId: string,
  data: { packing_requirement?: Record<string, any> }
): Promise<void>

// 上传结单附件
export async function uploadClosingInfoFiles(
  formData: FormData
): Promise<ClosingAttachment[]>

// 提交结单信息
export async function submitClosingInfo(
  orderId: string,
  data: {
    closing_remark?: string;
    closing_attachments?: ClosingAttachment[];
  }
): Promise<void>

// 更新结单信息
export async function updateClosingInfo(
  orderId: string,
  data: {
    closing_remark?: string;
    closing_attachments?: ClosingAttachment[];
  }
): Promise<void>

// 更新订单收货地址
export async function updateOrderShippingAddress(
  orderId: string,
  address: AddressData
): Promise<void>

// 获取订单统计
export async function retrieveOrderStats(): Promise<{
  unpaidVoucherCount: number;
  pendingClosingCount: number;
}>
```

### 使用示例

```typescript
import {
  retrieveOrders,
  retrieveOrderById,
  submitPaymentVoucher,
  submitPackingRequirement,
  submitClosingInfo
} from '@/data/orders';

// 获取订单列表
const { orders, count } = await retrieveOrders(10, 0, '-created_at');

// 获取订单详情
const order = await retrieveOrderById('order_123');

// 上传支付凭证
await submitPaymentVoucher('order_123', ['https://example.com/voucher.jpg']);

// 提交打包要求
await submitPackingRequirement('order_123', {
  packing_requirement: {
    shipping_marks: 'IMPORTANT',
    instructions: '小心轻放',
  }
});

// 提交结单信息
await submitClosingInfo('order_123', {
  closing_remark: '订单完成',
  closing_attachments: [...],
});
```

## Customer 模块 (`data/customer/`)

### API 列表

```typescript
// 获取当前客户信息
export async function retrieveCustomer(): Promise<StoreCustomer | null>

// 获取客户地址列表
export async function retrieveCustomerAddresses(): Promise<StoreCustomerAddress[]>

// 更新客户信息
export async function updateCustomer(body: StoreUpdateCustomer): Promise<StoreCustomer>

// 添加地址
export async function addCustomerAddress(
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<{ success: boolean; error?: string | null }>

// 删除地址
export async function deleteCustomerAddress(addressId: string): Promise<void>

// 更新地址
export async function updateCustomerAddress(
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<{ success: boolean; error?: string | null }>

// 获取含自定义字段的客户信息
export async function retrieveCustomerWithZgarFields(
  customerId?: string
): Promise<(StoreCustomer & { zgar_customer?: any }) | null>
```

### 使用示例

```typescript
import {
  retrieveCustomer,
  addCustomerAddress,
  updateCustomer
} from '@/data/customer';

// 获取客户信息
const customer = await retrieveCustomer();

// 添加地址
const result = await addCustomerAddress({}, formData);

// 更新客户信息
await updateCustomer({
  first_name: '张',
  last_name: '三',
  phone: '13800138000',
});
```

## Auth 模块 (`data/auth/`)

### API 列表

```typescript
// 强制认证检查（未登录则重定向）
export async function requireAuth(): Promise<StoreCustomer>

// 可选认证检查（不强制登录）
export async function getOptionalAuth(): Promise<StoreCustomer | null>

// 用户注册
export async function signup(
  currentState: unknown,
  formData: FormData
): Promise<{ error?: string }>

// 用户登录
export async function login(
  currentState: unknown,
  formData: FormData
): Promise<{ error?: string }>

// 用户登出
export async function signout(): Promise<{ success: boolean }>

// 重置密码
export async function resetPassword(
  currentState: unknown,
  formData: FormData
): Promise<{ success: boolean; message?: string }>

// 更新密码
export async function updatePassword(
  currentState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }>
```

### 使用示例

```typescript
import { requireAuth, login } from '@/data/auth';

// 服务端组件中强制认证
export default async function DashboardPage() {
  const customer = await requireAuth();

  return <Dashboard customer={customer} />;
}

// 客户端登录表单
const result = await login({}, formData);
if (result.error) {
  console.error('登录失败:', result.error);
}
```

## Payments 模块 (`data/payments/`)

### API 列表

```typescript
// 余额支付结算
export async function completeCartWithBalance(
  items: StoreAddCartLineItem[]
): Promise<CompleteCartWithBalanceResponse>
```

## Anti-counterfeit 模块 (`data/anti-counterfeit/`)

### API 列表

```typescript
// 查询防伪码基本信息
export async function queryCodeInfo(
  code: string
): Promise<QueryCodeInfoResponse>

// 验证防伪码真伪
export async function verifyCode(
  code: string
): Promise<VerifyCodeResponse>
```

### 使用示例

```typescript
import { queryCodeInfo, verifyCode } from '@/data/anti-counterfeit';

// 查询防伪码
const info = await queryCodeInfo('9IG15BI8');

// 验证防伪码
const result = await verifyCode('9IG15BI8123456');
```

## Banners 模块 (`data/banners/`)

### API 列表

```typescript
// 获取所有 Banner
export async function getAllBanners(): Promise<Banner[]>

// 获取活跃 Banner
export async function getActiveBanners(): Promise<Banner[]>

// 根据 ID 获取 Banner
export async function getBannerById(id: string): Promise<Banner | null>
```

## Addresses 模块 (`data/addresses/`)

### API 列表

```typescript
// 获取地址列表
export async function listAddresses(): Promise<StoreCustomerAddress[]>

// 添加地址
export async function addAddress(
  address: StoreCreateCustomerAddress
): Promise<StoreCustomerAddress>

// 更新地址
export async function updateAddress(
  addressId: string,
  address: StoreUpdateCustomerAddress
): Promise<StoreCustomerAddress>

// 删除地址
export async function deleteAddress(addressId: string): Promise<void>
```

## 错误处理

所有数据模块函数都使用 `medusaError` 工具统一处理错误：

```typescript
import medusaError from "@/utils/medusa-error";

try {
  const result = await someDataFunction();
} catch (error) {
  throw medusaError(error);
}
```

## 缓存策略

所有数据修改操作都会触发缓存更新：

```typescript
import { updateTag, revalidateTag } from "next/cache";

// 更新购物车后
const cartCacheTag = await getCacheTag("carts");
updateTag(cartCacheTag); // 立即重新获取

// 更新客户后
const customerCacheTag = await getCacheTag("customers");
revalidateTag(customerCacheTag, "max"); // 下次访问时重新获取
```

## 相关文档

- [Medusajs 集成文档](./medusa-integration.md)
- [验证模块文档](../modules/verify.md)
- [总体架构文档](../README.md)
