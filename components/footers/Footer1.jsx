"use client";
import Link from "next/link";
import Image from "next/image";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import NewsLetterForm from "./NewsLetterForm";
import { useEffect, useRef } from "react";

export default function Footer1({
  parentClass = "tf-footer style-4",
  hasLineTop = true,
}) {
  const isBgDark = parentClass.includes("bg-black");
  const footerRef = useRef(null);

  useEffect(() => {
    const container = footerRef.current;
    if (!container) return;

    const headings = container.querySelectorAll(".footer-heading-mobile");

    const toggleOpen = (event) => {
      const target = event.target;
      const parent = target.closest(".footer-col-block");
      const content = parent?.querySelector(".tf-collapse-content");

      if (parent?.classList.contains("open")) {
        parent.classList.remove("open");
        if (content) content.style.height = "0px";
      } else {
        parent?.classList.add("open");
        if (content) content.style.height = content.scrollHeight + 10 + "px";
      }
    };

    headings.forEach((heading) =>
      heading.addEventListener("click", toggleOpen)
    );

    return () => {
      headings.forEach((heading) =>
        heading.removeEventListener("click", toggleOpen)
      );
    };
  }, []);
  return (
    <footer ref={footerRef} className={parentClass}>
      {hasLineTop ? (
        <div className="container d-flex">
          <span className="br-line" />
        </div>
      ) : (
        ""
      )}
      <div className="footer-body bg-[#fff]">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-sm-6 mb_30 mb-xl-0">
              <div className="footer-col-block">
                <p className="footer-heading footer-heading-mobile">
                  Contact us
                </p>
                <div className="tf-collapse-content">
                  <ul className="footer-contact">
                    <li>
                      <i className="icon icon-map-pin" />
                      <span className="br-line" />
                      <a
                        href="https://www.google.com/maps?q=8500+Lorem+Street+Chicago,+IL+55030+Dolor+sit+amet"
                        target="_blank"
                        className="h6 link"
                      >
                        8500 Lorem Street Chicago, IL 55030
                        <br className="d-none d-lg-block" />
                        Dolor sit amet
                      </a>
                    </li>
                    <li>
                      <i className="icon icon-phone" />
                      <span className="br-line" />
                      <a href="tel:+88001234567" className="h6 link">
                        +8(800) 123 4567
                      </a>
                    </li>
                    <li>
                      <i className="icon icon-envelope-simple" />
                      <span className="br-line" />
                      <a
                        href="mailto:themesflat@support.com"
                        className="h6 link"
                      >
                        themesflat@support.com
                      </a>
                    </li>
                  </ul>
                  <div className="social-wrap">
                    <ul
                      className={`tf-social-icon ${isBgDark ? "style-2" : ""}`}
                    >
                      <li>
                        <a
                          href="https://www.facebook.com/"
                          target="_blank"
                          className="social-facebook"
                        >
                          <span className="icon">
                            <i className="icon-fb" />
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/"
                          target="_blank"
                          className="social-instagram"
                        >
                          <span className="icon">
                            <i className="icon-instagram-logo" />
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://x.com/"
                          target="_blank"
                          className="social-x"
                        >
                          <span className="icon">
                            <i className="icon-x" />
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.tiktok.com/"
                          target="_blank"
                          className="social-tiktok"
                        >
                          <span className="icon">
                            <i className="icon-tiktok" />
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-sm-6 mb_30 mb-xl-0">
              <div className="footer-col-block footer-wrap-1 ms-xl-auto">
                <p className="footer-heading footer-heading-mobile">Shopping</p>
                <div className="tf-collapse-content">
                  <ul className="footer-menu-list">
                    <li>
                      <Link href={`/faq`} className="link h6">
                        Shipping
                      </Link>
                    </li>
                    <li>
                      <Link href={`/shop-default`} className="link h6">
                        Shop by Brand
                      </Link>
                    </li>
                    <li>
                      <Link href={`/track-order`} className="link h6">
                        Track order
                      </Link>
                    </li>
                    <li>
                      <Link href={`/faq`} className="link h6">
                        Terms &amp; Conditions
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#size-guide"
                        data-bs-toggle="modal"
                        className="link h6"
                      >
                        Size Guide
                      </a>
                    </li>
                    <li>
                      <Link href={`/wishlist`} className="link h6">
                        My Wishlist
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 mb_30 mb-sm-0">
              <div className="footer-col-block footer-wrap-2 mx-xl-auto">
                <p className="footer-heading footer-heading-mobile">
                  Information
                </p>
                <div className="tf-collapse-content">
                  <ul className="footer-menu-list">
                    <li>
                      <Link href={`/about-us`} className="link h6">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href={`/faq`} className="link h6">
                        Term &amp; Policy
                      </Link>
                    </li>
                    <li>
                      <Link href={`/faq`} className="link h6">
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog-grid`} className="link h6">
                        News &amp; Blog
                      </Link>
                    </li>
                    <li>
                      <Link href={`/faq`} className="link h6">
                        Refunds
                      </Link>
                    </li>
                    <li>
                      <Link href={`/faq`} className="link h6">
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6">
              <div className="footer-col-block">
                <p className="footer-heading footer-heading-mobile">
                  Let’s keep in touch
                </p>
                <div className="tf-collapse-content">
                  <div className="footer-newsletter">
                    <p
                      className={`h6 caption  ${isBgDark ? "text-main-5" : ""}`}
                    >
                      Enter your email below to be the first to know about new
                      collections and product launches.
                    </p>
                    <NewsLetterForm isBgDark={isBgDark} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="footer-bottom">
        <div className="container">
          <div className="inner-bottom">
            <ul className="list-hor">
              <li>
                <Link
                  href={`/faq`}
                  className={`h6 link ${isBgDark ? "text-main" : ""}`}
                >
                  Help &amp; FAQs
                </Link>
              </li>
              <li className="br-line type-vertical" />
              <li>
                <Link
                  href={`/faq`}
                  className={`h6 link ${isBgDark ? "text-main" : ""}`}
                >
                  Factory
                </Link>
              </li>
            </ul>
            <div className="flex-wrap list-hor">
              <span className="h6">Payment:</span>

              <ul className={`payment-method-list`}>
                {["visa", "master-card", "amex", "discover", "paypal"].map(
                  (type) => (
                    <li key={type}>
                      <Image
                        alt="Payment"
                        src={`/images/payment/${type}${
                          isBgDark ? "-2.svg" : ".png"
                        }`}
                        width={200}
                        height={128}
                      />
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="list-hor">
              <div className="tf-currencies">
                <CurrencySelect
                  textColor="color-white-2"
                  textBlack={!isBgDark}
                />
              </div>
              <span className="br-line type-vertical" />
              <div className="tf-languages">
                <LanguageSelect
                  textColor="color-white-2"
                  textBlack={!isBgDark}
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  );
}
