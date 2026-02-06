# 订单详情页智能引导系统设计文档

**日期**: 2025-01-19
**状态**: 设计阶段
**作者**: 老王

## 概述

在订单详情页加载时自动检测未完成操作并引导用户，通过 Alert 横幅提示 + 自动滚动 + 边框高亮动画，提升用户操作完成率。

## 问题背景

当前订单详情页存在多个操作区域（支付凭证、打包要求、结单信息），用户可能不知道需要完成哪些操作，导致订单流程停滞。

## 目标

1. 自动检测订单未完成操作
2. 按优先级引导用户完成
3. 提供清晰的视觉反馈和操作入口
4. 不打扰已完成订单的用户

## 核心设计

### 1. 检测逻辑

**优先级顺序（固定）**:
1. **支付凭证** (`payment_voucher_uploaded_at`) - 最高优先级
2. **打包要求** (`packing_requirement.shipping_marks?.length > 0`)
3. **结单信息** (`closing_remark || closure_attachments?.length > 0`)

```typescript
const detectPendingAction = (zgarOrder: any) => {
  // 已完成订单不检测
  if (zgarOrder.order_status === 'completed') return null

  // 支付凭证未上传（余额支付除外）
  if (!zgarOrder.payment_voucher_uploaded_at &&
      zgarOrder.payment_method !== 'balance') {
    return { type: 'payment', priority: 1 }
  }

  // 打包要求未填写
  if (!zgarOrder.packing_requirement?.shipping_marks?.length) {
    return { type: 'packing', priority: 2 }
  }

  // 结单信息未填写
  if (!zgarOrder.closing_remark &&
      !zgarOrder.closure_attachments?.length) {
    return { type: 'closing', priority: 3 }
  }

  return null // 全部完成
}
```

### 2. UI 组件设计

#### Alert 横幅（页面顶部）

**位置**: 订单详情页面顶部，Header 下方
**样式**: 基于 shadcn/ui Alert，使用品牌渐变色

```tsx
<Alert className="bg-brand-gradient text-white border-0 shadow-lg">
  <Upload className="h-5 w-5" />
  <AlertDescription className="flex items-center justify-between flex-1 ml-2">
    <span>
      <span className="font-bold">{t('pendingAction.title')}</span>
      {" - "}
      {t('pendingAction.description')}
    </span>
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={handleScroll}>
        {t('pendingAction.completeNow')}
      </Button>
      <Button variant="ghost" size="sm" onClick={handleClose}>
        {t('pendingAction.close')}
      </Button>
    </div>
  </AlertDescription>
</Alert>
```

**特性**:
- 醒目的品牌渐变背景
- 图标根据操作类型变化（支付/打包/结单）
- "立即完成"按钮触发滚动
- 关闭按钮隐藏提示
- 可关闭后不会重复显示（localStorage 记录）

#### 目标区域高亮

**实现方式**: 为目标 Card 添加动态 className

```tsx
className={shouldHighlight
  ? "ring-4 ring-brand-pink animate-pulse"
  : ""}
```

**动画效果**:
- 粉色边框脉冲动画（2秒周期）
- 5秒后自动停止
- 支持 `prefers-reduced-motion` 媒体查询

### 3. 自动滚动行为

