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
      {/* 老王我：主图容器 - Vibrant Blocks 蓝粉纯色碰撞风格 */}
      <div className="relative">
        {/* 老王我：装饰性几何色块 - 左上粉色 */}
        <div className="absolute -top-2 -left-2 w-20 h-20 bg-brand-pink rounded-3xl -z-10"></div>
        {/* 老王我：装饰性几何色块 - 右下蓝色 */}
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-brand-blue rounded-full -z-10"></div>
        {/* 老王我：装饰性三角形 - 左下 */}
        <div className="absolute bottom-8 left-0 w-0 h-0 border-l-[32px] border-l-transparent border-b-[24px] border-b-brand-pink opacity-60 -z-10"></div>
        {/* 老王我：装饰性三角形 - 右上 */}
        <div className="absolute top-8 right-0 w-0 h-0 border-r-[28px] border-r-transparent border-t-[20px] border-t-brand-blue opacity-60 -z-10"></div>

        <div
          className={`relative overflow-hidden rounded-3xl shadow-2xl bg-white ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          } border-4 border-brand-pink`}
          style={{ aspectRatio: "1/1" }}
          onClick={handleImageClick}
        >
          <Image
            src={allImages[currentImageIndex]}
            alt={`Product Image ${currentImageIndex + 1}`}
            fill
            className={`object-cover transition-all duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* 老王我：缩放提示 - Vibrant Blocks 风格 */}
          {!isZoomed && allImages.length > 0 && (
            <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="bg-gradient-to-r from-brand-pink to-brand-blue text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
                <ZoomIn size={20} />
                <span className="text-sm font-black">点击放大</span>
              </div>
            </div>
          )}

          {/* 老王我：导航箭头 - 粉蓝渐变 */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-pink to-brand-blue text-white p-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 opacity-0 hover:opacity-100 border-2 border-white"
                style={{ width: 52, height: 52 }}
                aria-label="上一张图片"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-blue to-brand-pink text-white p-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 opacity-0 hover:opacity-100 border-2 border-white"
                style={{ width: 52, height: 52 }}
                aria-label="下一张图片"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          {/* 老王我：图片计数器 - 渐变色块 */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-white">
                <span className="text-sm font-black">{currentImageIndex + 1} / {allImages.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 老王我：缩略图画廊 - Vibrant Blocks 大胆设计 */}
      {allVariantImages.length > 1 && (
        <div className="relative">
          {/* 滚动容器 */}
          <div className="overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex gap-4 px-2">
              {allVariantImages.map((imageData, idx) => {
                const isSelected = selectedVariant?.id === imageData.variant.id &&
                                  allImages[currentImageIndex] === imageData.url;

                // 老王我：循环使用粉蓝颜色
                const colors = [
                  "border-brand-pink shadow-pink-lg",
                  "border-brand-blue shadow-blue-lg",
                  "border-gray-800 shadow-gray-lg",
                ];
                const borderColor = colors[idx % colors.length];

                return (
                  <div
                    key={`${imageData.variant.id}-${idx}`}
                    className={`
                      relative shrink-0 transition-all duration-300 ease-out
                      ${isSelected
                        ? 'transform scale-110 z-20'
                        : 'transform hover:scale-105 opacity-70 hover:opacity-100'
                      }
                    `}
                  >
                    <button
                      onClick={() => handleVariantImageClick(imageData)}
                      className="relative block cursor-pointer focus:outline-none"
                      style={{
                        width: '88px',
                        height: '110px',
                      }}
                    >
                      {/* 图片容器 - Vibrant Blocks 风格 */}
                      <div className={`
                        absolute inset-0 rounded-2xl overflow-hidden shadow-md
                        border-4 ${isSelected ? borderColor : 'border-gray-200'}
                      `}>
                        <Image
                          src={imageData.url}
                          alt={`${imageData.variant.title} - Image ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="88px"
                          priority={isSelected}
                        />

                        {/* 老王我：选中状态 - 顶部色条 */}
                        {isSelected && (
                          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-pink to-brand-pink"></div>
                        )}

                        {/* Variant 名称标签 - Vibrant Blocks 风格 */}
                        <div className={`
                          absolute bottom-0 left-0 right-0 py-2 text-center text-xs font-black
                          ${isSelected
                            ? 'bg-gradient-to-r from-brand-pink to-brand-pink text-white'
                            : 'bg-gray-900 text-white'
                          }
                        `}>
                          {imageData.variant.title || `规格${idx + 1}`}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 老王我：滚动提示 */}
          {allVariantImages.length > 6 && (
            <div className="flex justify-center mt-2">
              <div className="bg-gradient-to-r from-brand-pink/10 to-brand-blue/10 px-4 py-2 rounded-xl border-2 border-brand-pink/30">
                <div className="text-xs text-gray-700 flex items-center gap-2 font-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span>左右滑动查看更多</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 老王我：Variant 标识 - Vibrant Blocks 色块 */}
      {selectedVariant && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-brand-pink/10 px-6 py-3 rounded-2xl border-2 border-brand-pink shadow-md">
            <div className="w-3 h-3 rounded-full bg-brand-pink shadow-sm"></div>
            <span className="text-sm font-black text-gray-900">
              {selectedVariant.title || `规格 ${currentImageIndex + 1}`}
            </span>
          </div>
        </div>
      )}

      {/* 老王我：Package Specifications (箱规) - Vibrant Blocks 风格 */}
      {product?.metadata && Object.keys(product.metadata).some(key => key.startsWith('package_spec_')) && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Package size={20} className="text-brand-pink" />
            Package Specifications
          </h3>

          <div className="space-y-2">
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

                // 老王我：循环使用粉蓝颜色
                const colors = [
                  "bg-brand-pink/10 border-brand-pink",
                  "bg-brand-blue/10 border-brand-blue",
                  "bg-gray-100 border-gray-300",
                ];
                const colorClass = colors[index % colors.length];
                const iconColors = [
                  "text-brand-pink",
                  "text-brand-blue",
                  "text-gray-700",
                ];

                return (
                  <div key={key} className={`flex items-start gap-3 p-3 rounded-xl border-2 ${colorClass} shadow-sm`}>
                    <div className={`w-8 h-8 ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Package size={16} className={iconColors[index % iconColors.length]} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1 font-semibold">{labelText}</p>
                      <p className="text-sm font-black text-gray-900">{value}</p>
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
