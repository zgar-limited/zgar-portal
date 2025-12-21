[根目录](../../../../CLAUDE.md) > [app](../../../) > [[locale]](../../) > [(layout)](../) > **(other-pages)**

# 其他页面模块

## 模块职责
包含电商网站的所有辅助页面，提供用户认证、购物车管理、结账流程、客户服务、公司介绍等功能。这些页面虽然不直接产生销售，但对用户转化和客户满意度至关重要。

## 入口与启动

### 用户认证页面
- `login/page.tsx` - 用户登录
- `register/page.jsx` - 用户注册
- `reset-password/page.tsx` - 密码重置
- `update-password/page.tsx` - 密码更新

### 购物流程页面
- `view-cart/page.tsx` - 购物车查看
- `checkout/page.jsx` - 结账流程
- `track-order/page.jsx` - 订单跟踪

### 信息和服务页面
- `contact-us/page.jsx` - 联系我们
- `contact-us-2/page.jsx` - 联系我们（备选版）
- `faq/page.jsx` - 常见问题
- `store-list/page.jsx` - 门店列表
- `compare/page.jsx` - 产品比较
- `invoice/page.jsx` - 发票页面
- `404/page.jsx` - 错误页面

## 对外接口
```typescript
// 认证相关接口
interface AuthFormData {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterFormData extends AuthFormData {
  first_name: string;
  last_name: string;
  phone?: string;
}

// 购物车数据
interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
}

// 结账流程数据
interface CheckoutData {
  cart: Cart;
  shipping_address: Address;
  billing_address: Address;
  payment_method: PaymentMethod;
  shipping_method: ShippingMethod;
}
```

## 关键依赖与配置

### 认证系统
- Medusajs Auth API: 用户认证和注册
- JWT Token 管理: 会话保持
- 密码重置流程: 邮件验证

### 购物车和结账
- `@/data/cart.ts`: 购物车数据管理
- `@/data/checkout.ts`: 结账流程逻辑
- Medusajs Cart API: 购物车操作
- Medusajs Payment API: 支付处理

### 页面组件
- `@/components/other-pages/`:
  - `contact/ContactForm.jsx` - 联系表单
  - `contact/ContactMap.jsx` - 联系地图
  - `about/` - 关于我们页面组件
- `@/components/auth/`:
  - `LoginForm.jsx` - 登录表单
  - `RegisterForm.jsx` - 注册表单
  - `PasswordResetForm.jsx` - 密码重置表单

### 第三方集成
- 地图服务: Google Maps 或其他地图API
- 支付网关: Stripe、PayPal 等支付集成
- 邮件服务: 密码重置和通知邮件
- 跟踪服务: 订单状态跟踪

## 数据模型
```typescript
// 用户认证
interface UserAuth {
  customer: Customer;
  access_token: string;
  refresh_token?: string;
}

// 购物车完整信息
interface FullCart extends Cart {
  items: CartItem[];
  shipping_total: number;
  tax_total: number;
  discount_total: number;
  total: number;
  region: Region;
}

// 结账步骤
enum CheckoutStep {
  ADDRESS = 'address',
  DELIVERY = 'delivery',
  PAYMENT = 'payment',
  REVIEW = 'review',
  COMPLETE = 'complete'
}

// 联系表单
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  order_id?: string;
}
```

## 测试与质量
- **认证流程测试**: 登录、注册、密码重置的完整流程
- **购物车测试**: 添加商品、修改数量、删除商品
- **结账测试**: 完整的结账流程和支付集成
- **表单验证测试**: 所有表单的客户端和服务端验证

### 关键测试场景
1. 用户注册和登录流程
2. 购物车操作的实时性
3. 结账流程的步骤验证
4. 支付集成的安全性
5. 表单提交和错误处理
6. 移动端表单体验

## 常见问题 (FAQ)

### Q: 如何处理结账流程中的错误？
A: 实现优雅的错误处理，提供清晰的错误信息，允许用户修正错误后继续结账流程。

### Q: 密码重置的安全措施？
A: 使用安全的令牌生成，设置过期时间，限制重试次数，并通过HTTPS传输。

### Q: 购物车数据持久化？
A: 使用数据库存储用户购物车，结合浏览器本地存储作为临时缓存，确保用户数据不丢失。

## 相关文件清单

### 认证页面
- `login/page.tsx` - 登录页面
- `register/page.jsx` - 注册页面
- `reset-password/page.tsx` - 密码重置
- `update-password/page.tsx` - 密码更新

### 购物流程
- `view-cart/page.tsx` - 购物车页面
- `checkout/page.jsx` - 结账页面
- `track-order/page.jsx` - 订单跟踪

### 信息页面
- `contact-us/page.jsx` - 联系我们
- `contact-us-2/page.jsx` - 备选联系页面
- `faq/page.jsx` - 常见问题
- `store-list/page.jsx` - 门店列表
- `compare/page.jsx` - 产品比较
- `404/page.jsx` - 404错误页面

### 组件文件
- `components/other-pages/contact/ContactForm.jsx` - 联系表单
- `components/other-pages/contact/ContactMap.jsx` - 联系地图
- `components/auth/` - 认证相关组件
- `components/cart/` - 购物车组件
- `components/checkout/` - 结账组件

### 数据文件
- `data/cart.ts` - 购物车数据
- `data/auth.ts` - 认证数据
- `data/checkout.ts` - 结账数据

## 变更记录 (Changelog)

### 2025-12-18 10:52:29
- 创建其他页面模块文档
- 分析认证和购物流程
- 识别13个核心辅助页面

### 待优化项
- [ ] 添加社交登录集成
- [ ] 实现多步骤结账向导
- [ ] 优化移动端结账体验
- [ ] 添加订单实时跟踪
- [ ] 实现客户支持聊天
- [ ] 添加优惠券和促销码功能