"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, AlertCircle, Package, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PointsProduct } from "@/data/points-products";

/**
 * 积分商品卡片 - 激进 Vibrant Blocks 风格
 *
 * 老王我完全重构：
 * 1. 大胆分屏 - 上图下文各50%
 * 2. 超大积分标签 - 占据整个图片左侧
 * 3. 几何背景 - 装饰性方块和线条
 * 4. 强对比色彩 - 粉蓝黑白高对比
 * 5. 直边硬朗 - 4px小圆角
 */

interface PointsProductCardProps {
  product: PointsProduct;
  userPoints: number;
  onRedeem: (product: PointsProduct) => void;
}

export default function PointsProductCard({
  product,
  userPoints,
  onRedeem,
}: PointsProductCardProps) {
  const t = useTranslations("Club");
  const [imageError, setImageError] = useState(false);

  const canAfford = userPoints >= product.points_required;
  const isOutOfStock = !product.is_available || product.stock <= 0;

  return (
    <div
      className="
        group
        relative
        bg-white
        overflow-hidden
        transition-all
        duration-300
        hover:shadow-2xl
        hover:-translate-y-2
        cursor-pointer
      "
      style={{ borderRadius: '4px', border: '2px solid #f496d3' }}
    >
      {/* 老王我：商品图片区域 - 50%高度 */}
      <div
        className="relative aspect-square bg-gray-50 overflow-hidden"
        style={{ borderBottom: '4px solid #0047c7' }}
      >
        {/* 老王我：几何装饰背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10"
            style={{
              backgroundColor: '#f496d3',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(-45deg)'
            }}
          ></div>
          <div
            className="absolute top-4 right-4 w-16 h-16 opacity-10"
            style={{ backgroundColor: '#0047c7', borderRadius: '2px' }}
          ></div>
        </div>

        {/* 商品图片 */}
        {!imageError && product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={80} className="text-gray-300" />
          </div>
        )}

        {/* 老王我：超大积分标签 - 占据整个左侧 */}
        <div
          className="absolute top-0 left-0 bottom-0 flex flex-col items-center justify-center"
          style={{
            width: '80px',
            backgroundColor: '#f496d3',
            clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0% 100%)',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px'
          }}
        >
          <Star size={24} className="text-yellow-300 fill-yellow-300 mb-2" />
          <div className="text-white font-black text-center leading-tight">
            <div className="text-xs mb-1">POINTS</div>
            <div className="text-lg">
              {product.points_required >= 1000
                ? `${(product.points_required / 1000).toFixed(1)}k`
                : product.points_required.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 老王我：库存状态标签 */}
        {isOutOfStock && (
          <div
            className="absolute top-4 right-4 px-4 py-2 backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: '#0a0a0a' }}
          >
            <span className="text-xs font-black text-white">
              {t("outOfStock")}
            </span>
          </div>
        )}

        {/* 老王我：热点装饰 */}
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#f496d3' }}></div>
      </div>

      {/* 老王我：商品信息区域 - 50%高度 */}
      <div className="p-6" style={{ backgroundColor: 'white' }}>
        {/* 商品名称 */}
        <h3
          className="
            font-black
            text-gray-900
            text-lg
            mb-3
            line-clamp-2
            leading-snug
          "
          style={{ fontFamily: 'sans-serif' }}
        >
          {product.name}
        </h3>

        {/* 商品描述（如果有）*/}
        {product.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* 老王我：库存提示条 */}
        <div
          className="mb-4 px-3 py-2 flex items-center justify-between"
          style={{
            backgroundColor: '#f0f0f0',
            borderRadius: '2px'
          }}
        >
          {!isOutOfStock ? (
            <>
              <span className="text-xs font-bold text-gray-700">
                {t("inStock", { count: product.stock })}
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0047c7' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f496d3' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0a0a0a' }}></div>
              </div>
            </>
          ) : (
            <span className="text-xs font-bold text-gray-400">
              {t("outOfStock")}
            </span>
          )}
        </div>

        {/* 老王我：兑换按钮 - 超大渐变 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRedeem(product);
          }}
          disabled={!canAfford || isOutOfStock}
          className={`
            w-full
            px-6
            py-4
            text-sm
            font-black
            transition-all
            duration-200
            flex
            items-center
            justify-center
            gap-2
            ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : canAfford
                ? 'text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          style={{
            borderRadius: '4px',
            ...(canAfford && !isOutOfStock ? {
              background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)'
            } : {})
          }}
        >
          {isOutOfStock ? (
            <span>{t("outOfStock")}</span>
          ) : !canAfford ? (
            <span className="flex items-center gap-2">
              <AlertCircle size={16} />
              {t("insufficientPoints")}
            </span>
          ) : (
            <>
              <Sparkles size={16} className="animate-pulse" />
              {t("redeemNow")}
            </>
          )}
        </button>

        {/* 老王我：积分不足提示 */}
        {!canAfford && !isOutOfStock && (
          <div
            className="mt-3 px-3 py-2 text-center"
            style={{ backgroundColor: '#fef2f2', borderRadius: '2px' }}
          >
            <p className="text-xs font-bold" style={{ color: '#f496d3' }}>
              {t("needMorePoints", { points: (product.points_required - userPoints).toLocaleString() })}
            </p>
          </div>
        )}
      </div>

      {/* 老王我：装饰性角落 */}
      <div className="absolute top-0 right-0 w-8 h-8" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
        <div className="w-full h-full" style={{ backgroundColor: '#0047c7' }}></div>
      </div>

      {/* 老王我：底部装饰条纹 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: 'repeating-linear-gradient(45deg, #f496d3, #f496d3 10px, #0047c7 10px, #0047c7 20px)',
          opacity: '0.5'
        }}
      ></div>
    </div>
  );
}
