"use client";
import DomeGallery from "@/components/dome-gallery/DomeGallery";
import ProductCard1 from "@/components/productCards/ProductCard1";
import ProductCard2 from "@/components/productCards/ProductCard2";
import TrueFocus from "@/components/true-focus/TrueFocus";
import { productsSneakers } from "@/data/products";
import { fadeAnimation } from "@/hooks/useGsapAnimation";
import { useGSAP } from "@gsap/react";
import React, { useMemo, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductGrid from "./ProductGrid";
const tabItems = ["new arrivals", "best seller", "on sale"];

export default function Products1() {
  const [activeTab, setActiveTab] = useState("new arrivals");
  const filteredProducts = useMemo(
    () =>
      productsSneakers.filter((product) =>
        product.tabFilterOptions?.includes(activeTab)
      ),
    [activeTab]
  );

  return (
    <section className="text-center  mt-[100px] flat-spacing rounded-[30px]">
      <a className="text-black h1 mb-[80px]">
        <span>🔥🔥🔥🔥</span>
        <TrueFocus
          pauseBetweenAnimations={0.5}
          sentence="Hot-selling Products"
        ></TrueFocus>
      </a>
      <ProductGrid/>
      {/* <div className=" container-full h-[900px] ">
        <DomeGallery />
      </div> */}
      
    </section>
  );
}
