"use client";
import React, { useState } from "react";
import { StoreProduct } from "@medusajs/types";
import { Package, Truck, RotateCcw, FileText } from "lucide-react";

interface ProductTabsProps {
  product: StoreProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("desc");

  // 老王我：Tab配置 - Memphis 风格
  const tabs = [
    { id: "desc", label: "商品描述", icon: FileText, color: "#f496d3" },
    { id: "details", label: "详细规格", icon: Package, color: "#f496d3" },
    { id: "shipping", label: "配送退换", icon: Truck, color: "#0047c7" },
  ];

  return (
    <div className="pt-8 mt-8 border-t-2 border-gray-100">
      {/* 老王我：Tab导航 - Memphis 风格几何按钮 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // 老王我：Memphis 明亮色彩
          const memphisColors = [
            { bg: "#f496d3", hover: "#FF5CB8" },  // 粉
            { bg: "#f496d3", hover: "#FFB83A" },  // 黄
            { bg: "#0047c7", hover: "#6FBEBB" },  // 青
          ];
          const colorScheme = memphisColors[index % memphisColors.length];

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative group"
              style={{ fontFamily: 'sans-serif' }}
            >
              {/* 老王我：Memphis 装饰边框 - 虚线 */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: isActive ? 'none' : '3px dashed',
                  borderColor: isActive ? 'transparent' : colorScheme.bg,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease-out'
                }}
              ></div>

              {/* 老王我：按钮背景 */}
              <div
                className="relative px-6 py-3 rounded-sm font-black text-base transition-all duration-200"
                style={{
                  backgroundColor: isActive ? colorScheme.bg : 'white',
                  color: isActive ? 'white' : colorScheme.bg,
                  transform: 'rotate(-2deg)',
                  boxShadow: isActive ? '0 8px 20px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = colorScheme.bg;
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = colorScheme.bg;
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </div>

                {/* 老王我：装饰性三角形 */}
                {!isActive && (
                  <div
                    className="absolute -top-2 -right-2 w-4 h-4 opacity-40"
                    style={{
                      backgroundColor: colorScheme.bg,
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }}
                  ></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 老王我：Tab内容区域 - Memphis 风格大卡片 */}
      <div className="max-w-4xl mx-auto">
        <div
          className="relative p-6 shadow-xl"
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '3px dashed #f496d3'
          }}
        >
          {/* 老王我：卡片装饰 - 波点图案背景 */}
          <div
            className="absolute inset-0 opacity-5 rounded-sm"
            style={{
              backgroundImage: 'radial-gradient(circle, #f496d3 2px, transparent 2px)',
              backgroundSize: '20px 20px',
              pointerEvents: 'none'
            }}
          ></div>

          {/* 老王我：装饰性几何图形 */}
          {/* 左上角三角形 */}
          <div
            className="absolute -top-4 -left-4 w-10 h-10 opacity-30"
            style={{
              backgroundColor: '#f496d3',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(-25deg)'
            }}
          ></div>

          {/* 右上角圆形 */}
          <div
            className="absolute -top-5 -right-5 w-14 h-14 opacity-20 rounded-sm"
            style={{ backgroundColor: '#f496d3' }}
          ></div>

          {/* 左下角方形 */}
          <div
            className="absolute -bottom-4 -left-4 w-12 h-12 opacity-25"
            style={{
              backgroundColor: '#0047c7',
              transform: 'rotate(-15deg)'
            }}
          ></div>

          {/* 右下角X形 */}
          <div className="absolute -bottom-3 -right-3 w-6 h-6 opacity-20">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <path
                d="M4,4 L28,28 M28,4 L4,28"
                stroke="#0047c7"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 老王我：内容区域 */}
          <div className="relative z-10">
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
                    <p className="text-center text-gray-500 mb-6 font-bold">
                      详细规格和自定义产品信息
                    </p>

                    {/* 老王我：Memphis 风格规格卡片网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "材质", value: "优质棉，有机认证", color: "#f496d3" },
                        { label: "重量", value: "250g", color: "#f496d3" },
                        { label: "尺寸", value: "20 x 15 x 5 cm", color: "#0047c7" },
                        { label: "产地", value: "意大利制造", color: "#0047c7" },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="group relative overflow-hidden"
                          style={{
                            backgroundColor: item.color,
                            borderRadius: "4px"
                          }}
                        >
                          {/* 老王我：Memphis 装饰边框 - 虚线 */}
                          <div
                            className="absolute inset-0 rounded-sm"
                            style={{
                              border: '2px dashed',
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                              padding: '8px'
                            }}
                          ></div>

