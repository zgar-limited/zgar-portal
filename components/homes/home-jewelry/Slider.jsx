"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import PhotoSwipeLightbox from "photoswipe/lightbox";

import Drift from "drift-zoom";
import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
export default function Slider({
  activeColor = "gold",
  setActiveColor = () => {},
}) {
  const previewImages = [
    "/images/products/jewelry/thumb-1.jpg",
    "/images/products/jewelry/thumb-2.jpg",
    "/images/products/jewelry/thumb-3.jpg",
    "/images/products/jewelry/thumb-4.jpg",
  ];

  const slideItems = [
    {
      id: 1,
      color: "gold",
      src: "/images/products/jewelry/product-21.jpg",
    },
    {
      id: 2,
      color: "titanium",
      src: "/images/products/jewelry/product-22.jpg",
    },
    {
      id: 3,
      color: "rose",
      src: "/images/products/jewelry/thumb-3.jpg",
    },
    {
      id: 4,
      color: "gold",
      src: "/images/products/jewelry/thumb-4.jpg",
    },
  ];
  const [thumbSwiper, setThumbSwiper] = useState(null);

  const swiperRef = useRef(null);
  const lightboxRef = useRef(null);

  useEffect(() => {
    const checkWindowSize = () => window.innerWidth >= 1200;

    if (!checkWindowSize()) return;

    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: 0,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
    };

    imageZoom();

    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const target = event.target;
      const parent = target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const target = event.target;
      const parent = target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-swiper-started",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
    };
  }, []);

  useEffect(() => {
    const target = slideItems.find((elm) => elm.color === activeColor);
    if (target && swiperRef.current) {
      swiperRef.current.slideTo((target.id ?? 1) - 1);
    }
  }, [activeColor]);

  useEffect(() => {
    setTimeout(() => {
      const target = slideItems.find((elm) => elm.color === activeColor);
      if (swiperRef.current && target) {
        swiperRef.current.slideTo(1);
        swiperRef.current.slideTo((target.id ?? 1) - 1);
      }
    });
  }, []);
  return (
    <>
      <Swiper
        dir="ltr"
        className="swiper tf-product-media-thumbs other-image-zoom"
        {...{
          spaceBetween: 8,
          slidesPerView: 4.7,
          freeMode: true,

          watchSlidesProgress: true,
          observer: true,
          observeParents: true,

          breakpoints: {
            0: {
              direction: "horizontal",
              slidesPerView: 5,
            },
            1200: {
              direction: "vertical",
              slidesPerView: 4.7,
            },
          },
        }}
        modules={[Thumbs, FreeMode]}
        onSwiper={setThumbSwiper}
      >
        {previewImages.map((src, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide stagger-item"
            data-size="XS"
            data-color="blue"
          >
            <div className="item">
              <Image
                className="lazyload"
                src={src}
                alt="img-product"
                width={696}
                height={800}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flat-wrap-media-product">
        <Swiper
          dir="ltr"
          className="swiper tf-product-media-main"
          id="gallery-swiper-started"
          modules={[Thumbs]}
          thumbs={{ swiper: thumbSwiper }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            if (slideItems[swiper.activeIndex]) {
              setActiveColor(slideItems[swiper.activeIndex]?.color);
            }
          }}
        >
          {slideItems.map((image, index) => (
            <SwiperSlide
              key={index}
              className="swiper-slide"
              data-color={image.color}
            >
              <a
                href={image.src}
                target="_blank"
                className="item"
                data-pswp-width="696px"
                data-pswp-height="800px"
              >
                <Image
                  className="tf-image-zoom lazyload"
                  data-zoom={image.src}
                  data-src={image.src}
                  alt=""
                  src={image.src}
                  width={696}
                  height={800}
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
