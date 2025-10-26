// "use client";
import Aurora from "@/components/aurora/Aurora";
import BreathingImage from "@/components/breathing-image/BreathingImage";
import DotGrid from "@/components/dot-grid/DotGrid";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

type Props = {};

const HomeAboutUs = (props: Props) => {
  return (
    <div className="relative  aspect-[5/2] mt-16  bg-black">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      {/* <DotGrid
        className="bg-black container-full"
        dotSize={2}
        gap={10}
        baseColor="#fff"
        activeColor="#45d4fb"
        proximity={120}
        shockRadius={250}
        shockStrength={1}
        resistance={750}
        returnDuration={1.5}
      ></DotGrid> */}
      <section className="absolute top-0 bottom-0 left-0 right-0 ">
        <a className="absolute font-semibold text-white start-50 top-20 translate-middle h1">
          About Us
        </a>
        <BreathingImage
          animation={{ duration: 2 }}
          className="absolute top-0 left-0 w-[400px]"
          src={"/images/production/transparent/A-1.webp"}
          width={100}
          height={100}
          alt="production"
        />
        <BreathingImage
          animation={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-[400px]"
          src={"/images/production/transparent/Nex_2_0003.webp"}
          width={100}
          height={100}
          alt="production"
        />
        <BreathingImage
          animation={{ duration: 2.5 }}
          className="absolute bottom-[-100px] right-0 w-[400px]"
          src={"/images/production/transparent/zenith_10_0003.webp"}
          width={100}
          height={100}
          alt="production"
        />
        <BreathingImage
          animation={{ duration: 1.8 }}
          className="absolute bottom-[-100px] left-[40px] w-[400px]"
          src={"/images/production/transparent/PULSE_4000_9_0009.webp"}
          width={100}
          height={100}
          alt="production"
        />
      </section>
    </div>
  );
};

export default HomeAboutUs;
