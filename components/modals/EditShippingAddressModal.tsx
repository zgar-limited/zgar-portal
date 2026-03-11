"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Save,
  X,
  Edit2,
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";
import { updateOrderShippingAddress } from "@/data/orders";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditShippingAddressModalProps {
  show: boolean;
  onHide: () => void;
  orderId: string;
  address: HttpTypes.StoreOrderAddress | null;
  onAddressUpdated: () => void;
  mode?: 'create' | 'edit';  // 老王我：区分新增/编辑模式
}

export default function EditShippingAddressModal({
  show,
  onHide,
  orderId,
  address,
  onAddressUpdated,
  mode = 'edit',  // 老王我：默认为编辑模式
}: EditShippingAddressModalProps) {
  const t = useTranslations('edit-address'); // 老王我：添加多语言支持

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
    phone: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 老王我初始化表单数据
  useEffect(() => {
    if (show) {
      if (mode === 'edit' && address) {
        // 编辑模式：填充现有地址
        setFormData({
          first_name: address.first_name || "",
          last_name: address.last_name || "",
          company: address.company || "",
          address_1: address.address_1 || "",
          address_2: address.address_2 || "",
          city: address.city || "",
          province: address.province || "",
          postal_code: address.postal_code || "",
          phone: address.phone || "",
        });
      } else {
        // 新增模式：清空表单
        setFormData({
          first_name: "",
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          province: "",
          postal_code: "",
          phone: "",
        });
      }
      setError(null);
    }
  }, [show, address, mode]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 老王我验证必填字段（公司、地址二、省份、邮编选填，其他必填）
    if (!formData.first_name || !formData.last_name || !formData.address_1 || !formData.city || !formData.phone) {
      setError(t('requiredFieldsError'));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // 老王我：提交时不包含 country_code
      const addressData = { ...formData };
      await updateOrderShippingAddress(orderId, addressData);
      onAddressUpdated();
      onHide();
    } catch (err: any) {
      console.error("更新地址失败:", err);
      setError(err.message || t('updateFailedError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Minimalism 风格 - 简洁头部 */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-3 text-base font-bold text-gray-900">
            <Edit2 size={18} className="text-gray-400" />
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 错误提示 - Minimalism 风格 */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* 收件人信息 */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('recipientInfo')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  {t('firstName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder={t('firstNamePlaceholder')}
                  disabled={isSaving}
                  required
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  {t('lastName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder={t('lastNamePlaceholder')}
                  disabled={isSaving}
                  required
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1.5">{t('company')}</label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder={t('companyPlaceholder')}
                  disabled={isSaving}
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1.5">
                  {t('phone')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  disabled={isSaving}
                  required
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-gray-200" />

          {/* 地址信息 */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('addressInfo')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1.5">
                  {t('address1')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="address_1"
                  type="text"
                  value={formData.address_1}
                  onChange={(e) => handleChange("address_1", e.target.value)}
                  placeholder={t('address1Placeholder')}
                  disabled={isSaving}
                  required
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1.5">{t('address2')}</label>
                <Input
                  id="address_2"
                  type="text"
                  value={formData.address_2}
                  onChange={(e) => handleChange("address_2", e.target.value)}
                  placeholder={t('address2Placeholder')}
                  disabled={isSaving}
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  {t('city')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder={t('cityPlaceholder')}
                  disabled={isSaving}
                  required
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">{t('province')}</label>
                <Input
                  id="province"
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                  placeholder={t('provincePlaceholder')}
                  disabled={isSaving}
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">{t('postalCode')}</label>
                <Input
                  id="postal_code"
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  placeholder={t('postalCodePlaceholder')}
                  disabled={isSaving}
                  className="h-10 border-gray-200 focus:border-brand-blue focus:ring-0 rounded-none"
                />
              </div>
            </div>
          </div>

          {/* 底部按钮 - Minimalism 风格 */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onHide}
              className="flex-1 h-10 font-medium border-gray-200 hover:bg-gray-50 rounded-none"
              disabled={isSaving}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 font-medium bg-brand-blue hover:bg-brand-blue/90 rounded-none flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{t('save')}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
