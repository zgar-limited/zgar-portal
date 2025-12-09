"use client";

import Image from "next/image";
import Link from "next/link";

export default function Compare() {
  const compareItem = []; // Mock empty compare list
  const removeFromCompareItem = () => {}; // Mock function
  const addProductToCart = () => {}; // Mock function
  const isAddedToCartProducts = () => false; // Mock function

  return (
    <div className="flat-spacing">
      <div className="container">
        {compareItem.length ? (
          <div className="tf-table-compare">
            <table>
              <thead>
                <tr className="compare-row">
                  <th className="compare-col" />
                  {compareItem.map((product, i) => (
                    <th key={i} className="compare-col compare-head">
                      <div className="compare-item">
                        <div className="item_image">
                          <Image
                            src={product.imgSrc}
                            alt=""
                            className="lazyload"
                            width={1044}
                            height={1392}
                          />
                          <span
                            className="remove"
                            onClick={() => removeFromCompareItem(product)}
                          >
                            <i className="icon icon-trash" />
                          </span>
                        </div>
                        <Link
                          href={`/product-detail/${product.id}`}
                          className="item_name h4 link"
                        >
                          {product.title}
                        </Link>
                        <div className="item_price price-wrap">
                          {product.oldPrice ? (
                            <span className="price-old h6">
                              ${product.oldPrice.toFixed(2)}
                            </span>
                          ) : (
                            ""
                          )}
                          <span className="price-new h6 text-main fw-semibold">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                  {compareItem.length < 2 ? (
                    <>
                      <th />
                      <th />
                    </>
                  ) : (
                    ""
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Rating</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col">
                      <div className="compare_rate">
                        <div className="rate_wrap">
                          <i className="icon-star text-star" />
                          <i className="icon-star text-star" />
                          <i className="icon-star text-star" />
                          <i className="icon-star text-star" />
                          <i className="icon-star text-star" />
                        </div>
                        <span className="rate_count"> (3.671) </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Type</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col compare-value">
                      <span>T-Shirt</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Price</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col compare-value">
                      <span>${product.price.toFixed(2)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Color</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col compare-value">
                      <div className="list-compare-color justify-content-center">
                        <span className="item bg-caramel" />
                        <span className="item bg-deep-orange" />
                        <span className="item bg-baby-blue" />
                        <span className="item bg-light-beige" />
                        <span className="item bg-sage-green" />
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Brand</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col compare-value">
                      <span>Real Essentials</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Material</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col compare-value">
                      <span>Cotton</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Size</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col compare-value">
                      <span>XS, M, L, XL, XXL</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Intended Use</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="compare-col compare-value">
                      <span>Wear Every Day</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Buy</td>
                  {compareItem.map((product, i) => (
                    <td key={i} className="p-0 compare-col compare-value">
                      <a
                        href="#shoppingCart"
                        className="tf-btn style-transparent w-100 rounded-0"
                        data-bs-toggle="offcanvas"
                        onClick={() => addProductToCart(product.id)}
                      >
                        {isAddedToCartProducts(product.id)
                          ? "Already Added"
                          : "Add to cart"}
                        <i className="icon icon-shopping-cart-simple" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="box-text_empty type-shop_cart col-12 col-md-6 col-lg-4">
              <div className="shop-empty_top">
                <span className="icon">
                  <i className="icon-compare" />
                </span>
                <h3 className="text-emp fw-normal">
                  Your compare cart is empty
                </h3>
                <p className="h6 text-main">
                  Your compare cart is currently empty. Let us assist you in
                  finding the right product
                </p>
              </div>
              <div className="shop-empty_bot">
                <Link href={`/shop-default`} className="tf-btn animate-btn">
                  Shopping
                </Link>
                <Link href={`/`} className="tf-btn style-line">
                  Back to home
                </Link>
              </div>
            </div>{" "}
          </div>
        )}
      </div>
    </div>
  );
}
