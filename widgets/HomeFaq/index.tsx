"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";

export default function HomeFaq() {
    return (
        <section className="flat-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                        <ul className="faq-list">
                            <li className="faq-item" id="faq">
                                <h2 className="faq_title">Frequently Asked Question</h2>
                                <div className="faq_wrap" id="real-faq">
                                    {[1, 2, 3, 4].map((item, index) => {
                                        return <div className="accordion-faq accor-mn-pl">
                                            <div
                                                className="accordion-title collapsed"
                                                data-bs-target={`#faq-content-${index}`}
                                                role="button"
                                                data-bs-toggle="collapse"
                                                aria-expanded="false"
                                                aria-controls={`#faq-content-${index}`}
                                            >
                                                <span className="text h5">
                                                    {index + 1}. FAQ Title
                                                </span>
                                                <span className="icon">
                                                    <span className="ic-accordion-custom" />
                                                </span>
                                            </div>
                                            <div
                                                id={`faq-content-${index}`}
                                                className="collapse"
                                                data-bs-parent="#real-faq"
                                            >
                                                <div className="accordion-body">
                                                    <p className="h6">
                                                        FAQ Content
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    })}




                                </div>

                            </li>



                        </ul>
                    </div>
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="blog-sidebar sidebar-content-wrap sticky-top">


                            <div className="sidebar-item">
                                <div className="sb-banner hover-img">
                                    <Link href={`/shop-default`} className="image img-style">
                                        <Image
                                            src="/images/slot/social/10.webp"
                                            alt="Banner"
                                            width={648}
                                            height={950}
                                        />
                                    </Link>
                                    <div className="content">
                                        {/* <h5 className="sub-title text-primary">Sale Upto 45%</h5>
                                        <h2 className="fw-semibold title">
                                            <a href="#" className="text-white link">
                                                Fall winter collection
                                            </a>
                                        </h2> */}
                                        <Link
                                            href={`/shop-default`}
                                            className="tf-btn btn-white animate-btn animate-dark"
                                        >
                                            Shop now
                                            <i className="icon icon-arrow-right" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
