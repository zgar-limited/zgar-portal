# 用户仪表盘模块 (Dashboard)

## 模块概述

用户仪表盘模块是 Zgar Portal 的核心用户中心，为注册用户提供完整的账户管理功能。该模块采用左侧导航 + 右侧内容的经典布局设计，使用 Vibrant Blocks 设计风格（粉色 #FF71CE + 蓝色 #0047c7），提供账户概览、订单管理、交易记录、地址管理、账户设置等功能。

### 模块职责

- **用户认证**: 统一的登录状态检查和 token 过期处理
- **账户管理**: 个人信息查看与编辑、余额积分展示
- **订单管理**: 订单列表、订单详情、订单状态跟踪
- **交易记录**: 余额和积分的交易流水查询
- **地址管理**: 收货地址的增删改查
- **账户设置**: 用户偏好设置和隐私配置

## 路由结构

```
app/[locale]/(layout)/(dashboard)/
├── layout.tsx                          # 仪表盘子布局
├── account-page/
│   └── page.tsx                        # 账户概览页（首页）
├── account-orders/
│   └── page.tsx                        # 订单列表页
├── account-orders-detail/
│   └── [id]/
│       └── page.tsx                    # 订单详情页
├── account-transactions/
│   └── page.tsx                        # 交易记录页
├── account-addresses/
│   ├── page.tsx                        # 地址管理页
│   ├── AddressForm.tsx                 # 地址表单组件
│   └── AddressesClient.tsx             # 地址管理客户端组件
└── account-setting/
    └── page.jsx                        # 账户设置页
```

### 路由映射表

| 路由路径 | 页面名称 | 功能描述 |
|---------|---------|---------|
| `/account-page` | 账户概览 | 显示用户信息、余额积分、最近订单、导航卡片、任务列表 |
| `/account-orders` | 订单列表 | 订单历史记录，支持分页和状态筛选 |
| `/account-orders-detail/[id]` | 订单详情 | 单个订单的完整信息，包括商品、支付、发货等 |
| `/account-transactions` | 交易记录 | 余额和积分的交易流水，支持 Tab 切换 |
| `/account-addresses` | 地址管理 | 收货地址的增删改查 |
| `/account-setting` | 账户设置 | 用户个人信息编辑和偏好设置 |

## 核心功能

### 1. 用户认证流程

#### 认证机制

仪表盘模块使用统一的 `requireAuth()` 函数进行身份验证，该函数位于 `@/data/auth`。

```typescript
// 认证流程
export default async function page() {
  // 统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();
  // ... 页面逻辑
}
```

#### 认证特性

- **Token 验证**: 基于 JWT 的用户身份验证
- **自动过期处理**: Token 过期时自动跳转到登录页
- **服务端验证**: 使用 Server Components 进行安全的身份验证
- **Cookie 管理**: 通过 `@/utils/cookies` 管理认证令牌

#### 认证相关函数

```typescript
// data/customer/server.ts
export async function signup(formData: FormData)        // 用户注册
export async function login(formData: FormData)         // 用户登录
export async function signout()                          // 用户登出
export async function resetPassword(formData: FormData) // 密码重置
export async function updatePassword(formData: FormData) // 密码更新
```

### 2. 订单管理功能

#### 订单列表页 (`/account-orders`)

**核心特性**:
- 订单分页显示（每页 10 条）
- 订单状态筛选（已完成、进行中、已退货、已取消）
- 支付方式标识（余额、积分、账期、线下支付）
- 订单统计卡片（总订单数、已完成、进行中、未上传凭证、待结单）

**订单状态映射**:

