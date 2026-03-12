/**
 * Apple-Style B2B 商务设计系统
 * 灵感来源：Apple 设计语言
 * 特点：极简主义、精致圆角、柔和阴影、精确间距、适当尺寸
 */

// 老王我：苹果风格色彩系统
export const b2bColors = {
  // 主色调
  primary: 'slate-900',      // 深色文字
  secondary: 'slate-600',    // 次要文字
  accent: 'brand-blue',      // 品牌蓝作为强调色

  // 语义色
  success: 'emerald-600',
  warning: 'amber-500',
  danger: 'red-500',

  // 背景色
  background: 'gray-50',     // 苹果风格浅灰背景
  card: 'white',             // 卡片白色
  surface: 'gray-100',       // 表面色

  // 边框色
  border: 'gray-200',        // 浅边框
  borderDark: 'gray-300',    // 深边框

  // 文字色
  muted: 'gray-500',         // 弱化文字
  mutedLight: 'gray-400',    // 更弱化文字
} as const;

// 老王我：苹果风格按钮 - 适当尺寸 (40-44px高度)
export const b2bButton = {
  // 主按钮 - 品牌蓝，苹果风格圆角
  primary:
    'bg-brand-blue hover:bg-brand-blue/90 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow',

  // 次按钮 - 白色背景，灰色边框
  secondary:
    'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium px-5 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',

  // 危险按钮
  danger:
    'bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow',

  // 幽灵按钮 - 无背景
  ghost:
    'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-xl transition-all duration-200',

  // 图标按钮 - 紧凑尺寸
  icon: 'p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200',

  // 小尺寸按钮
  sm: 'px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200',

  // 大尺寸按钮
  lg: 'px-6 py-3 text-base rounded-xl font-medium transition-all duration-200',
} as const;

// 老王我：苹果风格卡片 - 精致圆角和柔和阴影
export const b2bCard = {
  // 基础卡片
  base: 'bg-white border border-gray-200/60 rounded-2xl shadow-sm',

  // 可悬停卡片
  hover: 'bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300/60 transition-all duration-200',

  // 选中状态 - 左侧品牌蓝细边框
  selected: 'bg-blue-50/50 border-l-[3px] border-l-brand-blue rounded-2xl',

  // 紧凑卡片
  compact: 'bg-white border border-gray-200/60 rounded-xl shadow-sm',

  // 分组卡片
  group: 'bg-gray-50 border border-gray-200/60 rounded-xl',
} as const;

// 老王我：苹果风格表格
export const b2bTable = {
  header:
    'bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide',
  row: 'border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150',
  selected: 'bg-blue-50/30 border-l-2 border-l-brand-blue',
  cell: 'py-3.5 px-4',
} as const;

// 老王我：苹果风格输入框
export const b2bInput = {
  base: 'border border-gray-200 rounded-xl bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 placeholder:text-gray-400',

  search: 'border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 placeholder:text-gray-400',
} as const;

// 老王我：苹果风格文字
export const b2bText = {
  // 标题
  title: 'text-gray-900 font-semibold tracking-tight',
  subtitle: 'text-gray-700 font-medium',

  // 标签
  label: 'text-gray-500 text-sm font-medium',
  muted: 'text-gray-400 text-sm',

  // 价格 - 使用品牌蓝强调
  price: 'text-gray-900 font-mono font-medium',
  priceLarge: 'text-gray-900 font-bold text-xl font-mono',
  priceSmall: 'text-gray-500 text-sm font-mono',

  // 品牌色价格
  priceAccent: 'text-brand-blue font-mono font-semibold',
} as const;

// 老王我：苹果风格徽章 - 精致圆角
export const b2bBadge = {
  default: 'bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium',
  primary: 'bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-lg text-xs font-medium',
  success: 'bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-medium',
  warning: 'bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-xs font-medium',
  danger: 'bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-medium',
} as const;

// 老王我：苹果风格布局
export const b2bLayout = {
  section: 'p-5 bg-white border border-gray-200/60 rounded-2xl shadow-sm',
  header: 'flex items-center justify-between pb-4 border-b border-gray-100',
  footer: 'flex items-center justify-between pt-4 border-t border-gray-100',
} as const;

// 老王我：苹果风格复选框
export const b2bCheckbox = {
  base: 'w-4 h-4 border-gray-300 rounded data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue transition-colors duration-150',
  large: 'w-5 h-5 border-gray-300 rounded-md data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue transition-colors duration-150',
} as const;

// 老王我：苹果风格阴影
export const b2bShadow = {
  sm: 'shadow-sm',
  md: 'shadow-md shadow-gray-200/50',
  lg: 'shadow-lg shadow-gray-200/50',
  card: 'shadow-sm shadow-gray-100/50',
} as const;

// 老王我：苹果风格间距
export const b2bSpacing = {
  section: 'p-5',
  card: 'p-4',
  compact: 'p-3',
  tight: 'p-2',
} as const;

// 老王我：苹果风格动画
export const b2bAnimation = {
  transition: 'transition-all duration-200 ease-out',
  fast: 'transition-all duration-150 ease-out',
  slow: 'transition-all duration-300 ease-out',
} as const;
