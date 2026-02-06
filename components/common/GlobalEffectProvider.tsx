"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useGlobalTaskTracker } from "@/hooks/useGlobalTaskTracker"; // 老王我添加：全局任务追踪
import type { StoreCustomer } from "@medusajs/types"; // 老王我添加：用户类型

export default function GlobalEffectsProvider({
  customer,
}: {
  customer?: StoreCustomer | null; // 老王我添加：用户信息
}) {
  const hasLoadedBootstrap = useRef(false);
  const bootstrapRef = useRef(null);
  const wowRef = useRef(null); // Save WOW module (imported once)

  const pathname = usePathname();

  // 老王我添加：全局任务追踪（传递登录状态）
  useGlobalTaskTracker(!!customer);

  // Load Bootstrap JS only once on client
  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedBootstrap.current) return;

    import("bootstrap/dist/js/bootstrap.esm")
      .then((module) => {
        hasLoadedBootstrap.current = true;
        bootstrapRef.current = module;
      })
      .catch((err) => console.error("Failed to load Bootstrap:", err));
  }, []);

  // Close any open modals/offcanvas on route change
  useEffect(() => {
    if (!hasLoadedBootstrap.current || !bootstrapRef.current) return;

    const bootstrap = bootstrapRef.current;

    // Close all open modals
    document.querySelectorAll(".modal.show").forEach((modal) => {
      const instance = bootstrap.Modal.getOrCreateInstance(modal);
      if (instance) instance.hide();
    });

    // Close all open offcanvas
    document.querySelectorAll(".offcanvas.show").forEach((offcanvas) => {
      const instance = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
      if (instance) instance.hide();
    });
  }, [pathname]);

  // WOW.js: import once, but init on every route change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initWow = async () => {
      if (!wowRef.current) {
        const module = (await import("@/utils/wow")).default;

        wowRef.current = new module({
          mobile: false,
        });
        wowRef.current.init();
      } else {
        wowRef.current.sync();
      }
    };

    initWow();
  }, [pathname]);
  return null;
}
