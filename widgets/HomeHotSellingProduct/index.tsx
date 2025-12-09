"use client";
import TrueFocus from "@/components/true-focus/TrueFocus";

import { useMemo, useState } from "react";
import ProductGrid from "./ProductGrid";
const tabItems = ["new arrivals", "best seller", "on sale"];

export default function Products1() {
  const [activeTab, setActiveTab] = useState("new arrivals");
  
  return (
    <section className="">
      <a className="w-full mx-auto my-32 text-center text-black h1">
        <span>🔥🔥🔥🔥</span>
        <TrueFocus
          pauseBetweenAnimations={0.5}
          sentence="Hot-selling Products"
        ></TrueFocus>
      </a>
      <ProductGrid />
      
    </section>
  );
}
