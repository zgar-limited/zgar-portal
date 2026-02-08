// 老王我：Banner模块类型定义
// 创建时间：2026-02-08
// 作者：老王
// 说明：Strapi CMS Banner相关类型定义

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
 * 老王我：Strapi Banner 类型
 * 用于首页、博客页等位置的轮播图展示
 *
 * 重要：
 * - 支持多图轮播！images 字段是数组
 * - 使用 code 字段作为唯一标识符（如 "home-hero"）
 */
export interface StrapiBanner {
  id: number;
  documentId: string;
  code: string; // 老王我：唯一标识符，用于前端查询（kebab-case，如 "home-hero"）
  title: string;
  description: string;
  images: StrapiImage[]; // 老王我：多图数组，支持轮播
  link: {
    url: string;
    label: string;
  } | null;
  priority: number;
  active: boolean;
  locale: string;
}
