import GradientText from "@/components/gradient-text/GradientText";
import PortfolioSlicerElegant from "@/components/portfolio-slider-elegant/PortfolioSlicerElegant";
import TextUnderline from "@/components/text-underline/TextUnderline";
import React from "react";
import { useTranslations } from "next-intl";

type Props = {};

const HomeProductCate = (props: Props) => {
  const t = useTranslations("HomeProductCate");

  // 老王我：产品分类数据 - 使用Lucide图标名称
  const categories = [
    { href: "", img: `/images/slot/homecate/1.jpg`, title: t("disposable"), iconName: "Zap" },
    { href: "", img: `/images/slot/homecate/2.jpg`, title: t("pod"), iconName: "Layers" },
    { href: "", img: `/images/slot/homecate/3.jpg`, title: t("eLiquid"), iconName: "Droplet" },
    { href: "", img: `/images/slot/homecate/4.jpg`, title: t("accessories"), iconName: "Wrench" },
    { href: "", img: `/images/slot/homecate/5.jpg`, title: t("limited"), iconName: "Crown" },
  ];

  return (
    <section className="container-full py-20">
      {/* 老王我：标题区域 - 粉蓝渐变风格 */}
      <div className="text-center mb-16">
        <GradientText
          className="relative inline-block"
          animationSpeed={6}
          showBorder={false}
          colors={["#f496d3", "#0047c7", "#f496d3", "#0047c7", "#f496d3"]}
        >
          <h2 className="font-bold text-5xl md:text-6xl text-inherit">
            {t("title")}
            <span className="absolute bottom-[-0.5rem] left-1/2 transform -translate-x-1/2">
              <TextUnderline />
            </span>
          </h2>
        </GradientText>
        <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <PortfolioSlicerElegant categories={categories} />
    </section>
  );
};

export default HomeProductCate;
