"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countryCodes = [
  { code: "+86", country: "CN", label: "China" },
  { code: "+1", country: "US", label: "USA" },
  { code: "+44", country: "UK", label: "UK" },
  { code: "+81", country: "JP", label: "Japan" },
  { code: "+49", country: "DE", label: "Germany" },
  { code: "+33", country: "FR", label: "France" },
  { code: "+7", country: "RU", label: "Russia" },
  { code: "+91", country: "IN", label: "India" },
  { code: "+61", country: "AU", label: "Australia" },
  { code: "+82", country: "KR", label: "Korea" },
];

export default function CountryCodeSelect({ onSelect, initialCode = "+86" }) {
  return (
    <Select
      defaultValue={initialCode}
      onValueChange={(value) => {
        if (onSelect) {
          onSelect(value);
        }
      }}
    >
      <SelectTrigger
        className="h-11 w-[100px] border-gray-200 focus-visible:ring-gray-900 bg-white"
      >
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent className="border-gray-200">
        {countryCodes.map((item) => (
          <SelectItem
            key={item.country}
            value={item.code}
            className="focus:bg-gray-100"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-700">{item.label}</span>
              <span className="text-gray-500 font-medium">{item.code}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
