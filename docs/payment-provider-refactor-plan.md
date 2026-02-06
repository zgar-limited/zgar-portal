# Payment Provider List 动态化改造计划

## 📋 需求概述

**改造目标：** 将结算确认弹框中的支付方式选择从硬编码改为动态获取后端 payment-provider list

**参考实现：** zgar-club 项目的 payment-provider 架构

**当前问题：**
1. `PaymentMethodSelector` 组件硬编码了两种支付方式（`balance` 和 `manual_transfer`）
2. 新增支付方式需要修改前端代码，不够灵活
3. 无法动态启用/禁用支付方式

## 🔍 现状分析

### zgar-club 后端架构

**Payment Provider 定义：**
```typescript
// zgar-club/src/modules/payment-zgar/index.ts
export default ModuleProvider(Modules.PAYMENT, {
  services: [
    ManualPaymentProvider,      // zgar_manual - 线下转账
    BalancePaymentProvider,     // zgar_balance - 余额支付
    CreditPaymentProvider,      // zgar_credit - 账期支付
    PointsPaymentProvider,      // zgar_points - 积分支付
  ],
});
```

**Payment Provider 标识符：**
- `zgar_manual` - 线下转账支付
- `zgar_balance` - 余额支付（支持欠款模式）
- `zgar_credit` - 账期支付
- `zgar_points` - 积分支付（金额为0）

### zgar-portal 当前实现

**前端组件：**
- `components/checkout/PaymentMethodSelector.tsx` - 支付方式选择器
- `components/other-pages/ShopCart.tsx` - 结算确认弹框

**硬编码的支付方式：**
```typescript
export type PaymentMethod = "balance" | "manual_transfer";
```

**当前数据流：**
```
用户点击结算按钮
  → 显示确认弹框
  → PaymentMethodSelector 硬编码两种支付方式
  → 用户选择支付方式
  → 调用对应 API（completeZgarCartCheckoutWithBalance 或 completeZgarCartCheckout）
```

## 🎯 改造方案

### Phase 1: 后端 API 开发

#### 1.1 创建获取 Payment Provider List 的 API

**文件位置：** `app/api/store/payment-providers/route.ts`

**API 设计：**
```typescript
GET /api/store/payment-providers

Response:
{
  "payment_providers": [
    {
      "id": "zgar_balance",
      "name": "余额支付",
      "description": "使用账户余额直接支付订单",
      "icon": "wallet",
      "enabled": true,
      "is_default": true
    },
    {
      "id": "zgar_points",
      "name": "积分支付",
      "description": "使用积分兑换商品",
      "icon": "star",
      "enabled": true
    },
    {
      "id": "zgar_credit",
      "name": "账期支付",
      "description": "使用账期额度支付",
      "icon": "calendar",
      "enabled": false
    },
    {
      "id": "zgar_manual",
      "name": "线下转账",
      "description": "通过银行转账支付，完成后上传凭证",
      "icon": "upload",
      "enabled": true
    }
  ]
}
```

**实现要点：**
- 使用 Medusa SDK 的 `listPaymentProviders` 方法
- 过滤出 zgar 相关的 providers（`zgar_*`）
- 添加中文友好名称和描述
- 支持启用/禁用状态
- 标记默认支付方式

#### 1.2 集成到 data 层

**文件位置：** `data/payments.ts`

**新增函数：**
```typescript
export const getPaymentProviders = async (): Promise<PaymentProvider[]>
```

### Phase 2: 前端组件改造

#### 2.1 重构 PaymentMethodSelector 组件

**改造要点：**
1. 移除硬编码的支付方式类型
2. 从 props 接收支付方式列表
3. 动态渲染支付方式选项
4. 保留原有的 UI/UX 设计

**新接口设计：**
```typescript
interface PaymentMethodSelectorProps {
  paymentProviders: PaymentProvider[];  // 新增：支付方式列表
  mode?: "selection" | "payment";
  orderId?: string;
  orderAmount: number;
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
  onPaymentMethodChange?: (providerId: string) => void;  // 改为使用 providerId
  onPaymentSuccess?: () => void;
}
```

**支付方式渲染逻辑：**
```tsx
{paymentProviders.map((provider) => (
  <div key={provider.id} onClick={() => handleMethodChange(provider.id)}>
    {/* 动态渲染每个支付方式 */}
  </div>
))}
```

#### 2.2 更新结算确认弹框

**文件位置：** `components/other-pages/ShopCart.tsx`

**改造要点：**
1. 在组件挂载时获取 payment-provider list
2. 将支付方式列表传递给 `PaymentMethodSelector`
3. 处理不同支付方式的结算逻辑

**状态管理：**
```typescript
const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('');
```

**数据获取：**
```typescript
useEffect(() => {
  const fetchPaymentProviders = async () => {
    const providers = await getPaymentProviders();
    const enabledProviders = providers.filter(p => p.enabled);
    setPaymentProviders(enabledProviders);

    // 选择默认支付方式
    const defaultProvider = enabledProviders.find(p => p.is_default) || enabledProviders[0];
    if (defaultProvider) {
      setSelectedPaymentProvider(defaultProvider.id);
    }
  };

  fetchPaymentProviders();
}, []);
```

### Phase 3: 结算逻辑适配

#### 3.1 支付方式路由

