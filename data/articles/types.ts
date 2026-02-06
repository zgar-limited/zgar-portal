// 老王我：文章模块类型定义
// 创建时间：2026-02-02
// 作者：老王
// 说明：Strapi CMS 相关类型定义

/**
 * 老王我：Strapi 图片类型
 */
export interface StrapiImage {
  id: number;
  name: string;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

/**
 * 老王我：Strapi 分类类型
 */
export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  locale: string;
}

/**
 * 老王我：Strapi Block 类型（动态区块）
 * 用于渲染文章内容中的文本、图片、视频、引用、代码等
 */
export interface StrapiBlock {
  id: string;
  __component: string; // 例如 "blocks.text", "blocks.image", "blocks.quote" 等
  [key: string]: any; // 其他字段根据组件类型动态变化
}

/**
 * 老王我：Strapi 文章类型
 */
export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  cover: StrapiImage | null;
  author: {
    id: number;
    documentId: string;
    firstname: string;
    lastname: string;
  } | null;
  category: StrapiCategory | null;
  publishedAt: string;
  locale: string;
  blocks?: StrapiBlock[]; // Strapi Dynamic Zones (blocks)
}

/**
 * 老王我：Strapi Banner 类型
 */
export interface StrapiBanner {
  id: number;
  documentId: string;
  title: string;
  description: string;
  image: StrapiImage;
  link: {
    url: string;
    label: string;
  } | null;
  priority: number;
  active: boolean;
  page: string;
  locale: string;
}

/**
 * 老王我：文章列表响应类型
 */
export interface ArticlesResponse {
  articles: StrapiArticle[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
