"use client";

import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";


  // 老王我：统一的金额格式化函数
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `{formatAmount(amount)}`;
  };
export default function BoughtTogether() {
  // Mock functions
  const addProductToCart = () => {};
  const isAddedToCartProducts = () => false;

  // 💰 Calculate total with reducer
  const totalPrice = boughtTogetherProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );
  const allAdded = false; // Mock value
  const addAll = () => {
    // Mock function - no action
  };

  return (
    <div className="tf-product-fbt">
      <h4 className="text-xl title fw-medium">Frequently Bought Together</h4>

      <form
        className="tf-product-form-bundle"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="tf-bundle-products">
          {boughtTogetherProducts.map((product) => (
            <div key={product.id} className="tf-bundle-product-item">
              <Link
                href={`/product-detail/${product.id}`}
                className="bundle-image"
              >
                <Image
                  className="lazyloaded"
                  src={product.imgSrc}
                  alt={product.title}
                  width={1044}
                  height={1392}
                />
              </Link>

              <div className="bundle-info">
                <div className="text-small">{product.category}</div>
                <h6 className="text-black text-line-clamp-1">
                  {product.title}
                </h6>
                <div className="price-wrap">
                  <span className="price-old h6 fw-normal">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                  <span className="price-new h6">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bundle-check">
                <input type="checkbox" className="tf-check" />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bundle-total-submit">
            <div className="text">Total price:</div>
            <span className="text-black total-price fw-7">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#shoppingCart"
            onClick={addAll}
            className="btn-submit-total tf-btn btn-primary w-100"
          >
            {allAdded ? "selected already added" : "Add selected to cart"}

            <i className="icon icon-shopping-cart-simple" />
          </button>
        </div>
      </form>
    </div>
  );
}
