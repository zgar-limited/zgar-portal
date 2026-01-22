"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Flame } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

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
    reviews: 128
  },
  {
    id: 2,
    title: "Dream Mist Limited",
    price: 499,
    originalPrice: 599,
    image: "/images/slider/zgar/2.jpg",
    badge: "NEW",
    rating: 4.8,
    reviews: 95
  },
  {
    id: 3,
    title: "Vapor Storm Elite",
    price: 199,
    originalPrice: 299,
    image: "/images/slider/zgar/3.jpg",
    badge: "SALE",
    rating: 4.7,
    reviews: 203
  },
  {
    id: 4,
    title: "Nebula Cloud X",
    price: 349,
    originalPrice: 449,
    image: "/images/slider/zgar/4.jpg",
    badge: "BEST",
    rating: 4.9,
    reviews: 167
  },
];

const tabItems = [
  { key: "new", label: "新品", icon: Sparkles },
  { key: "hot", label: "热销", icon: Flame },
  { key: "sale", label: "特价", icon: TrendingUp },
];

export default function HomeHotSellingProduct() {
  const [activeTab, setActiveTab] = useState("new");

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
              热销产品
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            精选最受欢迎的产品，品质保证，限时优惠
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-pink transition-colors duration-300">
                    {product.title}
                  </h3>

                  {/* 评分 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* 价格 */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue">
                      ¥{product.price}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      ¥{product.originalPrice}
                    </span>
                    <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
