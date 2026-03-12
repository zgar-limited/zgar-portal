# 商品列表获取流程

## 概述
商品列表获取流程是 Zgar Portal 电商系统的核心功能，负责从 Medusajs 后端获取产品数据并在前端展示。该流程支持分页、筛选、排序等功能，采用服务端渲染（SSR）模式，确保首屏加载性能和 SEO 优化。

## 数据流向图

```mermaid
flowchart TD
    A[用户访问商店页 /shop] --> B[shop/page.tsx 服务端组件]
    B --> C[调用 fetchProducts]
    C --> D[buildQueryString 构建查询参数]
    D --> E[serverFetch 发送请求]
    E --> F[/store/zgar/products API 端点]
    F --> G[Medusajs 后端处理]
    G --> H[返回产品列表和总数]
    H --> I[ShopPageContent 接收数据]
    I --> J[ProductGrid 渲染产品卡片]
    J --> K[用户浏览/筛选/排序]

    C -.可选.-> L[传递 queryParams 筛选参数]
    L --> D

    C -.分页.-> M[pageParam 分页参数]
    M --> D

    K --> N[CategoryTabs 分类筛选]
    N --> O[更新 URL 参数]
    O --> P[重新触发页面渲染]
```

## 涉及文件

| 文件路径 | 职责 | 关键函数/组件 |
|---------|------|--------------|
| `data/products/server.ts` | 产品数据获取层，封装 Medusajs API 调用 | `fetchProducts()`, `fetchProduct()`, `buildQueryString()` |
| `app/[locale]/(layout)/(store)/shop/page.tsx` | 商店主页服务端组件，负责数据获取和页面渲染 | `Page()` 组件 |
| `app/[locale]/(layout)/(store)/ShopPageContent.tsx` | 商店页面内容容器组件 | `ShopPageContent` 组件 |
| `components/products/ProductGrid.tsx` | 产品网格展示组件，支持排序和空状态 | `ProductGrid` 组件 |
| `components/products/ProductCard.tsx` | 单个产品卡片展示组件 | `ProductCard` 组件 |
| `components/products/CategoryTabs.tsx` | 分类标签导航组件 | `CategoryTabs` 组件 |
| `utils/medusa-server.ts` | 服务端专用 Medusa 工具函数 | `serverFetch()`, `getMedusaHeaders()` |
| `data/products/types.ts` | 产品模块类型定义 | `StoreProduct`, `StoreProductListParams` |

## fetchProducts() 函数

### 函数签名
```typescript
// 文件位置: data/products/server.ts:30-79
async function fetchProducts({
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
  response: {
    products: HttpTypes.StoreProduct[];
    count: number;
  };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;
}>
```

### 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| `pageParam` | `number` | 否 | `1` | 当前页码，从 1 开始 |
| `queryParams` | `HttpTypes.FindParams & HttpTypes.StoreProductListParams` | 否 | `undefined` | 查询参数，包括筛选、排序、字段选择等 |
| `countryCode` | `string` | 否 | `undefined` | 国家代码，用于价格区域化 |
| `regionId` | `string` | 否 | `undefined` | 区域 ID，用于价格区域化 |

### 返回值
```typescript
interface FetchProductsResult {
  response: {
    products: HttpTypes.StoreProduct[];  // 产品列表数组
    count: number;                        // 产品总数（用于分页计算）
  };
  nextPage: number | null;  // 下一页页码，null 表示没有下一页
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;  // 原始查询参数
}
```

### 函数逻辑
1. **获取当前语言环境**：使用 `getLocale()` 获取用户的语言设置
2. **计算分页参数**：
   - `limit`：每页数量，默认 20，可从 `queryParams.limit` 获取
   - `offset`：偏移量，计算公式：`(pageParam - 1) * limit`
3. **构建查询参数**：调用 `buildQueryString()` 将参数对象转换为 URL 查询字符串
4. **设置默认字段**：自动包含产品、变体价格、库存、图片、元数据等字段
5. **发送 API 请求**：使用自定义端点 `/store/zgar/products`（支持可见性过滤）
6. **计算下一页**：根据 `count` 和 `offset + limit` 判断是否有下一页

## buildQueryString() 辅助函数

### 函数签名
```typescript
// 文件位置: data/products/server.ts:14-28
function buildQueryString(params: Record<string, any>): string
```

