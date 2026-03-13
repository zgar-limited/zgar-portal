// 结单信息上传弹框
// 设计风格：Tesla极简风格，匹配订单详情页面
//
// 设计原则：
// - 白色背景 + 浅灰分隔线 (border-gray-100)
// - 轻字重 (font-light) 用于标题
// - 淡雅的颜色层次 (gray-900/400/300)
// - 大量留白
// - 无厚重卡片边框
// - 确认按钮使用黑色 (bg-gray-900)

"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, FileText, Image, File, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { uploadClosingInfoFiles, submitClosingInfo, updateClosingInfo } from "@/data/orders";
import { toast } from "sonner";

interface ClosingInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSuccess?: () => void;
  mode?: "create" | "update";
  initialData?: {
    closing_remark?: string;
    closing_attachments?: Array<{
      url: string;
      filename: string;
      mime_type: string;
      file_size: number;
      file_type: "image" | "pdf" | "document";
    }>;
  };
}

/**
 * 结单信息上传模态框
 * 设计风格：Tesla极简风格，匹配订单详情页面
 */
export default function ClosingInfoModal({
  open,
  onOpenChange,
  orderId,
  onSuccess,
  mode = "create",
  initialData,
}: ClosingInfoModalProps) {
  const t = useTranslations('closing-info');

  const [closingRemark, setClosingRemark] = useState(initialData?.closing_remark || "");
  const [files, setFiles] = useState<Array<{
    file: File;
    preview: string;
    type: "image" | "pdf" | "word";
  }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 编辑模式下已有的附件
  const [existingAttachments, setExistingAttachments] = useState<Array<{
    url: string;
    filename: string;
    mime_type: string;
    file_size: number;
    file_type: "image" | "pdf" | "document";
  }>>(initialData?.closing_attachments || []);

  // 当 modal 打开时，初始化数据
  React.useEffect(() => {
    if (open && mode === "update" && initialData) {
      setClosingRemark(initialData.closing_remark || "");
      setExistingAttachments(initialData.closing_attachments || []);
      setFiles([]);
    } else if (open && mode === "create") {
      setClosingRemark("");
      setExistingAttachments([]);
      setFiles([]);
    }
  }, [open, mode, initialData]);

  // 删除已有的附件
  const handleRemoveExistingAttachment = (url: string) => {
    setExistingAttachments(prev => prev.filter(att => att.url !== url));
  };

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // 限制文件数量（最多 10 张）
    if (files.length + selectedFiles.length > 10) {
      toast.error(t("maxFilesError"));
      return;
    }

    // 处理每个文件
    selectedFiles.forEach((file) => {
      const fileType = file.type;
      let type: "image" | "pdf" | "word" = "image";

      if (fileType.startsWith("image/")) {
        type = "image";
      } else if (fileType === "application/pdf") {
        type = "pdf";
      } else if (
        fileType === "application/msword" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        type = "word";
      } else {
        toast.error(`${t("unsupportedFileType")} ${fileType}`);
        return;
      }

      // 验证文件大小（最大 10MB）
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("fileTooLarge", { name: file.name }));
        return;
      }

      // 创建预览
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            file,
            preview: reader.result as string,
            type,
          },
        ]);
      };

      if (type === "image") {
        reader.readAsDataURL(file);
      } else {
        setFiles((prev) => [
          ...prev,
          {
            file,
            preview: "",
            type,
          },
        ]);
      }
    });
  }, [files.length, t]);

  // 删除文件
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 提交结单信息
  const handleSubmit = async () => {
    if (!closingRemark.trim() && files.length === 0) {
      toast.error(t("fillRequired"));
      return;
    }

    setIsUploading(true);

    try {
      let closing_attachments: Array<{
        url: string;
        filename: string;
        mime_type: string;
        file_size: number;
        file_type: "image" | "pdf" | "document";
      }> = [];

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(({ file }) => {
          formData.append("files", file);
        });
        closing_attachments = await uploadClosingInfoFiles(formData);
      }

      if (mode === "update") {
        // 确保 existingAttachments 是数组
        const safeExistingAttachments = Array.isArray(existingAttachments) ? existingAttachments : [];
        const allAttachments = [...safeExistingAttachments, ...closing_attachments];
        await updateClosingInfo(orderId, {
          closing_remark: closingRemark,
          closing_attachments: allAttachments,
        });
      } else {
        await submitClosingInfo(orderId, {
          closing_remark: closingRemark,
          closing_attachments,
        });
      }

      toast.success(mode === "update" ? t("updateSuccess") : t("saveSuccess"));
      onOpenChange(false);
      setClosingRemark("");
      setFiles([]);
      setExistingAttachments([]);
      onSuccess?.();
    } catch (error: any) {
      console.error("[保存结单信息] 错误:", error);
      toast.error(error.message || t("saveError"));
    } finally {
      setIsUploading(false);
    }
  };

  // 获取文件图标 - Tesla风格
  const getFileIcon = (type: "image" | "pdf" | "word" | "document") => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-gray-400" strokeWidth={1.5} />;
      case "pdf":
        return <FileText className="w-5 h-5 text-gray-400" strokeWidth={1.5} />;
      default:
        return <File className="w-5 h-5 text-gray-400" strokeWidth={1.5} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0 bg-white border-gray-100 shadow-2xl">
        {/* 头部 - 极简 */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <DialogTitle className="text-xl font-light text-gray-900">
            {mode === "update" ? t("editTitle") : t("uploadTitle")}
          </DialogTitle>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
          {/* 结单备注 */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              {t("remark")}
            </p>
            <Textarea
              placeholder={t("remarkPlaceholder")}
              value={closingRemark}
              onChange={(e) => setClosingRemark(e.target.value)}
              rows={4}
              className="resize-none text-sm border-gray-200 focus:border-gray-900 focus:ring-0"
            />
          </div>

          {/* 已有附件列表（编辑模式） */}
          {mode === "update" && existingAttachments.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
                {t("existingAttachments")}
              </p>
              <div className="space-y-3">
                {existingAttachments.map((attachment, index) => (
                  <div
                    key={attachment.url}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0 group"
                  >
                    {/* 文件预览 */}
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {attachment.file_type === "image" ? (
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getFileIcon(attachment.file_type)
                      )}
                    </div>
                    {/* 文件信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        {attachment.filename}
                      </p>
                      {attachment.file_size > 0 && (
                        <p className="text-xs text-gray-400">
                          {(attachment.file_size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                    {/* 删除按钮 */}
                    <button
                      onClick={() => handleRemoveExistingAttachment(attachment.url)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-900 cursor-pointer"
                      type="button"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 新上传的文件预览 */}
          {files.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
                {t("newAttachments")}
              </p>
              <div className="space-y-3">
                {files.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0 group"
                  >
                    {/* 文件预览 */}
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {item.type === "image" && item.preview ? (
                        <img
                          src={item.preview}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getFileIcon(item.type)
                      )}
                    </div>
                    {/* 文件信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(item.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {/* 删除按钮 */}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-900 cursor-pointer"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 上传区域 - 极简 */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              {t("attachmentsOptional")}
            </p>
            <label
              htmlFor="file-upload"
              className={cn(
                "flex items-center gap-4 w-full px-5 py-5",
                "border border-gray-200 hover:border-gray-900",
                "cursor-pointer transition-colors"
              )}
            >
              <Upload className="w-5 h-5 text-gray-300 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-gray-500">
                  {t("uploadButton")}
                </p>
                <p className="text-xs text-gray-300 mt-0.5">
                  {t("supportedFormats")}
                </p>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* 底部按钮 - 极简 */}
        <div className="px-8 py-6 border-t border-gray-100 flex gap-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer flex items-center justify-center"
            disabled={isUploading}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading || (!closingRemark.trim() && files.length === 0)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-all cursor-pointer flex items-center justify-center",
              closingRemark.trim() || files.length > 0
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("uploading")}
              </span>
            ) : (
              mode === "update" ? t("updateButton") : t("saveButton")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
