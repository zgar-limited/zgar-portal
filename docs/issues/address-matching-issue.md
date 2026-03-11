# 订单地址与客户地址簿 ID 不匹配问题

## 问题描述

在订单详情页面的"选择收货地址"组件中，无法正确高亮显示当前订单使用的地址。

**现象：**
- 用户有 2 个保存的地址
- 但显示了 3 个地址（或当前使用的地址没有被绿色勾选标记）
- 视觉上无法一眼辨别出当前使用的是哪个地址

---

## 问题根因分析

### 1. 数据来源

**前端代码位置：** `components/dashboard/OrderDetails.tsx` 第 1142 行

```tsx
<AddressSelector
  addresses={savedAddresses}                          // 来源 1
  currentAddressId={order.shipping_address?.id}       // 来源 2
  onSelect={handleSelectAddress}
  ...
/>
```

**来源 1：客户地址簿**
- 获取方式：`retrieveCustomerAddresses()` → `GET /store/customers/me/addresses`
- 数据表：`customer_address`
- ID 类型：客户地址簿表的主键 ID

**来源 2：订单收货地址**
- 获取方式：`retrieveOrderWithZgarFields()` → `GET /store/orders/{id}`
- 数据表：`order_shipping_address`
- ID 类型：订单地址表的主键 ID

### 2. ID 不匹配的原因

**Medusa 创建订单的流程：**

```
用户下单时:
1. 选择客户地址簿中的某个地址
2. Medusa 将该地址的内容**复制**到 order_shipping_address 表
3. 复制后生成一个新的 ID（订单地址表的 ID）
4. 订单与新的订单地址记录关联
```

**结果：**
- `order.shipping_address.id` = 订单地址表的 ID（新 ID）
- `savedAddresses[].id` = 客户地址簿表的 ID（原始 ID）
- **这两个 ID 来自不同的数据库表，永远不会相等**

### 3. 数据库关系图

```
┌─────────────────────┐         ┌─────────────────────┐
│   customer_address  │         │ order_shipping_     │
│                     │         │      address        │
├─────────────────────┤         ├─────────────────────┤
│ id (PK)            │   复制   │ id (PK)            │
│ customer_id (FK)   │ ──────> │ order_id (FK)      │
│ first_name         │         │ first_name         │
│ last_name          │         │ last_name          │
│ address_1          │         │ address_1          │
│ city               │         │ city               │
│ ...                │         │ ...                │
│                     │         │                     │
│ ❌ 没有 order_      │         │ ❌ 没有 customer_   │
│    address_id 字段  │         │    address_id 字段 │
└─────────────────────┘         └─────────────────────┘
```

**问题：订单地址表没有保存原始客户地址的引用！**

---

## 解决方案

### 方案 A：后端添加关联字段（推荐）

**修改内容：**

1. **在 `zgar_order` 表添加字段：**
   ```sql
   ALTER TABLE zgar_order
   ADD COLUMN shipping_customer_address_id VARCHAR(255);
   ```

2. **创建订单时保存关联：**
   - 用户选择客户地址簿中的地址时
   - 将 `customer_address.id` 保存到 `zgar_order.shipping_customer_address_id`

3. **API 返回时包含该字段：**
   - `GET /store/orders/{id}` 返回的 `zgar_order` 对象包含 `shipping_customer_address_id`

4. **前端使用该字段匹配：**
   ```tsx
   <AddressSelector
     addresses={savedAddresses}
     currentAddressId={zgarOrder.shipping_customer_address_id}  // 使用新字段
     ...
   />
   ```

**优点：**
- 精确匹配，不会误判
- 性能好，不需要内容比较
- 支持地址内容相同但不同地址记录的场景

**缺点：**
- 需要修改后端代码和数据库

### 方案 B：前端通过地址内容匹配（不推荐）

**实现方式：** 比较地址的所有字段（姓名、公司、地址、城市、电话等）

**缺点：**
- 如果用户有两个内容完全相同的地址，无法区分
- 性能较差
- 代码复杂度高

---

## 前端需要的信息

请后端确认以下问题：

1. **`order.shipping_address` 对象中是否有 `customer_address_id` 或类似字段？**

2. **`zgar_order` 表中是否有保存原始客户地址 ID 的字段？**

3. **如果没有，是否可以添加 `shipping_customer_address_id` 字段？**

---

## 相关文件

| 文件路径 | 说明 |
|---------|------|
| `components/dashboard/AddressSelector.tsx` | 地址选择组件 |
| `components/dashboard/OrderDetails.tsx` | 订单详情页面（第 1142 行调用） |
| `data/orders/server.ts` | 订单数据获取（`retrieveOrderWithZgarFields` 函数） |
| `data/customer/server.ts` | 客户地址获取（`retrieveCustomerAddresses` 函数） |
| `app/[locale]/(layout)/(dashboard)/account-orders-detail/[id]/page.tsx` | 订单详情页面入口 |

---

## Medusa 官方文档参考

- [OrderAddress - Order Module Data Models Reference](https://docs.medusajs.com/resources/references/order/models/OrderAddress)
- [CustomerAddress - Customer Module Data Models Reference](https://docs.medusajs.com/resources/references/customer/models/CustomerAddress)
- [Manage Customer Addresses in Storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)

根据 Medusa 官方文档，`OrderAddress` 模型**没有** `customer_address_id` 字段来关联客户地址簿。订单地址是下单时的**快照/副本**，而不是引用。

---

## 日期

- **发现日期：** 2026-03-11
- **影响范围：** 订单详情页面的地址选择功能
