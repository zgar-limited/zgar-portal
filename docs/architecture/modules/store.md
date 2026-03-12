# 商店模块 (Store Module)

> 基于 `app/[locale]/(layout)/(store)/CLAUDE.md` 扩展的完整架构文档

## 模块概述

商店模块是 Zgar Portal 的核心销售功能区，负责产品展示、浏览、筛选和购买转化。该模块集成了 Medusajs 后端系统，提供完整的电商购物体验。

### 核心职责

- **产品展示**: 商店主页和产品列表页面
- **产品详情**: 单个产品的详细信息展示
- **分类导航**: 产品分类浏览和筛选
- **搜索与筛选**: 按价格、品牌、分类等多维度筛选产品
- **分页加载**: 大型产品目录的分页展示

## 路由结构

### 页面路由表

| 路由 | 文件路径 | 功能描述 | 服务端组件 |
|------|---------|---------|-----------|
| `/shop` | `app/[locale]/(layout)/(store)/shop/page.tsx` | 商店主页，展示所有产品 | 是 |
| `/products/[id]` | `app/[locale]/(layout)/(store)/products/[id]/page.tsx` | 产品详情页 | 是 |

### 路由参数说明

#### shop/page.tsx
```typescript
interface ShopPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
```

**支持的查询参数**:
- `page`: 页码（用于分页）
- `category`: 分类筛选
- `sort`: 排序方式
- `price_range`: 价格区间筛选

#### products/[id]/page.tsx
```typescript
interface ProductDetailPageProps {
  params: {
    locale: string;
    id: string;  // 产品ID
  };
}
```

## 数据获取层

### 产品数据获取函数

#### fetchProducts

获取产品列表，支持分页、筛选和排序。

**文件位置**: `data/products/server.ts`

```typescript
export const fetchProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;
  countryCode?: string;
  regionId?: string;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;
}>
```

**功能特点**:
- 使用 Medusajs 自定义端点 `/store/zgar/products`
- 支持可见性过滤（仅显示可见产品）
- 自动处理分页逻辑（limit/offset）
- 返回产品列表和总数

**查询参数构建**:
```typescript
const queryString = buildQueryString({
  limit,           // 每页数量（默认20）
  offset,          // 偏移量（pageParam - 1） * limit
  fields: "*variants.calculated_price,*variants.prices,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,*thumbnail,*images",
  ...queryParams,  // 额外的筛选参数
});
```

#### fetchProduct

获取单个产品的详细信息。

**文件位置**: `data/products/server.ts`

```typescript
export const fetchProduct = async (id: string): Promise<HttpTypes.StoreProduct>
```

**功能特点**:
- 优先使用自定义端点 `/store/zgar/products/${id}`
- 端点不可用时降级到原生 Medusajs 端点
- 包含完整的产品变体、价格、库存信息
- 支持元数据（metadata）和标签（tags）

### 类型定义

**文件位置**: `data/products/types.ts`

```typescript
// 重新导出 Medusajs 类型
export type StoreProduct = HttpTypes.StoreProduct;
export type StoreProductResponse = HttpTypes.StoreProductResponse;
export type StoreProductListParams = HttpTypes.StoreProductListParams;
```

**产品数据结构** (来自 Medusajs):
```typescript
interface StoreProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail?: string;
  images: string[];
  variants: ProductVariant[];
  categories: Category[];
  tags: Tag[];
  status: 'published' | 'draft';
  metadata?: Record<string, any>;
}

interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  prices: Price[];
  inventory_quantity: number;
  calculated_price?: {
    currency_code: string;
    amount: number;
  };
  options: Record<string, string>;
}
```

## 组件架构

### 核心组件

#### ProductGrid

产品网格组件，负责产品列表的展示和排序。

**文件位置**: `components/products/ProductGrid.tsx`

```typescript
interface ProductGridProps {
  initialProducts: StoreProduct[];
}
```

**功能特点**:
- 客户端排序（价格升序/降序）
- 响应式网格布局（1-4列）
- 空状态展示（无产品时）
- 北欧简约风格设计
- 流畅的动画效果

**排序选项**:
- `default`: 默认排序
- `price-asc`: 价格升序
- `price-desc`: 价格降序

#### CategoryTabs

分类标签栏组件，提供顶部分类导航。

**文件位置**: `components/products/CategoryTabs.tsx`

```typescript
interface CategoryTabsProps {
  onCategoryChange?: (category: string) => void;
}
```

**分类配置**:
- `all`: 全部产品
- `CLOSE-SYSTEM`: 封闭系统
- `OPEN-SYSTEM`: 开放系统
- `DISPOSABLE`: 一次性产品
- `Z-LIQ`: 烟油产品

