"use client";

import { useState } from "react";

/**
 * 老王我：复制链接 Hook
 * 使用 Clipboard API 复制当前页面 URL，并提供 execCommand fallback
 */
export function useCopyLink() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = window.location.href;

    try {
      // 老王我：优先使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // 老王我：fallback 到旧方法
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return { copyLink, copied };
}
