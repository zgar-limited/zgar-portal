"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Save,
  X,
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";
import { updateOrderShippingAddress } from "@/data/orders";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin size={20} className="text-white" strokeWidth={2.5} />
            </div>
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive" className="gap-2 py-3 flex items-center">
              <X size={18} strokeWidth={2.5} />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* 姓名 */}
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('firstName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder={t('firstNamePlaceholder')}
                disabled={isSaving}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('lastName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder={t('lastNamePlaceholder')}
                disabled={isSaving}
                required
                className="w-full"
              />
            </div>

            {/* 公司名称 */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('company')}
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder={t('companyPlaceholder')}
                disabled={isSaving}
                className="w-full"
              />
            </div>

            {/* 地址 */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="address_1" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('address1')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address_1"
                type="text"
                value={formData.address_1}
                onChange={(e) => handleChange("address_1", e.target.value)}
                placeholder={t('address1Placeholder')}
                disabled={isSaving}
                required
                className="w-full"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address_2" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('address2')}
              </Label>
              <Input
                id="address_2"
                type="text"
                value={formData.address_2}
                onChange={(e) => handleChange("address_2", e.target.value)}
                placeholder={t('address2Placeholder')}
                disabled={isSaving}
                className="w-full"
              />
            </div>

            {/* 城市 */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('city')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder={t('cityPlaceholder')}
                disabled={isSaving}
                required
                className="w-full"
              />
            </div>

            {/* 省份 */}
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('province')}
              </Label>
              <Input
                id="province"
                type="text"
                value={formData.province}
                onChange={(e) => handleChange("province", e.target.value)}
                placeholder={t('provincePlaceholder')}
                disabled={isSaving}
                className="w-full"
              />
            </div>

            {/* 邮编 */}
            <div className="space-y-2">
              <Label htmlFor="postal_code" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('postalCode')}
              </Label>
              <Input
                id="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                placeholder={t('postalCodePlaceholder')}
                disabled={isSaving}
                className="w-full"
              />
            </div>

            {/* 老王我：联系电话 - 必填 */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('phone')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={t('phonePlaceholder')}
                disabled={isSaving}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onHide}
              className="flex-1 h-11 font-semibold rounded-xl"
              disabled={isSaving}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 font-semibold rounded-xl flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save size={18} strokeWidth={2.5} />
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
