[根目录](../../../../CLAUDE.md) > [app](../../../) > [[locale]](../../) > [(layout)](../) > **(member)**

# 会员模块

## 模块职责
提供会员专享功能和权益管理，包括会员俱乐部、积分系统、专属优惠等。该模块旨在提升用户忠诚度，增加用户粘性，并提供个性化的会员体验。

## 入口与启动
- **会员俱乐部**: `club/page.jsx` - 会员主页和权益展示

## 对外接口
```typescript
// 会员页面参数
interface MemberPageProps {
  params: Promise<{
    locale: string;
  }>;
}

// 会员信息
interface MemberProfile {
  id: string;
  tier: MemberTier;
  points: number;
  join_date: string;
  benefits: Benefit[];
  activities: MemberActivity[];
}

// 会员等级
interface MemberTier {
  name: string;
  level: number;
  benefits: string[];
  next_tier?: MemberTier;
  progress: number; // 升级进度百分比
}
```

## 关键依赖与配置

### 数据层集成
- `@/data/member.ts`: 会员数据管理
- `@/data/loyalty.ts`: 积分和奖励系统
- Medusajs Customer API 扩展: 会员功能扩展
- 第三方忠诚度平台集成（可选）

### 核心组件依赖
- `@/components/member/`:
  - `MemberCard.jsx` - 会员卡片展示
  - `TierProgress.jsx` - 等级进度条
  - `PointsBalance.jsx` - 积分余额显示
  - `BenefitsList.jsx` - 权益列表
  - `ActivityFeed.jsx` - 会员活动动态
- `@/components/dashboard/` - 可能复用的仪表盘组件

### 功能特性
- 等级系统: 多级会员等级
- 积分管理: 赚取和使用积分
- 专属优惠: 会员专属促销
- 活动追踪: 会员行为记录

## 数据模型
```typescript
// 会员权益
interface Benefit {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'free_shipping' | 'exclusive_access' | 'birthday_gift';
  value: string | number;
  icon: string;
  conditions?: string;
}

// 会员活动
interface MemberActivity {
  id: string;
  type: 'purchase' | 'review' | 'referral' | 'birthday' | 'anniversary';
  description: string;
  points_earned: number;
  created_at: string;
  metadata?: Record<string, any>;
}

// 积分历史
interface PointsTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'redeemed';
  reason: string;
  created_at: string;
  expiry_date?: string;
}

// 专属优惠
interface ExclusiveOffer {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_spend?: number;
  expiry_date: string;
  usage_limit?: number;
  usage_count: number;
}
```

## 测试与质量
- **会员权益测试**: 验证各种会员等级的权益正确应用
- **积分系统测试**: 确保积分的赚取、使用和过期逻辑正确
- **等级升级测试**: 验证会员升级流程和通知
- **优惠应用测试**: 确保专属优惠正确应用

### 关键测试场景
1. 会员注册和等级分配
2. 购物积分的累积计算
3. 会员权益的自动应用
4. 等级升级的触发和通知
5. 积分兑换功能
6. 专属优惠码的生成和使用

## 常见问题 (FAQ)

### Q: 如何处理会员等级的升级逻辑？
A: 基于消费金额、购买频率等指标计算会员等级，设置自动升级规则和升级奖励。

### Q: 积分过期策略？
A: 设置积分有效期，通过邮件或应用通知提醒用户即将过期的积分，鼓励用户及时使用。

### Q: 如何防止会员系统滥用？
A: 实施防刷机制，监控异常行为，设置合理的积分获取限制，并定期审核会员活动。

## 相关文件清单

### 页面文件
- `club/page.jsx` - 会员俱乐部主页

### 组件文件
- `components/member/MemberCard.jsx` - 会员卡片
- `components/member/TierProgress.jsx` - 等级进度
- `components/member/PointsBalance.jsx` - 积分余额
- `components/member/BenefitsList.jsx` - 权益列表
- `components/member/ActivityFeed.jsx` - 活动动态

### 数据文件
- `data/member.ts` - 会员数据逻辑
- `data/loyalty.ts` - 忠诚度系统数据

### 配置文件
- 会员等级配置文件
- 积分规则配置
- 权益定义文件

## 变更记录 (Changelog)

### 2025-12-18 10:52:29
- 创建会员模块文档
- 分析会员系统核心功能
- 识别积分和等级管理需求

### 待优化项
- [ ] 实现会员推荐系统
- [ ] 添加生日专属福利
- [ ] 集成社交媒体分享奖励
- [ ] 实现会员挑战任务
- [ ] 添加会员数据分析仪表盘
- [ ] 实现会员专属客服通道
- [ ] 添加会员社区功能
- [ ] 集成游戏化元素增强参与度