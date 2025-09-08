"use client";

import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [scrollY, setScrollY] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const progressAngle = (scrollPercent / 100) * 360;

      setScrollY(scrollTop);
      setCurrentAngle(progressAngle);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button
      id="goTop"
      onClick={scrollToTop}
      className={scrollY > 200 ? "show" : ""}
    >
      <span
        className="border-progress"
        style={{ "--progress-angle": `${currentAngle}deg` }}
      />
      <span className="icon icon-caret-up" />
    </button>
  );
}
