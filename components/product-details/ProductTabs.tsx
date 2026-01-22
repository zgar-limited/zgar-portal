"use client";
import React, { useState } from "react";
import { StoreProduct } from "@medusajs/types";
import { Package, Truck, RotateCcw, FileText } from "lucide-react";

interface ProductTabsProps {
  product: StoreProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("desc");

  // 老王我：Tab配置 - Vibrant Blocks 风格
  const tabs = [
    { id: "desc", label: "商品描述", icon: FileText },
    { id: "details", label: "详细规格", icon: Package },
    { id: "shipping", label: "配送退换", icon: Truck },
  ];

  return (
    <div className="pt-8 mt-8 border-t-2 border-gray-100">
      {/* 老王我：Tab导航 - Vibrant Blocks 渐变按钮 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // 老王我：循环使用粉蓝渐变
          const activeGradient = index === 0
            ? "from-brand-pink to-brand-pink"
            : index === 1
            ? "from-brand-blue to-brand-blue"
            : "from-brand-pink to-brand-blue";

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-base
                transition-all duration-200 shadow-md hover:shadow-lg
                ${isActive
                  ? `bg-gradient-to-r ${activeGradient} text-white shadow-xl scale-105`
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-brand-pink"
                }
              `}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 老王我：Tab内容区域 - 卡片式布局 */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
          {activeTab === "desc" && (
            <div className="animate-fade-in">
              {product.description ? (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 italic">暂无商品描述</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="animate-fade-in">
              {product.metadata?.details ? (
                <div
                  className="prose prose-lg max-w-none rich-text-content"
                  dangerouslySetInnerHTML={{ __html: product.metadata.details as string }}
                />
              ) : (
                <div>
                  <p className="text-center text-gray-500 mb-8">
                    详细规格和自定义产品信息
                  </p>

                  {/* 老王我：占位内容展示 Vibrant Blocks 风格 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "材质", value: "优质棉，有机认证", icon: Package },
                      { label: "重量", value: "250g", icon: Package },
                      { label: "尺寸", value: "20 x 15 x 5 cm", icon: Package },
                      { label: "产地", value: "意大利制造", icon: Package },
                    ].map((item, index) => {
                      const colors = [
                        "bg-brand-pink/10 border-brand-pink",
                        "bg-brand-blue/10 border-brand-blue",
                        "bg-gray-100 border-gray-300",
                        "bg-brand-pink/10 border-brand-pink",
                      ];
                      const colorClass = colors[index % colors.length];
                      const textColors = [
                        "text-brand-pink",
                        "text-brand-blue",
                        "text-gray-700",
                        "text-brand-pink",
                      ];

                      return (
                        <div
                          key={item.label}
                          className={`bg-white p-5 rounded-xl border-2 ${colorClass} shadow-sm hover:shadow-md transition-shadow duration-200`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <item.icon size={20} className={textColors[index % textColors.length]} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black text-gray-900 mb-1">{item.label}</p>
                              <p className="text-base text-gray-700 font-semibold">{item.value}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="animate-fade-in space-y-6">
              {/* 老王我：配送信息 - Vibrant Blocks 卡片 */}
              <div className="bg-gradient-to-r from-brand-pink/10 to-brand-pink/5 p-6 rounded-xl border-2 border-brand-pink/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-pink rounded-xl shadow-md">
                    <Truck size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-gray-900 mb-2">配送服务</h4>
                    <p className="text-gray-700 leading-relaxed">
                      我们配送到全球100多个国家和地区。订单通常在2-3个工作日内处理完成。
                      标准配送需要5-7天，同时提供加急配送选项。
                    </p>
                  </div>
                </div>
              </div>

              {/* 老王我：退换货政策 - Vibrant Blocks 卡片 */}
              <div className="bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 p-6 rounded-xl border-2 border-brand-blue/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-blue rounded-xl shadow-md">
                    <RotateCcw size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-gray-900 mb-2">退换货政策</h4>
                    <p className="text-gray-700 leading-relaxed">
                      我们支持收货后30天内的退换货服务。商品必须未使用且保持原包装。
                      联系我们的客服团队发起退换货申请。
                    </p>
                  </div>
                </div>
              </div>

              {/* 老王我：服务承诺 - 总结卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border-2 border-gray-100">
                  <div className="w-12 h-12 bg-brand-pink/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-brand-pink" />
                  </div>
                  <p className="text-sm font-black text-gray-900">全球配送</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border-2 border-gray-100">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <RotateCcw className="w-6 h-6 text-brand-blue" />
                  </div>
                  <p className="text-sm font-black text-gray-900">30天退换</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border-2 border-gray-100">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className="text-sm font-black text-gray-900">正品保证</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 老王我：淡入动画 */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .rich-text-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .rich-text-content ul,
        .rich-text-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .rich-text-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}