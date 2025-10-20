"use client";

import React, { useState } from "react";

import axios from "axios";
import Link from "next/link";

export default function NewsLetterForm({ isBgDark = false }) {
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
    <form
      className="form_sub has_check"
      id="subscribe-form"
      onSubmit={(e) => {
        e.preventDefault();
        sendEmail(e);
      }}
    >
      <div className="f-content" id="subscribe-content">
        <fieldset className="col">
          <input
            className={isBgDark ? "style-stroke-2" : "style-stroke"}
            id="subscribe-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </fieldset>
        <button
          id="subscribe-button"
          type="submit"
          className={`tf-btn animate-btn type-small-2 ${
            isBgDark ? "btn-white animate-dark" : ""
          }`}
        >
          Subscribe
          <i className="icon icon-arrow-right" />
        </button>
      </div>
      {/* <div className="checkbox-wrap">
        <input
          id="remember"
          type="checkbox"
          className={`tf-check style-3 ${isBgDark ? "style-white" : ""} `}
        />
        <label
          htmlFor="remember"
          className={`h6 ${isBgDark ? "text-main-5" : ""}`}
        >
          By clicking subcribe, you agree to the &nbsp;{" "}
          <Link
            href={`/faq`}
            className={`text-decoration-underline link ${
              isBgDark ? "text-main-5" : ""
            }`}
          >
            Terms of Service{" "}
          </Link>{" "}
          and{" "}
          <Link
            href={`/faq`}
            className={`text-decoration-underline link ${
              isBgDark ? "text-main-5" : ""
            }`}
          >
            Privacy Policy
          </Link>
          .
        </label>
      </div> */}
      <div id="subscribe-msg">
        <div
          className={`tfSubscribeMsg  footer-sub-element ${
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
      </div>
    </form>
  );
}
