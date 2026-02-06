# 支付流程重新设计 - 前端实施设计文档

> **创建时间**：2026-02-02
> **作者**：老王
> **状态**：设计阶段
> **目标读者**：前端开发工程师

---

## 📋 目录

1. [项目概述](#项目概述)
2. [架构设计](#架构设计)
3. [组件设计](#组件设计)
4. [数据流设计](#数据流设计)
5. [API集成](#api集成)
6. [错误处理](#错误处理)
7. [测试策略](#测试策略)
8. [实施计划](#实施计划)

---

## 项目概述

### 背景

Zgar Club 项目进行了支付流程重新设计，从原来的"单次支付"架构升级为"多次支付（分期）"架构。前端需要适配新的API和数据结构，支持以下新功能：

- ✅ 一个订单可以有多次支付（分期付款）
- ✅ 支付不再阻塞订单流转
- ✅ 支付记录独立化
- ✅ 每次支付独立审核

### 改造范围

**涉及文件：**
- `components/dashboard/OrderDetails.tsx` - 订单详情页组件（修改）
- `data/payments.ts` - 支付API服务层（新建）
- `components/dashboard/payments/PaymentSummaryCard.tsx` - 支付汇总卡片（新建）
- `components/dashboard/payments/PaymentRecordsList.tsx` - 支付记录列表（新建）
- `components/dashboard/payments/CreatePaymentModal.tsx` - 创建支付弹窗（新建）

**核心功能：**
1. 支付汇总显示（订单总额、已付金额、剩余应付、支付进度）
2. 支付记录列表（显示所有支付记录及其状态）
3. 创建支付功能（选择支付方式、输入金额）
4. 上传支付凭证（打款支付上传凭证）

**技术约束：**
- ❌ 不兼容旧架构数据（旧订单需要数据迁移后才能使用）
- ✅ 只支持新API架构（基于 `/admin/zgar/orders/:id/payment-records`）
- ✅ 使用 Medusa Client Fetch 进行API调用

---

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    OrderDetails 组件                        │
│  - 订单基本信息                                             │
│  - 商品列表                                                 │
│  - 支付管理区域（本次改造重点）                              │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   支付管理组件层                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │PaymentSummaryCard│  │PaymentRecordsList│                │
│  │  支付汇总卡片     │  │  支付记录列表     │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────────────┐                                       │
│  │CreatePaymentModal│  (弹出式)                             │
│  │  创建支付弹窗     │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   数据服务层 (data/payments.ts)              │
│  - getPaymentRecords()    获取支付记录列表                  │
│  - createPayment()        创建支付                          │
│  - uploadPaymentVoucher() 上传支付凭证                      │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      Medusa API                             │
│  GET  /admin/zgar/orders/:id/payment-records                │
│  POST /store/zgar/orders/:id/transition                     │
└─────────────────────────────────────────────────────────────┘
```

### UI布局

**替换原支付卡片区域：**
```
OrderDetails.tsx (第282-374行)
  ↓ 删除
旧 Payment Voucher Card
  ↓ 替换为
新支付管理区域
  ├── PaymentSummaryCard (支付汇总)
  └── PaymentRecordsList (支付记录列表 + 创建按钮)
```

**布局特点：**
- 位于订单商品列表下方，右侧栏之前
- Minimalism 风格，与现有页面保持一致
- 使用品牌色：`brand-pink` (#f496d3), `brand-blue` (#0047c7)
- 大圆角：`rounded-2xl` 或 `rounded-3xl`
- 柔和阴影：`shadow-lg`

---

## 组件设计

### 1. PaymentSummaryCard（支付汇总卡片）

**文件位置：** `components/dashboard/payments/PaymentSummaryCard.tsx`

**功能：** 显示订单支付汇总信息

**Props接口：**
```typescript
interface PaymentSummaryCardProps {
  summary: {
    total_payable_amount: number;  // 订单应付总额
    total_paid_amount: number;     // 累计已付金额
    remaining_amount: number;      // 剩余应付金额
    payment_progress: number;      // 支付进度百分比 (0-100)
  };
}
```

**布局结构：**
```tsx
<div className="bg-white border border-gray-200">
  {/* 标题栏 */}
  <div className="border-b px-6 py-4">
    <h3>支付汇总</h3>
  </div>

  {/* 三列数据网格 */}
  <div className="p-6 grid grid-cols-3 gap-4">
    <div>
      <p className="text-sm text-gray-600">订单总额</p>
      <p className="text-2xl font-bold">¥{total_payable_amount}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">已付金额</p>
      <p className="text-2xl font-bold text-green-600">¥{total_paid_amount}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">剩余应付</p>
      <p className="text-2xl font-bold text-red-600">¥{remaining_amount}</p>
    </div>
  </div>

  {/* 进度条 */}
  <div className="px-6 pb-6">
    <div className="flex justify-between text-sm mb-1">
      <span>支付进度</span>
      <span className="font-bold">{payment_progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-brand-pink h-2 rounded-full transition-all"
        style={{ width: `${payment_progress}%` }}
      />
    </div>
  </div>
</div>
```

**进度条颜色逻辑：**
- `payment_progress >= 100`：绿色 (`bg-green-500`)
- `payment_progress >= 50`：粉色 (`bg-brand-pink`)
- `payment_progress < 50`：蓝色 (`bg-brand-blue`)

---

### 2. PaymentRecordsList（支付记录列表）

**文件位置：** `components/dashboard/payments/PaymentRecordsList.tsx`

**功能：** 显示所有支付记录，支持上传凭证

**Props接口：**
```typescript
interface PaymentRecordsListProps {
  records: PaymentRecord[];          // 支付记录数组
  summary: { remaining_amount: number }; // 支付汇总（用于判断是否可创建）
  orderAuditStatus: string;          // 订单审核状态
  onCreatePayment: () => void;       // 创建支付回调
  onUploadVoucher: (recordId: string) => void; // 上传凭证回调
}

interface PaymentRecord {
  id: string;
  amount: number;
  payment_method: 'balance' | 'manual';
  payment_status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  description: string;
  installment_number: number;
  payment_voucher_url: string | null;
  admin_audit_amount: number | null;
  cfo_audit_amount: number | null;
  admin_audited_at: string | null;
  cfo_audited_at: string | null;
  created_at: string;
}
```

**布局结构：**
```tsx
<div className="bg-white border border-gray-200">
  {/* 标题栏 */}
  <div className="border-b px-6 py-4">
    <h3>支付记录</h3>
  </div>

  <div className="p-6 space-y-4">
    {/* 创建支付按钮 - 条件显示 */}
    {canCreatePayment && (
      <Button onClick={onCreatePayment}>
        <Plus size={16} className="mr-2" />
        创建支付
      </Button>
    )}

    {/* 支付记录列表 */}
    {records.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        暂无支付记录
      </div>
    ) : (
      records.map(record => (
        <div key={record.id} className="border rounded-lg p-4">
          {/* 支付基本信息 */}
          <div className="flex justify-between">
            <div>
              <div className="font-bold">{record.description}</div>
              <div className="text-sm text-gray-500">
                {record.payment_method === 'balance' ? '余额支付' : '打款支付'}
              </div>
            </div>
            <div className="text-xl font-bold">¥{record.amount}</div>
          </div>

          {/* 状态标签 */}
          <div className="mt-2">
            <span className={getStatusBadgeClass(record.payment_status)}>
              {getStatusLabel(record.payment_status)}
            </span>
          </div>

          {/* 上传凭证按钮 - 仅打款支付且状态为pending */}
          {record.payment_method === 'manual' && record.payment_status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => onUploadVoucher(record.id)}
            >
              <Upload size={14} className="mr-2" />
              上传支付凭证
            </Button>
          )}

          {/* 审核信息 */}
          {(record.admin_audit_amount || record.cfo_audit_amount) && (
            <div className="mt-2 pt-2 border-t text-sm">
              {record.admin_audit_amount && (
                <div>Admin审核: ¥{record.admin_audit_amount}</div>
              )}
              {record.cfo_audit_amount && (
                <div>CFO审核: ¥{record.cfo_audit_amount}</div>
              )}
            </div>
          )}
        </div>
      ))
    )}
  </div>
</div>
```

**状态标签颜色：**
- `approved`：绿色背景，绿色文字 (`bg-green-100 text-green-800`)
- `reviewing`：黄色背景，黄色文字 (`bg-yellow-100 text-yellow-800`)
- `pending`：灰色背景，灰色文字 (`bg-gray-100 text-gray-800`)
- `rejected`：红色背景，红色文字 (`bg-red-100 text-red-800`)

**canCreatePayment 判断逻辑：**
```typescript
const canCreatePayment = () => {
  // 1. 订单必须已审核通过
  if (orderAuditStatus !== 'approved') return false;

  // 2. 必须有剩余应付金额
  if (summary.remaining_amount <= 0) return false;

  return true;
};
```

---

### 3. CreatePaymentModal（创建支付弹窗）

**文件位置：** `components/dashboard/payments/CreatePaymentModal.tsx`

**功能：** 创建支付，选择支付方式和金额

**Props接口：**
```typescript
interface CreatePaymentModalProps {
  show: boolean;                          // 是否显示弹窗
  onHide: () => void;                     // 关闭弹窗回调
  remainingAmount: number;                // 剩余应付金额（用于验证）
  onSubmit: (data: CreatePaymentInput) => Promise<void>; // 提交回调
}

interface CreatePaymentInput {
  amount: number;
  payment_method: 'balance' | 'manual';
  payment_description?: string;
}
```

**布局结构：**
```tsx
<Dialog open={show} onOpenChange={onHide}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>创建支付</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      {/* 剩余应付提示 */}
      <div className="bg-blue-50 p-3 rounded">
        <p className="text-sm">剩余应付金额</p>
        <p className="text-xl font-bold text-blue-600">¥{remainingAmount}</p>
      </div>

      {/* 支付金额输入 */}
      <div>
        <Label>支付金额</Label>
        <Input
          type="number"
          min={0}
          max={remainingAmount}
          placeholder="请输入支付金额"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </div>

      {/* 支付方式选择 */}
      <div>
        <Label>支付方式</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            variant={method === 'balance' ? 'default' : 'outline'}
            onClick={() => setMethod('balance')}
          >
            余额支付
          </Button>
          <Button
            variant={method === 'manual' ? 'default' : 'outline'}
            onClick={() => setMethod('manual')}
          >
            打款支付
          </Button>
        </div>
      </div>

      {/* 支付说明（可选） */}
      <div>
        <Label>支付说明（可选）</Label>
        <Input
          placeholder="如：首期付款"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={onHide}>取消</Button>
      <Button onClick={handleSubmit} disabled={!amount || !method}>
        确认创建
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**验证逻辑：**
```typescript
const validateAmount = (amount: number, remainingAmount: number) => {
  if (!amount || amount <= 0) {
    alert('请输入有效的支付金额');
    return false;
  }

  if (amount > remainingAmount) {
    alert(`支付金额不能超过剩余应付金额 ¥${remainingAmount}`);
    return false;
  }

  return true;
};
```

---

## 数据流设计

### 状态管理

**OrderDetails.tsx 新增状态：**
```typescript
const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
```

### 数据获取流程

```typescript
// 修改后的 refreshOrder 函数
const refreshOrder = async () => {
  setIsRefreshing(true);
  try {
    // 1. 获取订单详情（现有逻辑）
    const updatedOrder = await retrieveOrderWithZgarFields(orderId);
    if (updatedOrder) {
      setOrder(updatedOrder);
    }

    // 2. 获取支付记录（新增逻辑）
    const paymentData = await getPaymentRecords(orderId);
    setPaymentRecords(paymentData.payment_records || []);
    setPaymentSummary(paymentData.summary);

  } finally {
    setIsRefreshing(false);
  }
};

// 首次加载时调用
useEffect(() => {
  refreshOrder();
}, [orderId]);
```

### 事件处理流程

**创建支付流程：**
```typescript
const handleCreatePayment = async (data: CreatePaymentInput) => {
  try {
    // 1. 前端验证（余额支付时检查余额）
    if (data.payment_method === 'balance') {
      const customerBalance = (order as any).customer?.balance || 0;
      if (customerBalance < data.amount) {
        alert(`余额不足！当前余额: ¥${customerBalance}，需要支付: ¥${data.amount}`);
        return; // 不关闭弹窗
      }
    }

    // 2. 调用API创建支付
    const result = await createPayment(orderId, {
      amount: data.amount,
      payment_method: data.payment_method,
      payment_description: data.payment_description,
      installment_number: paymentRecords.length + 1,
    });

    // 3. 显示成功提示
    alert(result.message || '支付创建成功');

    // 4. 关闭弹窗
    setShowCreatePaymentModal(false);

    // 5. 刷新数据
    await refreshOrder();

  } catch (error: any) {
    // 6. 处理错误（余额不足的后端错误）
    if (error.message?.includes('余额不足')) {
      alert(error.message);
      return; // 不关闭弹窗
    }
    alert(error.message || '创建支付失败，请稍后重试');
  }
};
```

**上传凭证流程：**
```typescript
const handleUploadVoucher = async (recordId: string) => {
  const url = prompt('请输入支付凭证URL:');
  if (!url) return;

  try {
    // 1. 调用API上传凭证
    const result = await uploadPaymentVoucher(orderId, {
      payment_record_id: recordId,
      payment_voucher_url: url,
    });

    // 2. 显示成功提示
    alert(result.message || '凭证上传成功');

    // 3. 刷新数据
    await refreshOrder();

  } catch (error: any) {
    // 4. 显示错误（不刷新，让用户可以重试）
    alert(error.message || '上传凭证失败，请重试');
  }
};
```

---

## API集成

### data/payments.ts 服务层

**文件位置：** `data/payments.ts`

**完整代码：**
```typescript
import { MedusaClient } from "@medusajs/client";

const client = new MedusaClient();

// 类型定义
export interface PaymentRecord {
  id: string;
  order_id: string;
  amount: number;
  payment_method: 'balance' | 'manual';
  payment_status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  description: string;
  installment_number: number;
  payment_voucher_url: string | null;
  voucher_uploaded_at: string | null;
  admin_audit_amount: number | null;
  cfo_audit_amount: number | null;
  admin_audited_at: string | null;
  cfo_audited_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentSummary {
  total_payable_amount: number;
  total_paid_amount: number;
  remaining_amount: number;
  payment_progress: number;
  status_counts: {
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
  };
  method_counts: {
    balance: number;
    manual: number;
  };
}

/**
 * 获取订单的支付记录列表
 */
export async function getPaymentRecords(orderId: string) {
  try {
    const response = await client.fetch(`/admin/zgar/orders/${orderId}/payment-records`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '获取支付记录失败');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取支付记录失败:', error);
    throw error;
  }
}

/**
 * 创建支付记录
 */
export async function createPayment(
  orderId: string,
  data: {
    amount: number;
    payment_method: 'balance' | 'manual';
    payment_description?: string;
    installment_number?: number;
  }
) {
  try {
    const response = await client.fetch(`/store/zgar/orders/${orderId}/transition`, {
      method: 'POST',
      body: {
        action: 'create-payment',
        payment_amount: data.amount,
        payment_method: data.payment_method,
        payment_description: data.payment_description || `支付${data.amount}元`,
        installment_number: data.installment_number || 1,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '创建支付失败');
    }

    return await response.json();
  } catch (error) {
    console.error('创建支付失败:', error);
    throw error;
  }
}

/**
 * 上传支付凭证
 */
export async function uploadPaymentVoucher(
  orderId: string,
  data: {
    payment_record_id: string;
    payment_voucher_url: string;
  }
) {
  try {
    const response = await client.fetch(`/store/zgar/orders/${orderId}/transition`, {
      method: 'POST',
      body: {
        action: 'upload-payment-voucher',
        payment_record_id: data.payment_record_id,
        payment_voucher_url: data.payment_voucher_url,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '上传凭证失败');
    }

    return await response.json();
  } catch (error) {
    console.error('上传凭证失败:', error);
    throw error;
  }
}
```

### API端点说明

**1. 获取支付记录列表**
```
GET /admin/zgar/orders/:id/payment-records

响应示例：
{
  "order_id": "order_01JZ4ZKWY00000",
  "payment_records": [
    {
      "id": "pay_01HP6KS3Q6YNTQG",
      "amount": 1000,
      "payment_method": "balance",
      "payment_status": "reviewing",
      "description": "首期付款",
      "installment_number": 1,
      "admin_audit_amount": null,
      "cfo_audit_amount": null,
      "created_at": "2026-02-02T12:00:00Z"
    }
  ],
  "summary": {
    "total_payable_amount": 5000,
    "total_paid_amount": 1000,
    "remaining_amount": 4000,
    "payment_progress": 20
  },
  "status_counts": {
    "pending": 0,
    "reviewing": 1,
    "approved": 0,
    "rejected": 0
  },
  "method_counts": {
    "balance": 1,
    "manual": 0
  }
}
```

**2. 创建支付记录**
```
POST /store/zgar/orders/:id/transition

请求体：
{
  "action": "create-payment",
  "payment_amount": 1000,
  "payment_method": "balance",
  "payment_description": "首期付款",
  "installment_number": 1
}

响应示例：
{
  "payment_record": {
    "id": "pay_01HP6KS3Q6YNTQG",
    "amount": 1000,
    "payment_status": "reviewing"
  },
  "balance_transaction": {
    "id": "bt_01HP6KS3Q6YNTQG",
    "amount": -1000,
    "balance": 4000
  },
  "remaining_amount": 4000,
  "total_paid_amount": 1000,
  "message": "余额支付成功，支付记录已创建，等待审核"
}
```

**3. 上传支付凭证**
```
POST /store/zgar/orders/:id/transition

请求体：
{
  "action": "upload-payment-voucher",
  "payment_record_id": "pay_01HP6KS3Q6YNTQG",
  "payment_voucher_url": "https://example.com/voucher.jpg"
}

响应示例：
{
  "payment_record": {
    "id": "pay_01HP6KS3Q6YNTQG",
    "payment_voucher_url": "https://example.com/voucher.jpg",
    "voucher_uploaded_at": "2026-02-02T12:05:00Z",
    "payment_status": "reviewing"
  },
  "message": "支付凭证上传成功，等待审核"
}
```

---

## 错误处理

### API错误处理

**统一错误处理函数：**
```typescript
const handleApiError = (error: any) => {
  console.error('API调用失败:', error);

  if (error.message) {
    alert(`操作失败: ${error.message}`);
  } else if (error.status === 401) {
    alert('请先登录');
  } else if (error.status === 403) {
    alert('没有权限执行此操作');
  } else if (error.status === 404) {
    alert('订单不存在');
  } else {
    alert('操作失败，请稍后重试');
  }
};
```

### 余额不足错误

**前端预判：**
```typescript
if (payment_method === 'balance') {
  const customerBalance = (order as any).customer?.balance || 0;
  if (customerBalance < amount) {
    alert(`余额不足！当前余额: ¥${customerBalance}，需要支付: ¥${amount}`);
    return; // 不关闭弹窗，让用户修改
  }
}
```

**后端错误处理：**
```typescript
try {
  const result = await createPayment(orderId, data);
} catch (error: any) {
  if (error.message?.includes('余额不足')) {
    alert(error.message);
    return; // 不关闭弹窗
  }
  handleApiError(error);
}
```

### 金额验证错误

**前端验证：**
```typescript
const validateAmount = (amount: number, remainingAmount: number) => {
  if (!amount || amount <= 0) {
    alert('请输入有效的支付金额');
    return false;
  }

  if (amount > remainingAmount) {
    alert(`支付金额不能超过剩余应付金额 ¥${remainingAmount}`);
    return false;
  }

  return true;
};
```

### 边界情况处理

**订单未审核通过：**
```typescript
{(order as any).zgar_order?.audit_status !== 'approved' && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <p className="text-sm text-yellow-800">
      ⚠️ 订单需要审核通过后才能创建支付
    </p>
  </div>
)}
```

**已付清全部金额：**
```typescript
{paymentSummary?.remaining_amount === 0 && paymentRecords.length > 0 && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <p className="text-sm text-green-800">
      🎉 恭喜！您已付清全部订单金额
    </p>
  </div>
)}
```

**没有支付记录（空状态）：**
```typescript
{paymentRecords.length === 0 && (
  <div className="text-center py-12 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
      <CreditCard size={32} className="text-gray-400" />
    </div>
    <p className="text-gray-600 font-medium mb-1">暂无支付记录</p>
    <p className="text-sm text-gray-500">
      {canCreatePayment() ? '点击下方按钮创建支付' : '订单审核通过后即可创建支付'}
    </p>
  </div>
)}
```

**订单已完成或已取消（只读模式）：**
```typescript
const isCompleted = order.status === 'completed' || order.status === 'canceled';

{!isCompleted && (
  <Button onClick={() => setShowCreatePaymentModal(true)}>
    创建支付
  </Button>
)}
```

---

## 测试策略

### 单元测试

**PaymentSummaryCard组件测试：**
- 测试支付汇总信息正确显示
- 测试进度条颜色随进度变化
- 测试金额格式化（¥符号、小数点）

**PaymentRecordsList组件测试：**
- 测试空状态显示
- 测试支付记录列表渲染
- 测试状态标签颜色
- 测试上传凭证按钮条件显示

**CreatePaymentModal组件测试：**
- 测试金额验证（<= 0，超过剩余金额）
- 测试支付方式选择
- 测试表单提交

### 集成测试

**data/payments.ts测试：**
- 测试`getPaymentRecords()`成功和失败场景
- 测试`createPayment()`成功和失败场景
- 测试`uploadPaymentVoucher()`成功和失败场景

### 端到端测试

**用户流程测试：**
1. 用户访问订单详情页 → 查看支付汇总
2. 用户创建余额支付 → 验证自动扣款
3. 用户创建打款支付 → 验证状态为pending
4. 用户上传支付凭证 → 验证状态更新为reviewing
5. 余额不足场景 → 验证错误提示

### 手动测试清单

**功能测试：**
- [ ] 订单审核通过后，能正常创建支付
- [ ] 订单未审核时，不显示创建支付按钮
- [ ] 创建余额支付后，自动扣款并进入审核状态
- [ ] 创建打款支付后，状态为pending，显示上传凭证按钮
- [ ] 上传凭证后，状态更新为reviewing
- [ ] 支付汇总正确显示总额、已付、剩余金额
- [ ] 支付进度条正确计算百分比
- [ ] 已付清全部金额时，显示恭喜提示
- [ ] 已完成订单不显示操作按钮

**边界测试：**
- [ ] 支付金额超过剩余应付金额时，显示错误
- [ ] 支付金额为0时，显示错误
- [ ] 支付金额为负数时，显示错误
- [ ] 订单无支付记录时，显示空状态
- [ ] 网络错误时，显示友好提示

**UI测试：**
- [ ] 支付进度条颜色随进度变化
- [ ] 状态标签颜色正确
- [ ] 响应式布局在移动端正常显示
- [ ] Modal弹窗正常弹出和关闭
- [ ] 加载状态正常显示

---

## 实施计划

### 第一步：创建数据服务层

**文件：** `data/payments.ts`

**任务：**
- [ ] 创建文件 `data/payments.ts`
- [ ] 实现类型定义（PaymentRecord, PaymentSummary）
- [ ] 实现 `getPaymentRecords()` 函数
- [ ] 实现 `createPayment()` 函数
- [ ] 实现 `uploadPaymentVoucher()` 函数
- [ ] 添加错误处理和日志

**预计时间：** 30分钟

---

### 第二步：创建支付汇总卡片组件

**文件：** `components/dashboard/payments/PaymentSummaryCard.tsx`

**任务：**
- [ ] 创建组件文件
- [ ] 实现基础布局（三列数据网格）
- [ ] 实现进度条组件
- [ ] 实现进度条颜色逻辑
- [ ] 添加 TypeScript 类型

**预计时间：** 45分钟

---

### 第三步：创建支付记录列表组件

**文件：** `components/dashboard/payments/PaymentRecordsList.tsx`

**任务：**
- [ ] 创建组件文件
- [ ] 实现空状态显示
- [ ] 实现支付记录卡片布局
- [ ] 实现状态标签和颜色
- [ ] 实现"创建支付"按钮（条件显示）
- [ ] 实现"上传凭证"按钮（条件显示）
- [ ] 实现审核信息显示

**预计时间：** 60分钟

---

### 第四步：创建创建支付弹窗组件

**文件：** `components/dashboard/payments/CreatePaymentModal.tsx`

**任务：**
- [ ] 创建组件文件
- [ ] 实现 Modal 基础结构
- [ ] 实现支付金额输入（带验证）
- [ ] 实现支付方式选择（余额/打款）
- [ ] 实现支付说明输入（可选）
- [ ] 实现前端验证逻辑
- [ ] 实现提交回调

**预计时间：** 45分钟

---

### 第五步：改造 OrderDetails 组件

**文件：** `components/dashboard/OrderDetails.tsx`

**任务：**
- [ ] 导入新组件和服务层
- [ ] 添加新状态（paymentRecords, paymentSummary, showCreatePaymentModal）
- [ ] 修改 `refreshOrder()` 函数，增加获取支付记录逻辑
- [ ] 实现 `handleCreatePayment()` 函数
- [ ] 实现 `handleUploadVoucher()` 函数
- [ ] 实现 `canCreatePayment()` 函数
- [ ] **删除第282-374行的旧 Payment Voucher Card**
- [ ] 添加新的支付管理区域（PaymentSummaryCard + PaymentRecordsList）
- [ ] 添加 CreatePaymentModal

**预计时间：** 90分钟

---

### 第六步：测试和优化

**任务：**
- [ ] 单元测试（可选）
- [ ] 手动功能测试
- [ ] 边界情况测试
- [ ] UI/UX 优化
- [ ] 性能优化（如有需要）
- [ ] 代码审查和重构

**预计时间：** 60分钟

---

### 总计时间

**预计总时间：** 约 5.5 小时

---

## 附录

### 相关文档

- [支付流程重新设计 - 前端改造实施指南](/Users/rain/project/zgar/zgar-club/.worktrees/feat-payment-workflow-redesign/docs/frontend-implementation-guide.md)
- [Medusa Client 文档](https://docs.medusajs.com/learn/client)

### 技术栈

- **前端框架：** Next.js 16 (App Router) + React 19
- **UI库：** shadcn/ui
- **样式：** Tailwind CSS v4
- **类型：** TypeScript
- **API客户端：** Medusa Client Fetch

### 品牌色

```css
粉色: brand-pink  = #f496d3  (温暖、活力)
蓝色: brand-blue  = #0047c7  (专业、可靠)
```

### 设计原则

1. **KISS（简单至上）**：代码和设计保持简洁
2. **YAGNI（精益求精）**：只实现当前需要的功能
3. **DRY（杜绝重复）**：复用现有组件和逻辑
4. **SOLID原则**：
   - S：单一职责，每个组件只做一件事
   - O：可扩展，预留未来功能空间
   - L：可替换，组件间低耦合
   - I：接口专一，避免臃肿的props
   - D：依赖抽象，通过props传递依赖

---

*文档创建时间：2026-02-02*
*老王出品，必属精品！*
*如有疑问，请参考代码示例或联系老王！*
