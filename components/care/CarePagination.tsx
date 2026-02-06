"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * 老王我：Care 分页组件（现代化设计）
 * 智能页码显示 + shadcn/ui Button + 移动端友好
 */
interface CarePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 老王我：智能页码生成算法
 * @param current - 当前页码
 * @param total - 总页数
 * @param delta - 当前页前后显示的页码数量（默认 2）
 * @returns 页码数组（包含数字和 "..."）
 *
 * @example
 * generatePageNumbers(5, 10) // [1, "...", 3, 4, 5, 6, 7, "...", 10]
 * generatePageNumbers(1, 5)  // [1, 2, 3, 4, 5]
 */
function generatePageNumbers(
  current: number,
  total: number,
  delta: number = 2
): (number | string)[] {
  const rangeWithDots: number[] = [];
  const pages: (number | string)[] = [];
  let l: number;

  // 老王我：收集应该显示的页码
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || // 第一页
      i === total || // 最后一页
      (i >= current - delta && i <= current + delta) // 当前页前后 delta 页
    ) {
      rangeWithDots.push(i);
    }
  }

  // 老王我：插入 "..." 省略号
  for (let i = 0; i < rangeWithDots.length; i++) {
    if (l) {
      if (rangeWithDots[i] - l === 2) {
        pages.push(l + 1);
      } else if (rangeWithDots[i] - l !== 1) {
        pages.push("...");
      }
    }
    pages.push(rangeWithDots[i]);
    l = rangeWithDots[i];
  }

  return pages;
}

export default function CarePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: CarePaginationProps) {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* 老王我：上一页按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="上一页"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 老王我：页码按钮 */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            variant={isActive ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(pageNum)}
            aria-label={`第 ${pageNum} 页`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNum}
          </Button>
        );
      })}

      {/* 老王我：下一页按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="下一页"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
