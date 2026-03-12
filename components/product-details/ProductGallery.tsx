"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  product: StoreProduct;
  selectedVariant?: StoreProductVariant;
  onVariantSelect?: (variant: StoreProductVariant) => void;
}

export default function ProductGallery({ product, selectedVariant, onVariantSelect }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
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
      {/* 主图区域 */}
      <div className="bg-white border border-gray-200">
        <div
          className="relative overflow-hidden bg-gray-50 cursor-pointer"
          style={{ aspectRatio: "1/1" }}
        >
          <Image
            src={allImages[currentImageIndex]}
            alt={`Product Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          />

          {/* 导航箭头 */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="上一张图片"
              >
                <ChevronLeft size={18} className="text-gray-900" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="下一张图片"
              >
                <ChevronRight size={18} className="text-gray-900" />
              </button>
            </>
          )}
        </div>

        {/* 图片计数器 */}
        {allImages.length > 1 && (
          <div className="flex items-center justify-center px-4 py-3 bg-gray-50 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              {currentImageIndex + 1} / {allImages.length}
            </span>
          </div>
        )}
      </div>

      {/* 缩略图网格 */}
      {allVariantImages.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">选择款式</h3>
            <span className="text-sm text-gray-500">{allVariantImages.length} 款可选</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {allVariantImages.map((imageData, idx) => {
              const isSelected = selectedVariant?.id === imageData.variant.id &&
                                allImages[currentImageIndex] === imageData.url;

              return (
                <button
                  key={`${imageData.variant.id}-${idx}`}
                  onClick={() => handleVariantImageClick(imageData)}
                  className="relative group cursor-pointer"
                >
                  {/* 序号标识 */}
                  <div className={`absolute top-1 left-1 w-5 h-5 flex items-center justify-center text-xs font-bold z-10 ${
                    isSelected ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 group-hover:bg-gray-100'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* 图片容器 */}
                  <div className={`relative w-full aspect-square overflow-hidden border transition-colors ${
                    isSelected ? 'border-gray-900' : 'border-gray-200 group-hover:border-gray-400'
                  }`}>
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

      {/* Package Specifications */}
      {product?.metadata && Object.keys(product.metadata).some(key => key.startsWith('package_spec_')) && (
        <div className="border border-gray-200 bg-white">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wide">
              Package Specifications / 箱规详情
            </h3>
          </div>

          <div className="p-6">
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
                  const labelText = labelKey
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  // 交替背景色
                  const bgColor = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';

                  return (
                    <div
                      key={key}
                      className={`p-4 border border-gray-200 ${bgColor}`}
                    >
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {labelText}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {value}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