### 功能说明
将 JavaScript 对象转换为 URLSearchParams 格式的查询字符串，支持：
- **数组参数**：自动展开为多个同名参数（如 `category_id[]=a&category_id[]=b`）
- **忽略空值**：自动过滤 `undefined` 和 `null` 值
- **类型转换**：所有值转换为字符串

### 使用示例
```typescript
const params = {
  limit: 20,
  offset: 0,
  category_id: ["cat_1", "cat_2"],
  price_range: "[100,500]"
};

buildQueryString(params);
// 输出: "limit=20&offset=0&category_id=cat_1&category_id=2&price_range=%5B100%2C500%5D"
```

## 筛选参数

### 支持的筛选条件

| 参数名 | 类型 | 说明 | 示例 |
|-------|------|------|------|
| `category_id` | `string[]` | 按分类 ID 筛选 | `["cat_123", "cat_456"]` |
| `collection_id` | `string[]` | 按产品集合 ID 筛选 | `["col_789"]` |
| `brand_id` | `string[]` | 按品牌 ID 筛选 | `["brand_001"]` |
| `tags` | `string[]` | 按标签筛选 | `["new", "featured"]` |
| `price_range` | `string` | 价格范围（JSON 数组字符串） | `"[100,500]"` |
| `q` | `string` | 全文搜索关键词 | `"电子烟"` |
| `fields` | `string` | 指定返回字段 | `"*variants,+metadata"` |

### 字段选择参数

系统默认请求以下字段，确保获取完整的产品信息：

```typescript
fields: "*variants.calculated_price,*variants.prices,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,*thumbnail,*images"
```

字段说明：
- `*variants`：包含所有变体信息
- `*variants.calculated_price`：变体计算价格（含折扣）
- `*variants.prices`：变体原始价格
- `+variants.inventory_quantity`：变体库存数量
- `*variants.images`：变体图片
- `*variants.options`：变体选项（如颜色、尺寸）
- `+metadata`：产品元数据
- `+tags`：产品标签
- `*thumbnail`：产品缩略图
- `*images`：产品图片集

## 分页参数

### 分页逻辑

| 参数 | 类型 | 说明 | 计算方式 |
|-----|------|------|---------|
| `pageParam` | `number` | 当前页码（从 1 开始） | 用户传入 |
| `limit` | `number` | 每页产品数量 | 默认 20，可通过 `queryParams.limit` 覆盖 |
| `offset` | `number` | 跳过的产品数量 | `(pageParam - 1) * limit` |

### 分页计算示例

```typescript
// 第 1 页
pageParam = 1, limit = 20
offset = (1 - 1) * 20 = 0

// 第 2 页
pageParam = 2, limit = 20
offset = (2 - 1) * 20 = 20

// 第 3 页
pageParam = 3, limit = 20
offset = (3 - 1) * 20 = 40
```

### 下一页判断

```typescript
// 文件位置: data/products/server.ts:72
const nextPage = count > offset + limit ? pageParam + 1 : null;
```

如果总产品数 `count` 大于已加载的产品数 `offset + limit`，则存在下一页。

## API 端点

### 主要端点

| 端点 | 方法 | 说明 | 特点 |
|------|------|------|------|
| `/store/zgar/products` | GET | 自定义产品列表端点 | 支持可见性过滤，只返回前台可见产品 |
| `/store/zgar/products/:id` | GET | 单个产品详情端点 | 支持可见性检查 |
| `/store/products` | GET | 标准 Medusajs 端点 | 后备端点，不包含可见性过滤 |

### 请求配置

#### Headers
```typescript
{
  "authorization": "Bearer {JWT_TOKEN}",        // 用户认证令牌
  "x-medusa-locale": "zh-CN",                   // 语言环境
  "x-publishable-api-key": "{PUBLISHABLE_KEY}"  // 发布 API 密钥
}
```

#### 请求示例
```bash
# 获取第 1 页产品，每页 20 个
GET /store/zgar/products?limit=20&offset=0&fields=*variants,*thumbnail

# 按分类筛选
GET /store/zgar/products?category_id[]=cat_123&category_id[]=cat_456

# 价格范围筛选
GET /store/zgar/products?price_range=[100,500]

# 全文搜索
GET /store/zgar/products?q=电子烟&page=1
```

### 响应结构

