# 产品详情模块文档 (US-012)

## 概述

产品详情模块提供27种不同的产品展示布局变体，满足各种电商场景需求。所有产品详情页都通过 Next.js 动态路由实现，支持多语言。

## 模块结构

```
app/[locale]/(layout)/(product-detail)/
├── product-available/[id]/page.jsx
├── product-bottom-thumbnail/[id]/page.jsx
├── product-buy-the-look/[id]/page.jsx
├── product-buyx-gety/[id]/page.jsx
├── product-countdown-timer/[id]/page.jsx
├── product-description-accordion/[id]/page.jsx
├── product-description-list/[id]/page.jsx
├── product-description-vertical/[id]/page.jsx
├── product-frequently-bought-together/[id]/page.jsx
├── product-grid/[id]/page.jsx
├── product-grid-2/[id]/page.jsx
├── product-group/[id]/page.jsx
├── product-information/[id]/page.jsx
├── product-left-thumbnail/[id]/page.jsx
├── product-often-purchased-together/[id]/page.jsx
├── product-options-customizer/[id]/page.jsx
├── product-out-of-stock/[id]/page.jsx
├── product-right-thumbnail/[id]/page.jsx
├── product-stacked/[id]/page.jsx
├── product-swatch-dropdown/[id]/page.jsx
├── product-swatch-dropdown-color/[id]/page.jsx
├── product-swatch-image/[id]/page.jsx
├── product-swatch-image-square/[id]/page.jsx
├── product-video/[id]/page.jsx
├── product-volume-discount/[id]/page.jsx
└── product-volume-discount-thumbnail/[id]/page.jsx
```

## 27种产品详情布局

### 1. product-available
- **用途**: 有货产品展示
- **特点**: 显示库存状态、可用性提示

### 2. product-bottom-thumbnail
- **用途**: 底部缩略图布局
- **特点**: 产品图片缩略图在底部

### 3. product-buy-the-look
- **用途**: 搭配购买场景
- **特点**: 展示完整造型推荐搭配产品

### 4. product-buyx-gety
- **用途**: 买X送Y促销
- **特点**: 促销活动特殊布局

### 5. product-countdown-timer
- **用途**: 限时促销
- **特点**: 倒计时计时器，紧迫感营销

### 6. product-description-accordion
- **用途**: 折叠式详情
- **特点**: 手风琴折叠展开描述

### 7. product-description-list
- **用途**: 列表式详情
- **特点**: 清晰的列表展示产品信息

### 8. product-description-vertical
- **用途**: 垂直描述布局
- **特点**: 垂直排列描述信息

### 9. product-frequently-bought-together
- **用途**: 推荐组合购买
- **特点**: "经常一起购买"推荐区块

### 10. product-grid
- **用途**: 网格布局
- **特点**: 标准网格产品展示

### 11. product-grid-2
- **用途**: 双列网格
- **特点**: 两列特殊网格布局

### 12. product-group
- **用途**: 产品分组
- **特点**: 相关产品组合展示

### 13. product-information
- **用途**: 详细信息页
- **特点**: 完整产品信息展示

### 14. product-left-thumbnail
- **用途**: 左侧缩略图
- **特点**: 缩略图在左侧的布局

### 15. product-often-purchased-together
- **用途**: 关联购买推荐
- **特点**: 基于购买行为的推荐

### 16. product-options-customizer
- **用途**: 产品定制选项
- **特点**: 支持产品定制功能

### 17. product-out-of-stock
- **用途**: 缺货产品
- **特点**: 到货通知、缺货状态展示

### 18. product-right-thumbnail
- **用途**: 右侧缩略图
- **特点**: 缩略图在右侧的布局

### 19. product-stacked
- **用途**: 堆叠布局
- **特点**: 图片垂直堆叠展示

### 20. product-swatch-dropdown
- **用途**: 下拉色卡选择
- **特点**: 颜色/规格下拉选择器

### 21. product-swatch-dropdown-color
- **用途**: 颜色下拉选择
- **特点**: 专门用于颜色选择的下拉

### 22. product-swatch-image
- **用途**: 图片色卡
- **特点**: 用图片表示颜色/规格选项

### 23. product-swatch-image-square
- **用途**: 方形图片色卡
- **特点**: 方形图片色卡选择器

### 24. product-video
- **用途**: 视频展示
- **特点**: 产品视频演示

### 25. product-volume-discount
- **用途**: 批量折扣
- **特点**: 阶梯价格/批量优惠

### 26. product-volume-discount-thumbnail
- **用途**: 带缩略图的批量折扣
- **特点**: 批量折扣 + 缩略图导航

## 数据获取

### Server Component 方式

```tsx
// app/[locale]/(layout)/(product-detail)/product-video/[id]/page.jsx
import { fetchProduct } from '@/data/products';

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);

  return <ProductDetail product={product} />;
}
```

### API 端点

产品详情数据通过 `data/products` 模块获取：

```typescript
import { fetchProduct } from '@/data/products';

// 获取单个产品
const product = await fetchProduct(product_id);
```

## 核心组件

产品详情页使用以下共享组件：

- `ProductMain` - 主产品展示
- `CustomerPhotos` - 客户晒图
- `ProductSpecifications1` - 产品规格
- `Details1` - 详细描述
- `Features` - 产品特性
- `RelatedProducts` - 相关产品
- `SimilerProducts` - 相似产品
- `StickyProduct` - 粘性产品栏

## 路由模式

所有产品详情页都使用 `[id]` 动态路由段：

```
/[locale]/product-{variant}/[id]
```

示例：
- `/zh/product-video/prod_01J3R2K`
- `/en/product-grid/prod_01J3R2K`

## 多语言支持

产品详情页完全支持多语言：
- 中文简体 (`zh`)
- 中文繁体 (`zh-Hant`)
- 英文 (`en`)

## 相关文档

- [数据模块 API 文档](../../data-layer/data-modules.md)
- [Medusajs 集成文档](../../data-layer/medusa-integration.md)
- [设计系统 - 色彩](../../design-system/colors.md)
