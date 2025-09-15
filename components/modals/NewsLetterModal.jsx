"use client";

import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NewsLetterModal() {
  const [modalShown, setModalShown] = useState(false);
  const pathname = usePathname();
  const modalElement = useRef();
  useEffect(() => {
    if (pathname == "/" && !modalShown) {
      const showModal = async () => {
        const bootstrap = await import("bootstrap"); // dynamically import bootstrap
        const myModal = new bootstrap.Modal(
          document.getElementById("newsletterPopup"),
          {
            keyboard: false,
          }
        );

        // Show the modal after a delay using a promise
        await new Promise((resolve) => setTimeout(resolve, 2000));
        myModal.show();

        modalElement.current?.addEventListener("hidden.bs.modal", () => {
          myModal.hide();
        });
      };
      showModal();
      setModalShown(true);
    }
  }, [pathname]);

  return (
    <div
      ref={modalElement}
      className="modal modalCentered fade modal-newletter auto-popup"
      id="newsletterPopup"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-0">
          <div className="modal-heading">
            <div className="image">
              <Image
                className="lazyload"
                src="/images/section/newletter.jpg"
                alt="Image"
                width={1044}
                height={666}
              />
            </div>
            <span className="icon-close-popup" data-bs-dismiss="modal">
              <i className="icon-close" />
            </span>
          </div>
          <div className="modal-body">
            <p className="h6 sub-title">Zgar Tips!</p>
            <h3 className="fw-normal title">
              This website contains adult material and is only suitable for
              those 21 years or older. Click Enter only if you are at least 21
              years of age.
            </h3>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-light "
                data-bs-dismiss="modal"
              >
                Exit
              </button>
              <button
                type="button"
                className="btn btn-dark "
                data-bs-dismiss="modal"
              >
                I'm over 21
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
