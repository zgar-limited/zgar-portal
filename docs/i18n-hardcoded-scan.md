# Zgar Portal 硬编码中文字符完整扫描报告

> 扫描时间: 2026-02-08
> 扫描范围: 全项目（app/, components/, widgets/, hooks/, utils/）
> 目标: 删除简体中文，只保留繁体中文和英文

---

## 📊 扫描统计总览

### 总体数据

| 模块 | 扫描文件数 | 硬编码文件数 | 硬编码总数 | 高密度文件 | 状态 |
|------|-----------|-------------|-----------|-----------|------|
| **首页和布局** | 15 | 4 | 15 | 1 | ⚠️ 需处理 |
| **产品相关** | 45 | 10 | 90+ | 4 | ⚠️ 需处理 |
| **用户仪表盘** | 23 | 18 | 600+ | 16 | 🔴 严重 |
| **其他模块** | 60 | 25 | 165+ | 6 | ⚠️ 需处理 |
| **简体中文配置** | 6 | 6 | - | - | ✅ 已删除 |
| **总计** | **149** | **63** | **870+** | **27** | 🔴 待处理 |

### 状态说明
- 🔴 **严重**: 超过100个硬编码或超高密度文件
- ⚠️ **需处理**: 有硬编码需要国际化
- ✅ **已完成**: 无硬编码或已处理

---

## 🎯 优先级分类

### P0 - 紧急（超高密度文件 > 50个硬编码）

这些文件包含大量用户界面文本，对国际化影响最大，必须优先处理：

1. **components/dashboard/OrderDetails.tsx** - 100+ 处
2. **components/dashboard/Orders.tsx** - 50+ 处
3. **components/dashboard/payments/CreatePaymentModal.tsx** - 30+ 处
4. **components/dashboard/payments/PaymentRecordsList.tsx** - 30+ 处
5. **widgets/ShopBanner/index.jsx** - 80+ 处
6. **app/[locale]/(layout)/(other-pages)/about-us/page.tsx** - 40+ 处

### P1 - 重要（高密度文件 > 20个硬编码）

用户交互密集的组件，需要尽快处理：

