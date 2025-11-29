"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page with register tab active intent if possible,
    // but our Login component controls the state internally.
    // Ideally we should pass a prop to Login to set initial state,
    // or just redirect to /login and user can switch tabs.
    // Given the task, we merged Register into Login.
    router.replace("/login");
  }, [router]);

  return null;
}
