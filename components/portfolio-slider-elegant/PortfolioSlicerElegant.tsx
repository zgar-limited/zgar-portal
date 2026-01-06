"use client";

import Image from "next/image";
import { Link } from '@/i18n/routing';

const PortfolioSlicerElegant = () => {
  return (
    <div className="w-full px-4">
      <div className="flex gap-2 h-auto md:h-[500px] flex-wrap md:flex-nowrap">
        {[
          {
            href: "",
            img: `/images/slot/homecate/1.jpg`,
            title: "Product 1",
          },
          {
            href: "",
            img: `/images/slot/homecate/2.jpg`,
            title: "Product 2",
          },
          {
            href: "",
            img: `/images/slot/homecate/3.jpg`,
            title: "Product 3",
          },
          {
            href: "",
            img: `/images/slot/homecate/4.jpg`,
            title: "Product 4",
          },
          {
            href: "",
            img: `/images/slot/homecate/5.jpg`,
            title: "Product 5",
          },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="relative overflow-hidden rounded-3xl flex-1 min-w-0 transition-all duration-500 ease-out hover:flex-[2] group h-[300px] md:h-auto"
          >
            <Image
              src={item.img}
              alt={item.title}
              width={800}
              height={600}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* 标题 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white text-xl font-bold">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSlicerElegant;
