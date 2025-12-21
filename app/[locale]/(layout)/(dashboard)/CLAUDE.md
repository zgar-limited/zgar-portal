[根目录](../../../../CLAUDE.md) > [app](../../../) > [[locale]](../../) > [(layout)](../) > **(dashboard)**

# 用户仪表盘模块

## 模块职责
为注册用户提供个人中心功能，包括账户信息管理、订单查看、地址管理、设置配置等。该模块是用户完成购买后进行售后管理和个人信息维护的核心区域。

## 入口与启动
- **布局文件**: `layout.tsx` - 仪表盘的子布局
- **功能页面**:
  - `account-page/page.tsx` - 账户概览
  - `account-orders/page.tsx` - 订单列表
  - `account-orders-detail/[id]/page.tsx` - 订单详情
  - `account-addresses/page.tsx` - 地址管理
  - `account-setting/page.jsx` - 账户设置

## 对外接口
```typescript
// 仪表盘布局接口
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// 订单相关数据
interface OrderData {
  id: string;
  status: string;
  total: number;
  items: OrderItem[];
  created_at: string;
}

// 地址管理数据
interface Address {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  country_code: string;
  phone?: string;
}
```

## 关键依赖与配置

### 数据层集成
- `@/data/customer.ts`: 客户数据管理
- `@/data/orders.ts`: 订单数据获取
- Medusajs Customer API: 客户信息 CRUD
- Medusajs Order API: 订单查询和管理

### 核心组件依赖
- `@/components/dashboard/`:
  - `SidebarToggler.jsx`: 侧边栏切换
  - `DashboardSidebar.jsx`: 导航侧边栏
  - `AccountInfo.jsx`: 账户信息显示
  - `OrderHistory.jsx`: 订单历史
  - `AddressManager.jsx`: 地址管理组件

### 认证与授权
- 基于 Next.js 的服务端认证
- JWT Token 管理
- 路由保护中间件

## 数据模型
```typescript
// 客户信息扩展
interface CustomerProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  metadata: Record<string, any>;
}

// 订单详情
interface OrderDetail extends OrderData {
  shipping_address: Address;
  billing_address: Address;
  fulfillment_status: string;
  payment_status: string;
  fulfillments: Fulfillment[];
  returns: Return[];
}

// 账户设置
interface AccountSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  newsletter_subscription: boolean;
  privacy_settings: {
    profile_visibility: 'public' | 'private';
    show_order_history: boolean;
  };
}
```

## 测试与质量
- **认证测试**: 验证用户登录状态和权限控制
- **订单管理测试**: 确保订单查询、筛选功能正常
- **地址管理测试**: 验证地址的增删改查功能
- **隐私安全测试**: 确保敏感数据的安全处理

### 关键测试场景
1. 用户认证和会话管理
2. 订单状态跟踪和历史查询
3. 地址表单验证和保存
4. 账户信息更新功能
5. 响应式仪表盘布局

## 常见问题 (FAQ)

### Q: 如何处理订单状态的实时更新？
A: 使用 WebSocket 或定期轮询机制更新订单状态，确保用户能看到最新的订单信息。

### Q: 地址管理的验证规则？
A: 需要验证必填字段、电话号码格式、邮政编码格式等，使用客户端和服务端双重验证。

### Q: 如何保护用户隐私数据？
A: 实施适当的加密措施，限制敏感信息的显示，使用安全的 API 调用，并遵循 GDPR 等隐私法规。

## 相关文件清单

### 布局和页面
- `layout.tsx` - 仪表盘子布局
- `account-page/page.tsx` - 账户概览
- `account-orders/page.tsx` - 订单列表
- `account-orders-detail/[id]/page.tsx` - 订单详情
- `account-addresses/page.tsx` - 地址管理
- `account-setting/page.jsx` - 账户设置

### 组件文件
- `components/dashboard/SidebarToggler.jsx` - 侧边栏控制
- `components/dashboard/DashboardSidebar.jsx` - 导航菜单
- `components/dashboard/AccountInfo.jsx` - 账户信息
- `components/dashboard/OrderHistory.jsx` - 订单历史
- `components/dashboard/AddressManager.jsx` - 地址管理

### 数据文件
- `data/customer.ts` - 客户数据
- `data/orders.ts` - 订单数据

### 工具文件
- `utils/auth.ts` - 认证工具
- `utils/validation.ts` - 表单验证

## 变更记录 (Changelog)

### 2025-12-18 10:52:29
- 创建用户仪表盘模块文档
- 分析账户管理和订单功能
- 识别认证和隐私保护需求

### 待优化项
- [ ] 添加订单跟踪集成
- [ ] 实现客户支持聊天功能
- [ ] 添加订单评价和反馈系统
- [ ] 优化移动端仪表盘体验
- [ ] 实现账户安全双因素认证