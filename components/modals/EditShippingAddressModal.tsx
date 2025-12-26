"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import {
  MapPin,
  Save,
  X,
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";
import { updateOrderShippingAddress } from "@/data/orders";

interface EditShippingAddressModalProps {
  show: boolean;
  onHide: () => void;
  orderId: string;
  address: HttpTypes.StoreOrderAddress | null;
  onAddressUpdated: () => void;
}

export default function EditShippingAddressModal({
  show,
  onHide,
  orderId,
  address,
  onAddressUpdated,
}: EditShippingAddressModalProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "",
    phone: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 老王我初始化表单数据
  useEffect(() => {
    if (show && address) {
      setFormData({
        first_name: address.first_name || "",
        last_name: address.last_name || "",
        company: address.company || "",
        address_1: address.address_1 || "",
        address_2: address.address_2 || "",
        city: address.city || "",
        province: address.province || "",
        postal_code: address.postal_code || "",
        country_code: address.country_code || "",
        phone: address.phone || "",
      });
      setError(null);
    }
  }, [show, address]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 老王我验证必填字段
    if (!formData.first_name || !formData.last_name || !formData.address_1 || !formData.city || !formData.country_code) {
      setError("请填写所有必填字段");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateOrderShippingAddress(orderId, formData);
      onAddressUpdated();
      onHide();
    } catch (err: any) {
      console.error("更新地址失败:", err);
      setError(err.message || "更新收货地址失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="border-0 shadow-2xl rounded-3xl overflow-hidden"
      size="lg"
    >
      <Modal.Header closeButton className="pb-4 border-bottom-0 px-6 pt-6">
        <Modal.Title className="h5 fw-bold d-flex align-items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl d-flex align-items-center justify-center shadow-lg">
            <MapPin size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg">编辑收货地址</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-6">
        {error && (
          <Alert
            variant="danger"
            className="gap-2 py-3 d-flex align-items-center small mb-4 rounded-xl border-0"
          >
            <X size={18} strokeWidth={2.5} />
            <span className="font-medium">{error}</span>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* 姓名 */}
            <div className="col-md-6">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                名字 <span className="text-red-500">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder="请输入名字"
                disabled={isSaving}
                required
              />
            </div>

            <div className="col-md-6">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                姓氏 <span className="text-red-500">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder="请输入姓氏"
                disabled={isSaving}
                required
              />
            </div>

            {/* 公司名称 */}
            <div className="col-12">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                公司名称
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="请输入公司名称（可选）"
                disabled={isSaving}
              />
            </div>

            {/* 地址 */}
            <div className="col-12">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                详细地址 <span className="text-red-500">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.address_1}
                onChange={(e) => handleChange("address_1", e.target.value)}
                placeholder="请输入详细地址"
                disabled={isSaving}
                required
              />
            </div>

            <div className="col-12">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                地址二
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.address_2}
                onChange={(e) => handleChange("address_2", e.target.value)}
                placeholder="请输入补充地址（可选）"
                disabled={isSaving}
              />
            </div>

            {/* 城市 */}
            <div className="col-md-6">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                城市 <span className="text-red-500">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="请输入城市"
                disabled={isSaving}
                required
              />
            </div>

            {/* 省份 */}
            <div className="col-md-6">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                省份/州
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.province}
                onChange={(e) => handleChange("province", e.target.value)}
                placeholder="请输入省份或州（可选）"
                disabled={isSaving}
              />
            </div>

            {/* 邮编 */}
            <div className="col-md-6">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                邮政编码
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.postal_code}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                placeholder="请输入邮政编码"
                disabled={isSaving}
              />
            </div>

            {/* 国家代码 */}
            <div className="col-md-6">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                国家代码 <span className="text-red-500">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.country_code}
                onChange={(e) => handleChange("country_code", e.target.value)}
                placeholder="例如: CN, US"
                disabled={isSaving}
                required
                maxLength={2}
              />
            </div>

            {/* 电话 */}
            <div className="col-12">
              <Form.Label className="small fw-semibold text-gray-700 dark:text-gray-300">
                联系电话
              </Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="请输入联系电话（可选）"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <Button
              variant="light"
              onClick={onHide}
              className="flex-1 h-11 fw-semibold rounded-xl"
              disabled={isSaving}
            >
              取消
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="flex-1 h-11 fw-semibold rounded-xl d-flex align-items-center justify-content-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span>保存中...</span>
                </>
              ) : (
                <>
                  <Save size={18} strokeWidth={2.5} />
                  <span>保存地址</span>
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
