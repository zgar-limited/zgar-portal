import React from "react";
import SubmitButton from "./SubmitButton";
import { EmailIcon } from "@/svg/ContactIcons";
import { EmailIconFour, EmailIconThree, EmailIconTwo } from "@/svg";
import GradientText from "@/components/gradient-text/GradientText";
import Image from "next/image";

type Props = {};

const HomeSubscription = (props: Props) => {
  return (
    <div className="container-full bg-[black]  mt-32 flat-spacing relative ">
      {/* <Image
        className="    absolute -top-[100px] w-[375px] h-auto z-10"
        src={"/images/newsletter/pendant.png"}
        width={220}
        height={220}
        alt="zgar-newsletter"
      /> */}
      <div className="flex flex-wrap gap-y-8 items-center mx-auto text-center max-w-[1920px]">
        <GradientText
          //   className="w-full"
          animationSpeed={6}
          showBorder={false}
          colors={["#45d4fb", "#9dfbd3", "#45d4fb", "#9dfbd3", "#45d4fb"]}
        >
          <span className="h1">Receive Zgar production newsletter</span>
        </GradientText>
        <div className="flex-1">
          <div className="relative flex items-center max-w-2xl mx-auto">
            <span className="absolute inline-block ml-4 leading-1 ">
              <EmailIconThree strokeWidth="1.5" colorName="black" />
            </span>
            <input
              className="self-stretch block bg-white border-none  rounded-l-[100px] ps-[44px] pe-[24px] text-[16px] leading-1 flex-1"
              type="email"
              placeholder="Please input your Email"
            />
            <SubmitButton text="Subscription" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSubscription;
