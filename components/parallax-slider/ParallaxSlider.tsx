
"use client";
import { swiperParallaxOptions, useParallaxSwiper } from '@/constants/swiper';
// import PortfolioWebglHeader from '@/layouts/headers/PortfolioWebglHeader';
import { useCursorAndBackground } from '@/hooks/useCursorAndBackground';
// import BackToTop from '@/components/shared/BackToTop/BackToTop';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
// import { parallaxSlideItems } from '@/data/portfolioTwoData';
// import { ArrowSvg, ButtonBlurFilter } from '@/svg';
import React, { useRef } from 'react';
import { Link } from '@/i18n/routing';

interface SlideItem {
    backgroundImage: string;
    subtitle: string;
    title: string;
    filterId: string;
}

const ParallaxSlider = () => {
    const swiperRef = useRef<SwiperRef>(null!);
    useParallaxSwiper(swiperRef);

    // Set background color & cursor
    // useCursorAndBackground({ bgColor: "#000" });

    return (
        <>
            {/* -- Begin magic cursor -- */}
            {/* <div id="magic-cursor" className="cursor-white-bg">
                <div id="ball"></div>
            </div> */}

            {/* Global Components */}
            {/* <BackToTop /> */}
            {/* <PortfolioWebglHeader /> */}
            <main>
                <section className="tp-showcase-slider">
                    <div className="tp-showcase-slider-main p-relative">
                        <Swiper ref={swiperRef} {...swiperParallaxOptions}>
                            {[1, 2, 3, 4, 5].map((slide: any, index: number) => (
                                <SwiperSlide key={index}>
                                    <div
                                        className="tp-showcase-slider-bg"
                                        style={{ backgroundImage: `url(/images/slider/zgar/${slide + 1}.jpg)` }}
                                        data-swiper-parallax="1152"
                                    >

                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* <div className="tp-showcase-slider-button-wrap">
                            <div className="swiper-button-next" tabIndex={0} role="button" aria-label="Next slide">
                                <div><span>Next Slide</span></div>
                                <div><i className="fas fa-chevron-right"></i></div>
                            </div>
                            <div className="swiper-button-prev" tabIndex={0} role="button" aria-label="Previous slide">
                                <div><i className="fas fa-chevron-left"></i></div>
                                <div><span>Prev Slide</span></div>
                            </div>
                        </div> */}

                        {/* <div className="swiper-pagination"></div> */}
                    </div>
                </section>
            </main>
        </>
    );
};

export default ParallaxSlider;