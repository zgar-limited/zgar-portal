# 订单详情模块文档

## 概述
订单详情模块是用户仪表盘的核心功能，展示订单的完整信息，包括商品清单、支付状态、配送信息、地址管理和操作指引等。该模块支持多次支付、支付凭证上传、打包要求和结单信息等 Zgar 扩展功能。

## 核心类型定义

### StoreOrder 订单类型

订单类型基于 Medusajs 的 `HttpTypes.StoreOrder`，并扩展了 Zgar 自定义字段：

```typescript
import type { HttpTypes } from "@medusajs/types";

// 基础订单类型（重新导出 Medusajs 类型）
export type StoreOrder = HttpTypes.StoreOrder;

// 实际使用时会扩展 zgar_order 字段
interface OrderWithZgarFields extends HttpTypes.StoreOrder {
  zgar_order?: {
    // 支付相关
    payment_method: string;                    // 支付方式：balance | manual
    payment_audit_status: 'not_uploaded' | 'uploaded' | 'partial' | 'completed';
    payment_voucher_uploaded_at: string | null;

    // 打包要求
    packing_requirement?: {
      shipping_marks: string[];                // 唛头列表
      packaging_requirements?: string;         // 包装要求
      special_instructions?: string;           // 特殊说明
    };

    // 结单信息
    closing_remark?: string;                   // 结单备注
    closing_attachments?: Array<{              // 结单附件
      url: string;
      filename: string;
      mime_type: string;
      file_size: number;
      file_type: "image" | "pdf" | "document";
    }>;
    closing_status: 'pending' | 'closed';
    closed_at?: string;

    // 订单状态
    order_status: 'pending' | 'completed' | 'archived' | 'canceled' | 'requires_action';

    // 审核元数据
    metadata?: {
      audit_reason?: string;                   // 审核原因/备注
    };
  };
}
```

### PaymentRecord 支付记录类型

```typescript
interface PaymentRecord {
  id: string;
  order_id: string;
  amount: number;
  payment_method: "balance" | "manual";
  payment_status: "pending" | "reviewing" | "approved" | "rejected";
  description: string;
  installment_number: number;
  payment_voucher_urls: string[];              // 支付凭证图片URL数组
  voucher_uploaded_at: string | null;
  admin_audit_amount: number | null;           // Admin审核金额
  cfo_audit_amount: number | null;             // CFO审核金额
  admin_audited_at: string | null;
  cfo_audited_at: string | null;
  admin_remark: string | null;                 // Admin审核备注
  cfo_remark: string | null;                   // CFO审核备注
  created_at: string;
  updated_at: string;
}
```

### PaymentSummary 支付汇总类型

```typescript
interface PaymentSummary {
  total_payable_amount: number | null;         // 总应付金额
  total_paid_amount: number | null;            // 已付金额
  reviewing_amount: number;                    // 审核中金额
  rejected_amount: number;                     // 已拒绝金额
  remaining_amount: number | null;             // 剩余未付金额
  payment_progress: number | null;             // 支付进度 0-100
  status_counts: {
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
  };
  method_counts: {
    balance: number;                           // 余额支付次数
    manual: number;                            // 银行转账次数
  };
}
```

## 页面路由

### 订单详情页路由

```
app/[locale]/(layout)/(dashboard)/account-orders-detail/[id]/page.tsx
```

**路由参数**:
- `locale`: 语言代码（zh-CN、zh-TW、en）
- `id`: 订单ID（Medusajs订单ID）

**访问示例**:
- 中文简体: `/zh-CN/account-orders-detail/order_123`
- 中文繁体: `/zh-TW/account-orders-detail/order_123`
- 英文: `/en/account-orders-detail/order_123`

### 页面组件结构

```typescript
// app/[locale]/(layout)/(dashboard)/account-orders-detail/[id]/page.tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // 1. 认证检查
  const customer = await requireAuth();

  // 2. 获取订单ID
  const { id } = await params;

  // 3. 获取订单详情（包含 zgar_order 扩展字段）
  const order = await retrieveOrderWithZgarFields(id);

  // 4. 渲染订单详情组件
  return <OrderDetails order={order} />;
}
```

## 核心组件

### OrderDetails 组件

