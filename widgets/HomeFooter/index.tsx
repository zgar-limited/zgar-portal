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
      <div className="footer-body bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-wrap">
            <div className="w-full xl:w-1/3 sm:w-1/2 mb-8 xl:mb-0 px-4">
              <div className="footer-col-block">
                <p className="footer-heading footer-heading-mobile text-gray-900 font-semibold text-base mb-6">
                  Contact us
                </p>
                <div className="tf-collapse-content">
                  <ul className="footer-contact space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-gray-400">✉</span>
                      <a
                        href="mailto:themesflat@support.com"
                        className="text-gray-600 hover:text-brand-pink transition-colors text-sm"
                      >
                        Mail: support@zgar.com
                      </a>
                    </li>
                  </ul>

                  <ul className="tf-social-icon flex items-center gap-3 mt-6">
                    <li>
                      <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                      >
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/zgarofficial/"
                        target="_blank"
                        className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                      >
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://x.com/"
                        target="_blank"
                        className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                      >
                        X (Twitter)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.tiktok.com/"
                        target="_blank"
                        className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                      >
                        TikTok
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full xl:w-1/3 sm:w-1/2 mb-8 xl:mb-0 px-4">
              <div className="mx-auto footer-col-block footer-wrap-1">
                <p className="footer-heading footer-heading-mobile text-gray-900 font-semibold text-base mb-6">Products</p>
                <div className="tf-collapse-content">
                  <ul className="footer-menu-list space-y-3">
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        产品系列一
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        产品系列二
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        产品系列三
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        产品系列四
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full xl:w-1/3 sm:w-1/2 mb-8 sm:mb-0 px-4">
              <div className="mx-auto footer-col-block footer-wrap-2">
                <p className="footer-heading footer-heading-mobile text-gray-900 font-semibold text-base mb-6">
                  Information
                </p>
                <div className="tf-collapse-content">
                  <ul className="footer-menu-list space-y-3">
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        About Zgar
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        Care
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        Blogs
                      </Link>
                    </li>
                    <li>
                      <Link href="/club" className="text-gray-600 hover:text-brand-pink transition-colors text-sm">
                        Zgar Club
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="inner-bottom py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-gray-400 text-sm text-center sm:text-left">
                Copyright © 2023 Zgar International (M) SDN BHD All rights reserved.
              </span>
              <span className="text-gray-500 text-xs text-center sm:text-right">
                Privacy Policy | E-Cigarette Cartridge manufacturer / supplier
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
