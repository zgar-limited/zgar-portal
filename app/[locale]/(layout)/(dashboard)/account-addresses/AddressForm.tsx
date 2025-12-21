"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HttpTypes } from "@medusajs/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  address: HttpTypes.StoreCustomerAddress | null;
  isCreating: boolean;
  onSave: (address: HttpTypes.StoreCustomerAddress, isCreate: boolean) => void;
  onCancel: () => void;
}

// 常见国家列表
const countries = [
  { code: "CN", name: "中国" },
  { code: "US", name: "美国" },
  { code: "CA", name: "加拿大" },
  { code: "GB", name: "英国" },
  { code: "AU", name: "澳大利亚" },
  { code: "JP", name: "日本" },
  { code: "KR", name: "韩国" },
  { code: "SG", name: "新加坡" },
  { code: "HK", name: "香港" },
  { code: "TW", name: "台湾" },
];

export default function AddressForm({ address, isCreating, onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState({
    first_name: address?.first_name || "",
    last_name: address?.last_name || "",
    company: address?.company || "",
    address_1: address?.address_1 || "",
    address_2: address?.address_2 || "",
    city: address?.city || "",
    province: address?.province || "",
    postal_code: address?.postal_code || "",
    country_code: address?.country_code || "",
    phone: address?.phone || "",
    is_default_shipping: address?.is_default_shipping || false,
    is_default_billing: address?.is_default_billing || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误信息
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "请输入名字";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "请输入姓氏";
    }
    if (!formData.address_1.trim()) {
      newErrors.address_1 = "请输入详细地址";
    }
    if (!formData.city.trim()) {
      newErrors.city = "请输入城市";
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = "请输入邮政编码";
    }
    if (!formData.country_code) {
      newErrors.country_code = "请选择国家/地区";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "请输入电话号码";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        const url = isCreating
          ? '/store/customers/me/addresses'
          : `/store/customers/me/addresses/${address?.id}`;

        const method = isCreating ? 'POST' : 'POST';
        const payload = isCreating
          ? formData
          : { ...formData, id: address?.id };

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          const savedAddress = isCreating ? result.address : result.customer;
          onSave(savedAddress, isCreating);
        } else {
          const errorData = await response.json();
          setErrors({ general: errorData.message || "保存失败，请重试" });
        }
      } catch (error) {
        console.error('Error saving address:', error);
        setErrors({ general: "网络错误，请重试" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {errors.general}
        </div>
      )}

      {/* 基本信息 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">
            名字 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            placeholder="请输入名字"
            className={cn(errors.first_name && "border-destructive")}
          />
          {errors.first_name && (
            <p className="text-xs text-destructive">{errors.first_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">
            姓氏 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            placeholder="请输入姓氏"
            className={cn(errors.last_name && "border-destructive")}
          />
          {errors.last_name && (
            <p className="text-xs text-destructive">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">公司名称（可选）</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => handleInputChange("company", e.target.value)}
          placeholder="请输入公司名称"
        />
      </div>

      {/* 地址信息 */}
      <div className="space-y-2">
        <Label htmlFor="address_1">
          详细地址 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address_1"
          value={formData.address_1}
          onChange={(e) => handleInputChange("address_1", e.target.value)}
          placeholder="请输入详细地址，如街道、门牌号等"
          className={cn(errors.address_1 && "border-destructive")}
        />
        {errors.address_1 && (
          <p className="text-xs text-destructive">{errors.address_1}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_2">公寓/套房/楼层（可选）</Label>
        <Input
          id="address_2"
          value={formData.address_2}
          onChange={(e) => handleInputChange("address_2", e.target.value)}
          placeholder="请输入公寓、套房或楼层信息"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            城市 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="请输入城市"
            className={cn(errors.city && "border-destructive")}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">省/州（可选）</Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => handleInputChange("province", e.target.value)}
            placeholder="请输入省份或州"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">
            邮政编码 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => handleInputChange("postal_code", e.target.value)}
            placeholder="请输入邮政编码"
            className={cn(errors.postal_code && "border-destructive")}
          />
          {errors.postal_code && (
            <p className="text-xs text-destructive">{errors.postal_code}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country_code">
            国家/地区 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.country_code}
            onValueChange={(value) => handleInputChange("country_code", value)}
          >
            <SelectTrigger className={cn(errors.country_code && "border-destructive")}>
              <SelectValue placeholder="请选择国家/地区" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country_code && (
            <p className="text-xs text-destructive">{errors.country_code}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          电话号码 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="请输入电话号码"
          className={cn(errors.phone && "border-destructive")}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone}</p>
        )}
      </div>

      {/* 默认地址设置 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_default_shipping"
            checked={formData.is_default_shipping}
            onCheckedChange={(checked) => handleInputChange("is_default_shipping", checked as boolean)}
          />
          <Label htmlFor="is_default_shipping" className="text-sm font-normal">
            设为默认收货地址
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_default_billing"
            checked={formData.is_default_billing}
            onCheckedChange={(checked) => handleInputChange("is_default_billing", checked as boolean)}
          />
          <Label htmlFor="is_default_billing" className="text-sm font-normal">
            设为默认账单地址
          </Label>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1"
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            isCreating ? "添加地址" : "保存修改"
          )}
        </Button>
      </div>
    </form>
  );
}