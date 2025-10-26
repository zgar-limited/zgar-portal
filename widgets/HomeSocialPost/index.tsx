"use client";

import PhotoProviderWrapper from "@/components/shared/PhotoProviderWrapper";
import { Instagram_swiper_params } from "@/constants/swiper";
import { InstagramThree } from "@/svg/social-icons/Instagram";
import Image from "next/image";
import { PhotoView } from "react-photo-view";

import { Swiper, SwiperSlide } from "swiper/react";
import "./index.scss";
import BrandArea from "@/components/brand-area/BrandArea";
import CircularText from "@/components/circular-text/CircularText";
import TextPressure from "@/components/text-pressure/TextPressure";

export default function InstagramPosts() {
  return (
    <section className="mt-48 ">
      {/* <div className="h-[88px] "></div> */}
      <BrandArea />
      {/* <h1 className="mt-32 text-center">FLOW US</h1> */}
      <div className="mt-2 mb-16 ">
        <CircularText
          text="ZGAR*SOCIAL*MEDIA*"
          className="text-black "
          onHover="goBonkers"
        />
      </div>
      <div className="relative w-full ">
        <div className="p-0 container-fluid">
          <div className="row gx-0">
            <div className="col-xl-12">
              <PhotoProviderWrapper>
                <Swiper
                  className="ai-instagram-active"
                  {...Instagram_swiper_params}
                >
                  {[
                    {
                      id: "1",
                      image: "/images/slot/social/1.webp",
                      alt: "xxx",
                    },
                    {
                      id: "2",
                      image: "/images/slot/social/2.webp",
                      alt: "xxx",
                    },
                    {
                      id: "3",
                      image: "/images/slot/social/3.webp",
                      alt: "xxx",
                    },
                    {
                      id: "4",
                      image: "/images/slot/social/4.webp",
                      alt: "xxx",
                    },
                    {
                      id: "5",
                      image: "/images/slot/social/5.webp",
                      alt: "xxx",
                    },
                    {
                      id: "6",
                      image: "/images/slot/social/5.webp",
                      alt: "xxx",
                    },
                    {
                      id: "7",
                      image: "/images/slot/social/5.webp",
                      alt: "xxx",
                    },
                    {
                      id: "8",
                      image: "/images/slot/social/5.webp",
                      alt: "xxx",
                    },
                    {
                      id: "9",
                      image: "/images/slot/social/5.webp",
                      alt: "xxx",
                    },
                    {
                      id: "10",
                      image: "/images/slot/social/5.webp",
                      alt: "xxx",
                    },
                  ].map((post) => (
                    <SwiperSlide key={post.id}>
                      <div className="social-instagram-item">
                        <PhotoView src={post.image}>
                          <Image
                            style={{ width: "100%", height: "auto" }}
                            width={320}
                            height={320}
                            src={post.image}
                            alt={post.alt}
                          />
                        </PhotoView>
                        <div className="social-instagram-icon">
                          <InstagramThree />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </PhotoProviderWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