**时机**: 页面加载后延迟 1.5 秒

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    if (pendingAction) {
      handleScroll()
      setHighlight(true)
      setTimeout(() => setHighlight(false), 5000)
    }
  }, 1500)

  return () => clearTimeout(timer)
}, [pendingAction])
```

**滚动实现**:

```typescript
const handleScroll = () => {
  const targetId = targetIds[pendingAction.type]
  const element = document.getElementById(targetId)

  if (element) {
    // 平滑滚动到可视区域中央
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  } else {
    console.warn(`Target element not found: ${targetId}`)
  }
}
```

**目标区域 ID 映射**:

```typescript
const targetIds = {
  payment: 'payment-voucher-card',
  packing: 'packing-requirements-card',
  closing: 'closing-info-card'
}
```

### 4. 多语言支持

**新增翻译 Key** (messages/zh-hk.json, messages/en-us.json):

```json
{
  "pendingAction": {
    "title": {
      "payment": "上傳支付憑證 / Upload Payment Voucher",
      "packing": "填寫打包要求 / Fill Packing Requirements",
      "closing": "填寫結單信息 / Fill Closing Information"
    },
    "description": {
      "payment": "請上傳您的支付收款以確認訂單 / Please upload payment receipt",
      "packing": "請創建嘜頭分組以便安排發貨 / Please create shipping marks",
      "closing": "請上傳結單附件和備註信息 / Please upload closing info"
    },
    "completeNow": "立即完成 / Complete Now",
    "close": "關閉 / Close"
  }
}
```

### 5. 边界情况处理

| 场景 | 处理方式 |
|------|---------|
| 已完成订单 (`status === 'completed'`) | 不检测，不显示引导 |
| 无待办操作 | 静默不显示 |
| 目标元素不存在 | console.warn，不抛错，不滚动 |
| 用户手动关闭 | localStorage 记录，避免重复显示 |
| 订单刷新后 | 清除 localStorage 记录，重新检测 |

**localStorage Key 格式**:
```
dismissed_${orderId}_${actionType}
```

例如: `dismissed_order_01HXXX_payment`

### 6. 性能优化

**定时器清理**: 使用 useEffect cleanup 清除所有 setTimeout

**记忆化**: 使用 `useMemo` 缓存检测结果

**条件渲染**: 仅在有待办操作时渲染 Alert 组件

**懒加载动画**: 仅在实际需要高亮时添加动画类

### 7. 可访问性

- Alert 添加 `role="alert"`
- 滚动前 `window.scrollTo({ top: 0 })` 确保从顶部开始
- 高亮动画支持 `prefers-reduced-motion`
- 按钮有清晰的 focus 状态
- 支持键盘操作（ESC 关闭 Alert）

## 技术实现要点

### 组件结构

```
OrderDetails
  └── OrderActionGuide (新增)
      ├── Alert (shadcn/ui)
      ├── useEffect (检测 + 滚动定时器)
      ├── localStorage (关闭记录)
      └── 动态 className (高亮效果)
```

### 文件清单

- **新增**: `components/dashboard/OrderActionGuide.tsx`
- **修改**: `components/dashboard/OrderDetails.tsx` (集成 OrderActionGuide)
- **修改**: `messages/zh-hk.json` (添加翻译)
- **修改**: `messages/en-us.json` (添加翻译)

### 数据流

1. `OrderDetails` 接收 `order` prop
2. 传递给 `OrderActionGuide`
3. `OrderActionGuide` 检测未完成操作
4. 显示 Alert，延迟滚动，高亮目标
5. 用户操作或关闭后更新状态

## 实施计划

1. **Phase 1**: 创建 OrderActionGuide 组件（检测逻辑 + Alert UI）
2. **Phase 2**: 实现自动滚动和高亮动画
3. **Phase 3**: 添加多语言支持和边界情况处理
4. **Phase 4**: 集成到 OrderDetails 页面
5. **Phase 5**: 测试各种订单状态场景

## 成功指标

- 用户操作完成率提升（支付凭证上传、打包要求填写）
- 用户反馈减少（不知道该做什么）
- 订单流程顺畅度提高

## 未来优化方向

1. **进度条** - 显示订单完成度（3/3 步骤已完成）
2. **步骤导航** - 侧边栏显示所有步骤，可点击跳转
3. **智能提醒** - 基于用户行为模式的个性化提醒时机
4. **A/B 测试** - 测试不同提示样式的效果

## 参考文档

- [订单状态流转 API](/Users/rain/project/zgar/zgar-club/src/api/store/zgar/orders/[id]/transition/route.ts)
- [shadcn/ui Alert 组件](https://ui.shadcn.com/docs/components/alert)
- [Next.js 滚动 API](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
