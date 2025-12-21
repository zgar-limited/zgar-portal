[根目录](../../../../CLAUDE.md) > [app](../../../) > [[locale]](../../) > [(layout)](../) > **(store)**

# 商店模块

## 模块职责
负责电商平台的核心销售功能，包括商店主页、产品列表、产品搜索、分类浏览和产品详情页。该模块是与用户购买转化最直接相关的功能区域。

## 入口与启动
- **商店主页**: `shop/page.tsx` - 产品展示和分类导航
- **产品详情**: `products/[slug]/page.tsx` - 单个产品的详细信息页

## 对外接口
```typescript
// 产品数据接口
interface ProductPageProps {
  params: Promise<{
    locale: string;
    slug?: string;
  }>;
  searchParams: Promise<{
    category?: string;
    page?: string;
    sort?: string;
    price_range?: string;
  }>;
}

// 商店主页数据流
- fetchProducts(): 获取产品列表
- fetchCategories(): 获取产品分类
- productFilterOptions: 筛选选项配置
```

## 关键依赖与配置

### 数据层集成
- `@/data/products.ts`: 产品数据获取（Medusajs SDK）
- `@/data/categories.js`: 产品分类数据
- `@/data/productFilterOptions.js`: 产品筛选配置
- `@/data/brands.js`: 品牌信息
- `@/data/collections.js`: 产品集合

### 核心组件依赖
- `@/components/products/`: 产品相关组件
  - `ProductCard.jsx`: 产品卡片
  - `Sorting.jsx`: 排序组件
  - `Categories.jsx`: 分类导航
  - `Pagination.jsx`: 分页组件
- `@/components/products/LayoutHandler.jsx`: 布局处理器
- `@/widgets/ShopWidget`: 商店侧边栏组件

### 状态管理
- **React Query**: 用于缓存和同步产品数据
- **URL 参数**: 管理筛选、排序和分页状态

## 数据模型
```typescript
// 产品数据结构（Medusajs）
interface Product {
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
  // ...其他产品属性
}

// 产品变体
interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  prices: Price[];
  inventory_quantity: number;
  options: Record<string, string>;
}

// 筛选参数
interface ProductFilters {
  category_id?: string[];
  collection_id?: string[];
  brand_id?: string[];
  price_range?: {
    min: number;
    max: number;
  };
  tags?: string[];
}
```

## 测试与质量
- **产品展示测试**: 验证产品列表正确渲染
- **筛选功能测试**: 确保分类、价格、品牌筛选正常工作
- **分页测试**: 验证大数据集的分页加载
- **性能测试**: 确保产品列表的加载速度

### 关键测试场景
1. 产品搜索和筛选功能
2. 不同分类的产品展示
3. 价格筛选和排序功能
4. 产品图片懒加载
5. 响应式设计验证

## 常见问题 (FAQ)

### Q: 如何添加新的产品筛选条件？
A: 在 `data/productFilterOptions.js` 中添加新的筛选选项，并在 `products.ts` 的 `fetchProducts` 函数中处理相应的查询参数。

### Q: 产品图片加载优化策略？
A: 使用 Next.js 的 Image 组件，配置适当的图片尺寸和格式优化，实现懒加载。

### Q: 如何处理大型产品目录的性能？
A: 使用 React Query 缓存、虚拟滚动、分页加载和图片懒加载等技术优化性能。

## 相关文件清单

### 页面文件
- `shop/page.tsx` - 商店主页
- `products/[slug]/page.tsx` - 产品详情页

### 数据文件
- `data/products.ts` - 产品数据获取逻辑
- `data/categories.js` - 分类数据
- `data/productFilterOptions.js` - 筛选配置
- `data/brands.js` - 品牌数据
- `data/collections.js` - 产品集合

### 组件文件
- `components/products/ProductCard.jsx` - 产品卡片
- `components/products/Sorting.jsx` - 排序组件
- `components/products/Categories.jsx` - 分类导航
- `components/products/Pagination.jsx` - 分页组件
- `components/products/LayoutHandler.jsx` - 布局切换

### Widget 文件
- `widgets/ShopWidget/` - 商店侧边栏组件

## 变更记录 (Changelog)

### 2025-12-18 10:52:29
- 创建商店模块文档
- 分析产品数据流和组件结构
- 识别核心筛选和分页功能

### 待优化项
- [ ] 添加产品比较功能
- [ ] 实现产品推荐算法
- [ ] 优化移动端购物体验
- [ ] 添加产品视频支持
- [ ] 实现产品评论和评分系统