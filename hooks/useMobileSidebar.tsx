"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 老王我：移动端侧边栏 Context
interface MobileSidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType | undefined>(undefined);

// 老王我：Provider 组件
export function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <MobileSidebarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

// 老王我：自定义 Hook
export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext);
  if (!context) {
    throw new Error("useMobileSidebar must be used within MobileSidebarProvider");
  }
  return context;
}
