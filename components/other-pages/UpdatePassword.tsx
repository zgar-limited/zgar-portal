"use client";
import React, { useState, useActionState, useEffect } from "react";
import { updatePassword } from "@/data/customer";
import { useSearchParams } from "next/navigation";
import { Link } from '@/i18n/routing';

export default function UpdatePassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [state, formAction, isPending] = useActionState(updatePassword, null) as [
    { success: boolean; error?: string } | null,
    (payload: FormData) => void,
    boolean
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const formData = new FormData(e.currentTarget);
    // Ensure token and email are included if they are not in the form as hidden inputs
    // But we will add them as hidden inputs
    React.startTransition(() => {
      formAction(formData);
    });
  };

  if (!token || !email) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="text-center">
            <h3 className="mb-4">Invalid Link</h3>
            <p className="mb-4 text-muted">
              The password reset link is invalid or has expired.
            </p>
            <Link href="/login" className="tf-btn animate-btn">
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
            <h3 className="mb-2">Update Password</h3>
            <p className="text-muted">Enter your new password below.</p>
          </div>

          <form className="form-login" onSubmit={handleSubmit}>
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="email" value={email} />
            
            <div className="list-ver" style={{ gap: "20px" }}>
              <fieldset className="password-wrapper">
                <input
                  name="password"
                  className="password-field"
                  type={showPass1 ? "text" : "password"}
                  placeholder="New Password *"
                  required
                  style={{ borderRadius: "8px", padding: "15px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  placeholder="Confirm New Password *"
                  required
                  style={{ borderRadius: "8px", padding: "15px" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPass2((pre) => !pre)}
                  className={`toggle-pass ${
                    showPass2 ? "icon-view" : "icon-show-password"
                  } `}
                  style={{ right: "15px" }}
                />
              </fieldset>

              {state?.error && (
                <div className="mt-2 text-danger">{state.error}</div>
              )}
            </div>

            <button
              type="submit"
              className="tf-btn animate-btn w-100"
              style={{ marginTop: "24px", borderRadius: "8px" }}
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}