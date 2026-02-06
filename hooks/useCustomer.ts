"use client";

import { useState, useEffect } from "react";

/**
 * 客户端hook - 检查用户登录状态
 * 老王我通过API来检查登录状态，因为httpOnly的cookie客户端读不到
 *
 * @returns { isLoggedIn: boolean, isLoaded: boolean }
 */
export function useCustomer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    // 调用API检查登录状态 - 老王我这个方法靠谱
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isLoggedIn);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLoggedIn(false);
      } finally {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    };

    checkLoginStatus();

    return () => {
      mounted = false;
    };
  }, []);

  return { isLoggedIn, isLoaded };
}
