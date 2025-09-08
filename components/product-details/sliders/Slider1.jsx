"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Drift from "drift-zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import { defaultImages } from "@/data/singleProductSlides";

export default function Slider1({
  activeColor = "Black",
  setActiveColor = () => {},
  firstItem,
  slideItems = defaultImages,
  sliderThumbPosition = "left",
}) {
  const [thumbSwiper, setThumbSwiper] = useState(null);
  const swiperRef = useRef(null);
  const lightboxRef = useRef(null);

  // Replace first image if `firstItem` is provided
  if (firstItem) {
    slideItems[0].src = firstItem;
  }

  // Setup Drift zoom (desktop only)
  useEffect(() => {
    if (window.innerWidth < 1200) return;

    const pane = document.querySelector(".tf-zoom-main");
    const images = document.querySelectorAll(".tf-image-zoom");

    images.forEach((img) => {
      new Drift(img, {
        zoomFactor: 2,
        paneContainer: pane,
        inlinePane: 0,
        handleTouch: false,
        hoverBoundingBox: true,
        containInline: true,
      });

      const parent = img.closest(".section-image-zoom");
      if (parent) {
        img.addEventListener("mouseover", () =>
          parent.classList.add("zoom-active")
        );
        img.addEventListener("mouseleave", () =>
          parent.classList.remove("zoom-active")
        );
      }
    });

    return () => {
      images.forEach((img) => {
        const parent = img.closest(".section-image-zoom");
        if (parent) {
          img.removeEventListener("mouseover", () =>
            parent.classList.add("zoom-active")
          );
          img.removeEventListener("mouseleave", () =>
            parent.classList.remove("zoom-active")
          );
        }
      });
    };
  }, []);

  // Setup PhotoSwipe
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-swiper-started",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => lightbox.destroy();
  }, []);

  // Slide to active color on color change
  useEffect(() => {
    const index = slideItems.findIndex((item) => item.color === activeColor);
    if (swiperRef.current && index !== -1) {
      swiperRef.current.slideTo(index);
    }
  }, [activeColor, slideItems]);

  const isRight = sliderThumbPosition === "right";
  const isBottom = sliderThumbPosition === "bottom";

  return (
    <>
      {/* Thumbnail Slider */}
      <Swiper
        className={`swiper tf-product-media-thumbs other-image-zoom ${
          isRight ? "order-2" : ""
        }`}
        spaceBetween={8}
        slidesPerView={4.7}
        freeMode
        watchSlidesProgress
        observer
        observeParents
        breakpoints={{
          0: { direction: "horizontal", slidesPerView: 5 },
          1200: {
            direction: isBottom ? "horizontal" : "vertical",
            slidesPerView: 4.7,
          },
        }}
        modules={[Thumbs, FreeMode]}
        onSwiper={setThumbSwiper}
      >
        {slideItems.map((slide, index) => (
          <SwiperSlide
            key={index}
            data-size={slide.size}
            data-color={slide.color}
          >
            <div className={`item ${slide.video ? "wrap-btn-viewer" : ""}`}>
              {slide.video && <i className="icon icon-video" />}
              <Image
                className="lazyload"
                data-src={slide.src}
                src={slide.src}
                alt="Product Thumbnail"
                width={slide.width}
                height={slide.height}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Main Product Slider */}
      <div className={`flat-wrap-media-product ${isRight ? "order-1" : ""}`}>
        <Swiper
          className="swiper tf-product-media-main"
          id="gallery-swiper-started"
          modules={[Thumbs]}
          thumbs={{ swiper: thumbSwiper }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            const item = slideItems[swiper.activeIndex];
            if (item) setActiveColor(item.color);
          }}
        >
          {slideItems.map((slide, index) => (
            <SwiperSlide
              key={index}
              data-size={slide.size}
              data-color={slide.color}
            >
              <a
                href={slide.src}
                target="_blank"
                className={`item ${
                  slide.outOfStock ? "position-relative" : ""
                }`}
                data-pswp-width={slide.width}
                data-pswp-height={slide.height}
              >
                {slide.video ? (
                  <video
                    playsInline
                    autoPlay
                    preload="metadata"
                    muted
                    controls
                    loop
                    src={slide.video}
                  />
                ) : (
                  <Image
                    className="tf-image-zoom lazyload"
                    data-zoom={slide.src}
                    data-src={slide.src}
                    src={slide.src}
                    alt={`Product ${slide.color}`}
                    width={952}
                    height={1512}
                  />
                )}

                {slide.outOfStock && (
                  <div className="sold-out-wrap">
                    <h4 className="text fw-6 text-primary">
                      SOLD <br /> OUT
                    </h4>
                  </div>
                )}
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

/**
 * Slider1 Component
 *
 * Renders the main product image slider with synchronized thumbnail Swiper,
 * zoom-on-hover using Drift, and image lightbox with PhotoSwipe.
 *
 * ---------------------------
 * ✅ Props:
 * ---------------------------
 * @param {string} activeColor - Currently active color (e.g., "Red", "Blue", etc.)
 *        Used to sync slider with product color variant.
 *
 * @param {function} setActiveColor - Callback to update active color on slide change.
 *        Triggered on Swiper slide change.
 *
 * @param {string} firstItem - Optional override for the first image slide source.
 *        If provided, it replaces the first slide image.
 *
 * @param {Array} slideItems - Array of product media objects (images/videos) to display.
 *        Each item should include:
 *        ├─ src: string (image or video URL)
 *        ├─ color: string (variant color)
 *        ├─ size: string (e.g., "S", "M")
 *        ├─ width, height: number (dimensions)
 *        ├─ video?: string (optional video source)
 *        ├─ outOfStock?: boolean (optional stock badge toggle)
 *        Defaults to `defaultImages` if not passed.
 *
 * @param {string} sliderThumbPosition - Determines orientation of thumbnail swiper.
 *        Options:
 *        ├─ 'left' (default)
 *        ├─ 'right'
 *        ├─ 'bottom'
 *
 * ---------------------------
 * 🧩 Features & Integration:
 * ---------------------------
 * - Uses SwiperJS (`Swiper`, `SwiperSlide`) for both thumbnails and main media.
 * - Uses Drift.js for zoom-on-hover effect (desktop only).
 * - Uses PhotoSwipe for lightbox gallery opening on image click.
 * - Dynamically repositions Swipers based on `sliderThumbPosition`.
 * - Automatically selects slide matching `activeColor`.
 * - Swiper thumb and main sliders are synced using Swiper's Thumbs module.
 * - Videos are embedded and playable in the main slider if `slide.video` exists.
 * - Handles out-of-stock badges overlay via `slide.outOfStock`.
 *
 * ---------------------------
 * 🛠️ Notes:
 * ---------------------------
 * - Drift zoom only works on viewport width >= 1200.
 * - PhotoSwipe auto-inits on mount and destroys on unmount.
 * - You must provide `slideItems` formatted consistently with `defaultImages`.
 */
