"use client";
import React, { useState } from "react";
import Image from "next/image";
import { StoreProductImage } from "@medusajs/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: StoreProductImage[] | null;
  thumbnail: string | null;
}

export default function ProductGallery({ images, thumbnail }: ProductGalleryProps) {
  // Combine thumbnail and images, deduplicating if needed
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (thumbnail) list.push(thumbnail);
    if (images) {
        images.forEach(img => {
            if (img.url && !list.includes(img.url)) {
                list.push(img.url);
            }
        });
    }
    // Fallback if empty
    if (list.length === 0) {
        list.push("https://placehold.co/600x600");
    }
    return list;
  }, [images, thumbnail]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="gap-3 d-flex flex-column">
      {/* Main Image */}
      <div className="overflow-hidden position-relative rounded-4 bg-light w-100" style={{ aspectRatio: "1/1" }}>
        <Image
          src={allImages[selectedIndex]}
          alt="Product Image"
          fill
          className="object-fit-cover"
          priority
        />
        
        {/* Navigation Arrows (visible if multiple images) */}
        {allImages.length > 1 && (
            <>
                <button 
                    onClick={() => setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="p-2 shadow-xs position-absolute start-0 top-50 translate-middle-y btn btn-light rounded-circle ms-3 d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={() => setSelectedIndex((prev) => (prev + 1) % allImages.length)}
                    className="p-2 shadow-xs position-absolute end-0 top-50 translate-middle-y btn btn-light rounded-circle me-3 d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}
                >
                    <ChevronRight size={20} />
                </button>
            </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="gap-2 pb-2 overflow-auto d-flex">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`border-0 p-0 rounded-3 overflow-hidden position-relative shrink-0 ${selectedIndex === idx ? 'ring-2 ring-primary' : ''}`}
              style={{ width: 80, height: 80, outline: selectedIndex === idx ? '2px solid black' : 'none' }}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-fit-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}