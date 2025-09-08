"use client";
import Link from "next/link";
import Image from "next/image";

import { useEffect, useRef } from "react";

import PhotoSwipeLightbox from "photoswipe/lightbox";

import Drift from "drift-zoom";
const jewelryProducts = [
  {
    src: "/images/products/jewelry/product-1.jpg",
    size: "XS",
    color: "blue",
  },
  {
    src: "/images/products/jewelry/product-1.jpg",
    size: "S",
    color: "blue",
  },
  {
    src: "/images/products/jewelry/product-2.jpg",
    size: "S",
    color: "blue",
  },
  {
    src: "/images/products/jewelry/product-3.jpg",
    size: "M",
    color: "blue",
  },
  {
    src: "/images/products/jewelry/product-4.jpg",
    size: "L",
    color: "blue",
  },
];

export default function Gallery1() {
  useEffect(() => {
    const checkWindowSize = () => window.innerWidth >= 1200;

    if (!checkWindowSize()) return;

    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom2");
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

    const zoomElements = document.querySelectorAll(".tf-image-zoom2");

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
  const lightboxRef = useRef(null);
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-swiper-started2",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
    };
  }, []);
  return (
    <div className="product-thumbs-slider d-none d-md-block">
      <div className="flat-wrap-media-product w-100">
        <div
          dir="ltr"
          className="swiper tf-product-media-main"
          id="gallery-swiper-started2"
        >
          <div className="swiper-wrapper">
            {jewelryProducts.map((item, index) => (
              <div key={index} className="swiper-slide item-scroll-target">
                <a
                  href={item.src}
                  target="_blank"
                  className="item"
                  data-pswp-width="860px"
                  data-pswp-height="1146px"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="tf-image-zoom2 lazyload"
                    data-zoom={item.src}
                    data-src={item.src}
                    alt="img-product"
                    src={item.src}
                    width={740}
                    height={740}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
