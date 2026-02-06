"use client";
import { useState } from "react";

export default function FilterSidebarNew() {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: false,
    availability: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="sticky top-24 space-y-4">
      {/* 筛选标题 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span>筛选 FILTER</span>
        </h3>
      </div>

      {/* Category */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-900 font-medium">📦 分类 Category</span>
          <span className={`text-brand-pink transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.category && (
          <div className="px-4 pb-4 space-y-1.5 bg-gray-50/50">
            {['一次性电子烟', '封闭式电子烟', '开放式电子烟', '烟油'].map((cat, i) => (
              <label key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white cursor-pointer transition-colors group">
                <input type="checkbox" className="w-4 h-4 accent-brand-pink rounded" />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-900 font-medium">💰 价格 Price</span>
          <span className={`text-brand-pink transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.price && (
          <div className="px-5 pb-5 space-y-4 bg-gray-50/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">$0</span>
              <span className="text-gray-500">$500</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-pink"
            />
            <div className="flex gap-2">
              <input type="number" placeholder="Min" className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all" />
              <input type="number" placeholder="Max" className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all" />
            </div>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('availability')}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-900 font-medium">✨ 状态 Availability</span>
          <span className={`text-brand-pink transition-transform ${expandedSections.availability ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.availability && (
          <div className="px-4 pb-4 space-y-1.5 bg-gray-50/50">
            {['有货', '预售', '缺货'].map((status, i) => (
              <label key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white cursor-pointer transition-colors group">
                <input type="checkbox" className="w-4 h-4 accent-brand-pink rounded" />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm">
                  {status}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filter Button */}
      <button className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
        🗑️ 清除筛选
      </button>
    </div>
  );
}