**文件位置**: `components/dashboard/OrderDetails.tsx`

**组件职责**:
- 展示订单完整信息
- 管理订单相关操作（上传凭证、修改地址、提交打包要求等）
- 实时刷新订单数据
- 处理支付记录的创建和更新

**主要功能**:

1. **订单基本信息展示**
   - 订单编号、创建时间
   - 订单状态、支付状态
   - 配送状态

2. **商品清单**
   - 商品图片、标题、规格
   - 单价、数量、小计
   - 商品重量显示

3. **支付管理**
   - 支付汇总卡片（总应付、已付、剩余、进度条）
   - 支付记录列表（多次支付）
   - 创建支付（余额/转账）
   - 上传/修改支付凭证

4. **地址管理**
   - 收货地址展示
   - 编辑收货地址

5. **打包要求**
   - 唛头图片展示
   - 包装要求说明
   - 特殊说明

6. **结单信息**
   - 结单备注
   - 结单附件
   - 结单状态

**Props接口**:

```typescript
interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;  // 订单数据（从服务端传入）
}
```

**状态管理**:

```typescript
const [order, setOrder] = useState(initialOrder);
const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
const [showVoucherModal, setShowVoucherModal] = useState(false);
const [showPackingRequirements, setShowPackingRequirements] = useState(false);
const [showEditAddress, setShowEditAddress] = useState(false);
const [showClosingInfo, setShowClosingInfo] = useState(false);
const [highlightAction, setHighlightAction] = useState<string | null>(null);
```

### OrderActionGuide 组件

**文件位置**: `components/dashboard/OrderActionGuide.tsx`

**组件职责**:
- 智能检测未完成的操作
- 显示操作提醒横幅
- 提供快速定位功能（高亮目标区域）

**检测优先级**（从高到低）:

1. **支付凭证未上传** (`payment`)
   - 条件: `!zgarOrder.payment_voucher_uploaded_at && payment_method !== 'balance'`
   - 优先级: 1

2. **打包要求未填写** (`packing`)
   - 条件: `!zgarOrder.packing_requirement?.shipping_marks?.length`
   - 优先级: 2

3. **结单信息未填写** (`closing`)
   - 条件: `!zgarOrder.closing_remark && !zgarOrder.closure_attachments?.length`
   - 优先级: 3

**Props接口**:

```typescript
interface OrderActionGuideProps {
  order: any; // HttpTypes.StoreOrder with zgar_order fields
  onHighlightChange?: (action: string | null) => void;
}
```

**目标区域ID映射**:

```typescript
const targetIds: Record<string, string> = {
  payment: 'payment-voucher-card',
  packing: 'packing-requirements-card',
  closing: 'closing-info-card'
};
```

### PaymentSummaryCard 组件

**文件位置**: `components/dashboard/payments/PaymentSummaryCard.tsx`

**组件职责**:
- 显示支付统计信息
- 展示支付进度条
- 提供审核状态提示

**显示内容**:
- 总应付金额
- 已付金额（含审核中提示）
- 剩余金额
- 支付进度百分比
- 审核中金额提示
- 已拒绝金额警告
- 已付清恭喜提示

### PaymentRecordsList 组件

**文件位置**: `components/dashboard/payments/PaymentRecordsList.tsx`

**组件职责**:
- 显示所有支付记录列表
- 支持创建新支付
- 支持上传/修改支付凭证

**每条记录显示**:
- 支付方式（余额/转账）
- 支付金额
- 支付状态（待上传/审核中/已通过/已拒绝）
- 支付凭证预览
- 拒绝原因（如适用）
- 创建时间

**操作按钮**:
- 创建支付按钮（条件显示）
- 上传/修改凭证按钮（manual支付且pending/reviewing/rejected状态）

## 数据获取

### retrieveOrderWithZgarFields

**文件位置**: `data/orders/server.ts`

**函数签名**:

```typescript
export const retrieveOrderWithZgarFields = async (
  orderId: string
): Promise<(HttpTypes.StoreOrder & { zgar_order?: any }) | null>
```

**功能说明**:
获取包含 zgar_order 自定义扩展字段的订单详情

**请求字段**:

