import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function DepartmentsOrganic() {
  return (
    <>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-seasonal" />
          Seasonal Fruits
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-dry" />
          Dried Fruits
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-fresh" />
          Fresh Fruit
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-vegetable" />
          Vegetables
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-mushroom" />
          Mushrooms
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-ponk" />
          Organic Pork
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-poultry" />
          Poultry &amp; Eggs
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-seafood" />
          Seafood
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-nut" />
          Organic Nuts
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-grain" />
          Organic Grains
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-rice" />
          Organic Rice
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-noodles" />
          Noodles
        </Link>
      </li>
      <li>
        <Link href={`/shop-default`} className="nav-category_link h5">
          <i className="icon icon-canned" />
          Canned Food
        </Link>
      </li>
    </>
  );
}
