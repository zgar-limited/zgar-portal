"use client";

import { Link } from '@/i18n/routing';
import { ShoppingBag, Star, ChevronRight } from "lucide-react";

/**
 * 账户导航卡片 - Vibrant Blocks 风格
 *
 * 老王我：两个大型可点击导航卡片
 * - 前往商城（蓝色）
 * - 积分兑换（粉色）
 */
export default function AccountNavCards() {
  return (
    <div className="relative overflow-hidden flex flex-col md:flex-row rounded-2xl shadow-[8px_8px_0_0_#000000]">
      {/* 左侧：前往商城卡 */}
      <Link
        href="/shop"
        className="w-full md:w-1/2 h-auto md:h-40 bg-[#0047c7] border-4 border-black relative overflow-hidden group transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0_0_#000000]"
      >
        {/* 装饰性几何元素 */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-black opacity-10"
             style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}>
        </div>

        <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-lg flex items-center justify-center shadow-[2px_2px_0_0_#FFFFFF]">
                <ShoppingBag size={16} className="text-white md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-xl font-black text-white" style={{ fontFamily: 'sans-serif' }}>
                前往商城
              </h3>
            </div>
            <ChevronRight size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 flex items-center">
            <p className="text-sm md:text-base font-bold text-white/90">
              浏览最新产品 →
            </p>
          </div>
        </div>
      </Link>

      {/* 右侧：积分兑换卡 */}
      <Link
        href="/club"
        className="w-full md:w-1/2 h-auto md:h-40 bg-[#f496d3] border-t-4 md:border-t-4 md:border-l-0 border-black border-b-4 md:border-b-4 md:border-l-4 border-black relative overflow-hidden group transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0_0_#000000]"
      >
        {/* 装饰性几何元素 */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white opacity-20 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-black opacity-10"
             style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}>
        </div>

        <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-lg flex items-center justify-center shadow-[2px_2px_0_0_#FFFFFF]">
                <Star size={16} className="text-white md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-xl font-black text-white" style={{ fontFamily: 'sans-serif' }}>
                积分兑换
              </h3>
            </div>
            <ChevronRight size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 flex items-center">
            <p className="text-sm md:text-base font-bold text-white/90">
              用积分兑换好礼 →
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
