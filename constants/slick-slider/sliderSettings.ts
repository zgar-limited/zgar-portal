import { useState } from 'react';
import Slider from 'react-slick';
import { Settings } from 'react-slick';

export const useSlider = () => {
    const [nav1, setNav1] = useState<Slider | null>(null);
    const [nav2, setNav2] = useState<Slider | null>(null);

    // Main slider settings
    const MAIN_SLIDER_SETTINGS: Settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: nav2 || undefined
    };

    // Thumbnail slider settings
    const THUMB_SLIDER_SETTINGS: Settings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        asNavFor: nav1 || undefined,
        dots: false,
        arrows: false,
        focusOnSelect: true,
        verticalSwiping: true,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    };

    return {
        nav1,
        nav2,
        setNav1,
        setNav2,
        MAIN_SLIDER_SETTINGS,
        THUMB_SLIDER_SETTINGS 
    };
};