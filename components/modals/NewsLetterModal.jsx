"use client";

import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NewsLetterModal() {
  const t = useTranslations("AgeVerification");
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
        <div className="p-0 modal-content">
          <div className="modal-heading">
            {/* <div className="image">
              <Image
                className="lazyload"
                src="/images/section/newletter.jpg"
                alt="Image"
                width={1044}
                height={666}
              />
            </div> */}
            {/* <span className="icon-close-popup" data-bs-dismiss="modal">
              <i className="icon-close" />
            </span> */}
          </div>
          <div className="p-5 text-center modal-body">
            <p className="mb-4 h6 sub-title">{t("title")}</p>
            
            <div className="mb-4 alert alert-warning">
              <strong>{t("warning")}</strong>
              <p className="mt-2 text-sm">{t("subWarning")}</p>
            </div>

            <h3 className="mb-4 fw-normal title h5">
              {t("description")}
            </h3>
            <div className="gap-2 d-flex justify-content-center flex-column">
              <button
                type="button"
                className="btn btn-dark w-100"
                data-bs-dismiss="modal"
              >
                {t("confirm")}
              </button>
              <button
                type="button"
                className="btn btn-light w-100"
                onClick={() => window.history.back()}
              >
                {t("reject")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
