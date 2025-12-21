[根目录](../../../../CLAUDE.md) > [app](../../../) > [[locale]](../../) > [(layout)](../) > **(product-detail)**

# 产品详情模块

## 模块职责
提供多种产品详情页布局方案，支持不同的产品展示需求，包括图片展示、规格选择、库存管理、购买操作等核心电商功能。该模块直接影响用户购买决策和转化率。

## 入口与启动
该模块包含 24 种不同的产品详情页布局，支持各种产品展示场景：

### 核心布局类型
- **基础布局**: `product-left-thumbnail`, `product-right-thumbnail`, `product-bottom-thumbnail`
- **高级布局**: `product-video`, `product-stacked`, `product-grid`
- **营销布局**: `product-countdown-timer`, `product-volume-discount`, `product-buyx-gety`
- **交互布局**: `product-options-customizer`, `product-swatch-*` 系列

## 对外接口
```typescript
// 产品详情页参数
interface ProductDetailProps {
  params: Promise<{
    locale: string;
    id: string; // 产品ID
  }>;
}

// 产品数据接口
interface ProductDetailData {
  product: Product;
  relatedProducts: Product[];
  similarProducts: Product[];
  variants: ProductVariant[];
  inventory: InventoryInfo;
}
```

## 关键依赖与配置

### 数据层集成
- `@/data/products.ts`: 产品详细数据获取
- `@/data/singleProductSlides.js`: 产品幻灯片配置
- Medusajs Product API: 产品信息和库存查询

### 核心组件依赖
- `@/components/product-details/`:
  - `ProductMain.tsx`: 产品主展示区
  - `AvailableProgress.jsx`: 库存进度显示
  - `ProductSkuCategories.jsx`: SKU分类
  - `DeliveryPolicy.jsx`: 配送政策
  - `PaymentMethods.jsx`: 支付方式
  - `ColorSelector.jsx`: 颜色选择器
  - `SizeSelector.jsx`: 尺寸选择器
- `@/components/productActionButtons/`:
  - `CartButton*.jsx`: 购物车按钮系列
  - `WishlistButton*.jsx`: 收藏按钮
  - `CompareButton.jsx`: 比较按钮
  - `QuickViewButton.jsx`: 快速查看

### UI/UX 组件
- `@/components/breathing-image/`: 呼吸灯效果图片
- `@/components/react-compare-slider/`: 产品对比滑块
- `@/components/react-photo-view/`: 图片查看器
- GSAP 动画: 页面滚动和交互动画

## 数据模型
```typescript
// 产品详情扩展
interface ProductDetail extends Product {
  description: string;
  material: string;
  care_instructions: string;
  shipping_info: string;
  return_policy: string;
  warranty: string;
  specifications: Record<string, any>;
  videos?: ProductVideo[];
  countdown?: CountdownTimer;
  volume_discount?: VolumeDiscount[];
}

// 库存信息
interface InventoryInfo {
  quantity: number;
  track_quantity: boolean;
  allow_backorder: boolean;
  location?: string;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_backorder';
}

// 产品变体配置
interface VariantOption {
  id: string;
  title: string;
  values: VariantValue[];
}

interface VariantValue {
  value: string;
  label: string;
  color?: string;
  image?: string;
  price_adjustment?: number;
}
```

## 测试与质量
- **布局兼容性测试**: 确保不同布局在各种设备上正常显示
- **交互功能测试**: 验证产品选择、添加购物车、收藏等功能
- **性能测试**: 优化产品图片加载和动画性能
- **转化率测试**: A/B测试不同布局的转化效果

### 关键测试场景
1. 产品变体选择和价格更新
2. 库存状态显示和缺货处理
3. 图片切换和放大功能
4. 购物车添加功能
5. 移动端的产品浏览体验

## 常见问题 (FAQ)

### Q: 如何选择合适的产品详情页布局？
A: 根据产品类型和目标受众选择。服装类适合图片丰富的布局，电子产品适合规格详细的布局，促销产品适合倒计时等营销布局。

### Q: 产品变体价格如何动态更新？
A: 通过监听变体选择变化，实时计算并更新显示价格，包括任何价格调整或折扣。

### Q: 如何优化产品图片加载速度？
A: 使用 Next.js Image 组件，实现懒加载，提供多种尺寸的图片，并使用 WebP 等现代图片格式。

## 相关文件清单

### 页面文件（24种布局）
- `product-left-thumbnail/[id]/page.jsx`
- `product-right-thumbnail/[id]/page.jsx`
- `product-bottom-thumbnail/[id]/page.jsx`
- `product-video/[id]/page.jsx`
- `product-stacked/[id]/page.jsx`
- `product-grid/[id]/page.jsx`
- `product-countdown-timer/[id]/page.jsx`
- `product-volume-discount/[id]/page.jsx`
- `product-buyx-gety/[id]/page.jsx`
- 以及其他14种布局...

### 核心组件
- `components/product-details/ProductMain.tsx` - 主展示组件
- `components/product-details/ColorSelector.jsx` - 颜色选择
- `components/product-details/SizeSelector.jsx` - 尺寸选择
- `components/product-details/AvailableProgress.jsx` - 库存显示
- `components/productActionButtons/` - 操作按钮组

### 数据文件
- `data/singleProductSlides.js` - 幻灯片配置
- `data/products.ts` - 产品数据逻辑

### 样式文件
- `components/product-details/*.scss` - 组件样式
- 全局样式中的产品相关CSS

## 变更记录 (Changelog)

### 2025-12-18 10:52:29
- 创建产品详情模块文档
- 分析24种产品布局方案
- 识别核心交互组件和数据流

### 待优化项
- [ ] 添加产品3D/AR预览功能
- [ ] 实现产品定制化配置器
- [ ] 优化移动端产品图片体验
- [ ] 添加产品实时库存预警
- [ ] 实现产品问答和评论集成
- [ ] 添加社交分享功能增强