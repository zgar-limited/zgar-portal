"use client";
import { LeftArrowIcon, RightArrowIcon } from "@/svg";

import Image from "next/image";
import { Link } from '@/i18n/routing';

// Import Swiper components and modules
import { project_swiper_params } from "@/constants/swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoPlayer from "@/components/video-player/VideoPlayer";
import TextPressure from "@/components/text-pressure/TextPressure";

const HomeVideo = () => {
  return (
    <div className=" it-project-area">
      <h1 className="my-32 font-semibold text-center">🎬 Featured Videos</h1>
      <div className="text-center it-project-slider-wrap">
        <Swiper className="it-project-active " {...project_swiper_params}>
          {[
            {
              id: 38,
              title: "The Professional Theft",
              category: "Digital Art",
              image: "",
              videoUrl:
                "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
              link: "/portfolio-details-gallery-light",
            },
            {
              id: 39,
              title: "The Mastermind Heist",
              category: "Digital Art",
              image: "",
              videoUrl:
                "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
              link: "/portfolio-details-gallery-light",
            },
            {
              id: 40,
              title: "The Shadow Larcenist",
              category: "Digital Art",
              image: "",
              videoUrl:
                "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
              link: "/portfolio-details-gallery-light",
            },
            {
              id: 41,
              title: "The Shadow Larcenist",
              category: "Digital Art",
              image: "",
              videoUrl:
                "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
              link: "/portfolio-details-gallery-light",
            },
            {
              id: 42,
              title: "The Shadow Larcenist",
              category: "Digital Art",
              image: "",
              videoUrl:
                "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
              link: "/portfolio-details-gallery-light",
            },
          ].map((project) => (
            <SwiperSlide key={project.id}>
              <div className=" rounded-[30px] overflow-hidden">
                <VideoPlayer videoUrl={project.videoUrl} />
                <div
                  className="absolute top-0 bottom-0 left-0 right-0 mask rounded-[30px]"
                  style={{
                    backgroundColor: "hsla(0, 0%, 0%, 0.7)",
                  }}
                >
                  <div className="it-project-content">
                    <h4 className="it-project-title">
                      <Link className="text-white" href={project.link}>
                        {project.title}
                      </Link>
                    </h4>
                    <span>{project.category}</span>
                  </div>
                </div>

                {/* <div className="it-project-thumb fix"> */}
                {/* <Link href={project.link}>
                      <Image
                        style={{ width: "100%", height: "auto" }}
                        className="w-100"
                        src={project.image}
                        alt={project.title}
                      />
                    </Link> */}
              </div>

              {/* </div> */}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-16 it-project-arrow">
          <button className="it-project-prev">
            <span>
              <LeftArrowIcon
                width="14"
                height="14"
                viewBox="0 0 14 14"
                strokeWidth={2}
                pathValue="M13 7H1M1 7L7 1M1 7L7 13"
              />
            </span>
          </button>
          <button className="it-project-next">
            <span>
              <RightArrowIcon
                width="14"
                height="14"
                viewBox="0 0 14 14"
                strokeWidth={2}
                pathValue="M1 7H13M13 7L7 1M13 7L7 13"
              />
            </span>
          </button>
        </div>
        <div className=" it-project-dots"></div>
      </div>
    </div>
  );
};

export default HomeVideo;
