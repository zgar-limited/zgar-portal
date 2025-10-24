import React from "react";
import SubmitButton from "./SubmitButton";
import { EmailIcon } from "@/svg/ContactIcons";
import { EmailIconFour, EmailIconThree, EmailIconTwo } from "@/svg";
import GradientText from "@/components/gradient-text/GradientText";
import Image from "next/image";

type Props = {};

const HomeSubscription = (props: Props) => {
  return (
    <div className="container-full bg-[black]  mt-[48px] flat-spacing relative">
      <Image
        className="absolute -top-[100px]"
        src={"/images/newsletter/pendant.png"}
        width={220}
        height={220}
        alt="zgar-newsletter"
      />
      <p className=" col-4">
        <GradientText
          animationSpeed={6}
          showBorder={false}
          colors={["#45d4fb", "#9dfbd3", "#45d4fb", "#9dfbd3", "#45d4fb"]}
        >
          <span className=" h1">
            Receive Zgar production newsletter first time
          </span>
        </GradientText>
      </p>
      <div className="relative flex items-center col-4 ">
        <span className="absolute left-[16px] inline-block leading-1 ">
          <EmailIconThree strokeWidth="1.5" colorName="black" />
        </span>
        <input
          className="self-stretch block bg-white border-none  rounded-l-[100px] ps-[44px] text-[16px] leading-1 flex-1"
          type="email"
        />

        <SubmitButton text="Subscription" />
      </div>
    </div>
  );
};

export default HomeSubscription;