| fulfillment_status | 显示标签 | 颜色 |
|-------------------|---------|------|
| fulfilled | 已完成 | 蓝色 (#0047c7) |
| not_fulfilled | 进行中 | 粉色 (#FF71CE) |
| partially_fulfilled | 进行中 | 粉色 (#FF71CE) |
| returned | 已退货 | 黄色 (#FFFB00) |
| canceled | 已取消 | 灰色 |

**支付方式标识**:

| payment_method | 图标 | 说明 |
|---------------|-----|------|
| balance | 钱包图标 | 余额支付 |
| points | 星星图标 | 积分支付 |
| credit | 信用卡图标 | 账期积分支付（粉蓝渐变） |
| manual | 银行图标 | 线下支付 |

#### 订单详情页 (`/account-orders-detail/[id]`)

**核心信息**:
- 订单基本信息（订单号、日期、状态）
- 商品清单（规格、数量、价格）
- 支付信息（支付方式、已支付金额、待支付金额）
- 发货信息（收货地址、物流信息）
- 订单操作（上传凭证、修改地址、申请结单）

**订单操作流程**:

1. **上传支付凭证**: 用于线下支付订单
2. **修改收货地址**: 未发货订单可修改地址
3. **申请结单**: 完成订单后的最终确认
4. **查看物流**: 已发货订单可查看物流信息

### 3. 交易记录功能

**余额交易记录**:
- 充值记录
- 消费记录
- 退款记录
- 积分兑换

**积分交易记录**:
- 积分获得（购物、任务）
- 积分消费（兑换商品）
- 积分过期记录

**Tab 切换组件**: `TransactionTabs` 支持余额/积分流水切换

### 4. 地址管理功能

**地址 CRUD 操作**:

```typescript
// 添加地址
export const addCustomerAddress = async (formData: FormData)

// 更新地址
export const updateCustomerAddress = async (formData: FormData)

// 删除地址
export const deleteCustomerAddress = async (addressId: string)
```

**地址字段**:
- first_name, last_name（姓名）
- company（公司）
- address_1, address_2（地址）
- city（城市）
- postal_code（邮编）
- province（省份）
- country_code（国家代码）
- phone（电话）
- is_default_billing（默认账单地址）
- is_default_shipping（默认收货地址）

### 5. 账户设置功能

**可设置项**:
- 个人基本信息（姓名、电话、邮箱）
- 密码修改
- 通知偏好
- 隐私设置

## 数据模型

### 客户扩展模型

```typescript
interface CustomerWithZgarFields extends HttpTypes.StoreCustomer {
  zgar_customer?: {
    balance?: number;       // 账户余额
    points?: number;        // 可用积分
    [key: string]: any;
  };
}
```

### 订单扩展模型

```typescript
interface OrderWithZgarFields extends HttpTypes.StoreOrder {
  zgar_order?: {
    payment_method?: 'balance' | 'points' | 'credit' | 'manual';
    points_used?: number;    // 使用的积分数量
    voucher_status?: string; // 凭证状态
    [key: string]: any;
  };
}
```

### 地址模型

```typescript
interface StoreCustomerAddress {
  id: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code: string;
  province?: string;
  country_code: string;
  phone?: string;
  is_default_billing?: boolean;
  is_default_shipping?: boolean;
}
```

## 组件架构

### 布局组件

```
DashboardLayout (layout.tsx)
├── Sidebar (左侧导航栏)
│   ├── 用户信息区
│   ├── 数据统计区（余额、积分、订单）
│   ├── 导航菜单
│   └── 退出登录按钮
├── OffcanvasSidebar (移动端侧边栏)
├── SidebarToggler (侧边栏切换器)
└── Main Content (主内容区)
    └── children (各页面内容)
```

### 核心组件列表

| 组件路径 | 功能描述 |
|---------|---------|
| `components/dashboard/Sidebar.tsx` | 左侧导航栏 |
| `components/dashboard/OffcanvasSidebar.tsx` | 移动端侧边栏 |
| `components/dashboard/SidebarToggler.jsx` | 侧边栏切换器 |
| `components/dashboard/AccountSummary.tsx` | 账户概览卡片 |
| `components/dashboard/MyAccount.tsx` | 我的账户组件 |
| `components/dashboard/Orders.tsx` | 订单列表组件 |
| `components/dashboard/OrderDetails.tsx` | 订单详情组件 |
| `components/dashboard/OrderCard.tsx` | 订单卡片组件 |
| `components/dashboard/Addressess.tsx` | 地址管理组件 |
| `components/dashboard/AccountSettings.tsx` | 账户设置组件 |
| `components/dashboard/Tasks.tsx` | 任务列表组件 |
| `components/dashboard/AccountNavCards.tsx` | 导航卡片组件 |
| `components/dashboard/transactions/TransactionTabs.tsx` | 交易记录 Tab 切换 |
| `components/dashboard/transactions/BalanceTransactionTable.tsx` | 余额交易表格 |
| `components/dashboard/transactions/PointsTransactionTable.tsx` | 积分交易表格 |
| `components/dashboard/payments/PaymentSummaryCard.tsx` | 支付汇总卡片 |
| `components/dashboard/payments/PaymentRecordsList.tsx` | 支付记录列表 |
| `components/dashboard/payments/CreatePaymentModal.tsx` | 创建支付弹窗 |
| `components/dashboard/payments/VoucherUploadArea.tsx` | 凭证上传区域 |

## 数据获取

### 客户数据

```typescript
// data/customer/index.ts
export * from "./server";
export * from "./types";

// 主要导出函数
export const retrieveCustomer: () => Promise<StoreCustomer | null>
export const retrieveCustomerWithZgarFields: () => Promise<CustomerWithZgarFields | null>
export const retrieveCustomerAddresses: () => Promise<StoreCustomerAddress[]>
export const updateCustomer: (body: StoreUpdateCustomer) => Promise<any>
export const addCustomerAddress: (formData: FormData) => Promise<any>
export const updateCustomerAddress: (formData: FormData) => Promise<any>
export const deleteCustomerAddress: (addressId: string) => Promise<void>
```

### 订单数据

```typescript
// data/orders (主要函数)
export const retrieveOrders: (limit: number, offset: number, order?: string) => Promise<any>
export const retrieveOrderStats: () => Promise<OrderStats>
export const retrieveOrderWithZgarFields: (id: string) => Promise<OrderWithZgarFields | null>
```

### 认证数据

```typescript
// data/auth
export const requireAuth: () => Promise<StoreCustomer>
```

## 设计规范

### Vibrant Blocks 设计风格

**配色方案**:
- 主粉色: `#FF71CE` (温暖、活力)
- 主蓝色: `#0047c7` (专业、可靠)
- 渐变色: `linear-gradient(90deg, #FF71CE 0%, #0047c7 100%)`
- 黑色边框: `border-4 border-black`
- 立体阴影: `shadow-[6px_6px_0_0_#000000]`

**圆角规范**:
- 卡片圆角: `rounded-xl` (12px)
- 按钮圆角: `rounded-lg` (8px)
- 小元素圆角: `rounded` (4px)

**间距规范**:
- 卡片内边距: `p-5` 或 `p-6`
- 组件间距: `space-y-4` 或 `space-y-6`
- 网格间距: `gap-3` 或 `gap-4`

**字体规范**:
- 超大标题: `text-5xl font-black`
- 大标题: `text-3xl font-black`
- 中标题: `text-xl font-black`
- 正文: `text-base font-semibold`
- 小字: `text-sm font-medium`

### 响应式设计

**断点**:
- 移动端: `< 768px`
- 平板端: `768px - 1024px`
- 桌面端: `> 1024px`

**布局策略**:
- 移动端: 垂直堆叠，隐藏侧边栏
- 平板端: 侧边栏可收起
- 桌面端: 固定侧边栏 + 主内容区

## 国际化

### 翻译命名空间

| 命名空间 | 用途 |
|---------|------|
| `Sidebar` | 侧边栏导航 |
| `MyAccount` | 账户概览 |
| `Orders` | 订单相关 |
| `Pagination` | 分页组件 |
| `PaymentMethods` | 支付方式 |
| `Account` | 账户通用 |
| `Tasks` | 任务系统 |

### 使用示例

```typescript
const t = useTranslations('MyAccount');
const title = t('balance'); // "余额"
```

## 性能优化

### 数据获取策略

1. **并行请求**: 使用 `Promise.all` 并行获取多个数据源
2. **数据缓存**: 使用 Next.js 的 `revalidateTag` 进行缓存管理
3. **增量加载**: 订单列表使用分页加载
4. **服务端组件**: 尽可能在服务端获取数据，减少客户端请求

### 缓存策略

```typescript
// 缓存标签
const customerCacheTag = await getCacheTag("customers");
const cartCacheTag = await getCacheTag("carts");

// 缓存失效
revalidateTag(customerCacheTag, "max");
```

## 安全考虑

### 认证安全

- 所有仪表盘页面都需要通过 `requireAuth()` 验证
- JWT Token 存储在 HttpOnly Cookie 中
- Token 过期自动跳转登录页

### 数据安全

- 敏感操作（修改地址、删除地址）需要二次确认
- 支付凭证上传使用 HTTPS 加密传输
- 用户数据仅在服务端处理，不在客户端暴露

### CSRF 防护

- 使用 Next.js 内置的 CSRF 保护
- 状态变更操作使用 Server Actions

## 测试要点

### 单元测试

- [ ] 认证函数测试
- [ ] 数据获取函数测试
- [ ] 表单验证测试

### 集成测试

- [ ] 页面路由测试
- [ ] 数据流测试
- [ ] 组件交互测试

### E2E 测试

- [ ] 用户登录流程
- [ ] 订单查看流程
- [ ] 地址管理流程
- [ ] 支付凭证上传流程

## 相关文件清单

### 页面文件
- `app/[locale]/(layout)/(dashboard)/layout.tsx` - 仪表盘子布局
- `app/[locale]/(layout)/(dashboard)/account-page/page.tsx` - 账户概览页
- `app/[locale]/(layout)/(dashboard)/account-orders/page.tsx` - 订单列表页
- `app/[locale]/(layout)/(dashboard)/account-orders-detail/[id]/page.tsx` - 订单详情页
- `app/[locale]/(layout)/(dashboard)/account-transactions/page.tsx` - 交易记录页
- `app/[locale]/(layout)/(dashboard)/account-addresses/page.tsx` - 地址管理页
- `app/[locale]/(layout)/(dashboard)/account-addresses/AddressForm.tsx` - 地址表单
- `app/[locale]/(layout)/(dashboard)/account-addresses/AddressesClient.tsx` - 地址客户端
- `app/[locale]/(layout)/(dashboard)/account-setting/page.jsx` - 账户设置页

### 组件文件
- `components/dashboard/Sidebar.tsx` - 侧边栏
- `components/dashboard/OffcanvasSidebar.tsx` - 移动端侧边栏
- `components/dashboard/SidebarToggler.jsx` - 侧边栏切换
- `components/dashboard/AccountSummary.tsx` - 账户概览
- `components/dashboard/MyAccount.tsx` - 我的账户
- `components/dashboard/Orders.tsx` - 订单列表
- `components/dashboard/OrderDetails.tsx` - 订单详情
- `components/dashboard/OrderCard.tsx` - 订单卡片
- `components/dashboard/Addressess.tsx` - 地址管理
- `components/dashboard/AccountSettings.tsx` - 账户设置
- `components/dashboard/Tasks.tsx` - 任务列表
- `components/dashboard/AccountNavCards.tsx` - 导航卡片
- `components/dashboard/AccountEditModal.tsx` - 编辑弹窗
- `components/dashboard/ClosingInfoModal.tsx` - 结单信息
- `components/dashboard/OrderActionGuide.tsx` - 订单操作引导
- `components/dashboard/TabsNavigation.tsx` - Tab 导航

### 交易相关组件
- `components/dashboard/transactions/TransactionTabs.tsx` - 交易 Tab
- `components/dashboard/transactions/BalanceTransactionTable.tsx` - 余额流水
- `components/dashboard/transactions/PointsTransactionTable.tsx` - 积分流水

### 支付相关组件
- `components/dashboard/payments/PaymentSummaryCard.tsx` - 支付汇总
- `components/dashboard/payments/PaymentRecordsList.tsx` - 支付记录
- `components/dashboard/payments/CreatePaymentModal.tsx` - 创建支付
- `components/dashboard/payments/VoucherUploadArea.tsx` - 凭证上传

### 数据文件
- `data/customer/index.ts` - 客户模块入口
- `data/customer/types.ts` - 客户类型定义
- `data/customer/server.ts` - 客户服务端函数
- `data/orders.ts` - 订单数据
- `data/auth.ts` - 认证相关
- `data/payments.ts` - 支付数据
- `data/tasks.ts` - 任务数据

### 工具文件
- `utils/cookies.ts` - Cookie 管理
- `utils/medusa.ts` - Medusa SDK 集成
- `utils/medusa-server.ts` - 服务端 Medusa 工具
- `utils/weight-utils.ts` - 重量格式化

## 变更记录

### 2026-03-05
- 创建完整的仪表盘模块架构文档
- 整理所有路由和组件结构
- 补充认证流程和订单管理功能说明
- 添加设计规范和性能优化建议

### 待优化项

- [ ] 添加订单搜索和高级筛选功能
- [ ] 实现订单评价和反馈系统
- [ ] 添加实时订单状态更新（WebSocket）
- [ ] 优化移动端侧边栏体验
- [ ] 实现账户安全双因素认证
- [ ] 添加订单导出功能
- [ ] 实现地址智能推荐
- [ ] 添加订单提醒通知
