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
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };
  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const email = e.target.email.value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        e.target.reset(); // Reset the form
        setSuccess(true); // Set success state
        handleShowMessage();
      } else {
        setSuccess(false); // Handle unexpected responses
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || "An error occurred");
      setSuccess(false); // Set error state
      handleShowMessage();
      e.target.reset(); // Reset the form
    }
  };
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
            <p className="h6 sub-title">Subscribe to our newletter!</p>
            <h3 className="fw-normal title">
              Receive 20% off your next order, along with exclusive offers and
              more!
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendEmail(e);
              }}
              className="form-newletter"
            >
              <fieldset className="mb-12">
                <input
                  className="style-stroke"
                  type="text"
                  placeholder="Enter your email"
                  required
                  name="email"
                />
              </fieldset>
              <button type="submit" className="tf-btn w-100 animate-btn">
                Subscribe
              </button>
            </form>
            <div
              className={`tfSubscribeMsg text-center  footer-sub-element ${
                showMessage ? "active" : ""
              }`}
            >
              {success ? (
                <p style={{ color: "rgb(52, 168, 83)" }}>
                  You have successfully subscribed.
                </p>
              ) : (
                <p style={{ color: "red" }}>Something went wrong</p>
              )}
            </div>
            <ul className="tf-social-icon justify-content-center w-100">
              <li>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  className="social-facebook"
                >
                  <span className="icon">
                    <i className="icon-fb" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  className="social-instagram"
                >
                  <span className="icon">
                    <i className="icon-instagram-logo" />
                  </span>
                </a>
              </li>
              <li>
                <a href="https://x.com/" target="_blank" className="social-x">
                  <span className="icon">
                    <i className="icon-x" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  className="social-tiktok"
                >
                  <span className="icon">
                    <i className="icon-tiktok" />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
