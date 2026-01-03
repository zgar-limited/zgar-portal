"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";

import { useEffect, useRef } from "react";

export default function HomeFooter({ parentClass = "tf-footer style-4" }) {
  const isBgDark = parentClass.includes("bg-deep-green");
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
      <div className="container d-flex">
        <span className="br-line" />
      </div>
      <div className="bg-white footer-body">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-sm-6 mb_30 mb-xl-0">
              <div className="footer-col-block">
                <p className="footer-heading footer-heading-mobile">
                  Contact us
                </p>
                <div className="tf-collapse-content">
                  <ul className="footer-contact">
                    {/* <li>
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
                    </li> */}
                    {/* <li>
                      <i className="icon icon-phone" />
                      <span className="br-line" />
                      <a href="tel:+88001234567" className="h6 link">
                        +8(800) 123 4567
                      </a>
                    </li> */}
                    <li>
                      <i className="icon icon-envelope-simple" />
                      <span className="br-line" />
                      <a
                        href="mailto:themesflat@support.com"
                        className="h6 link"
                      >
                        Mail: support@zgar.com
                      </a>
                    </li>
                  </ul>

                  <ul className={`tf-social-icon ${isBgDark ? "style-2" : ""}`}>
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
                        href="https://www.instagram.com/zgarofficial/"
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

            <div className="col-xl-4 col-sm-6 mb_30 mb-xl-0">
              <div className="mx-auto footer-col-block footer-wrap-1">
                <p className="footer-heading footer-heading-mobile">Products</p>
                <div className="tf-collapse-content">
                  <ul className="footer-menu-list">
                    <li>
                      <Link href={`/`} className="link h6">
                        产品系列一
                      </Link>
                    </li>
                    <li>
                      <Link href={`/`} className="link h6">
                        产品系列二
                      </Link>
                    </li>
                    <li>
                      <Link href={`/`} className="link h6">
                        产品系列三
                      </Link>
                    </li>
                    <li>
                      <Link href={`/`} className="link h6">
                        产品系列四
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 mb_30 mb-sm-0 ">
              <div className="mx-auto footer-col-block footer-wrap-2">
                <p className="footer-heading footer-heading-mobile">
                  Information
                </p>
                <div className="tf-collapse-content ">
                  <ul className="footer-menu-list">
                    <li>
                      <Link href={`/`} className="link h6">
                        About Zgar
                      </Link>
                    </li>
                    <li>
                      <Link href={`/`} className="link h6">
                        Care
                      </Link>
                    </li>
                    <li>
                      <Link href={`/`} className="link h6">
                        Blogs
                      </Link>
                    </li>
                    <li>
                      <Link href={`/club`} className="link h6">
                        Zgar Club
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* <div className=" col-xl-8 col-sm-6">
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
            </div> */}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="inner-bottom">
            <div className="flex-wrap list-hor">
              <span className={`  ${isBgDark ? "text-white_50" : ""}`}>
                Copyright © 2023 Zgar International (M) SDN BHD All rights
                reserved. Privacy Policy E-Cigarette Cartridge manufacturer /
                supplier, offering Disposable Vape,Disposable Vape Pen, etc.
              </span>

              <Image
                alt="Copyright"
                src="/images/copyright/footer.svg"
                width={200}
                height={128}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
