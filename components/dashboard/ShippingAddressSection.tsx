"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { HttpTypes } from "@medusajs/types";
import {
  MapPin,
  Building,
  Phone,
  ChevronDown,
  Edit2,
  Check,
  Plus,
  Clock,
  Star,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateOrderShippingAddress } from "@/data/orders";

// 地址匹配工具函数
function isAddressMatch(
  addr1: { first_name?: string; last_name?: string; address_1?: string; city?: string; phone?: string } | null | undefined,
  addr2: { first_name?: string; last_name?: string; address_1?: string; city?: string; phone?: string } | null | undefined
): boolean {
  if (!addr1 || !addr2) return false;
  const normalize = (str?: string) => (str || '').trim().toLowerCase();
  return (
    normalize(addr1.first_name) === normalize(addr2.first_name) &&
    normalize(addr1.last_name) === normalize(addr2.last_name) &&
    normalize(addr1.address_1) === normalize(addr2.address_1) &&
    normalize(addr1.city) === normalize(addr2.city) &&
    normalize(addr1.phone) === normalize(addr2.phone)
  );
}

// 地址信息组件
function AddressInfo({
  address,
  showLabels = false,
  compact = false,
}: {
  address: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    phone?: string;
  } | null;
  showLabels?: boolean;
  compact?: boolean;
}) {
  if (!address || !address.address_1) {
    return (
      <span className="text-gray-400 italic">
        {showLabels ? "暂无收货地址" : "—"}
      </span>
    );
  }

  return (
    <div className={cn("space-y-1.5", compact && "space-y-1")}>
      {/* 收件人 */}
      <div className={cn("font-semibold text-gray-900", compact ? "text-sm" : "text-base")}>
        {address.first_name} {address.last_name}
      </div>

      {/* 详细地址 */}
      <div className={cn("text-gray-600", compact ? "text-xs" : "text-sm")}>
        <div className="flex items-start gap-1.5">
          {!compact && <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />}
          <div>
            <div>{address.address_1}</div>
            {address.address_2 && <div>{address.address_2}</div>}
            <div>
              {address.city}
              {address.province && `, ${address.province}`}
              {address.postal_code && ` ${address.postal_code}`}
            </div>
          </div>
        </div>
      </div>

      {/* 公司 */}
      {address.company && !compact && (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Building size={14} className="text-gray-400 flex-shrink-0" />
          <span>{address.company}</span>
        </div>
      )}

      {/* 电话 */}
      {address.phone && (
        <div className={cn("flex items-center gap-1.5 text-gray-600", compact ? "text-xs" : "text-sm")}>
          {!compact && <Phone size={14} className="text-gray-400 flex-shrink-0" />}
          <span>{address.phone}</span>
        </div>
      )}
    </div>
  );
}

interface ShippingAddressSectionProps {
  orderId: string;
  currentAddress: HttpTypes.StoreOrderAddress | null;
  savedAddresses: HttpTypes.StoreCustomerAddress[];
  lastOrderAddress?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    province?: string;
    postal_code?: string;
    phone?: string;
    country_code?: string;
  } | null;
  onAddressUpdated: () => Promise<void>;
  onAddNewAddress: () => void;
  onEditAddress: () => void;
  disabled?: boolean;
}

