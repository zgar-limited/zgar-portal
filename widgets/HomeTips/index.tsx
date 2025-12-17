import ScrollVelocity from "@/components/scroll-velocity/ScrollVelocity";
import { useTranslations } from "next-intl";
import React from "react";

type Props = {};

const HomeTips = (props: Props) => {
  const t = useTranslations("HomeTips");
  return (
    <section
      style={{
        // background: "linear-gradient(315deg,#45d4fb, #9dfbd3, #45d4fb, #9dfbd3 )",
      }}

      className=" w-full  text-white  p-2 flex items-center bg-black overflow-hidden"
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