#### Sorting

排序下拉组件。

**文件位置**: `components/products/Sorting.jsx`

**排序选项**:
- Sort by (Default)
- Title Ascending
- Title Descending
- Price Ascending
- Price Descending

#### FilterSidebar

侧边栏筛选组件，提供多维度的产品筛选。

**文件位置**: `components/products/FilterSidebar.jsx`

**筛选维度**:
- **Category**: 分类筛选
- **Availability**: 库存状态筛选
- **Price**: 价格区间筛选（使用 Slider 滑块）
- **Brand**: 品牌筛选（可选）
- **Size**: 尺寸筛选（可选，已注释）
- **Color**: 颜色筛选（可选，已注释）

**状态管理**: 使用 Reducer 模式管理筛选状态
```typescript
import {
  setCategories,
  setPrice,
  setSize,
  setColor,
  setAvailability,
  clearFilter,
  setBrands,
} from "@/reducer/filterActions";
```

#### Pagination

分页组件。

**文件位置**: `components/products/Pagination.jsx`

```typescript
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onPageChange?: (page: number) => void;
}
```

**功能特点**:
- 上一页/下一页按钮
- 页码数字显示
- 当前页高亮
- 边界禁用处理

#### Categories

分类展示组件（Swiper 轮播）。

**文件位置**: `components/products/Categories.jsx`

**数据源**: `@/data/categories` 的 `categories11` 数组

**功能特点**:
- Swiper 轮播展示
- 响应式布局（2-4列）
- 图片 + 渐变遮罩
- 悬停放大效果

#### ProductCard

产品卡片组件。

**文件位置**: `components/products/ProductCard.tsx`

**功能特点**:
- 产品图片展示
- 价格信息显示
- 悬停效果
- 快速查看/添加到购物车

## 筛选与排序实现

### 筛选流程

```
用户操作 → FilterSidebar 组件
    ↓
dispatch action (setCategories, setPrice, etc.)
    ↓
更新筛选状态 (state)
    ↓
触发产品重新获取
    ↓
ProductGrid 渲染筛选后的产品
```

### 筛选状态管理

**状态结构** (从 FilterSidebar 推断):
```typescript
interface FilterState {
  categories: string[];      // 选中的分类
  price: [number, number];   // 价格区间
  size: string;              // 选中的尺寸
  color: string;             // 选中的颜色
  availability: string;      // 库存状态
  brands: string[];          // 选中的品牌
  sortingOption: string;     // 排序选项
}
```

### 筛选数据源

**产品筛选选项**: `@/data/productFilterOptions.js`

```typescript
import {
  categories,
  sizes,
  colors,
  availabilityOptions,
  brands,
} from "@/data/productFilterOptions";
```

**分类数据**: `@/data/categories.js`

```typescript
import { categories11 } from "@/data/categories";
```

**品牌数据**: `@/data/brands.js`

```typescript
import { brands } from "@/data/brands";
```

### 排序实现

#### 服务端排序

通过 `fetchProducts` 的 `queryParams` 传递排序参数：

```typescript
await fetchProducts({
  queryParams: {
    order: "created_at",  // 排序字段
    direction: "desc",    // 排序方向
  },
});
```

#### 客户端排序

在 ProductGrid 组件中使用 `useMemo` 实现：

```typescript
const displayedProducts = useMemo(() => {
  let sorted = [...initialProducts];
  if (sortOption === "price-asc") {
    sorted.sort((a, b) =>
      (a.variants?.[0]?.prices?.[0]?.amount || 0) -
      (b.variants?.[0]?.prices?.[0]?.amount || 0)
    );
  } else if (sortOption === "price-desc") {
    sorted.sort((a, b) =>
      (b.variants?.[0]?.prices?.[0]?.amount || 0) -
      (a.variants?.[0]?.prices?.[0]?.amount || 0)
    );
  }
  return sorted;
}, [initialProducts, sortOption]);
```

## 数据流图

```
┌─────────────────────────────────────────────────────────────┐
│                         浏览器                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐│
│  │ shop/page.tsx│────▶│ProductGrid   │────▶│ ProductCard  ││
│  │              │     │              │     │              ││
│  │ fetchProducts│     │ 客户端排序    │     │ 产品展示      ││
│  └──────────────┘     └──────────────┘     └──────────────┘│
│         │                                          │        │
│         ▼                                          ▼        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            FilterSidebar + CategoryTabs              │  │
│  │            (筛选、分类、排序控制)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 服务端                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           data/products/server.ts                     │  │
│  │                                                        │  │
│  │  fetchProducts() ──────▶ /store/zgar/products         │  │
│  │  fetchProduct()  ──────▶ /store/zgar/products/:id     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Medusajs 后端                             │
├─────────────────────────────────────────────────────────────┤
│  /store/zgar/products  (自定义端点，支持可见性过滤)           │
│  /store/zgar/products/:id                                  │
└─────────────────────────────────────────────────────────────┘
```

