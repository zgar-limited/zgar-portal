import Link from "next/link";
import Image from "next/image";
import React from "react";
import CartButton from "../productActionButtons/CartButton";
import WishlistButton from "../productActionButtons/WishlistButton";
import CompareButton from "../productActionButtons/CompareButton";
import QuickViewButton from "../productActionButtons/QuickViewButton";

export default function ProductCard2({ product, addedClass = "" }) {
  return (
    <div className="wow fadeInUp">
      <div
        className={`card-product bundle-hover-item ${addedClass} ${product.pinClass}`}
      >
        <div className="card-product_wrapper d-flex">
          <Link href={`/product-detail/${product.id}`} className="product-img">
            <Image
              className="lazyload img-product"
              src={product.imgSrc}
              alt={""}
              width={648}
              height={865}
            />
            <Image
              className="lazyload img-hover"
              src={product.imgHoverSrc}
              alt={""}
              width={648}
              height={865}
            />
          </Link>
          <ul className="product-action_list">
            <li>
              <CartButton product={product} />
            </li>
            <li className="wishlist">
              <WishlistButton product={product} />
            </li>
            <li className="compare">
              <CompareButton product={product} />
            </li>
            <li>
              <QuickViewButton product={product} />
            </li>
          </ul>
        </div>
        <div className="card-product_info">
          <Link
            href={`/product-detail/${product.id}`}
            className="name-product h4 link"
          >
            {product.title}
          </Link>
          <div className="price-wrap mb-0">
            {product.oldPrice ? (
              <span className="price-old h6 fw-normal">
                ${product.oldPrice.toFixed(2)}
              </span>
            ) : (
              ""
            )}
            <span className="price-new h6">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
