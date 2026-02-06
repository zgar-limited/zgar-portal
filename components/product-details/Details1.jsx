"use client";

import React, { useState, useCallback } from "react";

// Media
import Slider1 from "./sliders/Slider1";
import Grid1 from "./gallery/Grid1";

// Variant Selectors
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import CustomSelect from "./CustomSelect";
import VarientSelector2 from "./VarientSelector2";
import VarientSelector3 from "./VarientSelector3";
import VarientSelector4 from "./VarientSelector4";
import VarientSelector5 from "./VarientSelector5";

// Add-ons
import CountdownTimer from "../common/Countdown";
import GroupedProducts from "./GroupedProducts";
import BuXGetY from "./BuXGetY";
import BoughtTogether from "./BoughtTogether";
import PurchasedTogether from "./PurchasedTogether";
import AvailableProgress from "./AvailableProgress";



// Static Info
import ProductActionPanel from "./ProductActionPanel";
import ExptaLink from "./ExptaLink";
import DeliveryPolicy from "./DeliveryPolicy";
import PaymentMethods from "./PaymentMethods";
import ProductSkuCategories from "./ProductSkuCategories";
import {
  defaultImagesForAvailableSlides,
  defaultImagesWithVideo,
} from "@/data/singleProductSlides";

export default function Details1({
  sliderThumbPosition = "left",
  productMetaStyleSimple = false,
  features = ["varientPicker"],
  mediaLayout = "slider",
  product,
}) {
  const [activeColor, setActiveColor] = useState("blue");

  const hasFeature = useCallback((key) => features.includes(key), [features]);

  return (
    <section className="flat-single-product flat-spacing-3">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* Media */}
            <div className="col-md-6">{renderMedia()}</div>

            {/* Info */}
            <div className="col-md-6">
              <div
                className={`tf-product-info-wrap position-relative ${
                  ["grid-1", "grid-2", "grid-stacked"].includes(mediaLayout)
                    ? "sticky-top"
                    : ""
                }`}
              >
                <div className="tf-zoom-main sticky-top" />
                <div className="tf-product-info-list other-image-zoom">
                  {hasFeature("brand-name") && (
                    <div className="tf-product-info-brand">
                      <span className="text-large">Brand:</span>
                      <a href="#" className="h6 text-primary">
                        Themesflat
                      </a>
                    </div>
                  )}

                  <h2 className="product-info-name">{product.title}</h2>

                  {productMetaStyleSimple ? (
                    <SimpleMetaBlock />
                  ) : (
                    <>
                      <DefaultMetaBlock />
                      <div className="tf-product-heading">
                        <PriceBlock />
                        {hasFeature("countdown-style-1") && CountdownBlock(1)}
                      </div>
                      <LiveViewBlock />
                    </>
                  )}

                  {hasFeature("countdown-style-2") && CountdownBlock(2)}
                  {hasFeature("available-progressbar") && <AvailableProgress />}
                  {hasFeature("varientPicker") && <VariantPicker />}
                  {hasFeature("varient-picker-dropdown") && (
                    <VarientSelector2
                      selectedColor={activeColor}
                      setSelectedColor={setActiveColor}
                    />
                  )}
                  {hasFeature("varient-picker-dropdown-color") && (
                    <VarientSelector5
                      selectedColor={activeColor}
                      setSelectedColor={setActiveColor}
                    />
                  )}
                  {hasFeature("varient-picker-image") && (
                    <VarientSelector4
                      selectedColor={activeColor}
                      setSelectedColor={setActiveColor}
                    />
                  )}
                  {hasFeature("varient-picker-image-square") && (
                    <VarientSelector3
                      selectedColor={activeColor}
                      setSelectedColor={setActiveColor}
                    />
                  )}
                  {hasFeature("varientPickerWithCustom") && <CustomSelect />}
                  {hasFeature("groupProduct") && <GroupedProducts />}

                  <ProductActionPanel product={product} />
                  <ExptaLink />

                  {hasFeature("buy-x-get-y") && <BuXGetY />}

                  
                  {hasFeature("bought-together") && <BoughtTogether />}
                  {hasFeature("purchased-together") && <PurchasedTogether />}

                  <DeliveryPolicy />
                  <PaymentMethods />
                  <ProductSkuCategories />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ----- Utility Render Functions -----

  function renderMedia() {
    const slider = (
      <Slider1
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        sliderThumbPosition={sliderThumbPosition}
        firstItem={product.imgSrc}
      />
    );
    const sliderVideo = (
      <Slider1
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        sliderThumbPosition={sliderThumbPosition}
        slideItems={defaultImagesWithVideo}
        firstItem={product.imgSrc}
      />
    );
    const availableSlider = (
      <Slider1
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        sliderThumbPosition={sliderThumbPosition}
        slideItems={defaultImagesForAvailableSlides}
        // firstItem={product.imgSrc}
      />
    );
    const grid = (
      <Grid1 activeColor={activeColor} setActiveColor={setActiveColor} />
    );

    const baseSlider = (
      <div
        className={`product-thumbs-slider ${
          sliderThumbPosition === "bottom" ? "thumbs-bottom" : ""
        }`}
      >
        {slider}
      </div>
    );

    const gridWrap = (additionalClass = "") => (
      <div
        className={`tf-product-media-wrap sticky-top wrapper-gallery-scroll product-grid-img ${additionalClass} d-none d-md-block`}
      >
        <div className="product-thumbs-slider">{grid}</div>
      </div>
    );

    return (
      {
        slider: (
          <div className="tf-product-media-wrap sticky-top">{baseSlider}</div>
        ),
        "slider-with-video": (
          <div className="tf-product-media-wrap sticky-top">
            <div className="product-thumbs-slider">{sliderVideo}</div>{" "}
          </div>
        ),
        "available-slider": (
          <div className="tf-product-media-wrap sticky-top">
            <div className="product-thumbs-slider">{availableSlider}</div>{" "}
          </div>
        ),
        "grid-1": (
          <>
            <div className="tf-product-media-wrap sticky-top d-md-none">
              {baseSlider}
            </div>
            {gridWrap()}
          </>
        ),
        "grid-2": (
          <>
            <div className="tf-product-media-wrap sticky-top d-md-none">
              {baseSlider}
            </div>
            {gridWrap("product-grid-img2")}
          </>
        ),
        "grid-stacked": (
          <>
            <div className="tf-product-media-wrap sticky-top d-md-none">
              {baseSlider}
            </div>
            {gridWrap("product-grid-stacked")}
          </>
        ),
        carousel: (
          <div className="custom-carousel">Carousel Component Here</div>
        ),
      }[mediaLayout] || null
    );
  }

  function PriceBlock() {
    return (
      <div className="product-info-price price-wrap">
        <span className="price-new price-on-sale h2 fw-4">
          $ {product.price.toFixed(2)}
        </span>
        {product.oldPrice ? (
          <span className="price-old compare-at-price h6">
            $ {product.oldPrice.toFixed(2)}
          </span>
        ) : (
          ""
        )}
        <p className="badges-on-sale h6 fw-semibold">
          <span className="number-sale" data-person-sale={29}>
            -29 %
          </span>
        </p>
      </div>
    );
  }

  function CountdownBlock(style) {
    return (
      <div
        className={`tf-product-info-countdown ${style === 2 ? "type-box" : ""}`}
      >
        <div className="countdown-title">
          <h5>Hurry up</h5>
          <p className="text-main">offer ends in:</p>
        </div>
        <div className="tf-countdown style-1">
          <CountdownTimer style={2} />
        </div>
      </div>
    );
  }

  function LiveViewBlock() {
    return (
      <div className="tf-product-info-liveview">
        <div className="liveview-count">
          <i className="icon icon-view" />
          <span className="count fw-6 h6">23</span>
        </div>
        <p className="fw-6 h6">People are viewing this right now</p>
      </div>
    );
  }

  function VariantPicker() {
    return (
      <div className="tf-product-variant">
        <div className="variant-picker-item variant-size">
          <SizeSelector />
        </div>
        <div className="variant-picker-item variant-color">
          <div className="variant-picker-label">
            <div className="h4 fw-semibold">
              Colors{" "}
              <span className="variant-picker-label-value value-currentColor">
                {activeColor}
              </span>
            </div>{" "}
          </div>
          <div className="variant-picker-values">
            <ColorSelector
              setActiveColor={setActiveColor}
              activeColor={activeColor}
            />
          </div>
        </div>
      </div>
    );
  }

  function SimpleMetaBlock() {
    return (
      <div className="pt-0 tf-product-heading justify-content-start align-items-center border-top-0">
        <PriceBlock />
        <div className="mb-0 tf-product-info-liveview">
          <div className="liveview-count size-40">
            <span className="count fw-6 h6">23</span>
          </div>
          <p className="fw-6 h6">People are viewing this right now</p>
        </div>
      </div>
    );
  }

  function DefaultMetaBlock() {
    return (
      <div className="product-info-meta">
        <div className="gap-4 rating d-flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width={14} height={14} viewBox="0 0 14 14" fill="none">
              <path
                d="M14 5.4091L8.913 5.07466L6.99721 0.261719L5.08143 5.07466L0 5.4091L3.89741 8.7184L2.61849 13.7384L6.99721 10.9707L11.376 13.7384L10.097 8.7184L14 5.4091Z"
                fill="#EF9122"
              />
            </svg>
          ))}
          <div className="reviews text-main">(3,671 reviews)</div>
        </div>
        <div className="people-add text-primary">
          <i className="icon icon-shopping-cart-simple" />
          <span className="h6">
            9 people just added this product to their cart
          </span>
        </div>
      </div>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////
