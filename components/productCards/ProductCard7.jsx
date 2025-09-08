import Link from "next/link";
import Image from "next/image";
import React from "react";
import CartButton from "../productActionButtons/CartButton";
import WishlistButton from "../productActionButtons/WishlistButton";
import CompareButton from "../productActionButtons/CompareButton";
import QuickViewButton from "../productActionButtons/QuickViewButton";

export default function ProductCard7({ product }) {
  return (
    <div className="card-product style-5">
      <div className="card-product_wrapper aspect-ratio-0 d-flex radius-16">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            src={product.imgSrc}
            alt="Product"
            width={648}
            height={736}
          />
          <Image
            className="lazyload img-hover"
            src={product.imgHoverSrc}
            alt="Product"
            width={648}
            height={736}
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
      <div className="card-product_info d-grid">
        <p className="tag-product text-small">{product.tag}</p>
        <h6 className="name-product">
          <Link href={`/product-detail/${product.id}`} className="link">
            {product.title}
          </Link>
        </h6>
        <div className="rate_wrap w-100">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="icon-star text-star" />
          ))}
        </div>
        <div className="price-wrap mb-0">
          <h4 className="price-new">${product.price.toFixed(2)}</h4>
          <span className="price-old h6">${product.oldPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
