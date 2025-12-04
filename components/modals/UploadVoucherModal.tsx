"use client";
import React, { useState, useRef } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Upload, X, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { medusaFetch } from "@/utils/medusa-fetch";

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
      const existingItems: VoucherItem[] = initialVouchers.map((url, index) => ({
        id: `existing-${index}-${Date.now()}`,
        url,
        isExisting: true,
      }));
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
      const newFiles = items.filter(i => !i.isExisting && i.file);
      const existingUrls = items.filter(i => i.isExisting).map(i => i.url);
      let newUploadedUrls: string[] = [];

      // 1. Upload new files to Medusa if any
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((f) => {
          if (f.file) formData.append("files", f.file);
        });

        const uploadRes = await medusaFetch<{ files: { url: string }[] }>(
          "/store/zgar/files",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.files || uploadRes.files.length === 0) {
          throw new Error("Failed to upload files");
        }
        newUploadedUrls = uploadRes.files.map((u) => u.url);
      }

      // Combine existing and new URLs
      const allUrls = [...existingUrls, ...newUploadedUrls];
      const fileUrls = allUrls.join(',');

      // 2. Submit vouchers to order
      await medusaFetch(
        `/store/zgar/orders/${orderId}/payment-voucher`,
        {
          method: "POST",
          body: JSON.stringify({
            payment_voucher_url: fileUrls,
          }),
        }
      );

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
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="border-0 shadow-lg rounded-4"
    >
      <Modal.Header closeButton className="pb-0 border-bottom-0">
        <Modal.Title className="h5 fw-bold">
          Upload Payment Vouchers
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pt-2 pb-4">
        <p className="mb-4 text-muted small">
          Please upload clear images of your payment receipts. Max size 5MB per
          file.
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
              Your payment vouchers have been submitted.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-wrap gap-3 mb-3 d-flex">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden border position-relative rounded-3"
                  style={{ width: "100px", height: "100px" }}
                >
                  <Button
                    variant="light"
                    size="sm"
                    className="top-0 p-0 m-1 shadow-sm position-absolute end-0 rounded-circle z-1 d-flex align-items-center justify-content-center"
                    style={{ width: "20px", height: "20px" }}
                    onClick={() => handleRemoveFile(index)}
                    disabled={isUploading}
                  >
                    <X size={12} />
                  </Button>
                  <img
                    src={item.url}
                    alt={`Preview ${index}`}
                    className="w-100 h-100 object-fit-cover"
                  />
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
                  accept="image/*"
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
                      Supports JPG, PNG, WEBP
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
                className="py-2 shadow-sm fw-medium"
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
                  } Vouchers`
                )}
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
