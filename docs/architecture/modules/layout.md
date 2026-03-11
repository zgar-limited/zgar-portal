# 主布局模块 (Layout Module)

> 模块路径: `app/[locale]/(layout)`

## 模块概述

主布局模块是 Zgar Portal 应用的核心布局容器，负责全局 UI 结构、用户认证状态管理、购物车数据获取以及多语言支持。该模块为所有子页面提供统一的头部导航、底部信息、全局提示系统和移动端菜单等核心组件。

### 核心职责

- **全局布局结构**: 提供应用的整体框架，包括头部、主体内容和底部
- **用户认证管理**: 通过 `retrieveCustomer()` 获取和管理用户登录状态
- **购物车管理**: 通过 `retrieveCart()` 获取购物车数据并传递给子组件
- **全局提示系统**: 使用 Sonner 的 Toaster 组件提供统一的消息通知
- **移动端支持**: 提供响应式布局和移动端菜单
- **多语言支持**: 基于 `next-intl` 的国际化路由

## 路由表

### 模块结构

```
app/[locale]/(layout)/
├── layout.tsx                          # 主布局入口
├── CLAUDE.md                           # 模块文档
├── (blogs)/                            # 博客模块
│   └── blog-list/page.tsx
├── (dashboard)/                        # 用户仪表盘
│   ├── layout.tsx
│   ├── account-page/page.tsx
│   ├── account-addresses/page.tsx
│   ├── account-orders/page.tsx
│   └── account-orders-detail/[id]/page.tsx
├── (intro)/                            # 介绍页面
│   ├── care/page.tsx
│   ├── partner/page.tsx
│   └── care/article/[slug]/page.tsx
├── (member)/                           # 会员模块
│   └── club/page.tsx
├── (other-pages)/                      # 其他页面
│   ├── about-us/page.tsx
│   ├── contact-us/page.tsx
│   ├── login/page.tsx
│   ├── reset-password/page.tsx
│   ├── update-password/page.tsx
│   └── view-cart/page.tsx
├── (product-detail)/                   # 产品详情
│   └── [type]/[id]/page.tsx
├── (store)/                            # 商店模块
│   ├── page.tsx
│   └── products/[id]/page.tsx
├── (verify)/                           # 验证模块
│   └── verify-guide/page.tsx
├── qr/[qr]/page.tsx                    # 二维码页面
└── verify/page.tsx                     # 验证页面
```

### 路由组说明

| 路由组 | 用途 | 主要页面 |
|--------|------|----------|
| `(blogs)` | 博客和文章列表 | 博客列表页 |
| `(dashboard)` | 用户中心 | 账户信息、地址、订单 |
| `(intro)` | 产品介绍和合作 | 产品介绍页、合作伙伴页 |
| `(member)` | 会员俱乐部 | 会员俱乐部页 |
| `(other-pages)` | 通用页面 | 关于我们、联系我们、登录等 |
| `(product-detail)` | 产品详情展示 | 各种类型的产品详情页 |
| `(store)` | 商店主页和产品 | 商店主页、产品列表 |
| `(verify)` | 防伪验证 | 验证指南页 |

## 数据获取函数列表

### 购物车相关函数

> 来源: `data/cart/server.ts`

| 函数名 | 用途 | 返回类型 |
|--------|------|----------|
| `retrieveCart(cartId?, fields?)` | 获取购物车信息 | `StoreCart \| null` |
| `getOrSetCart()` | 获取或创建购物车 | `StoreCart` |
| `updateCart(data)` | 更新购物车信息 | `StoreCart` |
| `addToCart(cartLineItem)` | 添加商品到购物车 | `Promise<void>` |
| `updateLineItem({lineId, quantity})` | 更新购物车商品数量 | `Promise<void>` |
| `deleteLineItem(lineId)` | 删除购物车商品 | `Promise<void>` |
| `setShippingMethod({cartId, shippingMethodId})` | 设置配送方式 | `Promise<void>` |
| `initiatePaymentSession(cart, data)` | 初始化支付会话 | `Promise<any>` |
| `applyPromotions(codes)` | 应用促销代码 | `Promise<void>` |
| `placeOrder(cartId?)` | 提交订单 | `Promise<StoreCart>` |
| `completeZgarCartCheckout(items)` | ZGAR 购物车结算 | `Promise<any>` |
| `submitOrder(items, provider_id?)` | 统一下单接口 | `Promise<{order, message?}>` |
| `completeZgarCartCheckoutWithBalance(items)` | 余额支付结算 | `Promise<CompleteCartWithBalanceResponse>` |
| `batchDeleteCartItems(cartId, itemIds)` | 批量删除商品 | `Promise<void>` |
| `batchAddCartItems(cartId, items)` | 批量添加商品 | `Promise<void>` |
| `batchUpdateCartItems(cartId, items)` | 批量更新商品 | `Promise<void>` |

