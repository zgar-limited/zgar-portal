import Link from "next/link";
import Image from "next/image";
import { blogArticles } from "@/data/blogs";
import React from "react";

export default function BlogGrid() {
  return (
    <div className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout sm-col-2 lg-col-3">
          {blogArticles.map((item, index) => (
            <div className="article-blog hover-img4" key={index}>
              <div className="blog-image">
                <Link href={`/blog-detail`} className="entry_image img-style4">
                  <Image
                    src={item.imgSrc}
                    alt=""
                    className="lazyload"
                    width={896}
                    height={968}
                  />
                </Link>
                <div className="entry_tag">
                  <span className="name-tag h6">{item.tag}</span>
                </div>
              </div>
              <div className="blog-content">
                <Link href={`/blog-detail`} className="entry_name link h4">
                  {item.title}
                </Link>
                <p className="entry_date">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
