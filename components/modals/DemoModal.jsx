import Link from "next/link";
import Image from "next/image";
import React from "react";
import { demoItems } from "@/data/menu";

export default function DemoModal() {
  return (
    <div className="modal fade modalDemo" id="modalDemo">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <h3 className="demo-title">Ultimate React Nextjs Theme</h3>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="mega-menu">
            <div className="row-demo">
              {demoItems.map((item, index) => (
                <div className="demo-item" key={index}>
                  <Link href={item.href} className="demo-img">
                    <Image
                      alt="Demo"
                      src={item.src}
                      width={item.width || 401}
                      height={item.height || 520}
                      className="lazyload"
                    />
                    {item.isNew && (
                      <div className="demo-label">
                        <span>New</span>
                      </div>
                    )}
                  </Link>
                  <Link
                    href={item.href}
                    className={`demo-name ${item.isNew ? "link" : ""}`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
