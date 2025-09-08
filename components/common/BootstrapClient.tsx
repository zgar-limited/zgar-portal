"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Only run this in the browser
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  return null; // This component only loads scripts
}