**根据 provider_id 调用不同 API：**
```typescript
const handleConfirmCheckout = async () => {
  switch (selectedPaymentProvider) {
    case 'zgar_balance':
      // 调用 completeZgarCartCheckoutWithBalance
      break;
    case 'zgar_points':
      // 新增：调用积分支付 API
      break;
    case 'zgar_credit':
      // 新增：调用账期支付 API
      break;
    case 'zgar_manual':
      // 调用 completeZgarCartCheckout
      break;
    default:
      toast.error('不支持的支付方式');
  }
};
```

#### 3.2 新增 Payment Provider 支持的 API

**需要在 data/cart.ts 中新增：**
- `completeZgarCartCheckoutWithPoints` - 积分支付
- `completeZgarCartCheckoutWithCredit` - 账期支付

**或使用统一的 API：**
- `completeZgarCartCheckoutWithProvider` - 根据 provider_id 动态调用

## 📁 文件清单

### 需要修改的文件

1. **API 路由（新增）**
   - `app/api/store/payment-providers/route.ts`

2. **数据层（修改）**
   - `data/payments.ts` - 新增 `getPaymentProviders` 函数

3. **组件（修改）**
   - `components/checkout/PaymentMethodSelector.tsx` - 重构为动态渲染
   - `components/other-pages/ShopCart.tsx` - 集成动态支付方式获取

4. **类型定义（新增）**
   - `types/payment.ts` - PaymentProvider 类型定义

### 可选的新增文件

5. **组件（新增）**
   - `components/checkout/PaymentProviderCard.tsx` - 单个支付方式卡片组件（从 PaymentMethodSelector 拆分）

## 🔄 数据流改造

### 改造前
```
ShopCart.tsx
  ↓ (硬编码)
PaymentMethodSelector.tsx
  ↓ (选择)
balance | manual_transfer
  ↓ (调用对应 API)
completeZgarCartCheckoutWithBalance | completeZgarCartCheckout
```

### 改造后
```
ShopCart.tsx
  ↓ (API 调用)
GET /api/store/payment-providers
  ↓ (返回列表)
[zgar_balance, zgar_points, zgar_manual, ...]
  ↓ (传递 props)
PaymentMethodSelector.tsx
  ↓ (动态渲染)
zgar_balance | zgar_points | zgar_manual | ...
  ↓ (路由到对应 API)
completeZgarCartCheckoutWithBalance | completeZgarCartCheckoutWithPoints | ...
```

## ⚠️ 注意事项

### 向后兼容性
- 保留原有的 `balance` 和 `manual_transfer` 映射到 `zgar_balance` 和 `zgar_manual`
- 确保现有订单支付流程不受影响

### 错误处理
- API 获取失败时的降级方案（使用硬编码列表）
- 不可用支付方式的禁用状态处理
- 用户余额不足等业务逻辑校验

### 用户体验
- 加载状态显示（获取支付方式列表时）
- 支付方式图标和描述的友好展示
- 默认支付方式的选择逻辑
- 支付方式的优先级排序

### 国际化
- 支付方式名称和描述的多语言支持
- 使用 `messages/zh-hk.json` 和 `messages/en-us.json`

## 🚀 实施步骤

1. **创建 PaymentProvider 类型定义**
2. **开发 `/api/store/payment-providers` API**
3. **在 `data/payments.ts` 中添加获取函数**
4. **重构 `PaymentMethodSelector` 组件**
5. **更新 `ShopCart` 组件集成动态支付方式**
6. **测试所有支付方式的结算流程**
7. **添加错误处理和降级方案**
8. **更新国际化文件**

## 📊 测试计划

### 单元测试
- API 路由测试
- 数据获取函数测试
- 组件渲染测试

### 集成测试
- 完整结算流程测试
- 不同支付方式的选择和提交
- 错误场景测试

### 手动测试清单
- [ ] 获取支付方式列表成功
- [ ] 选择余额支付并成功结算
- [ ] 选择手动转账并成功结算
- [ ] API 失败时的降级显示
- [ ] 余额不足时的提示
- [ ] 支付方式禁用状态
- [ ] 默认支付方式选择

## 🎨 UI/UX 改进建议

1. **支付方式图标**
   - 为每个支付方式设计独特图标
   - 使用 Lucide React 图标库

2. **支付方式排序**
   - 余额支付 > 积分支付 > 账期支付 > 手动转账
   - 根据可用性和用户偏好动态排序

3. **视觉反馈**
   - 选中状态更明显的视觉效果
   - 余额不足等警告状态的视觉提示

4. **加载状态**
   - 骨架屏显示
   - 支付方式列表加载中的动画

## 📝 后续优化

1. **配置化**
   - 在 Medusa 后台配置支付方式的启用/禁用
   - 支持动态调整支付方式优先级

2. **缓存策略**
   - 缓存支付方式列表，减少 API 调用
   - 定期刷新缓存

3. **智能推荐**
   - 根据用户余额智能推荐支付方式
   - 根据历史订单排序支付方式

4. **扩展性**
   - 支持第三方支付方式（支付宝、微信支付等）
   - 插件化架构，便于新增支付方式

---

**创建时间：** 2025-01-06
**创建者：** 老王（AI 开发助手）
**项目：** zgar-portal
**关联项目：** zgar-club（参考实现）