                          {/* 老王我：装饰性几何图形 - 三角形 */}
                          <div
                            className="absolute -top-2 -right-2 w-8 h-8 opacity-20"
                            style={{
                              backgroundColor: 'white',
                              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                              transform: 'rotate(25deg)'
                            }}
                          ></div>

                          {/* 老王我：波点装饰 */}
                          <div
                            className="absolute bottom-0 left-0 w-8 h-8 opacity-10"
                            style={{
                              backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                              backgroundSize: '6px 6px'
                            }}
                          ></div>

                          {/* 老王我：内容区域 */}
                          <div className="relative z-10 p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center"
                                style={{ transform: 'rotate(-5deg)' }}
                              >
                                <Package size={18} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-black uppercase text-white/80 mb-1">
                                  {item.label}
                                </p>
                                <p className="text-base font-black text-white leading-tight">
                                  {item.value}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="animate-fade-in space-y-5">
                {/* 老王我：配送信息 - Memphis 风格卡片 */}
                <div
                  className="group relative overflow-hidden"
                  style={{
                    backgroundColor: '#f496d3',
                    borderRadius: "4px"
                  }}
                >
                  {/* 老王我：虚线装饰边框 */}
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      border: '2px dashed rgba(255, 255, 255, 0.5)',
                      padding: '8px'
                    }}
                  ></div>

                  {/* 老王我：装饰三角形 */}
                  <div
                    className="absolute -top-2 -right-2 w-10 h-10 opacity-20"
                    style={{
                      backgroundColor: 'white',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      transform: 'rotate(25deg)'
                    }}
                  ></div>

                  {/* 老王我：内容 */}
                  <div className="relative z-10 p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center"
                        style={{ transform: 'rotate(-5deg)' }}
                      >
                        <Truck size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-white mb-2">配送服务</h4>
                        <p className="text-white/95 leading-relaxed text-sm">
                          我们配送到全球100多个国家和地区。订单通常在2-3个工作日内处理完成。
                          标准配送需要5-7天，同时提供加急配送选项。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 老王我：退换货政策 - Memphis 风格卡片 */}
                <div
                  className="group relative overflow-hidden"
                  style={{
                    backgroundColor: '#0047c7',
                    borderRadius: "4px"
                  }}
                >
                  {/* 老王我：虚线装饰边框 */}
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      border: '2px dashed rgba(255, 255, 255, 0.5)',
                      padding: '8px'
                    }}
                  ></div>

                  {/* 老王我：装饰圆形 */}
                  <div
                    className="absolute -top-3 -right-3 w-12 h-12 opacity-20 rounded-sm"
                    style={{ backgroundColor: 'white' }}
                  ></div>

                  {/* 老王我：内容 */}
                  <div className="relative z-10 p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center"
                        style={{ transform: 'rotate(-5deg)' }}
                      >
                        <RotateCcw size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-white mb-2">退换货政策</h4>
                        <p className="text-white/95 leading-relaxed text-sm">
                          我们支持收货后30天内的退换货服务。商品必须未使用且保持原包装。
                          联系我们的客服团队发起退换货申请。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 老王我：服务承诺 - Memphis 风格小卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { icon: Truck, label: "全球配送", color: "#f496d3" },
                    { icon: RotateCcw, label: "30天退换", color: "#0047c7" },
                    { icon: Package, label: "正品保证", color: "#f496d3" },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="group relative overflow-hidden text-center"
                        style={{
                          backgroundColor: item.color,
                          borderRadius: "4px"
                        }}
                      >
                        {/* 老王我：虚线装饰 */}
                        <div
                          className="absolute inset-0 rounded-sm"
                          style={{
                            border: '2px dashed rgba(255, 255, 255, 0.4)',
                            padding: '6px'
                          }}
                        ></div>

                        {/* 老王我：装饰X标记 */}
                        <div className="absolute bottom-2 right-2 w-3 h-3 opacity-20">
                          <svg viewBox="0 0 16 16" className="w-full h-full">
                            <path
                              d="M2,2 L14,14 M14,2 L2,14"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        {/* 老王我：内容 */}
                        <div className="relative z-10 p-4">
                          <div
                            className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center mx-auto mb-2"
                            style={{ transform: 'rotate(-3deg)' }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-sm font-black text-white">{item.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