7. **components/dashboard/AccountSettings.tsx** - 25+ 处
8. **components/dashboard/Tasks.tsx** - 25+ 处
9. **components/dashboard/ClosingInfoModal.tsx** - 25+ 处
10. **components/dashboard/payments/PaymentSummaryCard.tsx** - 20+ 处
11. **widgets/HomeHotSellingProduct/index.tsx** - 25+ 处
12. **widgets/HomeAboutUs/index.tsx** - 20+ 处
13. **app/[locale]/(layout)/(verify)/verify-guide/components/** - 25+ 处（多个文件）

### P2 - 一般（中低密度文件）

次要组件，可以分批处理：

14. **components/products/ProductCard.tsx** - 10 处
15. **components/products/ProductGrid.tsx** - 9 处
16. **components/products/FilterSidebarNew.jsx** - 11 处
17. **widgets/HomeFooter/index.tsx** - 8 处
18. **其他35个文件** - 5-15 处不等

---

## 📋 详细清单

### 1️⃣ 首页和布局模块（15处）

#### widgets/HomeFooter/index.tsx (8处)
```tsx
[行 49] "Contact us" → Footer.contactUs
[行 108] "Products" → Footer.products
[行 113] "产品系列一" → Footer.productSeries1
[行 118] "产品系列二" → Footer.productSeries2
[行 123] "产品系列三" → Footer.productSeries3
[行 128] "产品系列四" → Footer.productSeries4
[行 139] "Information" → Footer.information
```

#### 验证相关组件（7处）
```tsx
app/[locale]/(layout)/(verify)/verify-guide/components/CodeInfoCard.tsx
[行 178] "防伪码信息" → VerifyCodeInfo.title
[行 179] "请输入标签上的6位验证码" → VerifyCodeInfo.subtitle
[行 185] "序列号" → VerifyCodeInfo.serialNumber
[行 190] "查询次数" → VerifyCodeInfo.queryTimes
[行 195] "首次查询时间" → VerifyCodeInfo.firstQueryTime

app/[locale]/(layout)/(verify)/verify-guide/components/CodeInput.tsx
[行 158] aria-label "验证码第{n}位" → VerifyCodeInput.ariaLabel
```

---

### 2️⃣ 产品相关模块（90+处）

#### components/products/ProductCard.tsx (10处)
```tsx
[行 52,53,219,224] "未知" → ProductCard.unknown
[行 182] "登录查看价格" → ProductCard.loginToViewPrice
[行 267] "添加中..." → ProductCard.adding
[行 272] "已添加 ✓" → ProductCard.added
[行 277] "立即购买" → ProductCard.buyNow
```

#### components/products/ProductGrid.tsx (9处)
```tsx
[行 68] "排序 ▼" → ProductGrid.sortDefault
[行 69] "价格：低到高" → ProductGrid.sortPriceAsc
[行 70] "价格：高到低" → ProductGrid.sortPriceDesc
[行 105] "未找到产品" → ProductGrid.noProducts
[行 106] "试着调整筛选条件" → ProductGrid.adjustFilters
[行 121] "清除筛选" → ProductGrid.clearFilters
```

#### components/products/FilterSidebarNew.jsx (11处)
```tsx
[行 25] "筛选 FILTER" → FilterSidebar.title
[行 35] "📦 分类 Category" → FilterSidebar.category
[行 43] "一次性电子烟" → FilterSidebar.category.disposable
[行 43] "封闭式电子烟" → FilterSidebar.category.closedSystem
[行 43] "开放式电子烟" → FilterSidebar.category.openSystem
[行 43] "烟油" → FilterSidebar.category.eLiquid
[行 61] "💰 价格 Price" → FilterSidebar.price
[行 93] "✨ 状态 Availability" → FilterSidebar.availability
[行 101] "有货" → FilterSidebar.availability.inStock
[行 101] "预售" → FilterSidebar.availability.preOrder
[行 101] "缺货" → FilterSidebar.availability.outOfStock
[行 115] "🗑️ 清除筛选" → FilterSidebar.clear
```

#### widgets/ShopBanner/index.jsx (80+处)
```jsx
[行 15] "革命性雾化科技" → ShopBanner.product1.subtitle
[行 16] "重新定义您的体验" → ShopBanner.product1.description
[行 23] "梦幻口感" → ShopBanner.product2.subtitle
[行 24] "限量发售，先到先得" → ShopBanner.product2.description
[行 31] "星云系列" → ShopBanner.product3.subtitle
[行 32] "品质之选" → ShopBanner.product3.description
[行 39] "冰爽系列" → ShopBanner.product4.subtitle
[行 40] "极致清凉体验" → ShopBanner.product4.description
[行 47] "能量爆发" → ShopBanner.product5.subtitle
[行 48] "强劲持久体验" → ShopBanner.product5.description
[行 366] "立即探索" → ShopBanner.exploreNow
// ... 还有70+处产品描述、标签、注释
```

#### widgets/HomeHotSellingProduct/index.tsx (25+处)
```tsx
[行 53-55] "新品" → ProductBadge.new
[行 53-55] "热销" → ProductBadge.hot
[行 53-55] "特价" → ProductBadge.sale
[行 71] "热销产品" → HotSelling.title
[行 75] "精选最受欢迎的产品，品质保证，限时优惠" → HotSelling.subtitle
// ... 还有20+处
```

---

### 3️⃣ 用户仪表盘模块（600+处）🔴

这是最严重的模块，几乎所有的订单、支付、账户管理组件都有大量硬编码中文。

#### components/dashboard/OrderDetails.tsx (100+处)
```tsx
// 订单状态
[行 88] "未上传凭证" → OrderDetails.paymentAuditStatus.notUploaded
[行 93] "已上传凭证" → OrderDetails.paymentAuditStatus.uploaded
[行 98] "审核中" → OrderDetails.paymentAuditStatus.partial
[行 103] "审核完成" → OrderDetails.paymentAuditStatus.completed

// 订单追踪
[行 803] "订单已创建" → OrderDetails.tracking.created
[行 829] "支付确认" → OrderDetails.tracking.payment
[行 831] "已完成" → OrderDetails.tracking.completed
[行 833] "待处理" → OrderDetails.tracking.pending
[行 859] "商品打包" → OrderDetails.tracking.packing
[行 889] "已发货" → OrderDetails.tracking.shipped

// 订单汇总
[行 903] "订单汇总" → OrderDetails.orderSummary
[行 910] "订单日期" → OrderDetails.orderDate
[行 927] "支付" → OrderDetails.payment
[行 941] "支付方式" → OrderDetails.paymentMethod
[行 960] "发货状态" → OrderDetails.fulfillment
[行 975] "审核状态" → OrderDetails.auditStatus
[行 988] "拒绝理由" → OrderDetails.rejectionReason
[行 1005] "支付审核状态" → OrderDetails.paymentAuditStatus
[行 1021] "结单审核状态" → OrderDetails.closingAuditStatus

// 其他（还有80+处）
```

#### components/dashboard/Orders.tsx (50+处)
```tsx
// 订单状态
[行 71] "已退货" → Orders.status.returned

// 支付方式
[行 103] "余额支付" → Orders.paymentMethod.balance
[行 110] "积分支付" → Orders.paymentMethod.points
[行 118] "账期积分" → Orders.paymentMethod.credit
[行 125] "手动支付" → Orders.paymentMethod.manual

// 统计信息
[行 183] "总订单数" → Orders.totalOrders
[行 192] "已完成" → Orders.completed
[行 205] "进行中" → Orders.inProgress

// 空状态
[行 240] "暂无订单" → Orders.noOrders
[行 241] "您还没有任何订单，快去商城逛逛吧~" → Orders.noOrdersDesc
[行 246] "前往商城" → Orders.goToShop

// 其他（还有40+处）
```

#### components/dashboard/payments/CreatePaymentModal.tsx (30+处)
```tsx
[行 80] "请输入有效的支付金额" → PaymentModal.invalidAmount
[行 84] "支付金额不能超过剩余应付金额" → PaymentModal.amountExceeds
[行 108] "打款支付必须上传至少一张支付凭证" → PaymentModal.voucherRequired
[行 146] "付款" → PaymentModal.title
[行 164] "剩余应付金额" → PaymentModal.remainingAmount
[行 176] "支付金额 *" → PaymentModal.paymentAmount
[行 183] "请输入支付金额" → PaymentModal.amountPlaceholder
[行 193] "支付方式 *" → PaymentModal.paymentMethod
[行 209] "余额支付" → PaymentModal.balancePayment
[行 224] "银行转账" → PaymentModal.bankTransfer
[行 233] "支付凭证 *" → PaymentModal.paymentVoucher
[行 248] "支付说明（可选）" → PaymentModal.paymentDescription
[行 268] "取消" → PaymentModal.cancel
[行 293] "确认付款" → PaymentModal.confirmPayment
// ... 还有20+处
```

#### components/dashboard/payments/PaymentRecordsList.tsx (30+处)
```tsx
// 支付状态
[行 43] "已批准" → PaymentRecords.status.approved
[行 45] "审核中" → PaymentRecords.status.reviewing
[行 47] "已拒绝" → PaymentRecords.status.rejected
[行 50] "待处理" → PaymentRecords.status.pending

// 标题和提示
[行 103] "支付记录" → PaymentRecords.title
[行 107] "共 {n} 条" → PaymentRecords.totalRecords
[行 119] "恭喜！您已付清全部订单金额" → PaymentRecords.fullyPaid
[行 132] "付款" → PaymentRecords.paymentButton
[行 141] "订单需要审核通过后才能创建支付" → PaymentRecords.needApproval
[行 153] "暂无支付记录" → PaymentRecords.noRecords
[行 156] "点击上方按钮创建支付" → PaymentRecords.createPaymentHint
[行 157] "订单审核通过后即可创建支付" → PaymentRecords.waitApprovalHint

// 支付方式
[行 187] "第{n}期付款" → PaymentRecords.installment
[行 192] "余额支付" → PaymentRecords.balancePayment
[行 193] "银行转账" → PaymentRecords.bankTransfer

// 其他（还有20+处）
```

#### components/dashboard/AccountSettings.tsx (25+处)
```tsx
[行 43] "账户设置" → AccountSettings.title
[行 45] "管理您的个人信息和账户安全设置" → AccountSettings.description
[行 55] "个人信息" → AccountSettings.personalInfo
[行 64] "名字 *" → AccountSettings.firstName
[行 76] "姓氏 *" → AccountSettings.lastName
[行 92] "电子邮箱 *" → AccountSettings.email
[行 115] "修改密码" → AccountSettings.changePassword
[行 123] "当前密码 *" → AccountSettings.currentPassword
[行 153] "新密码 *" → AccountSettings.newPassword
[行 185] "确认新密码 *" → AccountSettings.confirmPassword
[行 219] "所有标记为 * 的字段都是必填项" → AccountSettings.requiredFieldsHint
[行 234] "取消" → AccountSettings.cancel
[行 238] "保存更改" → AccountSettings.saveChanges
// ... 还有15+处
```

#### components/dashboard/Tasks.tsx (25+处)
```tsx
// 任务类型
[行 37] "新手任务" → Tasks.newbie
[行 38] "日常任务" → Tasks.daily
[行 39] "成就任务" → Tasks.achievement
[行 40] "活动任务" → Tasks.campaign

// 任务状态
[行 57] "已锁定" → Tasks.status.locked
[行 58] "进行中" → Tasks.status.active
[行 59] "已完成" → Tasks.status.completed
[行 60] "已领取" → Tasks.status.claimed
[行 61] "已过期" → Tasks.status.expired

// 提示消息
[行 123] "今天已经签到过了哦~" → Tasks.alreadySignedToday
[行 124] "签到成功！获得 {n} 积分" → Tasks.signinSuccess
[行 135] "签到失败，请稍后重试" → Tasks.signinError
[行 177] "领取成功！获得 {n} 积分 🎉" → Tasks.claimSuccess
[行 182] "领取失败，请稍后重试" → Tasks.claimError

// 其他（还有15+处）
```

#### 其他仪表盘组件（16个文件，500+处）

包括：
- ClosingInfoModal.tsx (25+处)
- PaymentSummaryCard.tsx (20+处)
- VoucherUploadArea.tsx (15+处)
- OffcanvasSidebar.tsx (10+处)
- MyAccount.tsx (15+处)
- AccountSummary.tsx (10+处)
- OrderCard.tsx (10+处)
- Sidebar.tsx (10+处)
- AccountNavCards.tsx (8+处)
- TabsNavigation.tsx (4处)
- Addressess.tsx (5处)
- TransactionTabs.tsx (2处)

---

### 4️⃣ 其他模块（165+处）

#### app/[locale]/(layout)/(other-pages)/about-us/page.tsx (40+处)
```tsx
[行 49] "我们是谁" → AboutUs.whoWeAre
[行 52] "Zgar 是一家专注于电子烟产品研发和生产的创新型企业..." → AboutUs.whoWeAreDesc
[行 55] "我们的团队由经验丰富的工程师..." → AboutUs.teamDesc
[行 62] "年经验" → AboutUs.years
[行 66] "个国家" → AboutUs.countries
[行 70] "用户" → AboutUs.users
[行 88] "优质产品" → AboutUs.qualityProducts
[行 104] "国际认证" → AboutUs.certification
[行 113] "严格品控" → AboutUs.qualityControl
[行 122] "专业团队" → AboutUs.professionalTeam
[行 155] "全球布局" → AboutUs.globalReach
[行 179] "覆盖国家" → AboutUs.coveredCountries
[行 184] "合作伙伴" → AboutUs.partners
[行 189] "国际认证" → AboutUs.certifications
[行 194] "客户支持" → AboutUs.customerSupport
// ... 还有30+处
```

#### widgets/HomeAboutUs/index.tsx (20+处)
```tsx
[行 10-13] "成立年份" → AboutUs.founded
[行 10-13] "产品数量" → AboutUs.products
[行 10-13] "服务国家" → AboutUs.countries
[行 10-13] "全球用户" → AboutUs.users
[行 42] "关于 Zgar" → HomeAboutUs.title
[行 45] "专注电子烟领域 · 服务全球用户" → HomeAboutUs.tagline
[行 84] "品牌故事" → HomeAboutUs.brandStory
[行 87] "Zgar 成立于2018年，专注于为全球用户提供..." → HomeAboutUs.brandStoryDesc
[行 112] "了解更多" → HomeAboutUs.learnMore
// ... 还有10+处
```

#### widgets/HomeVideo/HomeVideo.tsx (15+处)
```tsx
[行 18-19] "一次性电子烟使用指南" → Video.video1Title
[行 18-19] "产品教程" → Video.video1Category
[行 25-26] "换弹系列快速上手" → Video.video2Title
[行 25-26] "产品教程" → Video.video2Category
[行 32-33] "烟油口味推荐" → Video.video3Title
[行 32-33] "使用技巧" → Video.video3Category
[行 39-40] "产品配件安装教程" → Video.video4Title
[行 39-40] "使用技巧" → Video.video4Category
[行 46-47] "限量版产品介绍" → Video.video5Title
[行 46-47] "产品展示" → Video.video5Category
[行 92] "精彩视频教程" → VideoGallery.title
[行 99] "观看产品使用教程，快速掌握使用技巧" → VideoGallery.subtitle
[行 127] "立即观看" → VideoGallery.watchButton
```

#### widgets/HomeProductVerify/index.tsx (10+处)
```tsx
[行 27] "扫码验证" → ProductVerify.title
[行 33] "使用手机扫描产品包装上的二维码" → ProductVerify.step1
[行 35] "进入两步产品验证流程" → ProductVerify.step2
[行 44] "查看验证指南" → ProductVerify.guideButton
[行 68] "正品保证" → ProductVerify.genuineGuarantee
[行 80] "正品保障" → ProductVerify.guaranteeBadge
[行 80] "官方认证" → ProductVerify.officialBadge
[行 89] "快速验证" → ProductVerify.fastBadge
[行 89] "扫码即查" → ProductVerify.fastDesc
[行 100] "安全可靠" → ProductVerify.safeBadge
[行 100] "全程加密" → ProductVerify.safeDesc
```

#### widgets/HomeSubscription/HomeSubscription.tsx (8处)
```tsx
[行 44] "订阅我们" → Subscription.title
[行 49] "获取最新产品发布、促销活动和优惠信息" → Subscription.desc1
[行 51] "免费直接送到您的收件箱!" → Subscription.desc2
[行 73] "输入您的邮箱地址" → Subscription.emailPlaceholder
[行 77] "立即订阅" → Subscription.subscribeButton
[行 89] "我们尊重您的隐私，绝不发送垃圾邮件" → Subscription.privacy
```

#### widgets/HomeProductCate/index.tsx (6处)
```tsx
[行 10-14] "一次性电子烟" → Category.disposable
[行 10-14] "换弹系列" → Category.pod
[行 10-14] "烟油系列" → Category.eLiquid
[行 10-14] "配件专区" → Category.accessories
[行 10-14] "限量版" → Category.limited
[行 29] "精选产品分类" → ProductCategories.title
[行 36] "探索我们的全系列产品，满足您的不同需求" → ProductCategories.subtitle
```

#### 会员俱乐部组件（15+处）
```tsx
app/[locale]/(layout)/(member)/club/components/HeroCarousel.tsx
[行 140] "会员专享权益" → Club.memberBenefits
[行 143] "加入ZGAR Club，享受积分奖励、专属优惠、生日福利等超多会员权益" → Club.memberBenefitsDesc

app/[locale]/(layout)/(member)/club/components/StatsSection.tsx
[行 96] "可用优惠券" → Club.availableCoupons
[行 104] "待处理订单" → Club.pendingOrders
[行 187] "普通会员" → Club.regularMember
[行 190] "还需 650 积分升级" → Club.pointsNeeded
[行 190] "签到领积分" → Club.checkInForPoints
[行 220] "每日签到 +10 积分" → Club.dailyCheckInReward

app/[locale]/(layout)/(member)/club/components/KickOffRewards.tsx
[行 96] "立即开始您的会员之旅" → Club.startJourney
```

#### 通用组件（10+处）
```tsx
components/common/TaskProgressIndicator.tsx
[行 47] "浏览页面" → TaskProgress.defaultLabel
[行 69] "已完成" → TaskProgress.completed
[行 147] "✓ 任务完成!" → TaskProgress.taskComplete
[行 150] "完成度" → TaskProgress.completeness
[行 158-162] "+{reward} 积分" → TaskProgress.earnPoints
[行 158-162] "奖励:{reward} 积分" → TaskProgress.reward

components/common/QuantitySelect.jsx
[行 71] aria-label "减少数量" → Quantity.decrease
[行 86] aria-label "数量" → Quantity.quantity
[行 93] aria-label "增加数量" → Quantity.increase
```

---

## ✅ 已完成的任务

### 删除简体中文配置

**状态**: ✅ 已完成

**改动内容**:
1. ✅ 删除 `messages/zh-cn.json` 文件（463行）
2. ✅ 更新 `i18n/routing.ts`，移除 `zh-cn` locale
3. ✅ 更新 `messages/en-us.json`，移除简体中文选项
4. ✅ 更新 `messages/zh-hk.json`，移除简体中文选项
5. ✅ 修改 `components/dashboard/transactions/PointsTransactionTable.tsx`，动态选择日期 locale
6. ✅ 修改 `components/dashboard/transactions/BalanceTransactionTable.tsx`，动态选择日期 locale
7. ✅ 构建测试通过，无编译错误

**当前支持的语言**:
- 🇺🇸 **en-us** (English) - 默认语言
- 🇭🇰 **zh-hk** (繁體中文)

---

## 🎯 翻译键命名规范

### 命名策略

采用**混合键名策略**：
- **页面级组件**: 使用 `pages.*` 前缀
- **可复用组件**: 使用组件名作为键
- **子组件**: 使用父子组件名

### 示例

```json
{
  "pages": {
    "about": {
      "title": "关于我们",
      "whoWeAre": "我们是谁",
      "globalReach": "全球布局"
    },
    "verify": {
      "guideTitle": "防伪查询指南",
      "result": {
        "success": "验证通过",
        "failed": "验证失败"
      }
    }
  },
  "ProductCard": {
    "addToCart": "加入购物车",
    "buyNow": "立即购买",
    "outOfStock": "库存不足"
  },
  "Footer": {
    "contactUs": "联系我们",
    "products": "产品"
  },
  "Club": {
    "memberBenefits": "会员专享权益",
    "availablePoints": "可用积分"
  }
}
```

---

## 📝 实施计划

### 阶段1: P0紧急文件（预计4-6小时）

1. **components/dashboard/OrderDetails.tsx** (100+处) - 1.5小时
2. **components/dashboard/Orders.tsx** (50+处) - 1小时
3. **components/dashboard/payments/CreatePaymentModal.tsx** (30+处) - 45分钟
4. **components/dashboard/payments/PaymentRecordsList.tsx** (30+处) - 45分钟
5. **widgets/ShopBanner/index.jsx** (80+处) - 1小时
6. **app/[locale]/(layout)/(other-pages)/about-us/page.tsx** (40+处) - 45分钟

### 阶段2: P1重要文件（预计3-4小时）

7. **components/dashboard/AccountSettings.tsx** (25+处) - 30分钟
8. **components/dashboard/Tasks.tsx** (25+处) - 30分钟
9. **components/dashboard/ClosingInfoModal.tsx** (25+处) - 30分钟
10. **components/dashboard/payments/PaymentSummaryCard.tsx** (20+处) - 30分钟
11. **widgets/HomeHotSellingProduct/index.tsx** (25+处) - 30分钟
12. **widgets/HomeAboutUs/index.tsx** (20+处) - 30分钟
13. **验证模块组件** (25+处) - 45分钟

### 阶段3: P2一般文件（预计2-3小时）

14. **产品相关组件** (30+处，5个文件) - 1小时
15. **其他 widgets 组件** (30+处，6个文件) - 1小时
16. **仪表盘其他组件** (20+处，8个文件) - 1小时

### 总计工作量

- **总时间**: 9-13小时
- **总文件数**: 63个
- **总硬编码数**: 870+处
- **新增翻译键**: 约350-400个

---

## 🔧 实施步骤

### 步骤1: 添加翻译键

在 `messages/zh-hk.json` 和 `messages/en-us.json` 中添加所有翻译键。

**批量生成脚本示例**:
```bash
# 使用 AI 工具批量生成翻译键
# 基于 scan-report.md 中的建议键名
```

### 步骤2: 替换硬编码文字

对于每个文件：

1. **添加 useTranslations hook**:
```tsx
import { useTranslations } from "next-intl";

export function ComponentName() {
  const t = useTranslations("ComponentName");
  // ...
}
```

2. **替换硬编码文字**:
```tsx
// ❌ 修改前
<button>提交</button>

// ✅ 修改后
<button>{t("submit")}</button>
```

3. **处理动态内容**:
```tsx
// ❌ 修改前
`签到成功！获得 ${n} 积分`

// ✅ 修改后
t("signinSuccess", { n })

// messages/*.json
{
  "signinSuccess": "签到成功！获得 {n} 积分"
}
```

### 步骤3: 测试验证

1. **语言切换测试**: 确保中英文切换正常
2. **功能测试**: 确保所有交互功能正常
3. **视觉测试**: 确保布局和样式正常
4. **Edge Case 测试**: 测试空状态、错误状态等

### 步骤4: 验证完整性

```bash
# 检查是否还有遗漏的硬编码中文
grep -r "[\u4e00-\u9fa5]" app/ components/ widgets/ --exclude-dir=node_modules
```

---

## ⚠️ 注意事项

### 可保留的中文

1. **注释中的中文**: 代码注释可以保留中文
2. **console.log 中的中文**: 调试信息可以保留
3. **开发者工具提示**: 非用户可见的提示可以保留

### 需要处理的中文

1. ✅ JSX 中的可见文字
2. ✅ HTML 属性 (alt, placeholder, aria-label)
3. ✅ 字符串模板中的用户可见内容
4. ✅ 错误提示和成功消息
5. ✅ Toast 和 Notification

### 特殊处理

1. **日期格式化**: 使用 `dayjs` 的 locale 功能
2. **货币格式化**: 使用 `Intl.NumberFormat`
3. **数字格式化**: 使用 `Intl.NumberFormat`

---

## 📊 进度追踪

### 已完成 ✅

- [x] 删除简体中文配置文件
- [x] 扫描全项目硬编码文字
- [x] 生成详细扫描报告
- [x] 制定实施计划

### 进行中 🔄

- [ ] 批量替换硬编码文字（准备开始）

### 待开始 ⏳

- [ ] P0 紧急文件处理（6个文件，370+处）
- [ ] P1 重要文件处理（7个文件，170+处）
- [ ] P2 一般文件处理（50个文件，330+处）
- [ ] 全面测试验证
- [ ] 清理遗漏的硬编码

---

## 🚀 后续建议

### 1. 建立 CI/CD 检查

在 `.github/workflows/` 或 CI 脚本中添加硬编码检查：

```bash
#!/bin/bash
# 检查新增的硬编码中文
git diff --name-only HEAD | grep -E "\.(tsx?|jsx?)$" | xargs grep -n "[\u4e00-\u9fa5]" && exit 1
```

### 2. 添加 ESLint 规则

```javascript
// .eslintrc.js
{
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "JSXElement > Literal[value=/[\u4e00-\u9fa5]/]",
        message: "禁止在 JSX 中使用硬编码中文，请使用 useTranslations()"
      }
    ]
  }
}
```

### 3. 代码审查清单

在 PR 审查时检查：
- [ ] 是否有新的硬编码中文
- [ ] 是否使用了 useTranslations()
- [ ] 翻译键是否已添加到 messages/*.json
- [ ] 中英文翻译是否完整

### 4. 定期审计

每月运行一次扫描，确保没有新的硬编码：
```bash
# 定期扫描脚本
npx hardcode-scanner --locale=zh-hk,en-us
```

---

## 📞 联系方式

如有问题或需要协助，请联系：
- **项目负责人**: [待填写]
- **国际化负责人**: [待填写]
- **技术支持**: [待填写]

---

**报告生成时间**: 2026-02-08
**下次更新时间**: 完成第一阶段处理后
**文档版本**: v1.0
