import ScrollVelocity from "@/components/scroll-velocity/ScrollVelocity";
import { useTranslations } from "next-intl";
import React from "react";

type Props = {};

const HomeTips = (props: Props) => {
  const t = useTranslations("HomeTips");
  return (
    <section
      style={{
        background: "#0039A0",
      }}

      className=" w-full  text-white  p-2 flex items-center overflow-hidden"
    >
      <ScrollVelocity
        className=" me-[80px]"
        texts={[
          t("warning"),
        ]}
      />
    </section>
  );
};

export default HomeTips;
