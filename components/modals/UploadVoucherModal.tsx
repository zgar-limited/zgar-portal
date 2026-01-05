"use client";

import React, { useState, useRef, useMemo } from "react";
import { Upload, X, CheckCircle, AlertCircle, Plus, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl"; // 老王我添加：多语言支持
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 老王我改成使用服务端函数，安全！
import { uploadPaymentVoucherFiles, submitPaymentVoucher } from "@/data/orders";

interface UploadVoucherModalProps {
  show: boolean;
  onHide: () => void;
  orderId: string | null;
  initialVouchers?: string[];
}

interface VoucherItem {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

export default function UploadVoucherModal({
  show,
  onHide,
  orderId,
  initialVouchers = [],
}: UploadVoucherModalProps) {
  const t = useTranslations("UploadVoucherModal"); // 老王我添加：多语言翻译函数
  const [items, setItems] = useState<VoucherItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 老王我：使用 useMemo 来稳定 initialVouchers 的引用，避免每次都是新数组
  const stableInitialVouchers = useMemo(() => initialVouchers, [JSON.stringify(initialVouchers)]);

  React.useEffect(() => {
    if (show) {
      const existingItems: VoucherItem[] = stableInitialVouchers.map(
        (url, index) => ({
          id: `existing-${index}-${Date.now()}`,
          url,
          isExisting: true,
        })
      );
      setItems(existingItems);
    } else {
      // 老王我：使用函数式更新来清理 blob URLs，避免闭包陷阱
      setItems((prevItems) => {
        // Cleanup blob URLs
        prevItems.forEach((item) => {
          if (!item.isExisting) {
            URL.revokeObjectURL(item.url);
          }
        });
        return [];
      });
      setSuccess(false);
      setError(null);
    }
  }, [show, stableInitialVouchers]);

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) {
      return t("fileTooLarge", { fileName: file.name });
    }
    if (!file.type.startsWith("image/")) {
      return t("fileNotImage", { fileName: file.name });
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError(null);
    setSuccess(false);

    if (selectedFiles.length === 0) return;

    const newItems: VoucherItem[] = [];
    let validationError: string | null = null;

    selectedFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        validationError = error;
        return;
      }
      newItems.push({
        id: `new-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
        isExisting: false,
      });
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setItems((prev) => [...prev, ...newItems]);

    // Reset input so same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setSuccess(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const newItems: VoucherItem[] = [];
    let validationError: string | null = null;

    droppedFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        validationError = error;
        return;
      }
      newItems.push({
        id: `new-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
        isExisting: false,
      });
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = (index: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const item = newItems[index];
      if (!item.isExisting) {
        URL.revokeObjectURL(item.url);
      }
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleSubmit = async () => {
    if (items.length === 0 || !orderId) return;

    setIsUploading(true);
    setError(null);

    try {
      const newFiles = items.filter((i) => !i.isExisting && i.file);
      const existingUrls = items.filter((i) => i.isExisting).map((i) => i.url);
      let newUploadedUrls: string[] = [];

      // 老王我改成：在客户端创建FormData，然后传给服务端函数
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((f) => {
          if (f.file) formData.append("files", f.file);
        });
        newUploadedUrls = await uploadPaymentVoucherFiles(formData);
      }

      // 合并已存在和新的URL
      const allUrls = [...existingUrls, ...newUploadedUrls];

      // 老王我改成：使用服务端函数提交凭证
      await submitPaymentVoucher(orderId, allUrls);

      setSuccess(true);
      setTimeout(() => {
        onHide();
      }, 2000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || t("uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Upload className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t("description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {/* 错误提示 */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 成功提示 - 老王我修复居中问题 */}
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("uploadSuccessful")}
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400">
                {t("uploadSuccessfulMessage")}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
                <span>{t("redirecting")}</span>
              </div>
            </div>
          ) : (
            <>
              {/* 上传区域 - 老王我改成灰色系匹配主题 */}
              <div className="mb-6">
                {items.length > 0 ? (
                  /* 已上传的图片网格 */
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
                      >
                        <img
                          src={item.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* 删除按钮 */}
                        <button
                          onClick={() => handleRemoveFile(index)}
                          disabled={isUploading}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X size={14} />
                        </button>
                        {/* 序号 */}
                        <div className="absolute top-1.5 left-1.5 bg-gray-900/80 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {index + 1}
                        </div>
                      </div>
                    ))}

                    {/* 添加按钮 */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <Plus className="w-8 h-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {t("addMore")}
                      </span>
                    </button>
                  </div>
                ) : (
                  /* 初始上传区域 */
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                      {/* 图标 */}
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform duration-200">
                        <ImageIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                      </div>

                      {/* 文本 */}
                      <div className="text-center space-y-1">
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {t("clickOrDragToUpload")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("supportedFormats")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 隐藏的文件输入 */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              {/* 提交按钮 - 老王我改成灰色系匹配主题 */}
              <Button
                onClick={handleSubmit}
                disabled={items.length === 0 || isUploading}
                className="w-full h-12 text-base font-semibold bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 border-0"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t("uploading")}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Upload size={18} />
                    <span>
                      {items.length === 0
                        ? t("submit_zero")
                        : items.length === 1
                        ? t("submit_one")
                        : t("submit_other", { count: items.length })}
                    </span>
                  </div>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