```typescript
fields: "*items,+items.unit_price,+items.total,+items.subtotal,+items.tax_total,*shipping_address,*billing_address,+zgar_order.*,*items.variant,*items.variant.options,*items.product"
```

**返回数据**:

```typescript
{
  id: string;
  display_id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping_total: number;
  fulfillment_status: string;
  payment_status: string;
  shipping_address: Address;
  billing_address: Address;
  zgar_order: {
    payment_method: string;
    payment_audit_status: string;
    packing_requirement: {...};
    closing_remark: string;
    closing_attachments: [...];
    closing_status: string;
    order_status: string;
    metadata: {...};
  };
  created_at: string;
  updated_at: string;
}
```

### getPaymentRecords

**文件位置**: `data/payments/server.ts`

**函数签名**:

```typescript
export async function getPaymentRecords(orderId: string): Promise<PaymentRecordsResponse>
```

**功能说明**:
获取订单的所有支付记录和汇总信息

**API端点**:
```
GET /store/zgar/orders/:orderId/payment-records
```

**返回数据**:

```typescript
{
  order_id: string;
  payment_records: PaymentRecord[];
  summary: PaymentSummary;
  status_counts: {...};
  method_counts: {...};
}
```

### createPayment

**文件位置**: `data/payments/server.ts`

**函数签名**:

```typescript
export async function createPayment(
  orderId: string,
  data: {
    amount: number;
    payment_method: "balance" | "manual";
    payment_description?: string;
    payment_voucher_urls?: string[];
    installment_number?: number;
  }
)
```

**功能说明**:
创建新的支付记录

**API端点**:
```
POST /store/zgar/orders/:orderId/transition
```

**请求Body**:

```typescript
{
  action: "create-payment-with-voucher",
  amount: number,
  payment_method: "balance" | "manual",
  payment_description: string,
  payment_voucher_urls: string[],
  installment_number: number
}
```

### updatePaymentVoucher

**文件位置**: `data/payments/server.ts`

**函数签名**:

```typescript
export async function updatePaymentVoucher(
  orderId: string,
  paymentRecordId: string,
  voucherUrls: string[]
)
```

**功能说明**:
修改支付记录的凭证图片（用于重新上传或更新）

**API端点**:
```
POST /store/zgar/orders/:orderId/transition
```

**请求Body**:

```typescript
{
  action: "update-payment-voucher",
  payment_record_id: string,
  payment_voucher_urls: string[]
}
```

## 订单操作流程

### 1. 订单详情查看流程

```
用户访问订单详情页
  ↓
认证检查 (requireAuth)
  ↓
获取订单数据 (retrieveOrderWithZgarFields)
  ↓
获取支付记录 (getPaymentRecords)
  ↓
渲染 OrderDetails 组件
  ↓
检测待办操作 (OrderActionGuide)
  ↓
显示提醒横幅（如有）
```

### 2. 支付凭证上传流程

```
点击"上传支付凭证"按钮
  ↓
打开 UploadVoucherModal 模态框
  ↓
选择图片文件
  ↓
上传到服务器 (uploadPaymentVoucherFiles)
  ↓
提交凭证URL到订单 (submitPaymentVoucher)
  ↓
刷新订单数据 (refreshOrder)
  ↓
更新支付记录列表
```

### 3. 创建支付流程

```
点击"创建支付"按钮
  ↓
打开 CreatePaymentModal 模态框
  ↓
选择支付方式（余额/转账）
  ↓
输入支付金额
  ↓
【转账方式】上传支付凭证
  ↓
调用 createPayment API
  ↓
刷新订单数据
  ↓
更新支付记录列表
```

### 4. 修改支付凭证流程

```
在支付记录列表中点击"上传/修改凭证"
  ↓
打开 UploadVoucherModal 模态框
  ↓
选择新的图片文件
  ↓
上传到服务器 (uploadPaymentVoucherFiles)
  ↓
调用 updatePaymentVoucher API
  ↓
刷新订单数据
  ↓
更新支付记录列表
```

### 5. 打包要求提交流程

```
点击"填写打包要求"按钮
  ↓
打开 PackingRequirementsModal 模态框
  ↓
上传唛头图片
  ↓
填写包装要求和特殊说明
  ↓
调用 submitPackingRequirement API
  ↓
刷新订单数据
  ↓
更新打包要求卡片
```

