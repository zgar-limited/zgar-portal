

import { useEffect } from "react";
import { Autoplay, FreeMode, Mousewheel, Navigation, Pagination, Parallax } from "swiper/modules";
import { SwiperRef } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import { Swiper as SwiperType } from 'swiper/types';

//brand slide swiper functionality 
export const brandMarqueeSwiperParams: SwiperOptions = {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 30,
  centeredSlides: true,
  allowTouchMove: false,
  speed: 12000,
  autoplay: {
    delay: 1,
    disableOnInteraction: true,
  },
  freeMode: {
    enabled: true,
    momentum: false,
  },
  modules: [Autoplay, FreeMode]
};

//testimonial slide swiper functionality 
export const TESTIMONIAL_SWIPER_PARAMS: SwiperOptions = {
  modules: [Autoplay],
  speed: 1000,
  loop: true,
  autoplay: true,
  spaceBetween: 10,
  breakpoints: {
    '1600': { slidesPerView: 4 },
    '1400': { slidesPerView: 4 },
    '1200': { slidesPerView: 2 },
    '992': { slidesPerView: 2 },
    '768': { slidesPerView: 1 },
    '576': { slidesPerView: 1 },
    '0': { slidesPerView: 1 },
  }
};

// -----instagram-slider------
export const Instagram_swiper_params: SwiperOptions = {
  modules: [Autoplay],
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  spaceBetween: 0,
  speed: 1000,
  breakpoints: {
    '1600': { slidesPerView: 6 },
    '1400': { slidesPerView: 5 },
    '1200': { slidesPerView: 4 },
    '992': { slidesPerView: 4 },
    '768': { slidesPerView: 3 },
    '576': { slidesPerView: 2 },
    '0': { slidesPerView: 1 }
  }
};

// ---- project-slider ----
export const project_swiper_params: SwiperOptions = {
  modules: [Autoplay, Navigation, Pagination],
  loop: true,
  autoplay: false,
  spaceBetween: 30,
  speed: 1000,
  breakpoints: {
    '1600': { slidesPerView: 4 },
    '1400': { slidesPerView: 4 },
    '1200': { slidesPerView: 4 },
    '992': { slidesPerView: 4 },
    '768': { slidesPerView: 3 },
    '576': { slidesPerView: 2 },
    '0': { slidesPerView: 1 },
  },
  navigation: {
    prevEl: '.it-project-prev',
    nextEl: '.it-project-next',
  },
  pagination: {
    el: ".it-project-dots",
    clickable: true,
  }
}

// ---- creative-brand-slider ----
export const creative_brand_swiper: SwiperOptions = {
  modules: [Autoplay, FreeMode],
  loop: true,
  freeMode: true,
  slidesPerView: 6,
  spaceBetween: 0,
  centeredSlides: true,
  allowTouchMove: false,
  speed: 3000,
  autoplay: {
    delay: 1,
    disableOnInteraction: true,
  },
  breakpoints: {
    '1600': { slidesPerView: 6 },
    '1400': { slidesPerView: 5 },
    '1200': { slidesPerView: 5 },
    '992': { slidesPerView: 4 },
    '768': { slidesPerView: 3 },
    '576': { slidesPerView: 3 },
    '0': { slidesPerView: 2 },
  },
}

// --- Text slider ---
export const text_swiper_params: SwiperOptions = {
  modules: [Autoplay, FreeMode],
  spaceBetween: 30,
  slidesPerView: 'auto',
  loop: true,
  autoplay: {
    delay: 1,
    disableOnInteraction: false
  },
  freeMode: true,
  speed: 4000
};

//home testimonial swiper params
export const testimonialSliderOptions: SwiperOptions = {
  modules: [Autoplay],
  loop: true,
  autoplay: false,
  spaceBetween: 0,
  speed: 1000,
  breakpoints: {
    1600: { slidesPerView: 6 },
    1400: { slidesPerView: 5 },
    1200: { slidesPerView: 4 },
    992: { slidesPerView: 4 },
    768: { slidesPerView: 3 },
    576: { slidesPerView: 1 },
    0: { slidesPerView: 1 },
  },
  a11y: { enabled: false }
}

// Function to update parallax effect in PortfolioParallaxSlider
export const useParallaxSwiper = (swiperRef: React.RefObject<SwiperRef>) => {
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper: SwiperType = swiperRef.current.swiper;

      const updateParallax = () => {
        swiper.slides.forEach((slide: HTMLElement) => {
          const bg = slide.querySelector<HTMLElement>('.tp-showcase-slider-bg');
          if (bg) {
            bg.setAttribute('data-swiper-parallax', String(0.75 * swiper.width));
          }
        });
      };

      updateParallax();
      swiper.on('resize', updateParallax);

      return () => {
        swiper.off('resize', updateParallax);
      };
    }
  }, [swiperRef]);
};
// Function to render custom bullet for pagination
const renderCustomBullet = (index: number, className: string) => {
  return `<span class="${className}">
    <svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">
      <circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF" stroke-opacity="1" stroke-width="1px"></circle> 
      <circle cx="8" cy="8" r="3" fill="#FFF"></circle>
    </svg>
  </span>`;
};
// Swiper options for parallax slider
export const swiperParallaxOptions = {
  className: "tp-showcase-slider-active",
  speed: 1500,
  modules: [Autoplay, Parallax, Mousewheel, Pagination, Navigation],
  autoplay: {
    delay: 5000,
  },
  parallax: true,
  mousewheel: false,
  loop: true,
  pagination: {
    el: '.tp-showcase-slider-main .swiper-pagination',
    clickable: true,
    renderBullet: renderCustomBullet,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  }
};

//about us team swiper params
export const teamSwiperParams = {
  modules: [Autoplay],
  slidesPerView: 5,
  loop: true,
  arrow: "false",
  spaceBetween: 30,
  speed: 8000,
  autoPlay: {
    delay: 1,
  },
  breakpoints: {
    '1600': { slidesPerView: 5 },
    '1400': { slidesPerView: 5 },
    '1200': { slidesPerView: 4 },
    '992': { slidesPerView: 4 },
    '768': { slidesPerView: 3 },
    '576': { slidesPerView: 1 },
    '0': { slidesPerView: 1 },
  },
}
//career slider swiper params
export const careerSwiperParams = {
  modules:[Autoplay],
  slidesPerView: 5,
  loop: true,
  autoplay: true,
  arrow: "false",
  spaceBetween: 30,
  speed: 5000,
  autoPlay: {
    delay: 1,
  },
  breakpoints: {
    '1400': { slidesPerView: 5 },
    '1200': { slidesPerView: 4 },
    '992': { slidesPerView: 4 },
    '768': { slidesPerView: 3 },
    '576': { slidesPerView: 2 },
    '0': { slidesPerView: 1.5 },
  },
}