export default function ShippingAddressSection({
  orderId,
  currentAddress,
  savedAddresses,
  lastOrderAddress,
  onAddressUpdated,
  onAddNewAddress,
  onEditAddress,
  disabled = false,
}: ShippingAddressSectionProps) {
  const t = useTranslations("shipping-address-section");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // 检查上次地址是否在保存列表中
  const isLastAddressInSaved = savedAddresses.some(addr => isAddressMatch(addr, lastOrderAddress));

  // 检查当前地址是否与上次地址匹配
  const isCurrentAddressMatchLast = isAddressMatch(currentAddress, lastOrderAddress);

  // 处理地址选择
  const handleSelectAddress = async (
    address: HttpTypes.StoreCustomerAddress | typeof lastOrderAddress,
    isLastUsedAddress = false
  ) => {
    if (!address) return;

    setIsUpdating(true);
    setSelectedAddressId(isLastUsedAddress ? 'last-used' : (address as HttpTypes.StoreCustomerAddress).id);

    try {
      await updateOrderShippingAddress(orderId, {
        first_name: address.first_name || '',
        last_name: address.last_name || '',
        company: address.company || undefined,
        address_1: address.address_1 || '',
        address_2: address.address_2 || undefined,
        city: address.city || '',
        province: address.province || undefined,
        postal_code: address.postal_code || '',
        country_code: (address as any).country_code || '',
        phone: address.phone || undefined,
      });

      await onAddressUpdated();
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to update address:', error);
    } finally {
      setIsUpdating(false);
      setSelectedAddressId(null);
    }
  };

  const hasCurrentAddress = currentAddress && currentAddress.address_1;
  const hasLastAddress = lastOrderAddress && lastOrderAddress.address_1;
  const isDisabled = disabled || isUpdating;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      {/* 标题栏 - 商务风格 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-gray-700" strokeWidth={2} />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t("title")}</h3>
            {hasCurrentAddress && (
              <CheckCircle size={16} className="text-gray-900" strokeWidth={2.5} />
            )}
          </div>
          {!isDisabled && hasCurrentAddress && (
            <button
              onClick={onEditAddress}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <Edit2 size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* 当前地址显示 */}
      <div
        className={cn(
          "px-6 py-4 cursor-pointer transition-colors",
          !isDisabled && "hover:bg-gray-50"
        )}
        onClick={() => !isDisabled && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {hasCurrentAddress ? (
              <AddressInfo address={currentAddress} />
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <AlertCircle size={16} className="text-gray-400" strokeWidth={2} />
                <span className="text-sm font-medium">{t("noAddress")}</span>
              </div>
            )}
          </div>

          {/* 展开/收起按钮 */}
          <div className={cn(
            "p-2 text-gray-400 transition-transform",
            isExpanded && "rotate-180"
          )}>
            <ChevronDown size={20} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* 展开的地址选择面板 - 商务风格 */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* 上次订单地址选项 */}
          {hasLastAddress && !isLastAddressInSaved && (
            <div className="border-b border-gray-200">
              <div className="px-6 py-3 bg-gray-50">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {t("lastOrderAddress")}
                </p>
              </div>
              <div
                onClick={() => !isDisabled && handleSelectAddress(lastOrderAddress!, true)}
                className={cn(
                  "relative px-6 py-4 transition-all cursor-pointer",
                  isCurrentAddressMatchLast
                    ? "bg-gray-50"
                    : "hover:bg-gray-50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {/* 选中状态指示 */}
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-1",
                      isCurrentAddressMatchLast
                        ? "border-gray-900 bg-gray-900"
                        : "border-gray-300"
                    )}
                  >
                    {(isCurrentAddressMatchLast || selectedAddressId === 'last-used') && (
                      isUpdating && selectedAddressId === 'last-used' ? (
                        <Loader2 size={12} className="text-white animate-spin" />
                      ) : (
                        <Check size={12} className="text-white" strokeWidth={3} />
                      )
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* 标签 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-gray-200 text-gray-900">
                        <Clock size={10} strokeWidth={2.5} />
                        {t("lastUsed")}
                      </span>
                    </div>
                    {/* 地址信息 */}
                    <AddressInfo address={lastOrderAddress} compact />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 保存的地址列表 */}
          {savedAddresses.length > 0 && (
            <div className="border-b border-gray-200">
              <div className="px-6 py-3 bg-gray-50">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {t("savedAddresses")} ({savedAddresses.length})
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {savedAddresses.map((address) => {
                  const isCurrent = isAddressMatch(address, currentAddress);
                  const isLastUsed = isAddressMatch(address, lastOrderAddress);
                  const isSelected = selectedAddressId === address.id;

                  return (
                    <div
                      key={address.id}
                      onClick={() => !isDisabled && !isCurrent && handleSelectAddress(address)}
                      className={cn(
                        "relative px-6 py-4 transition-all",
                        isCurrent
                          ? "bg-gray-50 cursor-default"
                          : "hover:bg-gray-50 cursor-pointer",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {/* 选中状态指示 */}
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-1",
                            isCurrent
                              ? "border-gray-900 bg-gray-900"
                              : isSelected
                              ? "border-gray-900 bg-gray-900"
                              : "border-gray-300"
                          )}
                        >
                          {(isCurrent || isSelected) && (
                            isUpdating && isSelected ? (
                              <Loader2 size={12} className="text-white animate-spin" />
                            ) : (
                              <Check size={12} className="text-white" strokeWidth={3} />
                            )
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* 标签 */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {address.is_default_shipping && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-gray-900 text-white">
                                <Star size={10} className="fill-current" strokeWidth={2.5} />
                                {t("default")}
                              </span>
                            )}
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-gray-700 text-white">
                                <Check size={10} strokeWidth={3} />
                                {t("current")}
                              </span>
                            )}
                            {isLastUsed && !isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-gray-200 text-gray-900">
                                <Clock size={10} strokeWidth={2.5} />
                                {t("lastUsed")}
                              </span>
                            )}
                          </div>
                          {/* 地址信息 */}
                          <AddressInfo address={address} compact />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 新增地址按钮 - 商务风格 */}
          <div className="px-6 py-4">
            <button
              onClick={() => {
                setIsExpanded(false);
                onAddNewAddress();
              }}
              disabled={isDisabled}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 cursor-pointer",
                "border border-gray-900 bg-gray-900 text-white",
                "hover:bg-gray-800",
                "transition-all font-semibold text-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="text-sm font-bold uppercase tracking-wide">{t("addNewAddress")}</span>
            </button>
          </div>

          {/* 无地址时的提示 */}
          {savedAddresses.length === 0 && !hasLastAddress && (
            <div className="px-6 py-8 text-center text-gray-500">
              <MapPin size={24} className="mx-auto text-gray-300 mb-2" strokeWidth={2} />
              <p className="text-sm font-medium">{t("noSavedAddresses")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
