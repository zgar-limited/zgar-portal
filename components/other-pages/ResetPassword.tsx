"use client";
import React, { useState, useActionState } from "react";
import { resetPassword } from "@/data/customer";
import { Link } from '@/i18n/routing';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(resetPassword, null) as [
    { success: boolean; message: string } | null,
    (payload: FormData) => void,
    boolean
  ];

  return (
    <section className="flat-spacing">
      <div className="container">
        <div
          className="login-register-wrapper account-box-shadow"
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            width: "100%",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "12px",
          }}
        >
          <div className="mb-4 text-center">
            <h3 className="mb-2">Reset Password</h3>
            <p className="text-muted">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          <form className="form-login" action={formAction}>
            <div className="list-ver" style={{ gap: "20px" }}>
              <fieldset>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address *"
                  required
                  style={{ borderRadius: "8px", padding: "15px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </fieldset>

              {state?.message && (
                <div
                  className={`mt-2 ${
                    state.success ? "text-success" : "text-danger"
                  }`}
                >
                  {state.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="tf-btn animate-btn w-100"
              style={{ marginTop: "24px", borderRadius: "8px" }}
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="mt-3 text-center">
              <Link href="/login" className="link">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}