"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StoreProduct, StoreProductVariant, StoreProductImage } from "@medusajs/types";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ProductGalleryProps {
  product: StoreProduct;
  selectedVariant?: StoreProductVariant;
  onVariantSelect?: (variant: StoreProductVariant) => void;
}

export default function ProductGallery({ product, selectedVariant, onVariantSelect }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const galleryRef = React.useRef<HTMLDivElement>(null);

  // 记录最后手动选择的图片URL，避免自动重置
  const lastManualSelectedImage = React.useRef<string | null>(null);

  // 获取当前选中variant的图片，如果没有则使用产品默认图片
  const allImages = React.useMemo(() => {
    const list: string[] = [];

    console.log('ProductGallery - selectedVariant:', selectedVariant);
    console.log('ProductGallery - variant metadata:', selectedVariant?.metadata);

    // 优先使用variant的metadata.images
    if (selectedVariant?.metadata?.images) {
      try {
        const imagesData = selectedVariant.metadata.images;
        let variantImages: string[] = [];

        if (typeof imagesData === 'string') {
          // 检查是否是JSON格式的数组
          if (imagesData.startsWith('[') || imagesData.startsWith('{')) {
            const parsed = JSON.parse(imagesData);
            variantImages = Array.isArray(parsed) ? parsed.map(item =>
              typeof item === 'string' ? item : item.url
            ).filter(Boolean) : [];
          } else {
            // 如果是普通的URL字符串，可能是单个URL或者多个URL用逗号/换行符分隔
            variantImages = imagesData
              .split(/[\n,]+/) // 按换行符或逗号分割
              .map(url => url.trim())
              .filter(url => url && url.startsWith('http')); // 只保留有效的URL
          }
        } else if (Array.isArray(imagesData)) {
          // 如果已经是数组格式
          variantImages = imagesData.map(item =>
            typeof item === 'string' ? item : item.url
          ).filter(Boolean);
        }

        console.log('ProductGallery - parsed variant images:', variantImages);

        // 添加到图片列表
        variantImages.forEach(img => {
          if (img && !list.includes(img)) {
            list.push(img);
          }
        });
      } catch (e) {
        console.warn('Failed to parse variant images:', e);
        // 如果解析失败，尝试当作单个URL处理
        const singleUrl = selectedVariant.metadata.images;
        if (typeof singleUrl === 'string' && singleUrl.startsWith('http')) {
          list.push(singleUrl);
        }
      }
    }

    // 如果variant没有图片，使用产品默认图片
    if (list.length === 0) {
      console.log('ProductGallery - using product default images');
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

    console.log('ProductGallery - final images list:', list);
    return list;
  }, [selectedVariant, product]);

  // 收集所有variant的图片，用于底部预览图库
  const allVariantImages = React.useMemo(() => {
    const imageData: Array<{
      url: string;
      variant: StoreProductVariant;
      isPrimary: boolean; // 是否是variant的主图
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

          // 添加到图片数组，第一张图标记为主图
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

    console.log('All variant images:', imageData);
    return imageData;
  }, [product, selectedVariant]);

  // 当variant变化时，检查是否需要保持当前选择的图片
  useEffect(() => {
    if (selectedVariant && allImages.length > 0) {
      // 如果有手动选择的图片，尝试在新的variant中找到相同图片
      if (lastManualSelectedImage.current) {
        const imageIndex = allImages.indexOf(lastManualSelectedImage.current);
        if (imageIndex >= 0) {
          // 找到了，保持选择的图片
          setCurrentImageIndex(imageIndex);
          return;
        }
      }

      // 没找到或没有手动选择，显示第一张
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
    console.log('Clicked image:', imageData.url);
    console.log('Target variant:', imageData.variant.title);

    // 记录手动选择的图片
    lastManualSelectedImage.current = imageData.url;

    // 如果点击的图片不属于当前选中的variant，先切换variant
    if (selectedVariant?.id !== imageData.variant.id) {
      console.log('Switching to variant:', imageData.variant.title);
      if (onVariantSelect) {
        onVariantSelect(imageData.variant);
      }
    }

    // 立即切换到选中的图片（在当前allImages中查找）
    const imageIndex = allImages.indexOf(imageData.url);
    if (imageIndex >= 0) {
      setCurrentImageIndex(imageIndex);
    }
  };

  return (
    <div className="flex flex-col gap-4" ref={galleryRef} onKeyDown={handleKeyDown}>
      {/* Main Image */}
      <div
        className={`relative overflow-hidden w-full cursor-pointer ${
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        style={{ aspectRatio: "1/1" }}
        onClick={handleImageClick}
      >
        <Image
          src={allImages[currentImageIndex]}
          alt={`Product Image ${currentImageIndex + 1}`}
          fill
          className={`object-cover transition-all duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 缩放提示 */}
        {!isZoomed && allImages.length > 0 && (
          <div className="absolute top-3 right-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black/80 text-white p-2 rounded-full flex items-center gap-1 shadow-lg">
              <ZoomIn size={16} />
              <span className="text-sm font-medium">点击放大</span>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-black"
              style={{ width: 40, height: 40 }}
              aria-label="上一张图片"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-black"
              style={{ width: 40, height: 40 }}
              aria-label="下一张图片"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* 图片计数器 */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>
        )}
      </div>

      {/* Product Images Gallery - 防裁剪设计 */}
      {allVariantImages.length > 1 && (
        <div className="relative">
          {/* 滚动容器 - 额外空间给选中状态 */}
          <div className="overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex gap-4 px-2">
              {allVariantImages.map((imageData, idx) => {
                const isSelected = selectedVariant?.id === imageData.variant.id &&
                                  allImages[currentImageIndex] === imageData.url;

                return (
                  <div
                    key={`${imageData.variant.id}-${idx}`}
                    className={`
                      relative shrink-0 transition-all duration-300 ease-out
                      ${isSelected
                        ? 'transform scale-125 z-20'
                        : 'transform hover:scale-110 opacity-75 hover:opacity-100'
                      }
                    `}
                  >
                    {/* 点击区域 - 比图片稍大，方便点击 */}
                    <button
                      onClick={() => handleVariantImageClick(imageData)}
                      className="
                        relative block cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
                      "
                      style={{
                        width: '70px',
                        height: '90px', // 额外高度给底部标签
                        marginTop: isSelected ? '15px' : '0',
                        marginBottom: isSelected ? '15px' : '0'
                      }}
                    >
                      {/* 图片容器 - 固定尺寸，完全无裁剪 */}
                      <div className="absolute inset-0 bg-gray-50">
                        <Image
                          src={imageData.url}
                          alt={`${imageData.variant.title || `Variant ${idx + 1}`} - Image ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="70px"
                          priority={isSelected}
                        />

                        
                        {/* 选中状态 - 底部高亮条 */}
                        {isSelected && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
                        )}

                        {/* Variant 名称标签 */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white text-xs text-center py-1 font-medium">
                          {imageData.variant.title || `规格${idx + 1}`}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 滚动提示 - 如果有很多图片 */}
          {allVariantImages.length > 6 && (
            <div className="flex justify-center mt-1">
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                左右滑动查看更多
              </div>
            </div>
          )}
        </div>
      )}

      {/* Variant 标识 */}
      {selectedVariant && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-full border border-gray-300 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span className="text-sm text-gray-800 font-medium">
              {selectedVariant.title || `规格 ${currentImageIndex + 1}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}