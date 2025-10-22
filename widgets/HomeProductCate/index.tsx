import GradientText from "@/components/gradient-text/GradientText";
import PortfolioSlicerElegant from "@/components/portfolio-slider-elegant/PortfolioSlicerElegant";
import React from "react";

type Props = {};

const HomeProductCate = (props: Props) => {
  return (
    <section className="container-full">
      <GradientText
        colors={["#45d4fb", "#9dfbd3", "#45d4fb", "#9dfbd3", "#45d4fb"]}
      >
        <a className="font-semibold h1 flat-spacing text-inherit">Zgar Amazing Products </a>
      </GradientText>
      <PortfolioSlicerElegant />
    </section>
  );
};

export default HomeProductCate;
