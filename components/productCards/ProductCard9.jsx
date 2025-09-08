import Link from "next/link";
import Image from "next/image";
import React from "react";
import CartButton from "../productActionButtons/CartButton";
import WishlistButton from "../productActionButtons/WishlistButton";
import CompareButton from "../productActionButtons/CompareButton";
import QuickViewButton from "../productActionButtons/QuickViewButton";

export default function ProductCard9({ product }) {
  return (
    <div className="card-product product-style_list-mini type-2 hover-img">
      <div className="card-product_wrapper">
        <Link
          href={`/product-detail/${product.id}`}
          className="product-img img-style"
        >
          <Image
            className="img-product lazyload"
            src={product.imgSrc}
            alt="Product"
            width={244}
            height={244}
          />
        </Link>
      </div>
      <div className="card-product_info z-5">
        <p className="tag-product text-small">{product.tag}</p>
        <h6 className="name-product">
          <Link href={`/product-detail/${product.id}`} className="link">
            {product.title}
          </Link>
        </h6>
        <div className="group-action">
          <div className="price-wrap mb-0">
            <h4 className="price-new">${product.price.toFixed(2)}</h4>
            <span className="price-old h6">${product.oldPrice.toFixed(2)}</span>
          </div>
          <ul className="product-action_list style-row">
            <li>
              <CartButton tooltipDirection="top" product={product} />
            </li>
            <li className="wishlist">
              <WishlistButton tooltipDirection="top" product={product} />
            </li>
            <li className="compare">
              <CompareButton tooltipDirection="top" product={product} />
            </li>
            <li>
              <QuickViewButton tooltipDirection="top" product={product} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
