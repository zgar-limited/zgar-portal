"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { HttpTypes } from "@medusajs/types";
import {
  MapPin,
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

// 地址信息组件 - Tesla极简风格
function AddressInfo({
  address,
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
  compact?: boolean;
}) {
  if (!address || !address.address_1) {
    return <span className="text-gray-300">—</span>;
  }

  return (
    <div className={cn("space-y-1", compact && "space-y-0.5")}>
      {/* 收件人 */}
      <div className={cn("text-gray-900", compact ? "text-sm font-medium" : "text-base font-light")}>
        {address.first_name} {address.last_name}
      </div>

      {/* 详细地址 */}
      <div className={cn("text-gray-500", compact ? "text-xs" : "text-sm")}>
        <div>{address.address_1}</div>
        {address.address_2 && <div>{address.address_2}</div>}
        <div>
          {address.city}
          {address.province && `, ${address.province}`}
          {address.postal_code && ` ${address.postal_code}`}
        </div>
      </div>

      {/* 电话 */}
      {address.phone && (
        <div className={cn("text-gray-500", compact ? "text-xs" : "text-sm")}>
          {address.phone}
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
    <div>
      {/* 标题栏 - Tesla极简风格 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">{t("title")}</h2>
          {hasCurrentAddress && (
            <CheckCircle size={14} className="text-black" />
          )}
        </div>
        {!isDisabled && hasCurrentAddress && (
          <button
            onClick={onEditAddress}
            className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit2 size={12} />
            {t("edit") || "Edit"}
          </button>
        )}
      </div>

      {/* 当前地址显示 */}
      <div
        className={cn(
          "cursor-pointer transition-colors",
          !isDisabled && "hover:opacity-80"
        )}
        onClick={() => !isDisabled && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {hasCurrentAddress ? (
              <AddressInfo address={currentAddress} />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <AlertCircle size={14} />
                  <span className="text-sm">{t("noAddress")}</span>
                </div>
                {/* 快速操作按钮 */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {savedAddresses.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(true);
                      }}
                      disabled={isDisabled}
                      className="flex items-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MapPin size={14} />
                      {t("selectAddress") || "選擇地址"}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNewAddress();
                    }}
                    disabled={isDisabled}
                    className="flex items-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} strokeWidth={2} />
                    {t("addNewAddress")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 展开/收起按钮 - 只在有地址时显示 */}
          {hasCurrentAddress && (
            <div className={cn(
              "p-1 text-gray-300 transition-transform",
              isExpanded && "rotate-180"
            )}>
              <ChevronDown size={16} />
            </div>
          )}
        </div>
      </div>

      {/* 展开的地址选择面板 - Tesla极简风格 */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
          {/* 上次订单地址选项 */}
          {hasLastAddress && !isLastAddressInSaved && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                {t("lastOrderAddress")}
              </p>
              <div
                onClick={() => !isDisabled && handleSelectAddress(lastOrderAddress!, true)}
                className={cn(
                  "py-4 transition-all cursor-pointer border-b border-gray-100",
                  isCurrentAddressMatchLast ? "opacity-100" : "opacity-70 hover:opacity-100",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-4 h-4 border flex items-center justify-center flex-shrink-0 mt-0.5",
                      isCurrentAddressMatchLast
                        ? "border-black bg-black"
                        : "border-gray-300"
                    )}
                  >
                    {(isCurrentAddressMatchLast || selectedAddressId === 'last-used') && (
                      isUpdating && selectedAddressId === 'last-used' ? (
                        <Loader2 size={10} className="text-white animate-spin" />
                      ) : (
                        <Check size={10} className="text-white" strokeWidth={3} />
                      )
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* 标签 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
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
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                {t("savedAddresses")} ({savedAddresses.length})
              </p>
              <div className="space-y-0">
                {savedAddresses.map((address, idx) => {
                  const isCurrent = isAddressMatch(address, currentAddress);
                  const isLastUsed = isAddressMatch(address, lastOrderAddress);
                  const isSelected = selectedAddressId === address.id;

                  return (
                    <div
                      key={address.id}
                      onClick={() => !isDisabled && !isCurrent && handleSelectAddress(address)}
                      className={cn(
                        "py-4 transition-all border-b border-gray-100 first:pt-0 last:border-b-0",
                        isCurrent ? "cursor-default" : "cursor-pointer",
                        !isCurrent && "hover:opacity-80",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-4 h-4 border flex items-center justify-center flex-shrink-0 mt-0.5",
                            (isCurrent || isSelected)
                              ? "border-black bg-black"
                              : "border-gray-300"
                          )}
                        >
                          {(isCurrent || isSelected) && (
                            isUpdating && isSelected ? (
                              <Loader2 size={10} className="text-white animate-spin" />
                            ) : (
                              <Check size={10} className="text-white" strokeWidth={3} />
                            )
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* 标签 */}
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {address.is_default_shipping && (
                              <span className="text-xs text-black font-medium flex items-center gap-1">
                                <Star size={10} className="fill-current" />
                                {t("default")}
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Check size={10} />
                                {t("current")}
                              </span>
                            )}
                            {isLastUsed && !isCurrent && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock size={10} />
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

          {/* 新增地址按钮 - 更明显 */}
          <button
            onClick={() => {
              setIsExpanded(false);
              onAddNewAddress();
            }}
            disabled={isDisabled}
            className={cn(
              "text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2 cursor-pointer py-3 px-4 bg-gray-100 hover:bg-gray-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Plus size={16} strokeWidth={2} />
            {t("addNewAddress")}
          </button>

          {/* 无地址时的提示 */}
          {savedAddresses.length === 0 && !hasLastAddress && (
            <p className="text-sm text-gray-400">{t("noSavedAddresses")}</p>
          )}
        </div>
      )}
    </div>
  );
}
