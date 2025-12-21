"use client";

import { useCursorAndBackground } from "@/hooks/useCursorAndBackground";
// import { portfolioSliderElegantData } from '@/data/portfolioTwoData';

import { fadeAnimation } from "@/hooks/useGsapAnimation";
import useScrollSmooth from "@/hooks/useScrollSmooth";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Link } from '@/i18n/routing';

const PortfolioSlicerElegant = () => {
  // Initialize custom cursor and background styles
  // useCursorAndBackground({ bgColor: "#fff" });

  // Enable smooth scroll animations
  // useScrollSmooth();

  // useGSAP(() => {
  //   const timer = setTimeout(() => {
  //     fadeAnimation();
  //   }, 100);
  //   return () => clearTimeout(timer);
  // });

  return (
    <>
      {/* <div id="magic-cursor" className='cursor-white-bg'>
                <div id="ball"></div>
            </div> */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          {/* Main Content Sections */}
          <main>
            <div className=" tp-slider-elegant-area">
              <div className="tp-slider-elegant-wrapper">
                <div className="tp-slider-elegant-inner-wrap">
                  {[
                    {
                      href: "",
                      img: `/images/slot/homecate/1.jpg`,
                      title: "xx",
                    },
                    {
                      href: "",
                      img: `/images/slot/homecate/2.jpg`,
                      title: "xx",
                    },
                    {
                      href: "",
                      img: `/images/slot/homecate/3.jpg`,
                      title: "xx",
                    },
                    {
                      href: "",
                      img: `/images/slot/homecate/4.jpg`,
                      title: "xx",
                    },
                    {
                      href: "",
                      img: `/images/slot/homecate/5.jpg`,
                      title: "xx",
                    },
                    
                  ].map((item, index) => (
                    <div key={index} className=" tp-slider-elegant-item">
                      <div
                        className="tp-slider-elegant-thumb not-hide-cursor"
                        data-cursor="View<br>Demo"
                      >
                        <Link className="cursor-hide d-inline" href={item.href}>
                          <Image className=" rounded-[32px] object-fit-cover" width={1600} height={1300} src={item.img} alt={item.title} />
                        </Link>
                      </div>
                      {/* <div className="tp-slider-elegant-content">
                        <h4 className="tp-slider-elegant-title">
                          <Link href={item.href}>{item.title}</Link>
                        </h4>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default PortfolioSlicerElegant;
