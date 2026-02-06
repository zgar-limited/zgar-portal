import React from "react";

/**
 * Container组件 - 替代Bootstrap的.container
 * 提供居中容器，带响应式padding
 */
export function Container({
  children,
  className = "",
  fluid = false,
}: {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}) {
  return (
    <div
      className={`mx-auto px-4 ${fluid ? "w-full" : "max-w-7xl"} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Row组件 - 替代Bootstrap的.row
 * Flex容器，负margin用于列的gutter补偿
 */
export function Row({
  children,
  className = "",
  gutter = 4,
}: {
  children: React.ReactNode;
  className?: string;
  gutter?: number;
}) {
  const gutterClass = gutter > 0 ? `-${gutter}` : "";

  return (
    <div className={`flex flex-wrap ${gutterClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Col组件 - 替代Bootstrap的.col-*
 * 响应式列组件
 */
export function Col({
  children,
  className = "",
  xs = 12,
  sm,
  md,
  lg,
  xl,
  gutter = 4,
}: {
  children: React.ReactNode;
  className?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gutter?: number;
}) {
  const getWidthClass = (breakpoint: string, cols: number) => {
    if (cols === 12) return ""; // 默认full width
    const fraction = cols / 12;
    const percentage = fraction * 100;
    return `${breakpoint}:w-[${percentage}%]`;
  };

  const classes = [
    "w-full", // 默认mobile全宽
    sm && getWidthClass("sm", sm),
    md && getWidthClass("md", md),
    lg && getWidthClass("lg", lg),
    xl && getWidthClass("xl", xl),
    `px-${gutter}`, // gutter padding
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

/**
 * 简化的Col组件 - 常用尺寸快捷方式
 */
export function ColHalf({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full md:w-1/2 px-4 ${className}`}>{children}</div>
  );
}

export function ColThird({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full md:w-1/3 px-4 ${className}`}>{children}</div>
  );
}

export function ColQuarter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full md:w-1/4 px-4 ${className}`}>{children}</div>
  );
}

export function ColFull({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`w-full px-4 ${className}`}>{children}</div>;
}
