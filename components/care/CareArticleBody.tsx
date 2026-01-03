"use client";

import Image from "next/image";
import DOMPurify from "dompurify";
import { Quote, Code } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { StrapiBlock, StrapiImage } from "@/data/articles";

/**
 * 老王我：Care 文章正文组件
 * 动态渲染 Strapi Blocks（text, image, video, quote, code 等）
 */
interface CareArticleBodyProps {
  blocks: StrapiBlock[];
  className?: string;
}

// 老王我：Block 渲染器映射（使用正确的 Strapi 组件名）
const BLOCK_RENDERERS: Record<string, (block: StrapiBlock) => JSX.Element | null> = {
  "sections.rich-text": RichTextBlockRenderer,
  "shared.media": MediaBlockRenderer,
  "shared.quote": QuoteBlockRenderer,
  "shared.slider": SliderBlockRenderer,
};

export default function CareArticleBody({
  blocks,
  className = "",
}: CareArticleBodyProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div
      className={`prose prose-gray dark:prose-invert max-w-none lg:prose-lg space-y-6 ${className}`}
    >
      {blocks.map((block) => {
        // 老王我：根据 __component 字段匹配渲染器
        const renderer = BLOCK_RENDERERS[block.__component];

        if (!renderer) {
          console.warn(`Unknown block type: ${block.__component}`, block);
          return null;
        }
        return <div key={block.id}>{renderer(block)}</div>;
      })}
    </div>
  );
}

// 老王我：Rich Text 渲染器（sections.rich-text）
function RichTextBlockRenderer(block: StrapiBlock) {
  // 老王我：安全渲染 HTML（防止 XSS）
  const content = block.content as string | undefined;
  if (!content) return null;

  const safeHTML = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "em",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "img",
      "br",
      "hr",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "title"],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });

  return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />;
}

// 老王我：Media 块渲染器（shared.media）
function MediaBlockRenderer(block: StrapiBlock) {
  const file = block.file as StrapiImage | undefined;
  const imageUrl = file?.url ? `${process.env.STRAPI_URL}${file.url}` : "";

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={file?.name || ""}
            fill
            className="object-cover"
          />
        ) : null}
      </div>
    </figure>
  );
}

// 老王我：引用块渲染器（shared.quote）
function QuoteBlockRenderer(block: StrapiBlock) {
  const title = block.title as string | undefined;
  const body = block.body as string | undefined;

  return (
    <Card className="border-l-4 border-primary p-6 my-6 bg-gray-50 dark:bg-gray-800/50">
      <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
      {title && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      {body && (
        <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
          "{body}"
        </blockquote>
      )}
    </Card>
  );
}

// 老王我：滑块渲染器（shared.slider）
function SliderBlockRenderer(block: StrapiBlock) {
  const files = block.files as StrapiImage[] | undefined;

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 my-8 sm:grid-cols-2">
      {files.map((file, index) => {
        const imageUrl = file.url ? `${process.env.STRAPI_URL}${file.url}` : "";
        return (
          <figure key={index} className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={file.name || ""}
                fill
                className="object-cover"
              />
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
