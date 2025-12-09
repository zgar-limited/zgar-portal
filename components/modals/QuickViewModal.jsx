"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContextElement } from "@/context/Context";
import QuantitySelect from "../common/QuantitySelect";
import CompareButton from "../productActionButtons/CompareButton";
import WishlistButton from "../productActionButtons/WishlistButton";

export default function QuickViewModal() {
  const { quickViewItem, addProductToCart, isAddedToCartProducts } =
    useMockContextElement();

  const slides = [
    {
      id: 1,
      size: "XS",
      color: "beige",
      src: quickViewItem?.imgSrc ?? "/images/products/product-9.jpg",
    },
    {
      id: 2,
      size: "L",
      color: "pink",
      src: "/images/products/product-39.jpg",
    },
    {
      id: 3,
      size: "M",
      color: "green",
      src: "/images/products/product-1.jpg",
    },
    {
      id: 4,
      size: "S",
      color: "blue",
      src: "/images/products/product-4.jpg",
    },
    {
      id: 5,
      size: "L",
      color: "black",
      src: "/images/products/product-47.jpg",
    },
  ];
  const sizes = ["XS", "S", "M", "L"];

  const colors = [
    { value: "beige", label: "Beige", bgClass: "bg-light-beige" },
    { value: "pink", label: "Pink", bgClass: "bg-hot-pink" },
    { value: "green", label: "Green", bgClass: "bg-sage-green" },
    { value: "blue", label: "Blue", bgClass: "bg-baby-blue" },
    { value: "black", label: "Dark", bgClass: "bg-dark-charcoal" },
  ];
  const [activeSize, setActiveSize] = useState("XS");
  const [activeColor, setActiveColor] = useState("beige");
  const [quantity, setQuantity] = useState(1);
  const swiperRef = useRef(null);
  useEffect(() => {
    const target = slides.find((elm) => elm.color === activeColor);
    if (target && swiperRef.current) {
      swiperRef.current.slideTo((target.id ?? 1) - 1);
    }
  }, [activeColor]);
  return (
    <div className="modal modalCentered fade modal-quick-view" id="quickView">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <i
            className="icon icon-close icon-close-popup"
            data-bs-dismiss="modal"
          />
          <div className="tf-product-media-wrap tf-btn-swiper-item">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              dir="ltr"
              className="swiper tf-single-slide"
              onSlideChange={(swiper) => {
                if (slides[swiper.activeIndex]) {
                  setActiveColor(slides[swiper.activeIndex]?.color);
                }
              }}
            >
              {slides.map((product, index) => (
                <SwiperSlide
                  key={index}
                  className="swiper-slide"
                  data-size={product.size}
                  data-color={product.color}
                >
                  <div className="item">
                    <Image
                      className="lazyload"
                      data-src={product.src}
                      alt=""
                      src={product.src}
                      width={1044}
                      height={1392}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="tf-product-info-wrap">
            <div className="tf-product-info-inner tf-product-info-list">
              <div className="tf-product-info-heading">
                <Link
                  href={`/product-detail/${quickViewItem?.id}`}
                  className="link product-info-name fw-medium h1"
                >
                  {quickViewItem?.title ?? "Casual Round Neck T-Shirt"}
                </Link>
                <div className="product-info-meta">
                  <div className="rating">
                    <div className="d-flex gap-4">
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 5.4091L8.913 5.07466L6.99721 0.261719L5.08143 5.07466L0 5.4091L3.89741 8.7184L2.61849 13.7384L6.99721 10.9707L11.376 13.7384L10.097 8.7184L14 5.4091Z"
                          fill="#EF9122"
                        />
                      </svg>
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 5.4091L8.913 5.07466L6.99721 0.261719L5.08143 5.07466L0 5.4091L3.89741 8.7184L2.61849 13.7384L6.99721 10.9707L11.376 13.7384L10.097 8.7184L14 5.4091Z"
                          fill="#EF9122"
                        />
                      </svg>
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 5.4091L8.913 5.07466L6.99721 0.261719L5.08143 5.07466L0 5.4091L3.89741 8.7184L2.61849 13.7384L6.99721 10.9707L11.376 13.7384L10.097 8.7184L14 5.4091Z"
                          fill="#EF9122"
                        />
                      </svg>
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 5.4091L8.913 5.07466L6.99721 0.261719L5.08143 5.07466L0 5.4091L3.89741 8.7184L2.61849 13.7384L6.99721 10.9707L11.376 13.7384L10.097 8.7184L14 5.4091Z"
                          fill="#EF9122"
                        />
                      </svg>
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 5.4091L8.913 5.07466L6.99721 0.261719L5.08143 5.07466L0 5.4091L3.89741 8.7184L2.61849 13.7384L6.99721 10.9707L11.376 13.7384L10.097 8.7184L14 5.4091Z"
                          fill="#EF9122"
                        />
                      </svg>
                    </div>
                    <div className="reviews text-main">(3.671 review)</div>
                  </div>
                  <div className="people-add text-primary">
                    <i className="icon icon-shopping-cart-simple" />
                    <span className="h6">
                      9 people just added this product to their cart
                    </span>
                  </div>
                </div>
                <div className="product-info-price">
                  <div className="price-wrap">
                    <span className="price-new price-on-sale h2">
                      $ {quickViewItem?.price?.toFixed(2)}
                    </span>
                    <span className="price-old compare-at-price h6">
                      $ {quickViewItem?.oldPrice?.toFixed(2)}
                    </span>
                    <p className="badges-on-sale h6 fw-semibold">
                      <span className="number-sale" data-person-sale={29}>
                        -29 %
                      </span>
                    </p>
                  </div>
                </div>
                <p className="product-infor-sub text-main h6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse justo dolor, consectetur vel metus vitae,
                  tincidunt finibus dui fusce tellus enim.
                </p>
              </div>
              <div className="tf-product-variant w-100">
                <div className="variant-picker-item variant-size">
                  <div className="variant-picker-label">
                    <div className="h4 fw-semibold">
                      Size{" "}
                      <span className="variant-picker-label-value value-currentSize">
                        {activeSize}
                      </span>
                    </div>
                    <a
                      href="#size-guide"
                      data-bs-toggle="modal"
                      className="size-guide link h6 fw-medium"
                    >
                      <i className="icon icon-ruler" />
                      Size Guide
                    </a>
                  </div>
                  <div className="variant-picker-values">
                    {sizes.map((size) => (
                      <span
                        key={size}
                        className={`size-btn ${
                          activeSize === size ? "active" : ""
                        }`}
                        onClick={() => setActiveSize(size)}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="variant-picker-item variant-color">
                  <div className="variant-picker-label">
                    <div className="h4 fw-semibold">
                      Colors{" "}
                      <span className="variant-picker-label-value value-currentColor">
                        {activeColor}
                      </span>
                    </div>
                  </div>
                  <div className="variant-picker-values">
                    {colors.map(({ value, label, bgClass }) => (
                      <div
                        key={value}
                        className={`hover-tooltip tooltip-bot color-btn ${
                          activeColor === value ? "active" : ""
                        }`}
                        data-color={value}
                        onClick={() => setActiveColor(value)}
                      >
                        <span className={`check-color ${bgClass}`} />
                        <span className="tooltip">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {quickViewItem ? (
                <div className="tf-product-total-quantity w-100">
                  <div className="group-btn">
                    <QuantitySelect
                      quantity={quantity}
                      setQuantity={setQuantity}
                    />
                    <p className="h6 d-none d-sm-block">
                      15 products available
                    </p>

                    <WishlistButton
                      tooltipDirection="top"
                      parentClass="d-sm-none hover-tooltip box-icon btn-add-wishlist flex-sm-shrink-0"
                      product={quickViewItem}
                    />
                    <CompareButton
                      parentClass="d-sm-none hover-tooltip tooltip-top box-icon flex-sm-shrink-0"
                      tooltipDirection="top"
                      product={quickViewItem}
                    />
                  </div>
                  <div className="group-btn flex-sm-nowrap">
                    <a
                      href="#shoppingCart"
                      onClick={() =>
                        addProductToCart(quickViewItem.id, quantity)
                      }
                      data-bs-toggle="offcanvas"
                      className="tf-btn animate-btn btn-add-to-cart"
                    >
                      {isAddedToCartProducts(quickViewItem.id)
                        ? "ALREADY ADDED"
                        : "ADD TO CART"}
                      <i className="icon icon-shopping-cart-simple" />
                    </a>

                    <WishlistButton
                      tooltipDirection="top"
                      parentClass="d-none d-sm-flex hover-tooltip box-icon btn-add-wishlist flex-sm-shrink-0"
                      product={quickViewItem}
                    />
                    <CompareButton
                      parentClass="d-none d-sm-flex hover-tooltip tooltip-top box-icon flex-sm-shrink-0"
                      tooltipDirection="top"
                      product={quickViewItem}
                    />
                  </div>
                  <div className="group-btn">
                    <Link
                      href={`/checkout`}
                      className="tf-btn btn-yellow w-100 animate-btn animate-dark"
                    >
                      Pay with
                      <span className="icon">
                        <svg
                          width={68}
                          height={18}
                          viewBox="0 0 68 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M45.7745 0H40.609C40.3052 0 40.0013 0.30254 39.8494 0.605081L37.7224 13.9169C37.7224 14.2194 37.8743 14.3707 38.1782 14.3707H40.9129C41.2167 14.3707 41.3687 14.2194 41.3687 13.9169L41.9764 10.1351C41.9764 9.83258 42.2802 9.53004 42.736 9.53004H44.4072C47.9015 9.53004 49.8766 7.86606 50.3323 4.53811C50.6362 3.17668 50.3323 1.96652 49.7246 1.21017C48.8131 0.453813 47.4457 0 45.7745 0ZM46.3822 4.99193C46.0784 6.80717 44.711 6.80717 43.3437 6.80717H42.4321L43.0399 3.32795C43.0399 3.17668 43.1918 3.02541 43.4956 3.02541H43.7995C44.7111 3.02541 45.6226 3.02541 46.0784 3.63049C46.3822 3.78176 46.3822 4.23558 46.3822 4.99193Z"
                            fill="#139AD6"
                          />
                          <path
                            d="M8.55188 0H3.38637C3.08251 0 2.77866 0.30254 2.62673 0.605081L0.499756 13.9169C0.499756 14.2194 0.651685 14.3707 0.955538 14.3707H3.38637C3.69022 14.3707 3.99407 14.0682 4.146 13.7656L4.75371 10.1351C4.75371 9.83258 5.05757 9.53004 5.51335 9.53004H7.18454C10.6789 9.53004 12.6539 7.86607 13.1097 4.53811C13.4135 3.17668 13.1097 1.96652 12.502 1.21017C11.5904 0.453813 10.375 0 8.55188 0ZM9.15959 4.99193C8.85574 6.80717 7.4884 6.80717 6.12105 6.80717H5.36142L5.96913 3.32795C5.96913 3.17668 6.12105 3.02541 6.42491 3.02541H6.72876C7.64032 3.02541 8.55188 3.02541 9.00766 3.63049C9.15959 3.78176 9.31152 4.23558 9.15959 4.99193ZM24.2004 4.84066H21.7695C21.6176 4.84066 21.3137 4.99193 21.3137 5.1432L21.1618 5.89955L21.0099 5.59701C20.4022 4.84066 19.3387 4.53811 18.1233 4.53811C15.3886 4.53811 12.9578 6.6559 12.502 9.53004C12.1981 11.0427 12.6539 12.4042 13.4135 13.3118C14.1732 14.2194 15.2367 14.522 16.604 14.522C18.8829 14.522 20.0983 13.1605 20.0983 13.1605L19.9464 13.9169C19.9464 14.2194 20.0983 14.3707 20.4022 14.3707H22.6811C22.9849 14.3707 23.2888 14.0682 23.4407 13.7656L24.8081 5.29447C24.6561 5.1432 24.3523 4.84066 24.2004 4.84066ZM20.706 9.68131C20.4022 11.0427 19.3387 12.1016 17.8194 12.1016C17.0598 12.1016 16.4521 11.7991 16.1482 11.4966C15.8444 11.0427 15.6924 10.4377 15.6924 9.68131C15.8444 8.31988 17.0598 7.26098 18.4271 7.26098C19.1868 7.26098 19.6425 7.56352 20.0983 7.86606C20.5541 8.31987 20.706 9.07623 20.706 9.68131Z"
                            fill="#263B80"
                          />
                          <path
                            d="M61.2699 4.8416H58.839C58.6871 4.8416 58.3833 4.99287 58.3833 5.14414L58.2313 5.9005L58.0794 5.59796C57.4717 4.8416 56.4082 4.53906 55.1928 4.53906C52.4581 4.53906 50.0273 6.65685 49.5715 9.53099C49.2676 11.0437 49.7234 12.4051 50.4831 13.3128C51.2427 14.2204 52.3062 14.5229 53.6735 14.5229C55.9524 14.5229 57.1678 13.1615 57.1678 13.1615L57.0159 13.9178C57.0159 14.2204 57.1678 14.3716 57.4717 14.3716H59.7506C60.0545 14.3716 60.3583 14.0691 60.5102 13.7666L61.8776 5.29541C61.7256 5.14414 61.5737 4.8416 61.2699 4.8416ZM57.7755 9.68226C57.4717 11.0437 56.4082 12.1026 54.8889 12.1026C54.1293 12.1026 53.5216 11.8 53.2177 11.4975C52.9139 11.0437 52.762 10.4386 52.762 9.68226C52.9139 8.32082 54.1293 7.26193 55.4966 7.26193C56.2563 7.26193 56.7121 7.56447 57.1678 7.86701C57.7755 8.32082 57.9275 9.07718 57.7755 9.68226Z"
                            fill="#139AD6"
                          />
                          <path
                            d="M37.4179 4.83984H34.8351C34.5312 4.83984 34.3793 4.99111 34.2274 5.14238L30.885 10.2856L29.3657 5.44493C29.2138 5.14238 29.0619 4.99111 28.6061 4.99111H26.1753C25.8714 4.99111 25.7195 5.29366 25.7195 5.5962L28.4542 13.6135L25.8714 17.244C25.7195 17.5466 25.8714 18.0004 26.1753 18.0004H28.6061C28.9099 18.0004 29.0619 17.8491 29.2138 17.6978L37.5698 5.74747C38.0256 5.29366 37.7217 4.83984 37.4179 4.83984Z"
                            fill="#263B80"
                          />
                          <path
                            d="M64.158 0.455636L62.031 14.07C62.031 14.3725 62.1829 14.5238 62.4868 14.5238H64.6138C64.9176 14.5238 65.2215 14.2212 65.3734 13.9187L67.5004 0.606904C67.5004 0.304363 67.3484 0.153094 67.0446 0.153094H64.6138C64.4618 0.00182346 64.3099 0.153095 64.158 0.455636Z"
                            fill="#139AD6"
                          />
                        </svg>
                      </span>
                    </Link>
                  </div>
                  <div className="group-btn justify-content-center">
                    <a
                      href="#"
                      className="tf-btn-line text-normal letter-space-0 fw-normal"
                    >
                      More payment options
                    </a>
                  </div>
                </div>
              ) : (
                ""
              )}
              <Link
                href={`/product-detail/${quickViewItem?.id}`}
                className="tf-btn-line text-normal letter-space-0 fw-normal"
              >
                <span className="h5">View full details</span>
                <i className="icon icon-arrow-top-right fs-24" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
