"use client";
import React, { useState } from "react";
import Image from "next/image";
export default function Review() {
  const [openReviewForm, setOpenReviewForm] = useState(false);
  return (
    <>
      {" "}
      <div className="tab-reviews-heading">
        <div className="top">
          <div className="text-center">
            <div className="number fw-6">
              4.8 <span>/5</span>
            </div>
            <div className="list-star d-flex justify-content-center gap-4">
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
            <p className="quantity-reviews">Based on 3.637 reviews</p>
          </div>
          <div className="rating-score">
            <div className="item">
              <div className="number-1">5</div>
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
              <div className="line-bg">
                <div style={{ width: "100%" }} />
              </div>
              <div className="number-2">100</div>
            </div>
            <div className="item">
              <div className="number-1">4</div>
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
              <div className="line-bg">
                <div style={{ width: "97%" }} />
              </div>
              <div className="number-2">97</div>
            </div>
            <div className="item">
              <div className="number-1">3</div>
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
              <div className="line-bg">
                <div style={{ width: "37%" }} />
              </div>
              <div className="number-2">37</div>
            </div>
            <div className="item">
              <div className="number-1">2</div>
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
              <div className="line-bg">
                <div style={{ width: "24%" }} />
              </div>
              <div className="number-2">24</div>
            </div>
            <div className="item">
              <div className="number-1">1</div>
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
              <div className="line-bg">
                <div style={{ width: "0%" }} />
              </div>
              <div className="number-2">0</div>
            </div>
          </div>
        </div>
        <div
          className="btns-reviews"
          onClick={() => setOpenReviewForm((pre) => !pre)}
        >
          <div
            className={`tf-btn btn-white animate-btn animate-dark line btn-comment-review btn-cancel-review ${
              openReviewForm ? "d-none" : "d-block"
            } `}
          >
            Cancel Review
            <svg
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.9834 5.15866L12.8412 2.0171C12.7367 1.9126 12.6127 1.82971 12.4762 1.77316C12.3397 1.71661 12.1933 1.6875 12.0456 1.6875C11.8978 1.6875 11.7515 1.71661 11.615 1.77316C11.4785 1.82971 11.3545 1.9126 11.25 2.0171L2.57977 10.6873C2.47485 10.7914 2.39167 10.9153 2.33506 11.0518C2.27844 11.1884 2.24953 11.3348 2.25001 11.4826V14.6248C2.25001 14.9232 2.36853 15.2093 2.57951 15.4203C2.79049 15.6313 3.07664 15.7498 3.37501 15.7498H15.1875C15.3367 15.7498 15.4798 15.6906 15.5853 15.5851C15.6907 15.4796 15.75 15.3365 15.75 15.1873C15.75 15.0381 15.6907 14.8951 15.5853 14.7896C15.4798 14.6841 15.3367 14.6248 15.1875 14.6248H8.10844L15.9834 6.74983C16.0879 6.64536 16.1708 6.52133 16.2274 6.38482C16.2839 6.24831 16.313 6.102 16.313 5.95424C16.313 5.80649 16.2839 5.66017 16.2274 5.52367C16.1708 5.38716 16.0879 5.26313 15.9834 5.15866ZM6.51727 14.6248H3.37501V11.4826L9.56251 5.29506L12.7048 8.43733L6.51727 14.6248ZM13.5 7.6421L10.3584 4.49983L12.0459 2.81233L15.1875 5.9546L13.5 7.6421Z"
                fill="black"
              />
            </svg>
          </div>
          <div
            className={`tf-btn btn-white animate-btn animate-dark line btn-comment-review btn-write-review  ${
              openReviewForm ? "d-block" : "d-none"
            } `}
          >
            Write a review
            <svg
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.9834 5.15866L12.8412 2.0171C12.7367 1.9126 12.6127 1.82971 12.4762 1.77316C12.3397 1.71661 12.1933 1.6875 12.0456 1.6875C11.8978 1.6875 11.7515 1.71661 11.615 1.77316C11.4785 1.82971 11.3545 1.9126 11.25 2.0171L2.57977 10.6873C2.47485 10.7914 2.39167 10.9153 2.33506 11.0518C2.27844 11.1884 2.24953 11.3348 2.25001 11.4826V14.6248C2.25001 14.9232 2.36853 15.2093 2.57951 15.4203C2.79049 15.6313 3.07664 15.7498 3.37501 15.7498H15.1875C15.3367 15.7498 15.4798 15.6906 15.5853 15.5851C15.6907 15.4796 15.75 15.3365 15.75 15.1873C15.75 15.0381 15.6907 14.8951 15.5853 14.7896C15.4798 14.6841 15.3367 14.6248 15.1875 14.6248H8.10844L15.9834 6.74983C16.0879 6.64536 16.1708 6.52133 16.2274 6.38482C16.2839 6.24831 16.313 6.102 16.313 5.95424C16.313 5.80649 16.2839 5.66017 16.2274 5.52367C16.1708 5.38716 16.0879 5.26313 15.9834 5.15866ZM6.51727 14.6248H3.37501V11.4826L9.56251 5.29506L12.7048 8.43733L6.51727 14.6248ZM13.5 7.6421L10.3584 4.49983L12.0459 2.81233L15.1875 5.9546L13.5 7.6421Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        className={`reply-comment cancel-review-wrap  ${
          openReviewForm ? "d-none" : "d-block"
        } `}
      >
        <div className="reply-comment-filter d-flex mb_24 gap-20 align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center flex-wrap gap-12">
            <div className="h6 fw-5">Filter by:</div>
            <div className="filter-start-wrap">
              <div className="filter-item h6 active">All</div>
              <div className="filter-item h6">
                5 star (<span className="number">97</span>)
              </div>
              <div className="filter-item h6">
                4 star (<span className="number">12</span>)
              </div>
              <div className="filter-item h6">
                3 star (<span className="number">23</span>)
              </div>
              <div className="filter-item h6">
                2 star (<span className="number">0</span>)
              </div>
              <div className="filter-item h6">
                1 star (<span className="number">0</span>)
              </div>
            </div>
          </div>
          <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
            <div className="btn-select">
              <span className="text-sort-value">Most Recent</span>
              <span className="icon icon-caret-down" />
            </div>
            <div className="dropdown-menu">
              <div className="select-item active">
                <span className="text-value-item">Most Recent</span>
              </div>
              <div className="select-item">
                <span className="text-value-item">Oldest</span>
              </div>
              <div className="select-item">
                <span className="text-value-item">Most Popular</span>
              </div>
            </div>
          </div>
        </div>
        <div className="reply-comment-wrap">
          <div className="reply-comment-item">
            <div className="image">
              <Image
                className="lazyload"
                data-src="/images/section/recent-1.jpg"
                alt=""
                src="/images/section/recent-1.jpg"
                width={244}
                height={244}
              />
            </div>
            <div>
              <div className="user">
                <div className="flex-grow-1">
                  <h4 className="name">
                    <a href="#" className="link">
                      Esther Howard
                    </a>
                  </h4>
                  <div className="user-infor">
                    <div className="color">Color: Black</div>
                    <div className="line" />
                    <div className="verified-purchase">
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.6453 8.03281C17.3508 7.725 17.0461 7.40781 16.9312 7.12891C16.825 6.87344 16.8187 6.45 16.8125 6.03984C16.8008 5.27734 16.7883 4.41328 16.1875 3.8125C15.5867 3.21172 14.7227 3.19922 13.9602 3.1875C13.55 3.18125 13.1266 3.175 12.8711 3.06875C12.593 2.95391 12.275 2.64922 11.9672 2.35469C11.4281 1.83672 10.8156 1.25 10 1.25C9.18437 1.25 8.57266 1.83672 8.03281 2.35469C7.725 2.64922 7.40781 2.95391 7.12891 3.06875C6.875 3.175 6.45 3.18125 6.03984 3.1875C5.27734 3.19922 4.41328 3.21172 3.8125 3.8125C3.21172 4.41328 3.20312 5.27734 3.1875 6.03984C3.18125 6.45 3.175 6.87344 3.06875 7.12891C2.95391 7.40703 2.64922 7.725 2.35469 8.03281C1.83672 8.57188 1.25 9.18437 1.25 10C1.25 10.8156 1.83672 11.4273 2.35469 11.9672C2.64922 12.275 2.95391 12.5922 3.06875 12.8711C3.175 13.1266 3.18125 13.55 3.1875 13.9602C3.19922 14.7227 3.21172 15.5867 3.8125 16.1875C4.41328 16.7883 5.27734 16.8008 6.03984 16.8125C6.45 16.8187 6.87344 16.825 7.12891 16.9312C7.40703 17.0461 7.725 17.3508 8.03281 17.6453C8.57188 18.1633 9.18437 18.75 10 18.75C10.8156 18.75 11.4273 18.1633 11.9672 17.6453C12.275 17.3508 12.5922 17.0461 12.8711 16.9312C13.1266 16.825 13.55 16.8187 13.9602 16.8125C14.7227 16.8008 15.5867 16.7883 16.1875 16.1875C16.7883 15.5867 16.8008 14.7227 16.8125 13.9602C16.8187 13.55 16.825 13.1266 16.9312 12.8711C17.0461 12.593 17.3508 12.275 17.6453 11.9672C18.1633 11.4281 18.75 10.8156 18.75 10C18.75 9.18437 18.1633 8.57266 17.6453 8.03281ZM16.743 11.1023C16.3687 11.493 15.9812 11.8969 15.7758 12.393C15.5789 12.8695 15.5703 13.4141 15.5625 13.9414C15.5547 14.4883 15.5461 15.0609 15.3031 15.3031C15.0602 15.5453 14.4914 15.5547 13.9414 15.5625C13.4141 15.5703 12.8695 15.5789 12.393 15.7758C11.8969 15.9812 11.493 16.3687 11.1023 16.743C10.7117 17.1172 10.3125 17.5 10 17.5C9.6875 17.5 9.28516 17.1156 8.89766 16.743C8.51016 16.3703 8.10313 15.9812 7.60703 15.7758C7.13047 15.5789 6.58594 15.5703 6.05859 15.5625C5.51172 15.5547 4.93906 15.5461 4.69687 15.3031C4.45469 15.0602 4.44531 14.4914 4.4375 13.9414C4.42969 13.4141 4.42109 12.8695 4.22422 12.393C4.01875 11.8969 3.63125 11.493 3.25703 11.1023C2.88281 10.7117 2.5 10.3125 2.5 10C2.5 9.6875 2.88437 9.28516 3.25703 8.89766C3.62969 8.51016 4.01875 8.10313 4.22422 7.60703C4.42109 7.13047 4.42969 6.58594 4.4375 6.05859C4.44531 5.51172 4.45391 4.93906 4.69687 4.69687C4.93984 4.45469 5.50859 4.44531 6.05859 4.4375C6.58594 4.42969 7.13047 4.42109 7.60703 4.22422C8.10313 4.01875 8.50703 3.63125 8.89766 3.25703C9.28828 2.88281 9.6875 2.5 10 2.5C10.3125 2.5 10.7148 2.88437 11.1023 3.25703C11.4898 3.62969 11.8969 4.01875 12.393 4.22422C12.8695 4.42109 13.4141 4.42969 13.9414 4.4375C14.4883 4.44531 15.0609 4.45391 15.3031 4.69687C15.5453 4.93984 15.5547 5.50859 15.5625 6.05859C15.5703 6.58594 15.5789 7.13047 15.7758 7.60703C15.9812 8.10313 16.3687 8.50703 16.743 8.89766C17.1172 9.28828 17.5 9.6875 17.5 10C17.5 10.3125 17.1156 10.7148 16.743 11.1023ZM13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13414 13.0003 9.06521 13.0464 8.98934 13.0779C8.91346 13.1093 8.83213 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51066 13.0779C8.43479 13.0464 8.36586 13.0003 8.30781 12.9422L6.43281 11.0672C6.31554 10.9499 6.24965 10.7909 6.24965 10.625C6.24965 10.4591 6.31554 10.3001 6.43281 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04085 9.99965 7.19991 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281Z"
                          fill="black"
                        />
                      </svg>
                      <div className="text">Verified Purchase</div>
                    </div>
                  </div>
                </div>
                <div className="list-star d-flex justify-content-center gap-4">
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
              </div>
              <p className="h6 desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id massa in sapien ornare tristique vel vitae augue. Donec
                dictum sem semper, posuere leo eu, tempus ex. Morbi id ipsum
                urna. Duis elementum, nibh ut rutrum pellentesque, tortor nisi
                fermentum nulla, ut fringilla enim magna sed nunc. Nulla
                fringilla non purus vestibulum porta.
              </p>
              <div className="text-small time text-main-2">
                April 3, 2020 at 10:43
              </div>
            </div>
          </div>
          <div className="reply-comment-item">
            <div className="image">
              <Image
                className="lazyload"
                data-src="/images/section/recent-2.jpg"
                alt=""
                src="/images/section/recent-2.jpg"
                width={244}
                height={244}
              />
            </div>
            <div>
              <div className="user">
                <div className="flex-grow-1">
                  <h4 className="name">
                    <a href="#" className="link">
                      Eleanor Pena
                    </a>
                  </h4>
                  <div className="user-infor">
                    <div className="color">Color: Black</div>
                    <div className="line" />
                    <div className="verified-purchase">
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.6453 8.03281C17.3508 7.725 17.0461 7.40781 16.9312 7.12891C16.825 6.87344 16.8187 6.45 16.8125 6.03984C16.8008 5.27734 16.7883 4.41328 16.1875 3.8125C15.5867 3.21172 14.7227 3.19922 13.9602 3.1875C13.55 3.18125 13.1266 3.175 12.8711 3.06875C12.593 2.95391 12.275 2.64922 11.9672 2.35469C11.4281 1.83672 10.8156 1.25 10 1.25C9.18437 1.25 8.57266 1.83672 8.03281 2.35469C7.725 2.64922 7.40781 2.95391 7.12891 3.06875C6.875 3.175 6.45 3.18125 6.03984 3.1875C5.27734 3.19922 4.41328 3.21172 3.8125 3.8125C3.21172 4.41328 3.20312 5.27734 3.1875 6.03984C3.18125 6.45 3.175 6.87344 3.06875 7.12891C2.95391 7.40703 2.64922 7.725 2.35469 8.03281C1.83672 8.57188 1.25 9.18437 1.25 10C1.25 10.8156 1.83672 11.4273 2.35469 11.9672C2.64922 12.275 2.95391 12.5922 3.06875 12.8711C3.175 13.1266 3.18125 13.55 3.1875 13.9602C3.19922 14.7227 3.21172 15.5867 3.8125 16.1875C4.41328 16.7883 5.27734 16.8008 6.03984 16.8125C6.45 16.8187 6.87344 16.825 7.12891 16.9312C7.40703 17.0461 7.725 17.3508 8.03281 17.6453C8.57188 18.1633 9.18437 18.75 10 18.75C10.8156 18.75 11.4273 18.1633 11.9672 17.6453C12.275 17.3508 12.5922 17.0461 12.8711 16.9312C13.1266 16.825 13.55 16.8187 13.9602 16.8125C14.7227 16.8008 15.5867 16.7883 16.1875 16.1875C16.7883 15.5867 16.8008 14.7227 16.8125 13.9602C16.8187 13.55 16.825 13.1266 16.9312 12.8711C17.0461 12.593 17.3508 12.275 17.6453 11.9672C18.1633 11.4281 18.75 10.8156 18.75 10C18.75 9.18437 18.1633 8.57266 17.6453 8.03281ZM16.743 11.1023C16.3687 11.493 15.9812 11.8969 15.7758 12.393C15.5789 12.8695 15.5703 13.4141 15.5625 13.9414C15.5547 14.4883 15.5461 15.0609 15.3031 15.3031C15.0602 15.5453 14.4914 15.5547 13.9414 15.5625C13.4141 15.5703 12.8695 15.5789 12.393 15.7758C11.8969 15.9812 11.493 16.3687 11.1023 16.743C10.7117 17.1172 10.3125 17.5 10 17.5C9.6875 17.5 9.28516 17.1156 8.89766 16.743C8.51016 16.3703 8.10313 15.9812 7.60703 15.7758C7.13047 15.5789 6.58594 15.5703 6.05859 15.5625C5.51172 15.5547 4.93906 15.5461 4.69687 15.3031C4.45469 15.0602 4.44531 14.4914 4.4375 13.9414C4.42969 13.4141 4.42109 12.8695 4.22422 12.393C4.01875 11.8969 3.63125 11.493 3.25703 11.1023C2.88281 10.7117 2.5 10.3125 2.5 10C2.5 9.6875 2.88437 9.28516 3.25703 8.89766C3.62969 8.51016 4.01875 8.10313 4.22422 7.60703C4.42109 7.13047 4.42969 6.58594 4.4375 6.05859C4.44531 5.51172 4.45391 4.93906 4.69687 4.69687C4.93984 4.45469 5.50859 4.44531 6.05859 4.4375C6.58594 4.42969 7.13047 4.42109 7.60703 4.22422C8.10313 4.01875 8.50703 3.63125 8.89766 3.25703C9.28828 2.88281 9.6875 2.5 10 2.5C10.3125 2.5 10.7148 2.88437 11.1023 3.25703C11.4898 3.62969 11.8969 4.01875 12.393 4.22422C12.8695 4.42109 13.4141 4.42969 13.9414 4.4375C14.4883 4.44531 15.0609 4.45391 15.3031 4.69687C15.5453 4.93984 15.5547 5.50859 15.5625 6.05859C15.5703 6.58594 15.5789 7.13047 15.7758 7.60703C15.9812 8.10313 16.3687 8.50703 16.743 8.89766C17.1172 9.28828 17.5 9.6875 17.5 10C17.5 10.3125 17.1156 10.7148 16.743 11.1023ZM13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13414 13.0003 9.06521 13.0464 8.98934 13.0779C8.91346 13.1093 8.83213 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51066 13.0779C8.43479 13.0464 8.36586 13.0003 8.30781 12.9422L6.43281 11.0672C6.31554 10.9499 6.24965 10.7909 6.24965 10.625C6.24965 10.4591 6.31554 10.3001 6.43281 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04085 9.99965 7.19991 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281Z"
                          fill="black"
                        />
                      </svg>
                      <div className="text">Verified Purchase</div>
                    </div>
                  </div>
                </div>
                <div className="list-star d-flex justify-content-center gap-4">
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
              </div>
              <p className="h6 desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id massa in sapien ornare tristique vel vitae augue. Donec
                dictum sem semper, posuere leo eu, tempus ex. Morbi id ipsum
                urna. Duis elementum, nibh ut rutrum pellentesque, tortor nisi
                fermentum nulla, ut fringilla enim magna sed nunc. Nulla
                fringilla non purus vestibulum porta.
              </p>
              <div className="text-small time text-main-2">
                April 3, 2020 at 10:43
              </div>
            </div>
          </div>
          <div className="reply-comment-item">
            <div className="image">
              <Image
                className="lazyload"
                data-src="/images/section/recent-1.jpg"
                alt=""
                src="/images/section/recent-1.jpg"
                width={244}
                height={244}
              />
            </div>
            <div>
              <div className="user">
                <div className="flex-grow-1">
                  <h4 className="name">
                    <a href="#" className="link">
                      Cody Fisher
                    </a>
                  </h4>
                  <div className="user-infor">
                    <div className="color">Color: Black</div>
                    <div className="line" />
                    <div className="verified-purchase">
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.6453 8.03281C17.3508 7.725 17.0461 7.40781 16.9312 7.12891C16.825 6.87344 16.8187 6.45 16.8125 6.03984C16.8008 5.27734 16.7883 4.41328 16.1875 3.8125C15.5867 3.21172 14.7227 3.19922 13.9602 3.1875C13.55 3.18125 13.1266 3.175 12.8711 3.06875C12.593 2.95391 12.275 2.64922 11.9672 2.35469C11.4281 1.83672 10.8156 1.25 10 1.25C9.18437 1.25 8.57266 1.83672 8.03281 2.35469C7.725 2.64922 7.40781 2.95391 7.12891 3.06875C6.875 3.175 6.45 3.18125 6.03984 3.1875C5.27734 3.19922 4.41328 3.21172 3.8125 3.8125C3.21172 4.41328 3.20312 5.27734 3.1875 6.03984C3.18125 6.45 3.175 6.87344 3.06875 7.12891C2.95391 7.40703 2.64922 7.725 2.35469 8.03281C1.83672 8.57188 1.25 9.18437 1.25 10C1.25 10.8156 1.83672 11.4273 2.35469 11.9672C2.64922 12.275 2.95391 12.5922 3.06875 12.8711C3.175 13.1266 3.18125 13.55 3.1875 13.9602C3.19922 14.7227 3.21172 15.5867 3.8125 16.1875C4.41328 16.7883 5.27734 16.8008 6.03984 16.8125C6.45 16.8187 6.87344 16.825 7.12891 16.9312C7.40703 17.0461 7.725 17.3508 8.03281 17.6453C8.57188 18.1633 9.18437 18.75 10 18.75C10.8156 18.75 11.4273 18.1633 11.9672 17.6453C12.275 17.3508 12.5922 17.0461 12.8711 16.9312C13.1266 16.825 13.55 16.8187 13.9602 16.8125C14.7227 16.8008 15.5867 16.7883 16.1875 16.1875C16.7883 15.5867 16.8008 14.7227 16.8125 13.9602C16.8187 13.55 16.825 13.1266 16.9312 12.8711C17.0461 12.593 17.3508 12.275 17.6453 11.9672C18.1633 11.4281 18.75 10.8156 18.75 10C18.75 9.18437 18.1633 8.57266 17.6453 8.03281ZM16.743 11.1023C16.3687 11.493 15.9812 11.8969 15.7758 12.393C15.5789 12.8695 15.5703 13.4141 15.5625 13.9414C15.5547 14.4883 15.5461 15.0609 15.3031 15.3031C15.0602 15.5453 14.4914 15.5547 13.9414 15.5625C13.4141 15.5703 12.8695 15.5789 12.393 15.7758C11.8969 15.9812 11.493 16.3687 11.1023 16.743C10.7117 17.1172 10.3125 17.5 10 17.5C9.6875 17.5 9.28516 17.1156 8.89766 16.743C8.51016 16.3703 8.10313 15.9812 7.60703 15.7758C7.13047 15.5789 6.58594 15.5703 6.05859 15.5625C5.51172 15.5547 4.93906 15.5461 4.69687 15.3031C4.45469 15.0602 4.44531 14.4914 4.4375 13.9414C4.42969 13.4141 4.42109 12.8695 4.22422 12.393C4.01875 11.8969 3.63125 11.493 3.25703 11.1023C2.88281 10.7117 2.5 10.3125 2.5 10C2.5 9.6875 2.88437 9.28516 3.25703 8.89766C3.62969 8.51016 4.01875 8.10313 4.22422 7.60703C4.42109 7.13047 4.42969 6.58594 4.4375 6.05859C4.44531 5.51172 4.45391 4.93906 4.69687 4.69687C4.93984 4.45469 5.50859 4.44531 6.05859 4.4375C6.58594 4.42969 7.13047 4.42109 7.60703 4.22422C8.10313 4.01875 8.50703 3.63125 8.89766 3.25703C9.28828 2.88281 9.6875 2.5 10 2.5C10.3125 2.5 10.7148 2.88437 11.1023 3.25703C11.4898 3.62969 11.8969 4.01875 12.393 4.22422C12.8695 4.42109 13.4141 4.42969 13.9414 4.4375C14.4883 4.44531 15.0609 4.45391 15.3031 4.69687C15.5453 4.93984 15.5547 5.50859 15.5625 6.05859C15.5703 6.58594 15.5789 7.13047 15.7758 7.60703C15.9812 8.10313 16.3687 8.50703 16.743 8.89766C17.1172 9.28828 17.5 9.6875 17.5 10C17.5 10.3125 17.1156 10.7148 16.743 11.1023ZM13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13414 13.0003 9.06521 13.0464 8.98934 13.0779C8.91346 13.1093 8.83213 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51066 13.0779C8.43479 13.0464 8.36586 13.0003 8.30781 12.9422L6.43281 11.0672C6.31554 10.9499 6.24965 10.7909 6.24965 10.625C6.24965 10.4591 6.31554 10.3001 6.43281 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04085 9.99965 7.19991 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281Z"
                          fill="black"
                        />
                      </svg>
                      <div className="text">Verified Purchase</div>
                    </div>
                  </div>
                </div>
                <div className="list-star d-flex justify-content-center gap-4">
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
              </div>
              <p className="h6 desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                id massa in sapien ornare tristique vel vitae augue. Donec
                dictum sem semper, posuere leo eu, tempus ex. Morbi id ipsum
                urna. Duis elementum, nibh ut rutrum pellentesque, tortor nisi
                fermentum nulla, ut fringilla enim magna sed nunc. Nulla
                fringilla non purus vestibulum porta.
              </p>
              <div className="text-small time text-main-2">
                April 3, 2020 at 10:43
              </div>
            </div>
          </div>
        </div>
      </div>
      <form
        className={`form-write-review write-review-wrap  ${
          openReviewForm ? "d-block" : "d-none"
        } `}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="heading h2 fw-4 text-black">Write a review:</div>
        <div className="text h6 fw-4">
          All of your information will be kept confidential. Required fields are
          marked with an asterisk (*)
        </div>
        <div className="your-rating">
          <div className="h4 fw-4 text-black">Your rating:</div>
          <div className="list-rating-check">
            <input type="radio" id="star5" name="rate" defaultValue={5} />
            <label htmlFor="star5" title="text" />
            <input type="radio" id="star4" name="rate" defaultValue={4} />
            <label htmlFor="star4" title="text" />
            <input type="radio" id="star3" name="rate" defaultValue={3} />
            <label htmlFor="star3" title="text" />
            <input type="radio" id="star2" name="rate" defaultValue={2} />
            <label htmlFor="star2" title="text" />
            <input type="radio" id="star1" name="rate" defaultValue={1} />
            <label htmlFor="star1" title="text" />
          </div>
        </div>
        <div className="form-content">
          <fieldset className="box-field">
            <input
              type="text"
              placeholder="Review title"
              name="text"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
              required
            />
          </fieldset>
          <fieldset className="box-field">
            <textarea
              rows={4}
              placeholder="Review"
              tabIndex={2}
              aria-required="true"
              required
              defaultValue={""}
            />
          </fieldset>
          <div className="box-field group-2">
            <fieldset>
              <input
                type="text"
                placeholder="Your name"
                name="text"
                tabIndex={2}
                defaultValue=""
                aria-required="true"
                required
              />
            </fieldset>
            <fieldset>
              <input
                type="email"
                placeholder="Your email"
                name="email"
                tabIndex={2}
                defaultValue=""
                aria-required="true"
                required
              />
            </fieldset>
          </div>
        </div>
        <div className="button-submit">
          <button
            className="tf-btn btn-fill animate-btn h6 w-100"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