### 6. 结单信息提交流程

```
点击"填写结单信息"按钮
  ↓
打开 ClosingInfoModal 模态框
  ↓
填写结单备注
  ↓
上传结单附件
  ↓
调用 submitClosingInfo / updateClosingInfo API
  ↓
刷新订单数据
  ↓
更新结单信息卡片
```

### 7. 修改收货地址流程

```
点击地址编辑按钮
  ↓
打开 EditShippingAddressModal 模态框
  ↓
修改地址信息
  ↓
调用 updateOrderShippingAddress API
  ↓
刷新订单数据
  ↓
更新地址显示
```

## 国际化支持

### 翻译命名空间

订单详情模块使用以下翻译命名空间：

- `order-details`: 订单详情主要内容
- `pendingAction`: 待办操作提醒
- `packing-requirements`: 打包要求
- `PaymentSummary`: 支付汇总
- `PaymentRecords`: 支付记录列表
- `CreatePayment`: 创建支付

### 关键翻译键

```typescript
// order-details
t('title')                    // 订单详情
t('orderNumber')              // 订单编号
t('orderDate')                // 下单时间
t('orderStatus')              // 订单状态
t('paymentStatus')            // 支付状态
t('fulfillmentStatus')        // 配送状态

// pendingAction
t('title.payment')            // 待上传支付凭证
t('title.packing')            // 待填写打包要求
t('title.closing')            // 待填写结单信息
t('completeNow')              // 立即完成

// PaymentSummary
t('title')                    // 支付汇总
t('totalPayable')             // 总应付
t('totalPaid')                // 已付金额
t('remaining')                // 剩余金额
t('paymentProgress')          // 支付进度

// PaymentRecords
t('title')                    // 支付记录
t('status.pending')           // 待上传
t('status.reviewing')         // 审核中
t('status.approved')          // 已通过
t('status.rejected')          // 已拒绝
```

## 状态管理

### 订单状态

```typescript
const OrderStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  CANCELED: "canceled",
  REQUIRES_ACTION: "requires_action",
};
```

### 支付审核状态

```typescript
const PaymentAuditStatus = {
  NOT_UPLOADED: "not_uploaded",    // 未上传凭证
  UPLOADED: "uploaded",            // 已上传凭证
  PARTIAL: "partial",              // 部分审核通过
  COMPLETED: "completed",          // 全部审核通过
};
```

### 结单状态

```typescript
const ClosingStatus = {
  PENDING: "pending",              // 待结单
  CLOSED: "closed",                // 已结单
};
```

## 样式规范

### 设计风格

订单详情页面采用 **Minimalism** 极简主义设计风格：
- 直角设计（无圆角或小圆角）
- 清晰的边框分隔
- 黑白灰色调为主
- 品牌色（粉色/蓝色）用于强调

### 颜色使用

```css
/* 边框 */
border-gray-200        /* 卡片边框 */
border-brand-pink      /* 强调边框 */
border-brand-blue      /* 强调边框 */

/* 背景 */
bg-white               /* 卡片背景 */
bg-gray-50             /* 次要卡片背景 */
bg-brand-pink/10       /* 粉色强调背景 */
bg-brand-blue/10       /* 蓝色强调背景 */

/* 文字 */
text-gray-900          /* 主标题 */
text-gray-600          /* 次要文字 */
text-brand-pink        /* 粉色强调文字 */
text-brand-blue        /* 蓝色强调文字 */
```

### 卡片样式

```typescript
<div className="bg-white border border-gray-200">
  {/* 标题栏 */}
  <div className="border-b border-gray-200 px-6 py-4">
    <h3 className="text-base font-bold text-gray-900">标题</h3>
  </div>

  {/* 内容区 */}
  <div className="p-6">
    内容
  </div>
</div>
```

### 按钮样式

```typescript
// 主要按钮
<Button className="bg-brand-pink text-white hover:bg-brand-pink/90">
  确认
</Button>

// 次要按钮
<Button variant="outline" className="border-gray-200">
  取消
</Button>
```

## 错误处理

### API错误处理