```typescript
// 成功响应
interface ProductsResponse {
  products: StoreProduct[];
  count: number;
  // hasNextPage 由前端根据 count 和 offset+limit 计算
}

// StoreProduct 类型（Medusajs 标准）
interface StoreProduct {
  id: string;
  title: string;
  handle: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  variants?: ProductVariant[];
  categories?: Category[];
  tags?: Tag[];
  type?: ProductType;
  collection?: Collection;
  status?: "published" | "draft" | "proposed";
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 产品变体
interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  barcode?: string;
  prices?: Price[];
  calculated_price?: {
    currency_code: string;
    amount: number;
    calculated_amount?: number;
  };
  inventory_quantity: number;
  options?: Record<string, string>;
  images?: string[];
}
```

## 使用示例

### 基础使用（商店主页）

```tsx
// app/[locale]/(layout)/(store)/shop/page.tsx
import { fetchProducts } from "@/data/products";

export default async function Page() {
  // 获取第一页产品（默认 20 个）
  const { response } = await fetchProducts({});

  return <ShopPageContent products={response.products} />;
}
```

### 带筛选参数

```tsx
// 获取特定分类的产品
const { response } = await fetchProducts({
  queryParams: {
    category_id: ["cat_123"],
    limit: 12,
  },
});
```

### 分页加载

```tsx
// 客户端组件中的分页加载
async function loadMoreProducts(currentPage: number) {
  const { response, nextPage } = await fetchProducts({
    pageParam: currentPage + 1,
    queryParams: {
      limit: 20,
    },
  });

  // 合并新产品到现有列表
  setProducts(prev => [...prev, ...response.products]);

  // 更新下一页页码
  setNextPage(nextPage);
}
```

### 排序功能

```tsx
// ProductGrid.tsx 中的客户端排序
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

## 性能优化

### 1. 服务端渲染（SSR）
- 使用 Next.js 服务端组件，在服务器端获取数据
- 减少 API 调用延迟，提升首屏加载速度

### 2. 字段选择优化
- 只请求必要的字段，减少数据传输量
- 使用 `fields` 参数精确控制返回数据

### 3. 分页策略
- 默认每页 20 个产品，平衡性能和用户体验
- 支持 `limit` 参数动态调整每页数量

### 4. 缓存策略
- Medusajs SDK 内置缓存机制
- 可以通过 `next` 配置 Next.js 的缓存策略

## 错误处理

### fetchProducts 错误处理
```typescript
// 文件位置: data/products/server.ts:62-69
try {
  const result = await serverFetch<{
    products: HttpTypes.StoreProduct[];
    count: number;
  }>(`/store/zgar/products?${queryString}`, {
    method: "GET",
    headers,
    locale,
  });
  // ...
} catch (error) {
  // 错误会直接抛出，由上层处理
  throw new Error(`Failed to fetch products: ${error.message}`);
}
```

### fetchProduct 降级策略
```typescript
// 文件位置: data/products/server.ts:87-114
try {
  // 优先使用新端点（支持可见性检查）
  return await serverFetch(`/store/zgar/products/${id}`, ...);
} catch (error) {
  // 降级到原生端点
  console.warn("[fetchProduct] 新端点不可用，降级到原生端点:", error);
  return medusaSDK.client.fetch(`/store/products/${id}`, ...);
}
```

## 注意事项

1. **服务端专用**：`fetchProducts()` 使用 `"use server"` 指令，只能在服务端组件或 Server Actions 中调用
2. **类型安全**：使用 Medusajs 的 `HttpTypes` 确保类型一致性
3. **语言环境**：自动从 `getLocale()` 获取当前语言，传递给 API
4. **认证**：自动从 cookies 获取 JWT token，支持用户专属数据
5. **可见性过滤**：优先使用 `/store/zgar/products` 端点，确保只返回前台可见产品
6. **错误处理**：API 错误会直接抛出，需要调用方处理

## 相关文档

- [下单流程](./order-flow.md) - 完整的购物车和下单流程
- [订单详情](./order-detail.md) - 订单结构和查询
- [页面关系图](./page-flow.md) - 路由和页面跳转关系
- [Medusajs 产品 API 文档](https://docs.medusajs.com/resources/store-products)

## 变更记录

### 2026-03-05
- 创建商品列表获取流程文档
- 添加完整的数据流向图和函数说明
- 补充筛选、分页、排序功能文档
