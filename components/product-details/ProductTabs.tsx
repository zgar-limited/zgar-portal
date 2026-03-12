"use client";
import React, { useState } from "react";
import { StoreProduct } from "@medusajs/types";
import { Package, Truck, RotateCcw, FileText } from "lucide-react";

interface ProductTabsProps {
  product: StoreProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("desc");

  const tabs = [
    { id: "desc", label: "商品描述", icon: FileText },
    { id: "details", label: "详细规格", icon: Package },
    { id: "shipping", label: "配送退换", icon: Truck },
  ];

  return (
    <div>
      {/* Tab导航 */}
      <div className="flex flex-wrap justify-center gap-1 mb-8 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors cursor-pointer
                ${isActive
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab内容区域 */}
      <div className="max-w-4xl mx-auto">
        <div className="border border-gray-200 bg-white">
          <div className="p-6 lg:p-8">
            {activeTab === "desc" && (
              <div>
                {product.description ? (
                  <div
                    className="prose prose-lg max-w-none rich-text-content"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">暂无商品描述</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "details" && (
              <div>
                {product.metadata?.details ? (
                  <div
                    className="prose prose-lg max-w-none rich-text-content"
                    dangerouslySetInnerHTML={{ __html: product.metadata.details as string }}
                  />
                ) : (
                  <div>
                    <p className="text-center text-gray-500 mb-6 font-semibold">
                      详细规格和产品信息
                    </p>

                    {/* 规格网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
                      {[
                        { label: "材质", value: "优质棉，有机认证" },
                        { label: "重量", value: "250g" },
                        { label: "尺寸", value: "20 x 15 x 5 cm" },
                        { label: "产地", value: "意大利制造" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between items-center p-4 bg-white"
                        >
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {item.label}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6">
                {/* 配送信息 */}
                <div className="border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Truck size={20} className="text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">配送服务</h4>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          我们配送到全球100多个国家和地区。订单通常在2-3个工作日内处理完成。
                          标准配送需要5-7天，同时提供加急配送选项。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 退换货政策 */}
                <div className="border border-gray-200">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <RotateCcw size={20} className="text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">退换货政策</h4>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          我们支持收货后30天内的退换货服务。商品必须未使用且保持原包装。
                          联系我们的客服团队发起退换货申请。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 服务承诺 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
                  {[
                    { icon: Truck, label: "全球配送" },
                    { icon: RotateCcw, label: "30天退换" },
                    { icon: Package, label: "正品保证" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-center gap-3 p-4 bg-white"
                      >
                        <Icon className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 样式 */}
      <style jsx>{`
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