### 客户相关函数

> 来源: `data/customer/server.ts`

| 函数名 | 用途 | 返回类型 |
|--------|------|----------|
| `retrieveCustomer()` | 获取当前登录用户 | `StoreCustomer \| null` |
| `retrieveCustomerAddresses()` | 获取用户地址列表 | `StoreCustomerAddress[]` |
| `updateCustomer(body)` | 更新用户信息 | `Promise<StoreCustomer>` |
| `signup(currentState, formData)` | 用户注册 | `Promise<Error \| void>` |
| `login(currentState, formData)` | 用户登录 | `Promise<Error \| void>` |
| `signout()` | 用户登出 | `Promise<{success: boolean}>` |
| `resetPassword(currentState, formData)` | 请求重置密码 | `Promise<{success, message}>` |
| `updatePassword(currentState, formData)` | 更新密码 | `Promise<void>` |
| `addCustomerAddress(currentState, formData)` | 添加用户地址 | `Promise<{success, error}>` |
| `deleteCustomerAddress(addressId)` | 删除用户地址 | `Promise<void>` |
| `updateCustomerAddress(currentState, formData)` | 更新用户地址 | `Promise<{success, error}>` |
| `retrieveCustomerWithZgarFields(customerId?)` | 获取含自定义字段用户信息 | `Promise<(StoreCustomer & {zgar_customer?}) \| null>` |

## 状态管理说明

### 数据流架构

```
┌─────────────────────────────────────────────────────────────┐
│                     layout.tsx (Server Component)           │
│                                                              │
│  async function RootLayout({ children }) {                   │
│    const customer = await retrieveCustomer()                │
│    const cart = await retrieveCart()                        │
│                                                              │
│    return (                                                  │
│      <>                                                     │
│        <GlobalEffectsProvider customer={customer} />         │
│        <HomeTips />                                         │
│        <HomeHeader cart={cart} customer={customer} />       │
│        {children}                                           │
│        <HomeFooter />                                       │
│        <Toaster />                                          │
│      </>                                                    │
│    )                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
  │  客户数据    │    │  购物车数据  │    │  全局效果    │
  │  Customer   │    │    Cart     │    │   Provider  │
  └─────────────┘    └─────────────┘    └─────────────┘
```

### 缓存策略

#### Next.js 缓存标签

项目使用 Next.js 的 `revalidateTag` 和 `updateTag` 进行细粒度缓存控制：

| 缓存标签 | 用途 | 更新时机 |
|---------|------|----------|
| `carts` | 购物车数据 | 添加/更新/删除商品、设置配送方式 |
| `customers` | 用户数据 | 登录、注册、更新信息、地址管理 |
| `orders` | 订单数据 | 提交订单、订单状态变更 |
| `fulfillment` | 履约数据 | 设置配送方式 |

#### 认证状态管理

- **Token 存储**: 使用 `cookies` 存储认证令牌 (`auth_token`)
- **购物车 ID**: 使用 `cookies` 存储购物车 ID (`cart_id`)
- **认证头**: 通过 `getAuthHeaders()` 获取认证信息
- **Locale**: 通过 `getLocale()` 获取当前语言

### 全局状态提供者

#### GlobalEffectsProvider

位置: `components/common/GlobalEffectProvider`

- 接收 `customer` 数据作为初始状态
- 提供全局的用户上下文和效果
- 管理全局状态和副作用

#### Toaster

位置: `sonner` 库

- 配置: `position="top-right"`, `richColors`, `closeButton`
- 用于全局的消息提示和通知

