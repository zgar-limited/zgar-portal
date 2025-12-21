// "use client";
import Aurora from "@/components/aurora/Aurora";
import BreathingImage from "@/components/breathing-image/BreathingImage";
import DotGrid from "@/components/dot-grid/DotGrid";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

import { ArrowFour } from "@/svg";
import { Link } from '@/i18n/routing';
import "./index.scss"


type Props = {};

const HomeAboutUs = (props: Props) => {
  return (
    <div className="relative  aspect-5/2 mt-16  max-w-[1920px] mx-auto ">
      <div className="container row">
        <div className="col-lg-6">
          <div className="relative dgm-about-thumb-wrap">
            <Image
              className="tp_fade_anim"
              data-delay=".3"
              data-fade-from="left"
              src={"/images/slot/social/1.webp"}
              alt="about-image"
              width={430}
              height={500}
            />
            <Image
              className="dgm-about-thumb-1 tp_fade_anim"
              data-speed="1.1"
              data-delay=".5"
              width={320}
              height={320}
              src={"/images/slot/social/2.webp"}
              alt="about-image"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-30 col-lg-6">
          <a className="font-semibold h1 ">ABOUT US</a>
          <p className="font-light h4">
            We provide digital experience services to start up and small
            businesses. We help our clients succeed by creating brand
            identities, digital experiences, and print materials. Install any
            demo, plugin or template in a matter of seconds.
          </p>
          <div className=" tp_fade_anim" data-delay=".5">
            <Link
              className="tp-btn-primary solid btn-60 mb-50 "
              href="/about-us-light"
            >
              <span>
                <span className="text-1">More about Zgar</span>
                <span className="text-2">More about Zgar</span>
              </span>
              <i>
                <ArrowFour />
                <ArrowFour />
              </i>
            </Link>
          </div>
        </div>
      </div>

      <BreathingImage
        animation={{ duration: 2 }}
        className="absolute top-[-15%] left-[-5%] w-[30%] max-w-[400px] "
        src={"/images/production/transparent/A-1.webp"}
        width={100}
        height={100}
        alt="production"
      />
      <BreathingImage
        animation={{ duration: 1.5 }}
        className="absolute top-[-15%] right-0 w-[25%] max-w-[400px] "
        src={"/images/production/transparent/Nex_2_0003.webp"}
        width={100}
        height={100}
        alt="production"
      />
      <BreathingImage
        animation={{ duration: 2.5 }}
        className="absolute bottom-[-100px] right-[5%] w-[25%] max-w-[400px] "
        src={"/images/production/transparent/zenith_10_0003.webp"}
        width={100}
        height={100}
        alt="production"
      />
      <BreathingImage
        animation={{ duration: 1.8 }}
        className="absolute bottom-[-100px] left-[0%] w-[25%] max-w-[400px]"
        src={"/images/production/transparent/PULSE_4000_9_0009.webp"}
        width={100}
        height={100}
        alt="production"
      />
    </div>
  );
};

export default HomeAboutUs;
