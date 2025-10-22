import GradientText from "@/components/gradient-text/GradientText";
import PortfolioSlicerElegant from "@/components/portfolio-slider-elegant/PortfolioSlicerElegant";
import TextUnderline from "@/components/text-underline/TextUnderline";
import React from "react";

type Props = {};

const HomeProductCate = (props: Props) => {
  return (
    <section className="container-full">
      <GradientText
        className="relative flat-spacing"
        animationSpeed={6}
        showBorder={false}
        colors={["#45d4fb", "#9dfbd3", "#45d4fb", "#9dfbd3", "#45d4fb"]}
      >
        <a className="font-semibold h1 text-inherit">
          Zgar Amazing Products
          <span className="absolute bottom-[-1.65rem] right-[41%]">
            <TextUnderline  />
          </span>
        </a>
      </GradientText>

      <PortfolioSlicerElegant />
    </section>
  );
};

export default HomeProductCate;