// 📄 Product Details Page Documentation
////////////////////////////////////////////////////////////////////////////////
/**
 * Product Details Page Component
 *
 * Renders a detailed view of a single product with media, variant selectors, countdowns,
 * group items, upsells, and additional info blocks.
 *
 * ---------------------------
 * ✅ Props:
 * ---------------------------
 * @param {string} sliderThumbPosition - Position of thumbnail slider in Slider1 component
 *        Options: 'left' | 'bottom' (default: 'left')
 *
 * @param {boolean} productMetaStyleSimple - If true, displays simplified product meta layout
 *        Options: true | false (default: false)
 *
 * @param {string[]} features - List of enabled optional UI/UX modules
 *        Examples of available feature flags:
 *
 *        ├─ "varientPicker"                   → shows default size and color picker
 *        ├─ "varientPickerWithCustom"         → shows CustomSelect component
 *        ├─ "varient-picker-dropdown"         → shows VarientSelector2 (dropdown)
 *        ├─ "varient-picker-dropdown-color"   → shows VarientSelector5 (dropdown color picker)
 *        ├─ "varient-picker-image"            → shows VarientSelector4 (image swatches)
 *        ├─ "varient-picker-image-square"     → shows VarientSelector3 (square image swatches)
 *        ├─ "countdown-style-1"               → shows style-1 countdown inside heading
 *        ├─ "countdown-style-2"               → shows boxed countdown section
 *        ├─ "available-progressbar"           → shows AvailableProgress component
 *        ├─ "buy-x-get-y"                     → shows Buy X Get Y deal
 *        ├─ "volume-discount"                 → shows VolumeDiscount block
 *        ├─ "volume-discount-thumbnail"       → shows thumbnail variation of volume discount
 *        ├─ "bought-together"                 → shows BoughtTogether component
 *        ├─ "purchased-together"              → shows PurchasedTogether component
 *        ├─ "groupProduct"                    → shows GroupedProducts component
 *
 * @param {string} mediaLayout - Determines how media section is rendered
 *        Options:
 *        ├─ 'slider'                         → uses Slider1 with default images
 *        ├─ 'slider-with-video'             → uses Slider1 with image + video
 *        ├─ 'available-slider'              → uses Slider1 for available named page
 *        ├─ 'grid-1'                         → default Grid1 layout
 *        ├─ 'grid-2'                         → Grid1 with `product-grid-img2` layout
 *        ├─ 'grid-stacked'                   → Grid1 stacked layout
 *        ├─ 'carousel'                       → placeholder for future carousel
 *
 * @param {object} product - The main product object with necessary details
 *        Required Fields:
 *        ├─ product.title: string
 *        ├─ product.price: number
 *        ├─ product.oldPrice?: number
 *        ├─ product.imgSrc: string
 *
 * ---------------------------
 * 🧩 Components Used:
 * ---------------------------
 * Media:
 *    - Slider1 / Grid1 for product images
 *
 * Variant Pickers:
 *    - ColorSelector, SizeSelector
 *    - VarientSelector2 → dropdown
 *    - VarientSelector3 → image square
 *    - VarientSelector4 → image variant
 *    - VarientSelector5 → dropdown with color
 *    - CustomSelect     → generic custom dropdown
 *
 * Add-ons:
 *    - CountdownTimer
 *    - GroupedProducts
 *    - BuXGetY
 *    - BoughtTogether
 *    - PurchasedTogether
 *    - AvailableProgress
 *    - VolumeDiscount
 *    - VolumeThumbnail
 *
 * Static Info:
 *    - ProductActionPanel
 *    - ExptaLink
 *    - DeliveryPolicy
 *    - PaymentMethods
 *    - ProductSkuCategories
 */
