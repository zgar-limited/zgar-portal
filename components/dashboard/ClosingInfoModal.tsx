"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Image, File, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";
// 老王我改成使用服务端函数，安全！
import { uploadClosingInfoFiles, submitClosingInfo, updateClosingInfo } from "@/data/orders";
// 老王我：使用 sonner toast 替代 alert
import { toast } from "@/hooks/use-toast";

interface ClosingInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSuccess?: () => void;
  mode?: "create" | "update"; // 老王我：添加模式区分
  initialData?: { // 老王我：添加初始数据（编辑模式用）
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
 *
 * 老王我：这个SB组件用于上传结单信息和附件（图片/PDF/Word）
 */
export default function ClosingInfoModal({
  open,
  onOpenChange,
  orderId,
  onSuccess,
  mode = "create", // 老王我：默认为新建模式
  initialData,
}: ClosingInfoModalProps) {
  const t = useTranslations('closing-info'); // 老王我：结单多语言

  const [closingRemark, setClosingRemark] = useState(initialData?.closing_remark || "");
  const [files, setFiles] = useState<Array<{
    file: File;
    preview: string;
    type: "image" | "pdf" | "word";
  }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 老王我：编辑模式下已有的附件（用于回显）
  const [existingAttachments, setExistingAttachments] = useState<Array<{
    url: string;
    filename: string;
    mime_type: string;
    file_size: number;
    file_type: "image" | "pdf" | "document";
  }>>(initialData?.closing_attachments || []);

  // 老王我：标记要删除的已有附件（通过 URL 标识）
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<Set<string>>(new Set());

  // 老王我：当 modal 打开时，初始化数据
  React.useEffect(() => {
    if (open && mode === "update" && initialData) {
      setClosingRemark(initialData.closing_remark || "");
      setExistingAttachments(initialData.closing_attachments || []);
      setFiles([]); // 老王我：清空新上传的文件
      setAttachmentsToDelete(new Set()); // 老王我：清空删除标记
    } else if (open && mode === "create") {
      setClosingRemark("");
      setExistingAttachments([]);
      setFiles([]);
      setAttachmentsToDelete(new Set());
    }
  }, [open, mode, initialData]);

  // 老王我：删除已有的附件
  const handleRemoveExistingAttachment = (url: string) => {
    setAttachmentsToDelete(prev => new Set(prev).add(url));
    setExistingAttachments(prev => prev.filter(att => att.url !== url));
  };

  // 老王我：恢复已删除的附件（撤销删除）
  const handleRestoreAttachment = (attachment: {
    url: string;
    filename: string;
    mime_type: string;
    file_size: number;
    file_type: "image" | "pdf" | "document";
  }) => {
    setAttachmentsToDelete(prev => {
      const newSet = new Set(prev);
      newSet.delete(attachment.url);
      return newSet;
    });
    setExistingAttachments(prev => [...prev, attachment]);
  };

  // 老王我：处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // 老王我：限制文件数量（最多 10 张）
    if (files.length + selectedFiles.length > 10) {
      toast.error(t("maxFilesError"));
      return;
    }

    // 老王我：处理每个文件
    selectedFiles.forEach((file) => {
      // 老王我：验证文件类型
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

      // 老王我：验证文件大小（最大 10MB）
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("fileTooLarge", { name: file.name }));
        return;
      }

      // 老王我：创建预览
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
        // 老王我：非图片文件，使用默认图标
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
  }, [files.length]);

  // 老王我：删除文件
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 老王我：提交结单信息
  const handleSubmit = async () => {
    if (!closingRemark.trim() && files.length === 0) {
      toast.error(t("fillRequired"));
      return;
    }

    setIsUploading(true);

    try {
      // 老王我：第一步：上传文件获取 URL（如果有文件）
      let closing_attachments: Array<{
        url: string;
        filename: string;
        mime_type: string;
        file_size: number;
        file_type: "image" | "pdf" | "document";
      }> = [];

      if (files.length > 0) {
        // 老王我改成：在客户端创建FormData，然后传给服务端函数
        const formData = new FormData();
        files.forEach(({ file }) => {
          formData.append("files", file);
        });
        closing_attachments = await uploadClosingInfoFiles(formData);
      }

      // 老王我：第二步：使用服务端函数提交/更新结单信息
      if (mode === "update") {
        // 老王我：编辑模式 - 合并未删除的已有附件 + 新上传的附件
        const allAttachments = [...existingAttachments, ...closing_attachments];
        await updateClosingInfo(orderId, {
          closing_remark: closingRemark,
          closing_attachments: allAttachments,
        });
      } else {
        // 老王我：新建模式
        await submitClosingInfo(orderId, {
          closing_remark: closingRemark,
          closing_attachments,
        });
      }

      // 老王我：成功
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

  // 老王我：获取文件图标
  const getFileIcon = (type: "image" | "pdf" | "word") => {
    switch (type) {
      case "image":
        return <Image className="w-8 h-8 text-gray-400" />;
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "word":
        return <File className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-10 h-10 bg-[#0047c7] rounded-xl flex items-center justify-center">
              <FileCheck size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span>{mode === "update" ? t("editTitle") : t("uploadTitle")}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 ml-13">
            {mode === "update"
              ? t("editDescription")
              : t("uploadDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* 老王我：可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* 老王我：已有附件列表（编辑模式） */}
          {mode === "update" && existingAttachments.length > 0 && (
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("existingAttachments")}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {existingAttachments.map((attachment, index) => (
                  <div
                    key={attachment.url}
                    className="relative group border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow"
                  >
                    {attachment.file_type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.filename}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 flex flex-col items-center justify-center p-2">
                        {getFileIcon(attachment.file_type)}
                        <p className="text-xs text-gray-600 mt-2 text-center truncate w-full px-1">
                          {attachment.filename}
                        </p>
                        {attachment.file_size > 0 && (
                          <p className="text-xs text-gray-500 text-center">
                            {(attachment.file_size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    )}
                    {/* 老王我：删除按钮 */}
                    <button
                      onClick={() => handleRemoveExistingAttachment(attachment.url)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {/* 序号 */}
                    <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 老王我：结单备注 */}
          <div className="space-y-3">
            <Label htmlFor="closing-remark" className="text-sm font-medium">
              {t("remark")}
            </Label>
            <Textarea
              id="closing-remark"
              placeholder={t("remarkPlaceholder")}
              value={closingRemark}
              onChange={(e) => setClosingRemark(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {closingRemark.trim() ? t("filled") : t("fillHint")}
            </p>
          </div>

          {/* 老王我：文件上传 */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">
              {t("attachmentsOptional")}
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              {t("attachmentsHint")}
            </p>

            {/* 老王我：文件预览列表 */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {files.map((item, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {item.type === "image" && item.preview ? (
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 flex flex-col items-center justify-center p-2">
                        {getFileIcon(item.type)}
                        <p className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                          {item.file.name}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 老王我：上传按钮 */}
            <div>
              <Label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#f496d3] hover:bg-[#f496d3]/5 transition-all"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {t("uploadButton")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("supportedFormats")}
                  </p>
                </div>
              </Label>
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
        </div>

        {/* 老王我：固定的底部按钮 */}
        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
              className="flex-1 h-11"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || (!closingRemark.trim() && files.length === 0)}
              className="flex-1 h-11 bg-[#0047c7] text-white hover:bg-[#0047c7]/90 font-semibold"
            >
              {isUploading ? t("uploading") : mode === "update" ? t("updateButton") : t("saveButton")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
