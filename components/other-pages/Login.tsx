"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CountryCodeSelect from "../common/CountryCodeSelect";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [countryCode, setCountryCode] = useState("+86");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/account-page");
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div
          className="login-register-wrapper"
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            width: "100%",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          {/* Tab Header */}
          <div
            className="tabs-header"
            style={{
              display: "flex",
              marginBottom: "30px",
              borderBottom: "1px solid #eee",
            }}
          >
            <button
              className={`tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: "15px",
                background: "none",
                border: "none",
                borderBottom: isLogin ? "2px solid var(--black)" : "2px solid transparent",
                fontWeight: isLogin ? "600" : "400",
                fontSize: "18px",
                color: isLogin ? "var(--black)" : "var(--text-2)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Login
            </button>
            <button
              className={`tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: "15px",
                background: "none",
                border: "none",
                borderBottom: !isLogin ? "2px solid var(--black)" : "2px solid transparent",
                fontWeight: !isLogin ? "600" : "400",
                fontSize: "18px",
                color: !isLogin ? "var(--black)" : "var(--text-2)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          <div className="form-content">
            {isLogin ? (
              // Login Form
              <form className="form-login" onSubmit={handleSubmit}>
                <div className="list-ver" style={{ gap: "20px" }}>
                  <fieldset>
                    <input
                      type="email"
                      placeholder="Enter your email address *"
                      required
                      style={{ borderRadius: "8px", padding: "15px" }}
                    />
                  </fieldset>
                  <fieldset className="password-wrapper">
                    <input
                      className="password-field"
                      type={showPass1 ? "text" : "password"}
                      placeholder="Password *"
                      required
                      style={{ borderRadius: "8px", padding: "15px" }}
                    />
                    <span
                      onClick={() => setShowPass1((pre) => !pre)}
                      className={`toggle-pass ${
                        showPass1 ? "icon-view" : "icon-show-password"
                      } `}
                      style={{ right: "15px" }}
                    />
                  </fieldset>
                  <div className="check-bottom">
                    <div className="checkbox-wrap">
                      <input
                        id="remember"
                        type="checkbox"
                        className="tf-check"
                      />
                      <label htmlFor="remember" className="h6">
                        Keep me signed in
                      </label>
                    </div>
                    <h6>
                      <a href="#" className="link">
                        Forgot your password?
                      </a>
                    </h6>
                  </div>
                </div>

                <button
                  id="btnLogin"
                  type="submit"
                  className="tf-btn animate-btn w-100"
                  style={{ marginTop: "24px", borderRadius: "8px" }}
                >
                  Login
                </button>
              </form>
            ) : (
              // Register Form
              <form className="form-register" onSubmit={handleSubmit}>
                <div className="list-ver" style={{ gap: "20px" }}>
                  <fieldset>
                    <input
                      type="email"
                      placeholder="Enter your email address *"
                      required
                      style={{ borderRadius: "8px", padding: "15px" }}
                    />
                  </fieldset>
                  
                  {/* Phone Number with Country Code */}
                  <div className="phone-input-group" style={{ display: "flex", gap: "12px" }}>
                    <CountryCodeSelect onSelect={setCountryCode} initialCode="+86" />
                    <fieldset style={{ flex: 1 }}>
                      <input
                        type="tel"
                        placeholder="Phone number *"
                        required
                        style={{ borderRadius: "8px", padding: "15px" }}
                      />
                    </fieldset>
                  </div>

                  <fieldset className="password-wrapper">
                    <input
                      className="password-field"
                      type={showPass1 ? "text" : "password"}
                      placeholder="Password *"
                      required
                      style={{ borderRadius: "8px", padding: "15px" }}
                    />
                    <span
                      onClick={() => setShowPass1((pre) => !pre)}
                      className={`toggle-pass ${
                        showPass1 ? "icon-view" : "icon-show-password"
                      } `}
                      style={{ right: "15px" }}
                    />
                  </fieldset>
                  <fieldset className="password-wrapper">
                    <input
                      className="password-field"
                      type={showPass2 ? "text" : "password"}
                      placeholder="Confirm Password *"
                      required
                      style={{ borderRadius: "8px", padding: "15px" }}
                    />
                    <span
                      onClick={() => setShowPass2((pre) => !pre)}
                      className={`toggle-pass ${
                        showPass2 ? "icon-view" : "icon-show-password"
                      } `}
                      style={{ right: "15px" }}
                    />
                  </fieldset>
                </div>

                <div className="check-bottom" style={{ marginTop: "20px" }}>
                  <div className="checkbox-wrap">
                    <input
                      id="terms"
                      type="checkbox"
                      className="tf-check"
                      required
                    />
                    <label htmlFor="terms" className="h6">
                      I agree to the <a href="#" className="link">Terms of User</a>
                    </label>
                  </div>
                </div>

                <button
                  id="btnRegister"
                  type="submit"
                  className="tf-btn animate-btn w-100"
                  style={{ marginTop: "24px", borderRadius: "8px" }}
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