```typescript
// 订单获取失败
if (!order) {
  return (
    <div className="container py-5 text-center">
      <h3>Order not found</h3>
    </div>
  );
}

// 支付记录获取失败
try {
  const paymentData = await getPaymentRecords(orderId);
  setPaymentRecords(paymentData.payment_records || []);
} catch (error) {
  console.error('获取支付记录失败:', error);
  // 不影响订单详情的显示，使用默认值
  setPaymentSummary({
    total_payable_amount: orderTotal,
    total_paid_amount: 0,
    remaining_amount: orderTotal,
    payment_progress: 0,
    // ...
  });
}
```

### Toast提示

```typescript
import { toast } from "sonner";

// 成功提示
toast.success(t('messages.uploadSuccess'));

// 错误提示
toast.error(t('messages.uploadError'));

// 加载提示
toast.promise(
  uploadPromise,
  {
    loading: t('messages.uploading'),
    success: t('messages.uploadSuccess'),
    error: t('messages.uploadError'),
  }
);
```

## 性能优化

### 数据刷新策略

```typescript
// 首次加载时获取数据
useEffect(() => {
  refreshOrder();
}, [orderId]);

// 手动刷新函数
const refreshOrder = async () => {
  setIsRefreshing(true);
  try {
    const [updatedOrder, paymentData] = await Promise.all([
      retrieveOrderWithZgarFields(orderId),
      getPaymentRecords(orderId)
    ]);
    setOrder(updatedOrder);
    setPaymentRecords(paymentData.payment_records || []);
    setPaymentSummary(paymentData.summary);
  } finally {
    setIsRefreshing(false);
  }
};
```

### 缓存清理

```typescript
import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";

// 清除订单缓存
updateTag(await getCacheTag("orders"));

// 清除特定路径缓存
revalidatePath(`/account-orders-detail/${orderId}`);
```

## 相关文件清单

### 页面文件
- `app/[locale]/(layout)/(dashboard)/account-orders-detail/[id]/page.tsx` - 订单详情页

### 组件文件
- `components/dashboard/OrderDetails.tsx` - 订单详情主组件
- `components/dashboard/OrderActionGuide.tsx` - 操作引导组件
- `components/dashboard/payments/PaymentSummaryCard.tsx` - 支付汇总卡片
- `components/dashboard/payments/PaymentRecordsList.tsx` - 支付记录列表
- `components/dashboard/payments/CreatePaymentModal.tsx` - 创建支付模态框
- `components/modals/UploadVoucherModal.tsx` - 上传凭证模态框
- `components/modals/PackingRequirementsModal.tsx` - 打包要求模态框
- `components/modals/EditShippingAddressModal.tsx` - 编辑地址模态框
- `components/dashboard/ClosingInfoModal.tsx` - 结单信息模态框

### 数据文件
- `data/orders/server.ts` - 订单API（服务端）
- `data/orders/types.ts` - 订单类型定义
- `data/payments/server.ts` - 支付API（服务端）
- `data/payments/types.ts` - 支付类型定义
- `data/auth/server.ts` - 认证相关API

### 工具文件
- `utils/medusa.ts` - Medusa SDK配置
- `utils/medusa-server.ts` - 服务端Medusa工具
- `utils/cookies.ts` - Cookie管理
- `utils/weight-utils.ts` - 重量格式化工具

## 变更记录

### 2026-02-05
- 支持支付记录凭证修改（重新上传/更新）
- 显示审核拒绝原因（admin_remark、cfo_remark）
- 支付汇总显示审核中和已拒绝金额
- PaymentRecordsList 支持修改凭证按钮

### 2026-02-03
- 创建支付汇总卡片组件（PaymentSummaryCard）
- 创建支付记录列表组件（PaymentRecordsList）
- 实现多次支付功能
- 创建支付模态框（CreatePaymentModal）

### 2026-02-02
- 支付流程重新设计
- 支付凭证上传功能
- 打包要求管理
- 结单信息管理
- 地址编辑功能

### 待优化项
- [ ] 添加订单搜索和筛选功能
- [ ] 支持订单导出（PDF/Excel）
- [ ] 添加订单时间轴可视化
- [ ] 优化移动端订单详情页体验
- [ ] 添加订单消息通知功能
