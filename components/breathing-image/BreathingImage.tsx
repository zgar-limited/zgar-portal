"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image, { ImageProps } from "next/image";
import React, { useRef } from "react";

type Props = { animation?: { duration?: number } } & ImageProps;

const BreathingImage = (props: Props) => {
  const imageRef = useRef(null);
  const tween = useGSAP(() => {
    gsap.to(imageRef.current, {
      y: -25,
      duration: props.animation?.duration ?? 1,
      repeat: -1, // 无限重复
      yoyo: true, // 播放到结尾后再反向播放回来
      ease: "power1.inOut",
    });
  });
  
  return <Image ref={imageRef} {...props} />;
};

export default BreathingImage;
