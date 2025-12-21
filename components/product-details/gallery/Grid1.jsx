"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";

import { useEffect, useRef, useCallback } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Drift from "drift-zoom";
import { defaultImages } from "@/data/singleProductSlides";

export default function Grid1({
  activeColor = "blue",
  setActiveColor = () => {},
  images = defaultImages,
}) {
  const lightboxRef = useRef(null);
  const observerRef = useRef(null);

  // Zoom setup for desktop
  useEffect(() => {
    if (window.innerWidth < 1200) return;

    const driftAll = document.querySelectorAll(".tf-image-zoom3");
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

    const handleMouseOver = (e) => {
      const parent = e.target.closest(".section-image-zoom");
      if (parent) parent.classList.add("zoom-active");
    };

    const handleMouseLeave = (e) => {
      const parent = e.target.closest(".section-image-zoom");
      if (parent) parent.classList.remove("zoom-active");
    };

    driftAll.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      driftAll.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  // Photoswipe setup
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-swiper-started3",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => lightbox.destroy();
  }, []);

  // Scroll to active color image
  const scrollToTarget = useCallback(() => {
    const currentScroll = window.scrollY;
    const target = document.querySelector(`[data-scroll='${activeColor}']`);
    if (!target) return;

    setTimeout(() => {
      if (window.scrollY === currentScroll) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  }, [activeColor]);

  useEffect(() => {
    scrollToTarget();
  }, [scrollToTarget]);

  // Color tracking via intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const color = entry.target.getAttribute("data-scroll");
            if (color) setActiveColor(color);
          }
        });
      },
      { rootMargin: "-50% 0px" }
    );

    const elements = document.querySelectorAll(".item-scroll-target");
    elements.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [setActiveColor]);

  return (
    <div className="flat-wrap-media-product w-100">
      <div
        dir="ltr"
        className="swiper tf-product-media-main"
        id="gallery-swiper-started3"
      >
        <div className="swiper-wrapper">
          {images.map((item) => (
            <div
              className="swiper-slide item-scroll-target"
              data-scroll={item.color}
              key={item.id}
            >
              <a
                href={item.src}
                target="_blank"
                className="item"
                data-pswp-width={`${item.width}px`}
                data-pswp-height={`${item.height}px`}
              >
                <Image
                  className="tf-image-zoom3 lazyload"
                  data-zoom={item.src}
                  data-src={item.src}
                  src={item.src}
                  alt=""
                  width={item.width}
                  height={item.height}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Grid1 Component
 *
 * Renders a vertically scrollable image grid for product galleries.
 * Integrates zoom-on-hover via Drift and lightbox functionality via PhotoSwipe.
 * Tracks scroll and color selection via IntersectionObserver.
 *
 * ---------------------------
 * ✅ Props:
 * ---------------------------
 * @param {string} activeColor - The currently selected product color (default: "blue").
 *        Used to auto-scroll to the corresponding image and sync state.
 *
 * @param {function} setActiveColor - Callback to update the active color.
 *        Triggered when an image scrolls into view via IntersectionObserver.
 *
 * @param {Array} images - Array of image objects to render as scrollable slides.
 *        Each item should include:
 *        ├─ id: unique identifier
 *        ├─ src: image URL
 *        ├─ width: number (image width)
 *        ├─ height: number (image height)
 *        ├─ color: string (variant color for scroll tracking)
 *        Defaults to `defaultImages` from local data.
 *
 * ---------------------------
 * 🧩 Features & Behavior:
 * ---------------------------
 * - Renders a vertical grid of images (`swiper-wrapper`) using plain HTML.
 * - Each image slide is a clickable anchor (`<a>`) that opens PhotoSwipe lightbox.
 * - Uses Drift.js to add zoom-on-hover behavior on desktop (>=1200px width).
 * - Smoothly scrolls to the image matching `activeColor` on mount/update.
 * - Uses IntersectionObserver to update `activeColor` when images enter view.
 * - Automatically destroys all observers and lightbox on component unmount.
 *
 * ---------------------------
 * 🛠️ Notes:
 * ---------------------------
 * - Works best when used in grid-based layouts (`mediaLayout: "grid-1"`, etc.).
 * - Lightbox is triggered on anchor click and supports full-size zoomed view.
 * - Make sure all `images` have valid `color` keys for scroll syncing.
 */
