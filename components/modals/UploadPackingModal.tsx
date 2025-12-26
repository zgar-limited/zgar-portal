"use client";
import React, { useState, useRef } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Upload, X, CheckCircle, AlertCircle, Plus, FileText } from "lucide-react";
import { submitPackingRequirement, uploadPackingRequirementFiles } from "@/data/orders";

interface UploadPackingModalProps {
  show: boolean;
  onHide: () => void;
  orderId: string | null;
  initialFiles?: string[];
}

interface PackingItem {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
  type: "image" | "file";
  name?: string;
}

export default function UploadPackingModal({
  show,
  onHide,
  orderId,
  initialFiles = [],
}: UploadPackingModalProps) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (show) {
      const existingItems: PackingItem[] = initialFiles.map((url, index) => {
        const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
        return {
          id: `existing-${index}-${Date.now()}`,
          url,
          isExisting: true,
          type: isImage ? "image" : "file",
          name: url.split('/').pop()
        };
      });
      setItems(existingItems);
    } else {
      // Cleanup blob URLs
      items.forEach(item => {
        if (!item.isExisting) {
          URL.revokeObjectURL(item.url);
        }
      });
      setItems([]);
      setSuccess(false);
      setError(null);
    }
  }, [show, initialFiles]);

  const validateFile = (file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) {
      return `File ${file.name} is too large (max 10MB)`;
    }
    // Allow images, PDF, Excel, Word, Text
    const allowedTypes = [
      "image/",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "application/msword", // doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "text/plain"
    ];
    
    if (!allowedTypes.some(type => file.type.startsWith(type) || (type.endsWith("/") && file.type.startsWith(type)))) {
       // Fallback check for extensions if mime type is missing or generic
       const ext = file.name.split('.').pop()?.toLowerCase();
       const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'xlsx', 'xls', 'doc', 'docx', 'txt'];
       if (!ext || !allowedExts.includes(ext)) {
         return `File ${file.name} type is not supported`;
       }
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError(null);
    setSuccess(false);

    if (selectedFiles.length === 0) return;

    const newItems: PackingItem[] = [];
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
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name
      });
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setItems((prev) => [...prev, ...newItems]);

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

    const newItems: PackingItem[] = [];
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
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name
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
      const newFiles = items.filter(i => !i.isExisting && i.file);
      const existingUrls = items.filter(i => i.isExisting).map(i => i.url);
      let newUploadedUrls: string[] = [];

      // 1. 老王我上传文件，传入FormData
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((f) => {
          if (f.file) formData.append("files", f.file);
        });

        newUploadedUrls = await uploadPackingRequirementFiles(formData);
      }

      // Combine existing and new URLs
      const allUrls = [...existingUrls, ...newUploadedUrls];
      const fileUrls = allUrls.join(',');

      // 2. 老王我提交打包要求
      await submitPackingRequirement(orderId, {
        packing_requirement_url: fileUrls,
      });

      setSuccess(true);
      setTimeout(() => {
        onHide();
      }, 2000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload packing requirements. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="border-0 shadow-lg rounded-4"
    >
      <Modal.Header closeButton className="pb-0 border-bottom-0">
        <Modal.Title className="h5 fw-bold">
          Upload Packing Requirements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pt-2 pb-4">
        <p className="mb-4 text-muted small">
          Upload packing requirements (Images, PDF, Excel, Word). Max 10MB per file.
        </p>

        {error && (
          <Alert
            variant="danger"
            className="gap-2 py-2 d-flex align-items-center small"
          >
            <AlertCircle size={16} />
            {error}
          </Alert>
        )}

        {success ? (
          <div className="py-5 text-center">
            <div className="mb-3 text-success">
              <CheckCircle size={48} />
            </div>
            <h6 className="fw-bold text-success">Upload Successful!</h6>
            <p className="text-muted small">
              Your packing requirements have been submitted.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-wrap gap-3 mb-3 d-flex">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden border position-relative rounded-3 bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "100px", height: "100px" }}
                  title={item.name}
                >
                  <Button
                    variant="light"
                    size="sm"
                    className="top-0 p-0 m-1 shadow-xs position-absolute end-0 rounded-circle z-1 d-flex align-items-center justify-content-center"
                    style={{ width: "20px", height: "20px" }}
                    onClick={() => handleRemoveFile(index)}
                    disabled={isUploading}
                  >
                    <X size={12} />
                  </Button>
                  
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={`Preview ${index}`}
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="p-2 text-center text-muted">
                      <FileText size={32} className="mb-1" />
                      <div className="text-truncate small" style={{ fontSize: "0.6rem", maxWidth: "80px" }}>
                        {item.name || "File"}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div
                className="transition-all border-2 border-dashed cursor-pointer d-flex flex-column align-items-center justify-content-center rounded-3 hover-bg-light"
                style={{
                  width: items.length > 0 ? "100px" : "100%",
                  height: items.length > 0 ? "100px" : "160px",
                  borderColor: "#dee2e6",
                  backgroundColor: "#f8f9fa",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*,.pdf,.xlsx,.xls,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileChange}
                />
                <div
                  className={`text-primary opacity-75 ${
                    items.length > 0 ? "mb-1" : "mb-3"
                  }`}
                >
                  {items.length > 0 ? <Plus size={24} /> : <Upload size={32} />}
                </div>
                {items.length === 0 && (
                  <>
                    <h6 className="mb-1 fw-semibold">
                      Click or drag to upload
                    </h6>
                    <p className="mb-0 text-muted small">
                      Images, PDF, Excel, Word
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 d-grid">
              <Button
                variant="primary"
                disabled={items.length === 0 || isUploading}
                onClick={handleSubmit}
                className="py-2 shadow-xs fw-medium"
              >
                {isUploading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Uploading...
                  </>
                ) : (
                  `Submit ${
                    items.length > 0 ? `(${items.length})` : ""
                  } Files`
                )}
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}