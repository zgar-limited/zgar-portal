"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { ChevronLeft, ChevronRight, ZoomIn, Package } from "lucide-react";

interface ProductGalleryProps {
  product: StoreProduct;
  selectedVariant?: StoreProductVariant;
  onVariantSelect?: (variant: StoreProductVariant) => void;
}

export default function ProductGallery({ product, selectedVariant, onVariantSelect }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // 记录最后手动选择的图片URL
  const lastManualSelectedImage = React.useRef<string | null>(null);

  // 获取当前选中variant的图片
  const allImages = React.useMemo(() => {
    const list: string[] = [];

    // 优先使用variant的metadata.images
    if (selectedVariant?.metadata?.images) {
      try {
        const imagesData = selectedVariant.metadata.images;
        let variantImages: string[] = [];

        if (typeof imagesData === 'string') {
          if (imagesData.startsWith('[') || imagesData.startsWith('{')) {
            const parsed = JSON.parse(imagesData);
            variantImages = Array.isArray(parsed) ? parsed.map(item =>
              typeof item === 'string' ? item : item.url
            ).filter(Boolean) : [];
          } else {
            variantImages = imagesData
              .split(/[\n,]+/)
              .map(url => url.trim())
              .filter(url => url && url.startsWith('http'));
          }
        } else if (Array.isArray(imagesData)) {
          variantImages = imagesData.map(item =>
            typeof item === 'string' ? item : item.url
          ).filter(Boolean);
        }

        variantImages.forEach(img => {
          if (img && !list.includes(img)) {
            list.push(img);
          }
        });
      } catch (e) {
        console.warn('Failed to parse variant images:', e);
        const singleUrl = selectedVariant.metadata.images;
        if (typeof singleUrl === 'string' && singleUrl.startsWith('http')) {
          list.push(singleUrl);
        }
      }
    }

    // 如果variant没有图片，使用产品默认图片
    if (list.length === 0) {
      if (product.thumbnail) list.push(product.thumbnail);
      if (product.images) {
        product.images.forEach(img => {
          if (img.url && !list.includes(img.url)) {
            list.push(img.url);
          }
        });
      }
    }

    // 如果还是为空，使用占位图
    if (list.length === 0) {
      list.push(`https://picsum.photos/600/600?random=${product.id}`);
    }

    return list;
  }, [selectedVariant, product]);

  // 收集所有variant的图片
  const allVariantImages = React.useMemo(() => {
    const imageData: Array<{
      url: string;
      variant: StoreProductVariant;
      isPrimary: boolean;
    }> = [];

    product.variants?.forEach(variant => {
      if (variant.metadata?.images) {
        try {
          const imagesData = variant.metadata.images;
          let variantImages: string[] = [];

          if (typeof imagesData === 'string') {
            if (imagesData.startsWith('[') || imagesData.startsWith('{')) {
              const parsed = JSON.parse(imagesData);
              variantImages = Array.isArray(parsed) ? parsed.map(item =>
                typeof item === 'string' ? item : item.url
              ).filter(Boolean) : [];
            } else {
              variantImages = imagesData
                .split(/[\n,]+/)
                .map(url => url.trim())
                .filter(url => url && url.startsWith('http'));
            }
          } else if (Array.isArray(imagesData)) {
            variantImages = imagesData.map(item =>
              typeof item === 'string' ? item : item.url
            ).filter(Boolean);
          }

          variantImages.forEach((imgUrl, index) => {
            if (imgUrl && !imageData.find(item => item.url === imgUrl)) {
              imageData.push({
                url: imgUrl,
                variant,
                isPrimary: index === 0
              });
            }
          });
        } catch (e) {
          console.warn(`Failed to parse images for variant ${variant.id}:`, e);
        }
      }
    });

    // 如果没有variant图片，使用产品默认图片
    if (imageData.length === 0) {
      const defaultImages: string[] = [];
      if (product.thumbnail) defaultImages.push(product.thumbnail);
      if (product.images) {
        product.images.forEach(img => {
          if (img.url && !defaultImages.includes(img.url)) {
            defaultImages.push(img.url);
          }
        });
      }

      defaultImages.forEach(url => {
        imageData.push({
          url,
          variant: product.variants?.[0] as StoreProductVariant,
          isPrimary: true
        });
      });
    }

    return imageData;
  }, [product, selectedVariant]);

  // 当variant变化时，检查是否需要保持当前选择的图片
  useEffect(() => {
    if (selectedVariant && allImages.length > 0) {
      if (lastManualSelectedImage.current) {
        const imageIndex = allImages.indexOf(lastManualSelectedImage.current);
        if (imageIndex >= 0) {
          setCurrentImageIndex(imageIndex);
          return;
        }
      }

      setCurrentImageIndex(0);
      lastManualSelectedImage.current = null;
    }
  }, [selectedVariant, allImages]);

  // 缩放功能
  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'Escape') setIsZoomed(false);
  };

  // 点击底部小图选择对应的variant和图片
  const handleVariantImageClick = (imageData: typeof allVariantImages[0]) => {
    lastManualSelectedImage.current = imageData.url;

    if (selectedVariant?.id !== imageData.variant.id) {
      if (onVariantSelect) {
        onVariantSelect(imageData.variant);
      }
    }

    const imageIndex = allImages.indexOf(imageData.url);
    if (imageIndex >= 0) {
      setCurrentImageIndex(imageIndex);
    }
  };

  return (
    <div className="flex flex-col gap-6" onKeyDown={handleKeyDown}>
      {/* 老王我：IKEA 风格 - 主图区域 */}
      <div className="bg-white border-2 border-gray-200">
        {/* 老王我：主图容器 - 功能性设计 */}
        <div
          className={`relative overflow-hidden bg-gray-50 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          style={{ aspectRatio: "1/1" }}
          onClick={handleImageClick}
        >
          <Image
            src={allImages[currentImageIndex]}
            alt={`Product Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          />

          {/* 老王我：功能提示 - 简洁文字 */}
          {!isZoomed && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-gray-900 px-3 py-2 text-sm font-medium border border-gray-300">
              点击放大
            </div>
          )}

          {/* 老王我：导航箭头 - 功能性按钮 */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-900 hover:bg-gray-50 flex items-center justify-center transition-colors"
                style={{ width: 44, height: 44 }}
                aria-label="上一张图片"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-900 hover:bg-gray-50 flex items-center justify-center transition-colors"
                style={{ width: 44, height: 44 }}
                aria-label="下一张图片"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* 老王我：图片计数器 - 简洁信息 */}
        {allImages.length > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              图片 {currentImageIndex + 1} / {allImages.length}
            </span>
          </div>
        )}
      </div>

      {/* 老王我：IKEA 风格缩略图 - 网格布局 + 序号 */}
      {allVariantImages.length > 1 && (
        <div>
          {/* 老王我：缩略图标题 */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">选择款式</h3>
            <span className="text-sm text-gray-500">点击切换</span>
          </div>

          {/* 老王我：网格布局 - 数学化间距 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {allVariantImages.map((imageData, idx) => {
              const isSelected = selectedVariant?.id === imageData.variant.id &&
                                allImages[currentImageIndex] === imageData.url;

              return (
                <button
                  key={`${imageData.variant.id}-${idx}`}
                  onClick={() => handleVariantImageClick(imageData)}
                  className="relative group"
                >
                  {/* 老王我：序号标识 */}
                  <div className={`absolute top-2 left-2 w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors z-10 ${isSelected ? 'bg-brand-pink text-white' : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'}`}>
                    {idx + 1}
                  </div>

                  {/* 老王我：图片容器 - 扁平设计 */}
                  <div className={`relative w-full aspect-square rounded overflow-hidden border-2 transition-colors ${isSelected ? 'border-brand-pink' : 'border-gray-300 group-hover:border-gray-900'}`}>
                    <Image
                      src={imageData.url}
                      alt={`款式 ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 100px"
                      priority={isSelected}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 老王我：Package Specifications (箱规) - Bento Grid + Vibrant Blocks 风格 */}
      {product?.metadata && Object.keys(product.metadata).some(key => key.startsWith('package_spec_')) && (
        <div className="space-y-6 pt-6">
          {/* 老王我：超大标题区 - Vibrant Blocks 装饰 */}
          <div className="relative">
            <div className="absolute -left-3 top-1/2 w-2 h-16 bg-brand-pink -translate-y-1/2 rounded-lg transform -rotate-6"></div>
            <div className="flex items-center justify-between pl-5">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  Package Specifications
                </h3>
                <p className="text-sm text-gray-500 font-semibold mt-1">箱规详情</p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-pink"></div>
                <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                <div className="w-3 h-3 rounded-full bg-gray-800"></div>
              </div>
            </div>
          </div>

          {/* 老王我：Bento Grid 布局 - 2列大色块卡片 */}
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(product.metadata)
              .filter(key => key.startsWith('package_spec_'))
              .sort((a, b) => {
                const order = [
                  'package_spec_shipment_box_contains',
                  'package_spec_product_size',
                  'package_spec_product_weight',
                  'package_spec_packaging_box_size',
                  'package_spec_packaging_box_weight',
                  'package_spec_outer_box_size',
                  'package_spec_outer_box_weight',
                  'package_spec_shipment_box_size',
                  'package_spec_shipment_box_weight'
                ];
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
              })
              .map((key, index) => {
                const value = product.metadata![key];
                if (!value) return null;

                const labelKey = key.replace('package_spec_', '');
                // 老王我：格式化标签文本
                const labelText = labelKey
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                // 老王我：Vibrant Blocks 超大胆色块 - 循环粉蓝
                const colors = [
                  {
                    bg: "bg-gradient-to-br from-brand-pink to-brand-pink/80",
                    border: "border-brand-pink",
                    text: "text-white",
                    subtext: "text-white/90"
                  },
                  {
                    bg: "bg-gradient-to-br from-brand-blue to-brand-blue/80",
                    border: "border-brand-blue",
                    text: "text-white",
                    subtext: "text-white/90"
                  },
                  {
                    bg: "bg-gradient-to-br from-gray-800 to-gray-700",
                    border: "border-gray-800",
                    text: "text-white",
                    subtext: "text-white/90"
                  }
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <div
                    key={key}
                    className={`group relative overflow-hidden rounded-2xl border-3 ${colorScheme.bg} ${colorScheme.border} p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                  >
                    {/* 老王我：装饰性几何图形 */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-lg transform -translate-x-6 translate-y-6 group-hover:scale-125 transition-transform duration-500"></div>

                    {/* 老王我：内容区域 */}
                    <div className="relative z-10">
                      {/* 老王我：图标 */}
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                        <Package size={20} className={colorScheme.text} />
                      </div>

                      {/* 老王我：标签 */}
                      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${colorScheme.subtext}`}>
                        {labelText}
                      </p>

                      {/* 老王我：值 - 超大字体 */}
                      <p className={`text-lg font-black ${colorScheme.text} leading-tight`}>
                        {value}
                      </p>
                    </div>

                    {/* 老王我：序号角标 */}
                    <div className={`absolute top-3 right-3 w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center ${colorScheme.subtext} text-xs font-black`}>
                      {index + 1}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