## 组件依赖

### Widget 组件

| 组件 | 路径 | 用途 |
|------|------|------|
| `HomeTips` | `widgets/HomeTips/index.tsx` | 顶部提示栏 |
| `HomeHeader` | `widgets/HomeHeader/index.tsx` | 主导航头部 |
| `HomeFooter` | `widgets/HomeFooter/index.tsx` | 页面底部 |

### 通用组件

| 组件 | 路径 | 用途 |
|------|------|------|
| `GlobalEffectsProvider` | `components/common/GlobalEffectProvider` | 全局效果提供者 |
| `MobileMenu` | `components/modals/MobileMenu` | 移动端菜单模态框 |

## 数据模型

### 购物车数据结构

```typescript
interface StoreCart {
  id: string;
  email?: string;
  items: StoreCartLineItem[];
  region?: StoreRegion;
  currency_code: string;
  total: number;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  shipping_total: number;
  items?: StoreCartLineItem[];
  shipping_methods?: StoreCartShippingMethod[];
  // ... 其他购物车属性
}

interface StoreCartLineItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total: number;
  product?: StoreProduct;
  variant?: StoreProductVariant;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}
```

### 用户数据结构

```typescript
interface StoreCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  billing_address?: StoreCustomerAddress;
  shipping_address?: StoreCustomerAddress;
  addresses?: StoreCustomerAddress[];
  orders?: StoreOrder[];
  metadata?: Record<string, unknown>;
  // ZGAR 自定义字段
  zgar_customer?: {
    points_balance?: number;
    [key: string]: any;
  };
}
```

## 测试要点

### 布局测试

- [ ] 不同屏幕尺寸下的响应式布局
- [ ] 移动端菜单的打开/关闭功能
- [ ] 头部导航的链接和交互

### 数据流测试

- [ ] 购物车数据正确获取和传递
- [ ] 用户登录/退出时的状态管理
- [ ] 购物车数据更新时的 UI 同步

### 集成测试

- [ ] 子组件正确接收和渲染 props
- [ ] 全局提示系统的触发和显示
- [ ] 多语言切换的正确性

## 常见问题

### Q: 如何在布局中添加新的全局组件？

A: 在 `layout.tsx` 的 JSX 结构中添加新组件，确保位置正确（头部、底部或主要内容区域）。

### Q: 购物车数据如何实时更新？

A: 购物车数据通过 `retrieveCart()` 获取，更新时需要重新调用该函数并使用 `updateTag` 触发重新获取，React Suspense 会自动处理数据刷新。

### Q: 如何处理用户认证状态？

A: 用户认证通过 `retrieveCustomer()` 管理，登录状态会影响导航栏显示的内容。认证令牌存储在 cookies 中。

### Q: 多语言如何实现？

A: 通过 `next-intl` 实现，`[locale]` 动态路由参数控制当前语言，使用 `getLocale()` 获取当前语言环境。

## 相关文件清单

### 布局文件

- `app/[locale]/(layout)/layout.tsx` - 主布局组件
- `app/[locale]/layout.tsx` - 根布局（国际化配置）

### 数据层

- `data/cart/server.ts` - 购物车数据管理（服务端）
- `data/customer/server.ts` - 用户数据管理（服务端）

### 工具函数

- `utils/cookies.ts` - Cookie 管理（认证、购物车 ID）
- `utils/medusa.ts` - Medusa SDK 配置
- `utils/medusa-server.ts` - 服务端专用工具函数

### Widget 组件

- `widgets/HomeHeader/index.tsx` - 主导航
- `widgets/HomeFooter/index.tsx` - 页脚
- `widgets/HomeTips/index.tsx` - 顶部提示

## 变更记录

### 2025-12-18
- 创建主布局模块文档
- 分析布局结构和数据流
- 识别核心依赖和接口

### 2026-03-05
- 扩展为完整模块文档
- 添加详细的路由表
- 补充完整的数据获取函数列表
- 添加状态管理说明和缓存策略

## 待优化项

- [ ] 考虑添加全局错误边界
- [ ] 优化移动端体验
- [ ] 添加加载状态管理
- [ ] 考虑实现购物车乐观更新
