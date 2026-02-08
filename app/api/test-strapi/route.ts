// 老王我：测试 Strapi 数据拉取 API
// 创建时间：2026-02-08

import { NextResponse } from "next/server";
import { fetchBanners } from "@/data/banners";
import { fetchArticles } from "@/data/articles";

export async function GET() {
  try {
    // 老王我：测试 Banner
    const banners = await fetchBanners({
      page: "home",
      limit: 5
    });

    // 老王我：测试 Articles
    const articles = await fetchArticles({
      pageSize: 5
    });

    return NextResponse.json({
      success: true,
      data: {
        banners: {
          count: banners.length,
          items: banners
        },
        articles: {
          count: articles.length,
          items: articles
        }
      },
      message: "✅ 数据拉取成功！"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
