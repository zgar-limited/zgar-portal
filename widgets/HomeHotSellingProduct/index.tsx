"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Flame } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

// 老王我：模拟产品数据
const mockProducts = [
  {
    id: 1,
    title: "Cloud Chaser Pro",
    price: 299,
    originalPrice: 399,
    image: "/images/slider/zgar/1.jpg",
    badge: "HOT",
    rating: 4.9,
    reviews: 128,
    // 老王我：产品选项
    options: {
      colors: [
        { name: "Pink", value: "#f496d3" },
        { name: "Blue", value: "#0047c7" },
        { name: "Black", value: "#1a1a1a" }
      ],
      flavors: ["Mango", "Grape", "Mint"]
    }
  },
  {
    id: 2,
    title: "Dream Mist Limited",
    price: 499,
    originalPrice: 599,
    image: "/images/slider/zgar/2.jpg",
    badge: "NEW",
    rating: 4.8,
    reviews: 95,
    options: {
      colors: [
        { name: "Gold", value: "#d4af37" },
        { name: "Silver", value: "#c0c0c0" }
      ],
      flavors: ["Vanilla", "Caramel", "Coffee"]
    }
  },
  {
    id: 3,
    title: "Vapor Storm Elite",
    price: 199,
    originalPrice: 299,
    image: "/images/slider/zgar/3.jpg",
    badge: "SALE",
    rating: 4.7,
    reviews: 203,
    options: {
      colors: [
        { name: "Red", value: "#ff4444" },
        { name: "Blue", value: "#4444ff" },
        { name: "Green", value: "#44ff44" },
        { name: "Purple", value: "#9944ff" }
      ],
      flavors: ["Berry", "Lemon", "Ice"]
    }
  },
  {
    id: 4,
    title: "Nebula Cloud X",
    price: 349,
    originalPrice: 449,
    image: "/images/slider/zgar/4.jpg",
    badge: "BEST",
    rating: 4.9,
    reviews: 167,
    options: {
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Black", value: "#000000" }
      ],
      flavors: ["Tobacco", "Menthol"]
    }
  },
];

const getTabItems = (t: (key: string) => string) => [
  { key: "new", label: t("new"), icon: Sparkles },
  { key: "hot", label: t("hot"), icon: Flame },
  { key: "sale", label: t("sale"), icon: TrendingUp },
];

export default function HomeHotSellingProduct() {
  const t = useTranslations("HomeHotSellingProduct");
  const [activeTab, setActiveTab] = useState("new");
  const tabItems = getTabItems((key) => t(`tab.${key}`));

  return (
    <section className="py-20 bg-gradient-to-br from-brand-pink/5 via-white to-brand-blue/5">
      {/* 老王我：标题区域 */}
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">🔥🔥🔥🔥</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue">
              {t("title")}
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* 老王我：Tab 切换 - 圆形图标风格 */}
        <div className="flex justify-center gap-4 mt-8">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
                  ${activeTab === tab.key
                    ? "bg-gradient-to-r from-brand-pink to-brand-blue text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200"
                  }
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  ${activeTab === tab.key ? "bg-white/20" : "bg-gray-100"}
                `}>
                  <Icon size={14} className={activeTab === tab.key ? "text-white" : "text-gray-600"} />
                </div>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 老王我：产品网格 */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product-${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-brand-pink/30">
                {/* 产品图片容器 */}
                <div className="relative overflow-hidden aspect-square">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* 徽章 - 粉蓝渐变圆形 */}
                  <div className="absolute top-4 left-4 bg-gradient-to-br from-brand-pink to-brand-blue rounded-full shadow-lg px-4 py-2">
                    <span className="text-white text-xs font-bold">{product.badge}</span>
                  </div>

                  {/* 悬浮时显示的操作按钮 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 产品信息 */}
                <div className="p-5">
                  {/* 标题 */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-pink transition-colors duration-300 mb-3">
                    {product.title}
                  </h3>

                  {/* 老王我：口味选项显示 */}
                  {product.options?.flavors && product.options.flavors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {product.options.flavors.map((flavor, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-brand-pink/10 to-brand-blue/10 text-gray-700 font-medium border border-brand-pink/20"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
