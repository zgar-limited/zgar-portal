"use client";

import { ChevronUp, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 老王我：监听滚动，超过300px显示按钮
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 老王我：平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="group fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-brand-pink to-brand-blue text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
          aria-label="回到顶部"
        >
          {/* 老王我：向上箭头图标 */}
          <ArrowUp
            className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
          />

          {/* 老王我：可选的进度指示器（环形） */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 56 56"
          >
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
            />
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="163.36"
              strokeDashoffset="40.84"
              className="opacity-50"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default BackToTop;