## 依赖关系

### 外部依赖

```typescript
// Medusajs SDK
import { HttpTypes, StoreProduct } from "@medusajs/types";

// Next.js 国际化
import { getLocale } from "next-intl/server";

// 工具函数
import { getAuthHeaders } from "@/utils/cookies";
import { getMedusaHeaders, serverFetch } from "@/utils/medusa-server";
```

### 内部依赖

```
app/[locale]/(layout)/(store)/
├── shop/page.tsx
│   ├── data/products (fetchProducts)
│   ├── components/products/ProductGrid
│   ├── components/products/CategoryTabs
│   └── widgets/ShopPageBanner
│
└── products/[id]/page.tsx
    ├── data/products (fetchProduct)
    └── components/product-details/ProductMain
```

## 样式设计

### 设计系统

商店模块使用项目统一的设计系统：

**品牌色彩**:
- 粉色: `#f496d3` (brand-pink)
- 蓝色: `#0047c7` (brand-blue)
- 渐变: `linear-gradient(90deg, #f496d3 0%, #0047c7 100%)`

**设计风格**:
- 北欧简约风格
- Vibrant Blocks 配色（大胆色块）
- 大圆角: `rounded-2xl` / `rounded-3xl`
- 柔和阴影: `shadow-lg` / `shadow-xl`
- 克制动效

### 组件样式示例

**分类标签**:
```jsx
<div className="bg-gradient-to-r from-brand-pink to-brand-blue text-white px-5 py-2.5 rounded-xl font-semibold">
  {item.label}
</div>
```

**产品卡片**:
```jsx
<div className="relative overflow-hidden rounded-2xl transition-all duration-300 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg">
```

**排序选择器**:
```jsx
<select className="appearance-none pl-4 pr-10 py-3 bg-black text-white text-xs md:text-sm font-bold">
```

## 测试要点

### 单元测试

- `fetchProducts`: 验证分页逻辑和查询参数构建
- `fetchProduct`: 验证降级逻辑
- ProductGrid 排序逻辑
- FilterSidebar 状态管理

### 集成测试

- 产品列表页面渲染
- 产品详情页面加载
- 筛选功能交互
- 分页导航
- URL 参数同步

### E2E 测试场景

1. 浏览产品列表
2. 按分类筛选产品
3. 按价格区间筛选
4. 使用排序功能
5. 分页浏览
6. 点击产品进入详情页
7. 产品详情页信息展示

## 性能优化

### 已实现优化

1. **服务端组件**: shop/page.tsx 和 products/[id]/page.tsx 使用服务端渲染
2. **分页加载**: 限制每页产品数量（默认20）
3. **按需字段**: 只请求必要的字段（fields 参数）
4. **图片优化**: 使用 Next.js Image 组件
5. **RSC 数据获取**: Server Component 获取数据，Client Component 展示

### 可优化项

- [ ] 实现产品列表的虚拟滚动
- [ ] 添加图片懒加载
- [ ] 优化数据预加载策略
- [ ] 添加产品预加载
- [ ] 优化筛选器性能（防抖）

## 常见问题 (FAQ)

### Q: 如何添加新的筛选条件？

A: 在 `data/productFilterOptions.js` 中添加新的选项配置，然后在 `FilterSidebar.jsx` 中添加对应的 UI 组件和状态处理。

### Q: 如何修改产品列表的默认排序？

A: 修改 `ProductGrid.tsx` 中的 `sortOption` 初始值，或在 `fetchProducts` 调用时传递默认的 `order` 参数。

### Q: 产品图片加载慢怎么办？

A: 使用 Next.js Image 组件的 `priority` 属性优化首屏图片，配置合适的 `sizes` 和 `quality` 参数。

### Q: 如何处理大型产品目录？

A: 使用分页（已实现）、虚拟滚动（待实现）、服务端筛选和索引优化。

## 变更记录

### 2026-03-05
- 基于 `app/[locale]/(layout)/(store)/CLAUDE.md` 创建完整模块文档
- 添加路由结构、数据获取、组件架构详细说明
- 补充筛选排序实现和数据流图
- 添加测试要点和性能优化建议

### 2025-12-18
- 创建商店模块基础文档
- 分析产品数据流和组件结构

## 相关文档

- [主布局模块](./layout.md)
- [产品详情模块](./product-detail.md)
- [数据层 API](../data-layer/data-modules.md)
- [Medusajs 集成](../data-layer/medusa-integration.md)
