[根目录](../../../CLAUDE.md) > [app](../../) > [[locale]](../) > **(layout)**

# 主布局模块

## 模块职责
负责应用程序的核心布局结构，包括头部导航、底部信息、全局提示和移动端菜单等核心 UI 组件。该模块是所有页面的基础布局容器。

## 入口与启动
- **主入口**: `layout.tsx` - 应用的根布局组件
- **功能布局**:
  - `HomeTips`: 顶部提示栏
  - `HomeHeader`: 主导航头部
  - `HomeFooter`: 页面底部
  - `MobileMenu`: 移动端菜单
  - `ToastProvider`: 全局提示组件

## 对外接口
```typescript
// layout.tsx 接口
interface RootLayoutProps {
  children: React.ReactNode;
}

// 数据依赖
- retrieveCart(): 获取购物车信息
- retrieveCustomer(): 获取用户信息
```

## 关键依赖与配置

### 依赖组件
- `@/widgets/HomeHeader`: 主导航组件，接收 cart 和 customer 数据
- `@/widgets/HomeFooter`: 页脚组件
- `@/widgets/HomeTips`: 顶部提示栏
- `@/components/modals/MobileMenu`: 移动端菜单模态框
- `@/components/common/ToastProvider`: 全局提示系统

### 数据集成
- **购物车数据**: 从 `@/data/cart` 的 `retrieveCart()` 获取
- **用户数据**: 从 `@/data/customer` 的 `retrieveCustomer()` 获取
- **Medusajs 集成**: 通过数据层访问后端电商 API

## 数据模型
```typescript
// 购物车数据结构（来自 Medusajs）
interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  currency_code: string;
  // ...其他购物车属性
}

// 用户数据结构（来自 Medusajs）
interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  // ...其他用户属性
}
```

## 测试与质量
- **布局测试**: 确保响应式设计在不同设备上正常工作
- **数据流测试**: 验证购物车和用户数据的正确传递
- **组件集成测试**: 确保子组件正确渲染和交互

### 测试要点
1. 布局在不同屏幕尺寸下的响应性
2. 购物车数据更新时的 UI 同步
3. 用户登录/退出时的状态管理
4. 移动端菜单的打开/关闭功能

## 常见问题 (FAQ)

### Q: 如何在布局中添加新的全局组件？
A: 在 `layout.tsx` 的 JSX 结构中添加新组件，确保位置正确（如头部、底部或主要内容区域）。

### Q: 购物车数据如何实时更新？
A: 购物车数据通过 `retrieveCart()` 获取，更新时需要重新调用该函数并触发重新渲染。

### Q: 如何处理用户认证状态？
A: 用户认证通过 `retrieveCustomer()` 管理，登录状态会影响导航栏显示的内容。

## 相关文件清单

### 布局文件
- `app/[locale]/(layout)/layout.tsx` - 主布局组件
- `app/[locale]/layout.tsx` - 根布局（国际化配置）

### Widget 组件
- `widgets/HomeHeader/index.tsx` - 主导航
- `widgets/HomeFooter/index.tsx` - 页脚
- `widgets/HomeTips/index.tsx` - 顶部提示

### 数据层
- `data/cart.ts` - 购物车数据管理
- `data/customer.ts` - 用户数据管理

### 样式文件
- `public/scss/main.scss` - 全局样式
- `public/css/harmonyos_sans.css` - 字体样式

## 变更记录 (Changelog)

### 2025-12-18 10:52:29
- 创建主布局模块文档
- 分析布局结构和数据流
- 识别核心依赖和接口

### 待优化项
- [ ] 考虑添加全局错误边界
- [ ] 优化移动端体验
- [ ] 添加加载状态管理