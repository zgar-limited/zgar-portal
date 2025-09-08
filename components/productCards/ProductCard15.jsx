import Link from "next/link";
import Image from "next/image";
import React from "react";
import CartButton3 from "../productActionButtons/CartButton3";

export default function ProductCard15({ product }) {
  return (
    <div className="card-product product-style_list-mini type-3 style-border hover-img">
      <div className="card-product_wrapper d-flex aspect-ratio-0 h-100">
        <Link
          href={`/product-detail/${product.id}`}
          className="product-img img-style"
        >
          <Image
            className="img-product lazyload"
            src={product.imgSrc}
            alt={product.title}
            width={388}
            height={600}
          />
        </Link>
      </div>

      <div className="card-product_info">
        <div>
          <Link
            href={`/product-detail/${product.id}`}
            className="name-product h4 fw-medium link text-line-clamp-2"
          >
            {product.title}
          </Link>
          <div className="rate_wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} className="icon-star text-star" />
            ))}
          </div>
        </div>

        <div className="product-progress_sold primary-3">
          <div
            className="progress-sold progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-bar"
              style={{ width: `${product.progress}%` }}
            />
          </div>
          <div className="box-quantity">
            <p className="text-avaiable">
              Available:{" "}
              <span className="fw-bold text-black">{product.available}</span>
            </p>
            <p className="text-avaiable">
              Sold: <span className="fw-bold text-black">{product.sold}</span>
            </p>
          </div>
        </div>

        <div className="price-wrap mb-0">
          <h4 className="price-new">${product.price.toFixed(2)}</h4>
          <span className="price-old h6">${product.oldPrice.toFixed(2)}</span>
        </div>

        <CartButton3 product={product} />
      </div>
    </div>
  );
}
