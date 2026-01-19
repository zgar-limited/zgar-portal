"use client";

import React from "react";
import { useMobileSidebar } from "@/hooks/useMobileSidebar";

export default function SidebarToggler() {
  const { setOpen } = useMobileSidebar();

  return (
    <div className="fixed bottom-6 left-6 z-40 lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 bg-black dark:bg-white rounded-full shadow-lg flex items-center justify-center hover:opacity-80 transition-opacity"
        aria-label="Open menu"
      >
        <i className="icon icon-sidebar text-white dark:text-black text-xl" />
      </button>
    </div>
  );
}
