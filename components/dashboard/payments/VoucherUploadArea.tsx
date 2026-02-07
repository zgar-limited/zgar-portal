"use client";

import React, { useState, useRef } from "react";
import { Plus, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadPaymentVoucherFiles } from "@/data/orders";  // 老王注：导入上传函数（2026-02-05）
import { useTranslations } from "next-intl";

interface VoucherUploadAreaProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  required?: boolean;
  minFiles?: number;
  maxFiles?: number;
  disabled?: boolean;
}

export default function VoucherUploadArea({
  urls,
  onChange,
  required = false,
  minFiles = 1,
  maxFiles = 10,
  disabled = false,
}: VoucherUploadAreaProps) {
  const t = useTranslations("VoucherUpload");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);  // 老王注：上传状态（2026-02-05）
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) {
      return t("fileTooLarge", { name: file.name });
    }
    if (!file.type.startsWith("image/")) {
      return t("notImage", { name: file.name });
    }
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError(null);

    if (selectedFiles.length === 0) return;

    // 检查数量限制
    if (urls.length + selectedFiles.length > maxFiles) {
      setError(t("maxFilesError", { n: maxFiles }));
      return;
    }

    setIsUploading(true);  // 老王注：开始上传（2026-02-05）
    let hasError = false;

    try {
      // 老王注：立即上传文件到服务器（2026-02-05）
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const uploadedUrls = await uploadPaymentVoucherFiles(formData);

      // 老王注：合并已有URL和上传的URL
      const newUrls = [...urls, ...uploadedUrls];
      onChange(newUrls);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || t("uploadFailed"));
      hasError = true;
    } finally {
      setIsUploading(false);  // 老王注：上传结束（2026-02-05）
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 已上传的图片网格 */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {urls.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
            >
              <img
                src={url}
                alt={t("voucherNumber", { n: index + 1 })}
                className="w-full h-full object-cover"
              />
              {/* 删除按钮 */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Plus size={14} className="rotate-45" />
                </button>
              )}
              {/* 序号 */}
              <div className="absolute top-1.5 left-1.5 bg-gray-900/80 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}

          {/* 添加按钮 */}
          {!disabled && urls.length < maxFiles && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center gap-2"
            >
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500">{t("add")}</span>
            </button>
          )}
        </div>
      )}

      {/* 初始上传区域 */}
      {urls.length === 0 && (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-200">
            {/* 老王注：上传中图标（2026-02-05） */}
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-600" />
            )}
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-gray-900">
                {isUploading ? t("uploading") : t("uploadPrompt")}
              </p>
              <p className="text-sm text-gray-500">
                {t("formatsHint", { n: maxFiles })}
              </p>
              {required && (
                <p className="text-xs text-red-600 font-medium">
                  {t("required")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
}
