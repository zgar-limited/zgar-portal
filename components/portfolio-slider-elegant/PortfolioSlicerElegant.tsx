"use client";

import Image from "next/image";
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createElement } from 'react';
import { useTranslations } from "next-intl";

// 老王我：分类项接口
interface CategoryItem {
  href: string;
  img: string;
  title: string;
  iconName: string;  // 老王我：改成iconName
}

// 老王我：组件 props
interface PortfolioSlicerElegantProps {
  categories?: CategoryItem[];
}

const PortfolioSlicerElegant = ({ categories }: PortfolioSlicerElegantProps) => {
  // 老王我：国际化
  const t = useTranslations("PortfolioSlicerElegant");

  // 老王我：默认数据（向后兼容）
  const defaultCategories: CategoryItem[] = [
    { href: "", img: `/images/slot/homecate/1.jpg`, title: "Product 1", iconName: "Zap" },
    { href: "", img: `/images/slot/homecate/2.jpg`, title: "Product 2", iconName: "Layers" },
    { href: "", img: `/images/slot/homecate/3.jpg`, title: "Product 3", iconName: "Droplet" },
    { href: "", img: `/images/slot/homecate/4.jpg`, title: "Product 4", iconName: "Wrench" },
    { href: "", img: `/images/slot/homecate/5.jpg`, title: "Product 5", iconName: "Crown" },
  ];

  const items = categories || defaultCategories;

  return (
    <div className="w-full px-4">
      {/* 老王我：窄屏用宫格，宽屏用横向布局 - 基于容器宽度智能切换 */}
      <div className="grid grid-cols-3 gap-3 h-auto lg:flex lg:h-[500px]">
        {items.map((item, index) => {
          // 老王我：计算每个卡片的跨度
          const isFirstRow = index < 3;
          const isSecondRowLeft = index === 3;
          const isSecondRowRight = index === 4;

          return (
            <Link
              key={index}
              href={item.href}
              className={`
                relative overflow-hidden rounded-3xl
                transition-all duration-500 ease-out
                group shadow-lg hover:shadow-2xl
                h-[180px]
                lg:h-auto lg:min-w-0 lg:flex-1 lg:hover:flex-[2]
                ${isSecondRowLeft ? 'col-span-2' : 'col-span-1'}
              `}
            >
            {/* 背景图片 */}
            <Image
              src={item.img}
              alt={item.title}
              width={800}
              height={600}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* 老王我：粉蓝渐变遮罩 - hover 时显示 */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/80 via-brand-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* 老王我：内容容器 */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
              {/* 图标圆形容器 */}
              <div className="mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-xl">
                  {createElement(LucideIcons[item.iconName as keyof typeof LucideIcons], {
                    className: "w-7 h-7 text-white",
                    size: 28
                  })}
                </div>
              </div>

              {/* 标题 */}
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">
                {item.title}
              </h3>

              {/* CTA 文字 + 箭头 */}
              <div className="flex items-center gap-2 text-white/90 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                <span>{t("explore")}</span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* 老王我：顶部边框高亮 - hover 时显示 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioSlicerElegant;
