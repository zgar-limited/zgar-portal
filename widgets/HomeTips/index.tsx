import ScrollVelocity from "@/components/scroll-velocity/ScrollVelocity";
import React from "react";

type Props = {};

const HomeTips = (props: Props) => {
  return (
    <section
      style={{
        // background: "linear-gradient(315deg,#45d4fb, #9dfbd3, #45d4fb, #9dfbd3 )",
      }}

      className=" w-full  text-[#fff]  p-2 flex items-center bg-black"
    >
      <ScrollVelocity
        className=" me-[80px]"
        texts={[
          "WARNING: This product contains nicotine. Nicotine is an addictivechemical",
        ]}
      />
    </section>
  );
};

export default HomeTips;
