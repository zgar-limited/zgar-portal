[根目录](../../../../CLAUDE.md) > [app](../../../) > [[locale]](../../) > [(layout)](../) > **(intro)**

# 介绍页面模块

## 模块职责
提供公司介绍、品牌故事、合作伙伴展示等企业形象内容，帮助建立品牌信任度和企业认知度。这些页面对于建立客户关系和展示公司价值主张至关重要。

## 入口与启动
- **关怀页面**: `care/page.tsx` - 公司关怀理念和社会责任展示
- **合作伙伴**: `partner/page.tsx` - 合作伙伴展示和合作机会

## 对外接口
```typescript
// 介绍页面参数
interface IntroPageProps {
  params: Promise<{
    locale: string;
  }>;
}

// 合作伙伴数据
interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  partnership_type: 'technology' | 'distribution' | 'strategic';
}

// 关怀内容
interface CareContent {
  title: string;
  description: string;
  initiatives: Initiative[];
  impact_metrics: ImpactMetric[];
  gallery: GalleryItem[];
}
```

## 关键依赖与配置

### 数据层集成
- `@/data/partners.js`: 合作伙伴信息
- `@/data/care.js`: 关怀理念内容（可能存在）
- CMS 集成: 静态内容或 CMS 管理的内容

### 核心组件依赖
- `@/components/other-pages/about/`:
  - `Hero.jsx` - 页面英雄区域
  - `PageTitle.jsx` - 页面标题组件
  - `BrandStory.jsx` - 品牌故事展示
- `@/components/brand-area/BrandArea.tsx` - 品牌展示区域
- `@/components/common/Features.jsx` - 特性展示组件

### 视觉效果
- 动画效果: GSAP 滚动动画
- 图片展示: 响应式图片画廊
- 交互元素: 悬停效果、视差滚动

## 数据模型
```typescript
// 合作伙伴详细信息
interface PartnerDetail extends Partner {
  case_studies: CaseStudy[];
  testimonials: Testimonial[];
  contact_info: ContactInfo;
  partnership_benefits: string[];
}

// 关怀倡议
interface Initiative {
  id: string;
  title: string;
  description: string;
  image: string;
  impact: string;
  date_started: string;
}

// 影响力指标
interface ImpactMetric {
  metric: string;
  value: string;
  unit: string;
  description: string;
}

// 画廊项目
interface GalleryItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
}
```

## 测试与质量
- **内容展示测试**: 确保所有文本和媒体内容正确渲染
- **响应式测试**: 在不同设备上的显示效果
- **性能测试**: 图片加载和动画性能
- **可访问性测试**: 符合 WCAG 标准

### 关键测试场景
1. 合作伙伴 logo 的加载和链接
2. 关怀内容的信息展示
3. 页面滚动和动画效果
4. 联系表单（如果存在）
5. 图片画廊的交互功能
6. 多语言内容切换

## 常见问题 (FAQ)

### Q: 如何维护合作伙伴信息？
A: 建立合作伙伴数据库，通过 CMS 或后台管理系统更新信息，确保网站内容与业务发展同步。

### Q: 关怀页面的内容更新频率？
A: 根据企业社会责任活动的进展，定期更新内容，展示最新的企业贡献和社会影响。

### Q: 如何优化这些页面的SEO？
A: 使用相关的关键词，优化图片 alt 文本，添加结构化数据，建立内部链接策略。

## 相关文件清单

### 页面文件
- `care/page.tsx` - 关怀理念页面
- `partner/page.tsx` - 合作伙伴页面

### 组件文件
- `components/other-pages/about/Hero.jsx` - 英雄区域
- `components/other-pages/about/PageTitle.jsx` - 页面标题
- `components/other-pages/about/BrandStory.jsx` - 品牌故事
- `components/brand-area/BrandArea.tsx` - 品牌展示
- `components/common/Features.jsx` - 特性展示

### 数据文件
- `data/partners.js` - 合作伙伴数据
- 可能存在的关怀内容数据文件

### 样式文件
- 组件相关的 SCSS/CSS 文件
- 全局介绍页面样式

## 变更记录 (Changelog)

### 2025-12-18 10:52:29
- 创建介绍页面模块文档
- 分析企业形象页面结构
- 识别品牌展示和合作伙伴功能

### 待优化项
- [ ] 添加视频内容支持
- [ ] 实现合作伙伴分类筛选
- [ ] 添加互动式时间线展示历史
- [ ] 集成社交媒体动态
- [ ] 添加下载资源中心
- [ ] 实现合作伙伴登录门户
- [ ] 添加企业里程碑展示