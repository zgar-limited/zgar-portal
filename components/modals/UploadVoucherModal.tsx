"use client";

import React, { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, Plus, Image as ImageIcon } from "lucide-react";
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
  const [items, setItems] = useState<VoucherItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (show) {
      const existingItems: VoucherItem[] = initialVouchers.map(
        (url, index) => ({
          id: `existing-${index}-${Date.now()}`,
          url,
          isExisting: true,
        })
      );
      setItems(existingItems);
    } else {
      // Cleanup blob URLs
      items.forEach((item) => {
        if (!item.isExisting) {
          URL.revokeObjectURL(item.url);
        }
      });
      setItems([]);
      setSuccess(false);
      setError(null);
    }
  }, [show, initialVouchers]);

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) {
      return `File ${file.name} is too large (max 5MB)`;
    }
    if (!file.type.startsWith("image/")) {
      return `File ${file.name} is not an image`;
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
      setError(err.message || "Failed to upload vouchers. Please try again.");
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
                Upload Payment Vouchers
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload clear images of your payment receipts (Max 5MB per file)
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
                Upload Successful!
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Your payment vouchers have been submitted successfully.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
                <span>Redirecting...</span>
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
                        Add More
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
                          Click or drag to upload
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Supports JPG, PNG, WEBP (Max 5MB)
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
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Upload size={18} />
                    <span>
                      Submit {items.length > 0 ? `(${items.length}) ` : ""}Voucher{items.length !== 1 ? "s" : ""}
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
